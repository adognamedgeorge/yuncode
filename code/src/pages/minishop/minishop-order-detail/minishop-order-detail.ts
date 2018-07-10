import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MinishopOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-order-detail',
  templateUrl: 'minishop-order-detail.html',
})
export class MinishopOrderDetailPage {
  tradeId : any;
  token = '';
  info = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService,public storage: StorageProvider) {
    this.tradeId = this.navParams.get('tradeId');
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getDetail();
    });
  }
   getDetail() {
    this.appService.httpJsonp('mini.trade.get', {
      "token": this.token,
      "trade_id": this.tradeId
    }, res => {
      this.info = res.data;
    })
   }

}
