import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MallOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-order-detail',
  templateUrl: 'mall-order-detail.html',
})
export class MallOrderDetailPage {
  itemId = '';
  token = '';
  items = [];
  info = [];
  coin = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    this.itemId = this.navParams.get('id');
    // this.itemId = '550000029';
  }

  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItemLoad();
      this.getItemLoad1();
    });

  }
  // 获取数据
  getItemLoad () {
    this.appService.httpJsonp('mall.trade.get',{
      "token": this.token,
      "trade_id": this.itemId,
      "is_promo":"1"
    }, res => {
      this.info =  res.data;
      console.log(res)
    })
  }
  // 获取商品数据
  getItemLoad1 () {
    this.appService.httpJsonp('mall.trade.getOrdersByTradeId',{
      "token": this.token,
      "trade_id": this.itemId,
    }, res => {
      console.log(res)
      this.items = res.data;
    },true)
  }
  // 查看物流
  checked (item) {
    this.navCtrl.push('MallExpressCheckPage',{
      expressType: item.expressType,
      expressOrderNo: item.expressOrderNo,
      imageUrl: item.imageUrl
    })
  }
}
