import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the WholesaleCouponModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-coupon-modal',
  templateUrl: 'wholesale-coupon-modal.html',
})
export class WholesaleCouponModalPage {
  coupon1 = [];
  coupon2 = [];
  coupon3 = [];
  coupon1Id = 0;
  coupon2Id = 0;
  coupon3Id = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.coupon1 = this.navParams.get('coupon1');
    this.coupon2 = this.navParams.get('coupon2');
    this.coupon3 = this.navParams.get('coupon3');
    for (let k in this.coupon1) {
      if ( this.coupon1[k].selected == true ){
        this.coupon1Id = this.coupon1[k].id;
      }
    }
    for (let k in this.coupon2) {
      for (let i in this.coupon2[k].list) {
        if ( this.coupon2[k].list[i].selected == true ){
          this.coupon2Id = this.coupon2[k].list[i].id;
          console.log(this.coupon2Id);
        }
      }

    }
    for (let k in this.coupon3) {
      for (let i in this.coupon3[k].list) {
        if ( this.coupon3[k].list[i].selected == true ){
          this.coupon3Id = this.coupon3[k].list[i].id;
        }
      }
    }
  }
  /*关闭模板*/
  modalClose () {
    this.viewCtrl.dismiss({'coupon1':this.coupon1, 'coupon2':this.coupon2, 'coupon3':this.coupon3});
  }
  // 选中
  selected (items, item) {
    console.log(items)
    console.log(item)
    if (items == 'coupon1') {
      for (let k in this.coupon1) {
        this.coupon1[k].selected = false;
      }
    }
    else {
      for (let k in items.list) {
        items.list[k].selected = false;
      }
    }
    item.selected = true;
  }
}
