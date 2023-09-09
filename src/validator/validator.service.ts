import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GeoProvider } from '../geo-provider';
import { ClaimPromocodeInput, ComparisonSet, DateSet, MeteoSet, Promocode, Restrictions } from '../types';

type Clause = {
    passed: boolean,
    clause: string
}

export type ValidationResult = {
    valid: boolean,
    reasons?: string
}

@Injectable()
export class ValidatorService {
    constructor(private geoService: GeoProvider) {}

    private async validateMeteo(rule: MeteoSet, city: string): Promise<boolean> {
        const weather = await this.geoService.getCurrentWeather(city);
        if (rule.is.toLowerCase() !== weather.main) {
            return false;
        }

        if (!this.comparisonCheck(rule.temp, weather.temp)) {
            return false;
        }

        return true;
    }

    private validateDate(set: DateSet): boolean {
        const date = +new Date();
        const from = +new Date(set.after);
        const to = +new Date(set.before);

        return date > from && date < to;
    }

    private comparisonCheck(set: ComparisonSet, value: number): boolean {
        if (set.eq) {
            return set.eq === value;
        }

        if (set.gt && !set.lt) {
            return value > set.gt;
        }

        if (set.lt && !set.gt) {
            return value < set.lt;
        }

        if (set.gt && set.lt) {
            return value > set.gt && value < set.lt;
        }
    }

    private async traverse(arr: Restrictions, input: ClaimPromocodeInput): Promise<Clause[]> {
        let clauses: Clause[] = [];

        for await (const rule of arr) {
            switch (Object.keys(rule)[0]) {
                case '@date': {

                    clauses.push({
                        passed: this.validateDate(rule['@date']),
                        clause: '@date'
                    });
                    break;
                }
                case '@age': {
                    clauses.push({
                        passed: this.comparisonCheck(rule['@age'], input.arguments.age),
                        clause: '@age'
                    });
                    break;
                }
                case '@meteo': {
                    clauses.push({
                        passed: await this.validateMeteo(rule['@meteo'], input.arguments.meteo.town),
                        clause: '@meteo'
                    });
                    break;
                }
                case '@or': {
                    const orClauses = await this.traverse(rule['@or'], input);
                    const passed = orClauses.some(c => c.passed === true);
                    clauses.push({
                        passed,
                        clause: '@or'
                    });
                    break;
                }
                case '@and': {
                    const andClauses = await this.traverse(rule['@and'], input);
                    const passed = andClauses.every(c => c.passed === true);
                    clauses.push({
                        passed,
                        clause: '@and'
                    });
                    break;
                }
                default: {
                    throw new InternalServerErrorException('unknown clause');
                }
            }
        }

        return clauses;
    }

    async validate(code: Promocode, input: ClaimPromocodeInput): Promise<ValidationResult> {
        const traverseResult = await this.traverse(code.restrictions, input);
        const notPassedClauses = traverseResult.filter(c => c.passed !== true);
        const valid = notPassedClauses.length === 0;

        const result: ValidationResult = {
            valid
        };

        if (!valid) {
            result.reasons = `requirements for ${notPassedClauses.map(c => c.clause).join(',')} were not met`;
        }

        return result;
    }
}
