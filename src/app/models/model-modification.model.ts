export class ModelModification {
    constructor(
        public id: number,
        public name: string,
        public years: string,
        public power_hp: number,
        public power_kw: number,
        public engine_cap: number,
        public bodytype: string,
        public cylinders: string,
        public driveType: string,
        public values: number,
        public fuel: string,
        public engineType: string,
        public refueling: string
    ) { }
}

export const modelModificationFields = {
    id: "id",
    name: "name",
    years: "years",
    powerHp: "power_hp",
    powerKh: "power_kw",
    engineCap: "engine_cap",
    bodytype: "bodytype",
    cylinders: "cylinders",
    driveType: "driveType",
    values: "values",
    fuel: "fuel",
    engineType: "engineType",
    refueling: "refueling"
}