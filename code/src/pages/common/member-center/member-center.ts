import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import JsBarcode from "jsbarcode";
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MemberCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-center',
  templateUrl: 'member-center.html',
})
export class MemberCenterPage {
  token = '';
  vipInfo = [];
  barcode : any;
  	constructor(public navCtrl: NavController, public navParams: NavParams,
                public modalCtrl:ModalController, public appService: AppService,
                public storage: StorageProvider) {
  	}
  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.barcode = document.getElementById('barcodes');
      setTimeout(()=>{
        this.getVip();
      }, 500)
    });
  }
  // 获取VIP会员信息
  getVip () {
    this.appService.httpJsonp('cashier.platformvip.get',{
      'token':this.token,
    },res=>{
      if (res.data) {
        this.vipInfo = res.data;
        JsBarcode(this.barcode, res.data['card_number'], {
          lineColor: "#000",
          format: "CODE128",
          width:10,
          height:200,
          displayValue: false
        })
      }
    })
  }
}
