import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-order',
  templateUrl: 'wholesale-order.html',
})
export class WholesaleOrderPage {
  wholesaleUserInfo = [];
  pageNo = 1;
  pageSize = 20;
  //订单状态
  orderType: any = [];
  items = [];
  loading = true;
  number = 0;
  // 商品列表
  selectedSegment = 's0';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    for (let i= 0; i<= 2; i++){
      this.orderType[i] = {type:'wholesale',index:i};
    }
  }
  ionViewWillEnter () {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (res) {
        this.wholesaleUserInfo = res;
        this.getItems(0,true);
      }
    });

  }
  loadTradeList(states, statesList, type, callback?, load?, infiniteScroll?) {
    callback = typeof callback == 'function' ? callback : function(){};
    this.appService.httpJsonp('wholesale.shop.orderList',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "page_no": this.pageNo,
      "page_size": this.pageSize,
      "state": states,
      "state_list": statesList
    },res=>{
      this.pageNo++;
      if (res.data.result.length < 20) {
        this.loading = false;
      }
      this.items = this.items.concat(res.data.result);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      callback(res)
    },load)
  }
 getItems (type, load?, infiniteScroll?) {
   if(type == 0) {
      this.loadTradeList(0, "", type,'',load, infiniteScroll);
    }
    else if (type == 1) {
      this.loadTradeList(0, "1,2", type,'',load, infiniteScroll);
    }
    else {
      this.loadTradeList(3, "", type,'', load, infiniteScroll);
    }
 }
  // 下拉加载
  doInfinite(infiniteScroll): Promise<any> {
    return new Promise(resolve => {
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
