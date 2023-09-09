type PromocodeArguments = {
    age: number,
    meteo: {
        town: string
    }
}

export type PromocodeInput = {
    promocode_name: string,
    arguments: PromocodeArguments
}

type ComparisonSet = {
    lt?: number,
    gt?: number,
    eq?: number
}

type DateRule = {
    '@date': {
        after: Date,
        before: Date
    }
}

type MeteoRule = {
    '@meteo': {
        is: string,
        temp: ComparisonSet
    }
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

export type PromocodeModel = {
    id: string,
    name: string,
    advantage: {
        percent: number
    },
    restrictions: (DateRule | MeteoRule | AgeRule | OrRule | AndRule)[];
}
