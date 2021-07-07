import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IBreadcrumb, stringFormat } from '../mc-breadcrumbs.shared';
import { Observable, of } from 'rxjs';


export class McBreadcrumbsResolver implements Resolve<IBreadcrumb[]> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
     : Observable<IBreadcrumb[]> | Promise<IBreadcrumb[]> | IBreadcrumb[] {

    const data = route.routeConfig.data;

    let text = typeof (data.breadcrumbs) === 'string' ? data.breadcrumbs : data.breadcrumbs.text || data.text //|| path;
    text = stringFormat(text, route.data);

    const crumbs: IBreadcrumb[] = [{
      text: text,
     path: ''
    }];

    return of(crumbs);
  }  
}
