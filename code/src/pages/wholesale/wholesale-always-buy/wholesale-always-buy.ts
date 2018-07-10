import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleAlwaysBuyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-always-buy',
  templateUrl: 'wholesale-always-buy.html',
})
export class WholesaleAlwaysBuyPage {
// 商品列表
  public products: Array<any> = [];
  wholesaleUserInfo = {};
  cartInfo = {};
  constructor(public appService: AppService, public storage: StorageProvider) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.itemLoad();
        this.getCartInfo();
      }
    });
  }
  itemLoad () {
    this.appService.httpJsonp('wholesale.trade.oftenBuy', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      for (let k in res.data.product_list) {
        this.products.push(res.data.product_list[k]);
      }
    })
  }
  // 获取购物车数据
  getCartInfo () {
    this.appService.httpJsonp('wholesale.product.loadCartInfo', {
      "user_id": this.wholesaleUserInfo['user_id']
    }, res=>{
      this.cartInfo = res.data;
    })
  }
}
