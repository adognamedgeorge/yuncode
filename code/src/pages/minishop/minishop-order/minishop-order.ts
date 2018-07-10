import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MinishopOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-order',
  templateUrl: 'minishop-order.html',
})
export class MinishopOrderPage {
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
              public appService: AppService, public storage: StorageProvider,
              public events: Events) {
    for (let i= 0; i<= 3; i++){
      this.orderType[i] = {type:'minishop',index:i};
    }
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItems(0, true)
    });
    events.subscribe('orderType', index => {
      this.items = [];
      this.loading = true;
      this.pageNo = 1;
      this.getItems(index,true);
    })
  }
  // 获取订单列表
  loadTradeList(states, statesList, callback?, load?, infiniteScroll?) {
    callback = typeof callback == 'function' ? callback : function(){};
    this.appService.httpJsonp('mini.trade.buyerTradeList', {
      "token": this.token,
      "page_no": this.pageNo,
      "page_size": this.pageSize,
      "status": states,
      "status_list": statesList
    }, res => {
      this.pageNo ++;
      if (res.data.list.length < 20) {
        this.loading = false;
      }
      this.items = this.items.concat(res.data.list);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      callback(res)
    }, load)
  }
  // /**
  //  * slide切换处理
  //  */
  // onSlideWillChange() {
  //   let index: number = this.slides.getActiveIndex();
  //   if(index >= 0 && index <=3){
  //     //由于索引直接用数字的话，内部方法有的转换为字符串，有的转为整型，避免不必要麻烦，所以用字符串处理
  //     this.vm.selectedSegment = "s" + index;
  //   }
  // }
  getItems (type, load?, infiniteScroll?) {
    if(type == 0) {
      this.loadTradeList(0, "",'', load, infiniteScroll);
    }
    else if (type == 1) {
      this.loadTradeList(1, "",'', load, infiniteScroll);
    }
    else if (type == 2) {
      this.loadTradeList(0, "2,3,4",'', load, infiniteScroll);
    }
    else {
      this.loadTradeList(5, "",'', load, infiniteScroll);
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
