import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

var BuyerLoader = require('../../../loader/garment-buyers-loader');
var BookingOrderLoader = require('../../../loader/garment-booking-order-loader');
var ComodityLoader = require('../../../loader/garment-comodities-loader');
var SectionLoader = require('../../../loader/garment-sections-loader');

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;
    }
    get buyerLoader() {
        return BuyerLoader;
    }
    get bookingOrderLoader() {
        return BookingOrderLoader;
    }
    get comodityLoader() {
        return ComodityLoader;
    }
    get sectionLoader() {
        return SectionLoader;
    }


    confirmStateOption = ["", "Belum Dikonfirmasi", "Sudah Dikonfirmasi"];
    bookingOrderStateOption = ["", "Booking", "Confirmed", "Sudah Dibuat Master Plan"];
    args = { page: 1, size: 25 };

    search() {
        this.args.page = 1;
        this.args.total = 0;
        this.searching();
    }

    searching() {
        var locale = 'id-ID';
        var info = {
            page: this.args.page,
            size: this.args.size,
            section: this.section ? this.section.Code : "",
            no: this.BookingOrderNo ? this.BookingOrderNo.BookingOrderNo : "",
            buyerCode: this.buyer ? this.buyer.Code : "",
            comodityCode: this.comodity ? this.comodity.Code : "",
            statusConfirm: this.confirmState ? this.confirmState : "",
            statusBookingOrder: this.bookingOrderState ? this.bookingOrderState : "",
            dateFrom: this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
            dateDeliveryFrom: this.dateDeliveryFrom ? moment(this.dateDeliveryFrom).format("YYYY-MM-DD") : "",
            dateDeliveryTo: this.dateDeliveryTo ? moment(this.dateDeliveryTo).format("YYYY-MM-DD") : ""
        }

        this.service.search(info)

            .then(result => {

                this.data = [];
                this.args.total = result.info.total;

                var _temp = {};
                var row_span_count = 1;
                this.temp = [];
                var temps = {};
                var count = 0;

                for (var prs of result.data) {
                    temps.bookingCode = prs.BookingOrderNo;
                    temps.orderQty = prs.OrderQuantity;
                    this.temp.push(temps);
                }

                for (var pr of result.data) {
                    pr.BookingOrderDate = pr.BookingOrderDate ? moment(pr.BookingOrderDate).locale(locale).format("DD MMMM YYYY") : "";;
                    pr.DeliveryDate = pr.DeliveryDate ? moment(pr.DeliveryDate).locale(locale).format("DD MMMM YYYY") : "";
                    pr.ConfirmDate = pr.ConfirmDate ? moment(pr.ConfirmDate).locale(locale).format("DD MMMM YYYY") : "";
                    pr.DeliveryDateItems = pr.DeliveryDateItems ? moment(pr.DeliveryDateItems).locale(locale).format("DD MMMM YYYY") : "";
                    if (_temp.code == pr.BookingOrderNo) {
                        pr.BookingOrderNo = null;
                        pr.BookingOrderDate = null;
                        pr.BuyerName = null;
                        pr.OrderQuantity = null;
                        pr.DeliveryDate = null;
                        pr.StatusConfirm = null;
                        pr.StatusBooking = null;
                        pr.OrderLeft = null;
                        pr.DateDiff = null;
                        row_span_count = row_span_count + 1;
                        pr.row_count = row_span_count;

                    } else if (!_temp.code || _temp.code != pr.BookingOrderNo) {
                        _temp.code = pr.BookingOrderNo;
                        row_span_count = 1;
                        pr.row_count = row_span_count;
                    }

                    this.data.push(pr);

                    if (this.data[count].row_count > 1) {

                        for (var x = pr.row_count; 0 < x; x--) {
                            var z = count - x;

                            this.data[z + 1].row_count = this.data[count].row_count;
                        }
                    }

                    count++;
                }

                this.fillTable();
            });
    }

    fillTable() {
        const columns = [
            { field: 'KodeBooking', title: 'Kode Booking' },
            { field: 'TanggalBooking', title: 'Tanggal Booking' },
            { field: 'Buyer', title: 'Buyer' },
            { field: 'JumlahOrder', title: 'Jumlah Order' },
            { field: 'TanggalPengirimanBooking', title: 'Tanggal Pengiriman(booking)' },
            { field: 'Komoditi', title: 'Komoditi' },
            { field: 'JumlahConfirm', title: 'Jumlah Confirm' },
            { field: 'TanggalPengirimanConfirm', title: 'Tanggal Pengiriman(confirm)' },
            { field: 'TanggalConfirm', title: 'Tanggal Confirm' },
            { field: 'Keterangan', title: 'Keterangan' },
            { field: 'StatusConfirm', title: 'Status Confirm' },
            { field: 'StatusBookingOrder', title: 'Status Booking Order' },
            { field: 'SisaOrder', title: 'Sisa Order (Belum Confirm)' },
            { field: 'SelisihHari', title: 'Selisih Hari (dari Tanggal Pengiriman)' },
            { field: 'NotConfirmedOrder', title: 'Not Confirmed Order (MINUS)' },
            { field: 'OverConfirm', title: 'Over Confirm (SURPLUS)' }
        ];

        let data = [];
        for (let item of this.data) {
            let rowData = {
                KodeBooking : item.BookingOrderNo,
                TanggalBooking : item.BookingOrderDate,
                Buyer : item.BuyerName,
                JumlahOrder : item.OrderQuantity,
                TanggalPengirimanBooking : item.DeliveryDate,
                Komoditi : item.ComodityName,
                JumlahConfirm : item.ConfirmQuantity,
                TanggalPengirimanConfirm : item.DeliveryDateItems,
                TanggalConfirm : item.ConfirmDate,
                Keterangan : item.Remark,
                StatusConfirm : item.StatusConfirm,
                StatusBookingOrder : item.StatusBooking,
                SisaOrder : item.OrderLeft,
                SelisihHari : item.DateDiff,
                NotConfirmedOrder : item.NotConfirmedQuantity,
                OverConfirm : item.SurplusQuantity
            };

            data.push(rowData);
        }

        var bootstrapTableOptions = {
            columns: columns,
            data: data,
        };

        bootstrapTableOptions.height = $(window).height() - $('.navbar').height() - $('.navbar').height() - 25;
        $(this.table).bootstrapTable('destroy').bootstrapTable(bootstrapTableOptions);
    }

    changePage(e) {
        var page = e.detail;
        this.args.page = page;
        this.searching();
    }

    ExportToExcel() {
        var info = {
            section: this.section ? this.section.Code : "",
            no: this.BookingOrderNo ? this.BookingOrderNo.BookingOrderNo : "",
            buyerCode: this.buyer ? this.buyer.Code : "",
            comodityCode: this.comodity ? this.comodity.Code : "",
            statusConfirm: this.confirmState ? this.confirmState : "",
            statusBookingOrder: this.bookingOrderState ? this.bookingOrderState : "",
            dateFrom: this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
            dateDeliveryFrom: this.dateDeliveryFrom ? moment(this.dateDeliveryFrom).format("YYYY-MM-DD") : "",
            dateDeliveryTo: this.dateDeliveryTo ? moment(this.dateDeliveryTo).format("YYYY-MM-DD") : ""
        }
        this.service.generateExcel(info);
    }


    reset() {
        this.section = "";
        this.BookingOrderNo = "";
        this.buyer = "";
        this.comodity = "";
        this.confirmState = "";
        this.bookingOrderState = "";
        this.dateFrom = "";
        this.dateTo = "";
        this.dateDeliveryTo = "";
        this.dateDeliveryFrom = "";

    }

    sectionView = (section) => {
        return `${section.Code} - ${section.Name}`
    }

    buyerView = (buyer) => {
        return `${buyer.Code} - ${buyer.Name} `
    }

    bookingOrderView = (bookingOrder) => {
        return `${bookingOrder.BookingOrderNo} `
    }
    comodityView = (comodity) => {
        return `${comodity.Code} - ${comodity.Name} `
    }

    bookingOrderStateChanged(e) {
        var selectedBookingOrder = e.srcElement.value;
        this.bookingOrderState = "";
        if (selectedBookingOrder == "Booking") {
            this.bookingOrderState = "Booking";
        } else if (selectedBookingOrder == "Confirmed") {
            this.bookingOrderState = "Confirmed";
        } else if (selectedBookingOrder == "Sudah Dibuat Master Plan") {
            this.bookingOrderState = "Sudah Dibuat Master Plan";
        }
        else {
            this.bookingOrderState = "";
        }
    }

    confirmStateChanged(e) {
        var selectedConfirm = e.srcElement.value;
        this.confirmState = "";
        if (selectedConfirm = "Belum Dikonfirmasi") {

            this.confirmState = "Belum Dikonfirmasi";
        } else if (selectedConfirm = "Sudah Dikonfirmasi") {
            this.confirmState = "Sudah Dikonfirmasi";
        } else {
            this.confirmState = "";
        }
    }
}