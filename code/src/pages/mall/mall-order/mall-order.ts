import {Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MallOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-order',
  templateUrl: 'mall-order.html',
})
export class MallOrderPage {
  token = '';
  pageNo = 1;
  pageSize = 20;
  //订单状态
  orderType: any = [];

  items = [];
  loading = true;

  number = 0;
  selectedSegment = 's0';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    for (let i= 0; i<= 3; i++){
      this.orderType[i] = {type:'mall',index:i};
    }
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItems(0,true);
    });
  }

  // 加载数据
  loadTradeList(states, statesList, type, callback?, load?, infiniteScroll?) {
    callback = typeof callback == 'function' ? callback : function(){};
    this.appService.httpJsonp('mall.trade.list',{
      "token": this.token,
      "page": this.pageNo,
      "size": this.pageSize,
      "status": states,
      "status_str": statesList
    },res=>{
      this.pageNo++;
      if (res.data.list.length < 20) {
        this.loading = false;
      }
      this.items = this.items.concat(res.data.list);
      if (infiniteScroll) {
        infiniteScroll.complete();
        if(!res.data.has_next) {
          infiniteScroll.enable(false);
        }
      }
      callback(res)
    },load)
  }
  getItems (type, load?, infiniteScroll?) {
    if(type == 0) {
      this.loadTradeList(0, "", type,'', load, infiniteScroll);
    }
    else if (type == 1) {
      this.loadTradeList(1, "", type,'', load, infiniteScroll);
    }
    else if (type == 2) {
      this.loadTradeList(0, "2,3,4", type,'', load, infiniteScroll);
    }
    else {
      this.loadTradeList(5, "", type,'', load, infiniteScroll);
    }
  }
  // 下拉加载
  doInfinite(infiniteScroll): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.getItems (this.number,true, infiniteScroll);
        resolve();
      }, 500);
    })
  }
  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {
    if (this.number == index) {
      return false
    }
    else {
      this.items = [];
      this.loading = true;
      this.selectedSegment = 's' + index;
      this.number = index;
      this.pageNo = 1;
      this.getItems(index,true);
    }
  }
  getChildEvent(index) {
    this.items = [];
    this.loading = true;
    this.pageNo = 1;
    this.getItems(index,true);
  }
}
