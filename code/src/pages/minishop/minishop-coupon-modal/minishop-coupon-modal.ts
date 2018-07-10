import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the MinishopCouponModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-coupon-modal',
  templateUrl: 'minishop-coupon-modal.html',
})
export class MinishopCouponModalPage {
  coupon = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.coupon = this.navParams.get('coupon');
  }
  /*关闭模板*/
  modalClose () {
    this.viewCtrl.dismiss(this.coupon);
  }
  // 选中
  selected (item) {
    for (let k in this.coupon) {
      this.coupon[k].selected = false;
    }
    item.selected = true;
  }
}
