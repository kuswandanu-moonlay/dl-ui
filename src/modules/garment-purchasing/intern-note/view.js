import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class View {
    hasCancel = true;
    // hasEdit = true;
    // hasDelete = true;
    hasEdit = false;
    hasDelete = false;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        this.currency = this.data.currency;
        this.supplier = this.data.supplier;
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        this.router.navigateToRoute('edit', { id: this.data._id });
    }

    delete(event) {
        this.service.delete(this.data).then(result => {
            this.cancel();
        });
    }

    showDetail(item) {
        if (item.showDetails)
            item.showDetails = false;
        else
            item.showDetails = true;
    }
}
