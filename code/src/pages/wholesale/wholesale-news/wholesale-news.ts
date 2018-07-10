import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleNewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-news',
  templateUrl: 'wholesale-news.html',
})
export class WholesaleNewsPage {
  page = 1;
  pageSize = 20;
  // 批发用户信息
  wholesaleUser = [];
  // 公告列表
  itemsNew = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService, public storage: StorageProvider) {
    this.storage.getDate('wholesaleUser',(res)=>{
      this.wholesaleUser = res;
    });
  }
  ionViewDidEnter() {

    this.getNoticeList('');
  }
  // 获取批发快报
  getNoticeList (infiniteScroll) {
    let params = {
      "agent_number": this.wholesaleUser['agent_number'],
      "user_id": this.wholesaleUser['user_id'],
      "page_no": this.page,
      "page_size": this.pageSize
    };
    this.appService.httpJsonp('wholesale.shop.getNoticeList', params, res=> {
      this.itemsNew = this.itemsNew.concat(res.data.result);
      this.page++;
      if (infiniteScroll) {
        infiniteScroll.complete();
        if(!res.data.has_next) {
          infiniteScroll.enable(false);
        }
      }
    })
  }
  doInfinite(infiniteScroll): Promise<any> {
    console.log(infiniteScroll)
    return new Promise((resolve) => {
      setTimeout(() => {
        this.getNoticeList(infiniteScroll);
        resolve();
      }, 500);
    })
  }
}
