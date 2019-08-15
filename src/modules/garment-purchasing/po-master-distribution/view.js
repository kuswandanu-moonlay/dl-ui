import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, DeliveryOrderService } from './service';

@inject(Router, Service, DeliveryOrderService)
export class View {
    constructor(router, service, doService) {
        this.router = router;
        this.service = service;
        this.doService = doService;
    }

    async activate(params) {
        let id = params.id;
        this.data = await this.service.read(id);

        if (this.data) {
            this.selectedDeliveryOrder = {
                Id: this.data.DOId,
                DONo: this.data.DONo
            };
            this.data.deliveryOrder = await this.doService.read(this.data.DOId);
            this.selectedSupplier = this.data.deliveryOrder.supplier;
            this.selectedSupplier.toString = function() {
                return `${this.Code} - ${this.Name}`;
            };

            for (const item of this.data.Items) {
                const doItem = this.data.deliveryOrder.items.find(i => i.Id == item.DOItemId);
                const doDetail = doItem.fulfillments.find(i => i.Id == item.DODetailId);

                doDetail.EPONo = doItem.purchaseOrderExternal.no;
                doDetail.Currency = doItem.currency;

                Object.assign(item, doDetail);
            }
        }
    }

    backToList() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.backToList();
    }

    editCallback(event) {
        this.router.navigateToRoute('edit', { id: this.data.Id });
    }

    deleteCallback(event) {
        if (confirm(`Hapus Data?`))
            this.service.delete(this.data)
                .then(result => {
                    this.backToList();
                });
    }
}
