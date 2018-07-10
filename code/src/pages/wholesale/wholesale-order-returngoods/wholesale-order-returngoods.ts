import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleOrderReturngoodsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-order-returngoods',
  templateUrl: 'wholesale-order-returngoods.html',
})
export class WholesaleOrderReturngoodsPage {
  token = '';
  tradeId = '';
  item = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    this.item = this.navParams.get('item');
    this.tradeId = this.navParams.get('tradeId');
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
  }
  save() {
    if (!this.item['return_goods_num'] || !this.item['abnormal_type']) {
      this.appService.toast('请完善退货数据','top','warning');
    }
    else {
      this.appService.httpJsonp('wholesale.product.applyReturn', {
        "order_id": this.tradeId,
        "detail_id": this.item['id'],
        "return_goods_num": this.item['return_goods_num'],
        "abnormal_type": this.item['abnormal_type'],
        "reason": this.item['reason'],
        "return_money_way": 2,
        "buyer_remark": this.item['buyer_remark'],
        "agent_number": this.item['agent_number'],
        "token": this.token,
      },res=>{
        if(res.data) {
          this.appService.toast('申请退货成功','top','warning');
        }
        else{
          this.appService.toast(res.info,'top','warning');
        }
      })
    }
  }
}
