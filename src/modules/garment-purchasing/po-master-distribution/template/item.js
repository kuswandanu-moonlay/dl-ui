export class Item {

    controlOptions = {
        control: {
            length: 12
        }
    };

    itemsColumns = [
        { header: "RO No" },
        { header: "Nomor Referensi PR" },
        { header: "Barang" },
        { header: "Jumlah CC" },
        { header: "Satuan CC" },
        { header: "Konversi" },
        { header: "Jumlah" },
        { header: "Satuan" },
    ];

    constructor(coreService) {
        this.coreService = coreService;
    }

    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;

        this.readOnly = this.options.readOnly;
        this.isEdit = context.context.options.isEdit && this.data.Id > 0;
        this.itemOptions = {
            error: this.error,
            isEdit: this.isEdit
        };

        if (this.data.product) {
            this.dataProduct = `${this.data.product.Code} - ${this.data.product.Name}`;
        }

    }

    get addItems() {
        return (event) => {
            this.data.Details.push({
                Conversion: 1,
                ParentProduct: this.data.product,
                Uom: this.data.Uom,
                SCId: this.data.SCId,
            })
        };
    }

    get removeItems() {
        return (event) => {
            this.error = null;
            this.itemOptions.error = null;
     };
    }

}