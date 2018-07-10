import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the UserMarketingDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-marketing-detail',
  templateUrl: 'user-marketing-detail.html',
})
export class UserMarketingDetailPage {
  items = [];
  token = '';
  pageNo = 1;
  pageSize = 20;
  loading = true;
  constructor(public appService: AppService, public storage: StorageProvider,
  ) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.itemLoad();
    });
  }
  itemLoad (infiniteScroll?) {
    this.appService.httpJsonp('common.user.getUserGoldCoinDetailList', {
      "page_no": this.pageNo,
      "page_size": this.pageSize,
      "token": this.token,
      "type": "商城商品推广"
    }, res => {
      this.loading = true;
      this.pageNo++;
      this.items = this.items.concat(res.data.data);
      if (res.data.data.length < 20) {
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
