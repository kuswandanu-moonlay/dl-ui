import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';

@inject(Router, Service)
export class List {
    context = ["Rincian"];
    columns = [
        { field: "DocumentNo", title: "No. Realisasi VB" },
        { field: "VBRequestDocumentNo", title: "No. Permohonan VB" },
        {
            field: "Date", title: "Tanggal Realisasi", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        {
            field: "VBRequestDocumentRealizationEstimationDate", title: "Tanggal Estimasi", formatter: function (value, data, index) {
                if (data.VBRequestDocumentNo)
                    return moment(value).format("DD MMM YYYY");
                else
                    return "-";
            }
        },
        // { field: "UnitLoad", title: "Beban Unit" },
        { field: "CreatedBy", title: "Dibuat oleh" },
        {
            field: "isVerified", title: "Status Verifikasi",
            formatter: function (value, row, index) {
                return value ? "Sudah" : "Belum";
            }
        }
    ];

    loader = (info) => {
        let order = {};

        // if (info.sort)
        //     order[info.sort] = info.order;
        // else
        //     order["Date"] = "desc";

        let arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
            filter: JSON.stringify({
                Type: 1
            })
        };

        return this.service.search(arg)
            .then(result => {
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextCallback(event) {
        let arg = event.detail;
        let data = arg.data;
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }

    post() {
        this.router.navigateToRoute('post');
    }
}