import { ViewPort, Location } from ".";

export class Geometry {
    constructor(
        public location: Location,
        public location_type: string,
        public viewport: ViewPort,
        public bounds?: ViewPort
    ) { }
}