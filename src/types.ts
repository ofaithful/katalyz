export type PromocodeArguments = {
    age: number,
    meteo: {
        town: string
    }
}

export type ClaimPromocodeInput = {
    promocode_name: string,
    arguments: PromocodeArguments
}

export type ComparisonSet = {
    lt?: number,
    gt?: number,
    eq?: number
}

export type DateSet = {
    after: Date,
    before: Date
}

type DateRule = {
    '@date': DateSet
}

export type MeteoSet = {
    is: string,
    temp: ComparisonSet
}

type MeteoRule = {
    '@meteo': MeteoSet
}

type AgeRule = {
    '@age': ComparisonSet
}

type OrRule = {
    '@or': (DateRule | MeteoRule | AgeRule | OrRule)[];
}

type AndRule = {
    '@and': (DateRule | MeteoRule | AgeRule | AndRule)[];
}

export type Restrictions = (DateRule | MeteoRule | AgeRule | OrRule | AndRule)[]; 

export type Promocode = {
    id: string,
    name: string,
    advantage: {
        percent: number
    },
    restrictions: Restrictions;
}

export type ClaimSuccess = {
    promocode_name: string,
    status: string,
    advantage: { percent: number }
}

export type ClaimFailure = {
    promocode_name: string,
    status: string,
    reasons: string
}
