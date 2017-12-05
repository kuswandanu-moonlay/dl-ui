import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

var BuyersLoader = require('../../../../loader/buyers-loader');
var ComodityLoader = require('../../../../loader/comodity-loader');
var SpinningSalesContractLoader = require('../../../../loader/spinning-sales-contract-loader');

@inject(Router, Service)
export class List {

    constructor(router, service) {
        this.service = service;
        this.router = router;

        var yearNow = moment().format('YYYY')
        for (var i = parseInt(yearNow); i > 2011; i--) {
            this.yearList.push(i.toString());
        }

    }

    info = {};

    data = [];

    yearList = [];
    orderTypeList = ["", "WHITE", "DYEING", "PRINTING", "YARN DYED"];

    listDataFlag = false;

    tableOptions = {
        search: false,
        showToggle: false,
        showColumns: false
    }

    bind(context) {
        this.context = context;
        this.data = context.data;
    }

    columns = [
        { field: "name", title: "Bulan" },
        { field: "preProductionQuantity.toFixed(2)", title: "Belum Produksi\n(m)" },
        { field: "onProductionQuantity.toFixed(2)", title: "Sudah Produksi\n(m)" },
        { field: "orderQuantity.toFixed(2)", title: "Sudah Produksi\n(m)" },
        { field: "storageQuantity.toFixed(2)", title: "Sudah Dikirim Ke Gudang\n(m)" },
        { field: "shipmentQuantity.toFixed(2)", title: "Sudah Dikirim Ke Buyer\n(m)" }
    ];

    loader = (info) => {

        this.info = {};

        return this.listDataFlag ? (
            this.fillValues(),
            this.service.search(this.info)
                .then((result) => {
                    return {
                        data: result.data
                    }
                })
        ) : { total: 0, data: {} };
    }

    fillValues() {
        this.info.orderType = this.orderType ? this.orderType : "";
        this.info.year = this.year ? this.year : moment().format('YYYY');
    }

    searching() {
        this.listDataFlag = true;
        this.orderStatusTable.refresh();
    }

    exportToExcel() {
        this.fillValues();
        this.service.generateExcel(this.info);
    }

    reset() {
        this.listDataFlag = false;
        this.info = {};
        this.year = moment().format("YYYY");
        this.orderStatusTable.refresh();
    }

}