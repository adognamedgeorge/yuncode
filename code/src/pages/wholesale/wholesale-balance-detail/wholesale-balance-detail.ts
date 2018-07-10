import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { AppService } from "../../../app/app.service";
import { StorageProvider } from "../../../providers/storage/storage";
import {DatePipe} from "@angular/common";

/**
 * Generated class for the WholesaleBalanceDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-balance-detail',
  templateUrl: 'wholesale-balance-detail.html',
})
export class WholesaleBalanceDetailPage {
  items = [];
  wholesaleUserInfo = {};
  pageNo = 1;
  pageSize = 20;
  loading = true;
  constructor(public appService: AppService, public storage: StorageProvider,
              public datePipe: DatePipe) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.itemLoad();
      }
    });
  }
  itemLoad (infiniteScroll?) {
    // let today = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    this.appService.httpJsonp('wholesale.shop.yueDetail', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "start_time": "2015-07-01",
      // "end_time": today,
      "page_no": this.pageNo,
      "page_size": this.pageSize
    }, res => {
      this.loading = true;
      this.pageNo++;
      this.items = this.items.concat(res.data.result);
      if (res.data.result.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    }, true);
  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.itemLoad (infiniteScroll);
    this.loading = false;
  }
}
