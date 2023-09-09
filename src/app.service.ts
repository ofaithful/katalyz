import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    save(): string {
        return 'save';
    }

    claim(): string {
        return 'claim';
    }
}
