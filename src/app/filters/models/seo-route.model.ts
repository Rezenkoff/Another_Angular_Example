import { PriorityUrlPair } from './priority-url-pair.model';

export class SeoRoute {
    routeSectionsArray: PriorityUrlPair[] = [];
    queryParameters: QueryParams = new QueryParams();
}

class QueryParams {
    queryParams: Object = {}
} 