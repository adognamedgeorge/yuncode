import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleBalanceConvertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-balance-convert',
  templateUrl: 'wholesale-balance-convert.html',
})
export class WholesaleBalanceConvertPage {
  wholesaleUserInfo = {};
  items = [];
  price : number;
  constructor(public appService: AppService, public storage: StorageProvider) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.itemLoad()
      }
    });
  }
  itemLoad () {
    this.appService.httpJsonp('wholesale.shop.yueManage', {
      "user_id": this.wholesaleUserInfo['user_id'],
    }, res => {
      this.items = res.data;
    });
  }
  exchange(type) {
    if (type == 1) {
      if(!this.price) {
        this.appService.toast('兑换金额不能为空!','top','warning');
      }
      else {
        this.changePrice(this.price)
      }
    }
    else {
      this.changePrice(this.items['balance']/100)
    }
  }
  changePrice (price) {
    this.appService.httpJsonp('wholesale.shop.yueExchangeCoupon', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "num": price
    }, res => {
      if (res.status == 'fail') {
        this.appService.toast(res.data,'top','warning');
      }
      else {
        this.itemLoad();
        this.appService.toast(res.data.info,'top','warning');
      }
    })
  }
}
