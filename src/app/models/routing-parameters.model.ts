export class RoutingParametersModel {
    route: string[] = [];
    queryParameters: Object = null;

    constructor(route: string[], queryParameters?: Object) {
        this.route = route;
        this.queryParameters = queryParameters || null;
    }
}