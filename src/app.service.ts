import { Injectable, NotFoundException } from '@nestjs/common';
import { Promocode, ClaimPromocodeInput, ClaimSuccess, ClaimFailure } from './types';
import { ValidatorService } from './validator';

const store: Promocode[] = [];

@Injectable()
export class AppService {
    constructor(private validator: ValidatorService) {}

    get store() {
        return store;
    }

    async save(input: Promocode): Promise<string> {
        store.push(input);
        return 'OK';
    }

    async claim(input: ClaimPromocodeInput): Promise<ClaimSuccess | ClaimFailure> {
        const code = store.find(code => code.name === input.promocode_name);
        if (!code) {
            throw new NotFoundException('requested code was not found');
        }

        const result = await this.validator.validate(code, input);

        if (result.valid) {
            return {
                promocode_name: code.name,
                status: 'accepted',
                advantage: code.advantage
            }
        } else {
            return {
                promocode_name: code.name,
                status: 'denied',
                reasons: result.reasons
            }
        }
    }

}
