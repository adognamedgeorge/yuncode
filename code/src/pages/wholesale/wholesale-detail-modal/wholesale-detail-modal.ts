import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {WholesaleInfoProvider} from "../../../providers/wholesale-info/wholesale-info";
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the WholesaleDetailModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-detail-modal',
  templateUrl: 'wholesale-detail-modal.html',
})
export class WholesaleDetailModalPage {
  items = this.navParams.get('item');
  wholesaleUserInfo = {};
  cartInfo = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public loadingCtrl: LoadingController,
              public wholesaleInfoProvider: WholesaleInfoProvider, public appService: AppService,) {
    this.cartInfo = this.navParams.get('cartInfo');
    this.wholesaleUserInfo = this.navParams.get('wholesaleUserInfo');
    for (let i in this.cartInfo['cart_info']) {
      if (this.cartInfo['cart_info'][i].product_id == this.items['id']) {
        this.items['is_cart'] = true;
        this.items['cart_num'] = this.cartInfo['cart_info'][i].quantity;
      }
      else {
        this.items['is_cart'] = false;
      }
    }
    if ( this.items['is_cart'] ) {
      this.items['quantity'] = 1;
    }
    else {
      this.items['quantity'] = this.items['min_sold_num'];
    }
  }
  /*
    关闭模板
     */
  modalClose () {
    this.viewCtrl.dismiss(false);
  }
  // 加数量
  addNum(item,num?) {
    num = num ? num : 1;
    if ( this.items['is_cart'] ) {
      if ( item.quantity >=  item.amount ) {
        item.quantity = item.amount;
        return false
      }
      else {
        item.quantity =  item.quantity + num;
      }
    }
    else {
      if (this.items['min_sold_num'] > item.amount) {
        this.appService.toast('预购剩余数量少于最少购买数量','top');
        return false;
      }
      else if ( item.quantity >=  item.amount ) {
        item.quantity = item.amount;
        return false
      }
      else if (item.quantity < this.items['min_sold_num'] ) {
        item.quantity = this.items['min_sold_num'];
        return false
      }
      else {
        item.quantity =  item.quantity + num;
      }
    }
  }
  // 减数量
  decrementNum (item) {
      if ( item.quantity == 0 ) {
        return false
      }
      else {
        if ( this.items['is_cart'] ) {
          item.quantity--;
        }
        else {
          if ( item.quantity == this.items['min_sold_num'] ) {
            this.appService.toast(`该商品最少起批量为${this.items['min_sold_num']}`,'top');
            return false;
          }
          else {
            item.quantity--;
          }
      }
    }
  }
  // 确认
  confirm () {
    let presaleList = this.items['presaleList'];
    let itemPresale = [];
    let index = 0;
    if ( presaleList.length > 0) {
      presaleList.forEach((item, index, arr)=>{
        if (item.quantity > 0){
          let params = {
            'product_id': item.product_id,
            'quantity': item.quantity,
            'presaleId': item.id
          };
          itemPresale.push(params)
        }
      });
      let timer = () => {
        setTimeout(()=>{
          if (index <= itemPresale.length - 1) this.wholesaleInfoProvider.addPresaleCart(itemPresale[index], this.wholesaleUserInfo , res => {
            if (res.status != 'fail') {
              presaleList[index]['amount'] = presaleList[index]['amount'] - presaleList[index]['quantity'];
              index++;
              timer();
            }
            else {
              this.appService.toast(res.info, 'top', 'warning');
            }
          });
          else {
            this.appService.toast('加入购物车成功','top','warning');
          }
        },0)
      };
      timer();
    }
    else {
      this.appService.httpJsonp('wholesale.product.addItemToCart',{
        "user_id": this.wholesaleUserInfo['user_id'],
        "product_id": this.items['id'],
        "quantity": this.items['quantity'] + (this.items['cart_num'] | 0),
        "load_info" : 0,    // 加入购物车成功后，是否加载购物车信息
        "mode":2,         // 数量加入购物车的模式 1叠加模式 2覆盖模式
        "remark":this.items['remark'] || ''
      },res=>{
        if (res.info == 'OK') {
          this.appService.toast(res.data.info,'top','warning');
          this.viewCtrl.dismiss(true);
        }
        else {
          this.appService.toast(res.data,'top','warning');
        }
      });
    }
    // this.modalClose();
  }
}
