import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleMyTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-my-task',
  templateUrl: 'wholesale-my-task.html',
})
export class WholesaleMyTaskPage {
  wholesaleUserInfo =[];
  token = '';
  products = [];
  pageNo = 1;
  pageSize = 20;
  loading = true;
  cartInfo = {};
  constructor(public appService: AppService,public storage: StorageProvider) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      //获取批发用户信息
      this.storage.getDate('wholesaleUser',(res)=> {
        if (Object.keys(res)['length'] >0) {
          this.wholesaleUserInfo = res;
          this.itemLoad();
          this.getCartInfo();
        }
      });
    });

  }
  itemLoad (infiniteScroll?) {
    this.appService.httpJsonp('wholesale.product.collect', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "token": this.token,
      "page_no": this.pageNo,
      "page_size": this.pageSize,
    }, res => {
      this.pageNo++;
      let item = res.data.list;
      for (let k in item) {
        this.products.push(item[k][item[k]['product_id']])
      }
      if(res.data.list.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    },true)
  }
  // 下拉加载
  doInfinite(infiniteScroll){
    this.itemLoad(infiniteScroll);
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
