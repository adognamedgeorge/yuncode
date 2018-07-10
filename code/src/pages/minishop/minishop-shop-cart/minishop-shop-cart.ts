import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {StorageProvider} from "../../../providers/storage/storage";
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the MinishopShopCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-shop-cart',
  templateUrl: 'minishop-shop-cart.html',
})
export class MinishopShopCartPage {
  shopCart = {};
  shopId : any;
  cartInfo = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public storage: StorageProvider,
              public appService: AppService, public events: Events) {
    this.shopCart = this.navParams.get('shopCart');
    this.shopId = this.navParams.get('shopId');
    this.cartInfo = this.navParams.get('cartInfo');
  }
  //清空
  clean() {
    this.appService.confirm('清空购物车','',() => {
      delete this.cartInfo[this.shopId];
      this.shopCart = {};
      this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
      this.viewCtrl.dismiss({})
    });
  }
  // 减数量
  minusProduct(item) {
    if (item['inCartQuantity'] == 1) {
      delete this.shopCart[item.itemId]
    }
    else {
      item['inCartQuantity']--;
    }
  }
  // 加数量
  addProduct(item) {
    if (item['inCartQuantity'] >= item['stockNum']) {
      this.appService.toast('库存不够啦~','top','warning');
    }
    else {
      item['inCartQuantity']++
    }
  }
  close() {
    this.viewCtrl.dismiss(this.shopCart)
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }

}
