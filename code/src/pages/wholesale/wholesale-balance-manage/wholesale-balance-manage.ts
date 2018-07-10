import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleBalanceManagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-balance-manage',
  templateUrl: 'wholesale-balance-manage.html',
})
export class WholesaleBalanceManagePage {
  wholesaleUserInfo = {};
  items = {};
  bank_list = [];
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
    this.appService.httpJsonp('wholesale.shop.bankList', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      this.bank_list = res.data;
    });
  }
}
