import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class ExceptionService {
    constructor(private router: Router) { }

    exception(ex: any) {
        this.router.navigate(["error",ex.status + " " + ex.statusText]);
    }
}