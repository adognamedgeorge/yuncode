import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-order-detail',
  templateUrl: 'wholesale-order-detail.html',
})
export class WholesaleOrderDetailPage {
  wholesaleUserInfo = [];
  itemId = '';
  info = [];
  items = [];
  coupons = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    this.itemId = this.navParams.get('id');
  }

  ionViewDidLoad() {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (res) {
        this.wholesaleUserInfo = res;
        this.appService.httpJsonp('wholesale.shop.orderDetail',{
          "order_id": this.itemId,
          "user_id": this.wholesaleUserInfo['user_id']
        },res=>{
          this.items = res.data.order_detail_list;
          this.info = res.data.order_info;
          this.coupons = res.data.promoslist;
        },true)
      }
    });
  }
  // 退货
  returngoods(item) {
    this.navCtrl.push('WholesaleOrderReturngoodsPage',{
      'tradeId': this.itemId,
      'item': item
    });
  }
}
