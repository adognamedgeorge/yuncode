import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Events} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleSalesReturnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-sales-return',
  templateUrl: 'wholesale-sales-return.html',
})
export class WholesaleSalesReturnPage {
  wholesaleUserInfo = {};
  item = {};
  items = [];
  loading = true;
  pageNo = 1;
  pageSize = 20;
  backStatus = [
    {id: 0, text: '全部'},{id: 1, text: '待审核'},
    {id: 2, text: '客服打回'},{id: 3, text: '客服审核通过，待仓库审核'},
    {id: 4, text: '仓库打回'},{id: 5, text: '退货成功'}]
  ;
  reimburseStatus = [{id: 0, text: '全部'},{id: 1, text: '未退款'},{id: 2, text: '已退款'}];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public appService: AppService,
              public storage: StorageProvider, public events: Events) {
    this.item['isReturn'] = this.item['state'] = 0;
    this.item['orderId'] = '';
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
      }
    });
    events.subscribe('infiniteScroll', (infiniteScroll) => {
      if (infiniteScroll) {
        this.load(infiniteScroll)
      }
    });
  }
  switch(i, type) {
    if(type == 1) {
      this.item['state'] = i;
    }
    else {
      this.item['isReturn'] = i;
    }
  }
  search () {
    this.pageNo = 1;
    this.items = [];
    if ( !this.item['startTime'] ) {
      this.appService.toast('请选择起始时间','top');
    }
    else if ( !this.item['endTime'] ) {
      this.appService.toast('请选择结束时间','top');
    }
    else if ( this.item['startTime'] > this.item['endTime']) {
      this.appService.toast('起始时间要小于结束时间','top');
    }
    else {
     this.load();
    }
  }
  load (infiniteScroll?) {
    this.loading = false;
    this.appService.httpJsonp('wholesale.trade.returnBackList',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "start_time": this.item['startTime'],
      "end_time" : this.item['endTime'],
      "order_id": this.item['orderId'],//订单号
      "state": this.item['state'],//退货
      "is_return": this.item['isReturn'],//退款
      "page_no": this.pageNo,
      "page_size": this.pageSize
    }, res => {
      this.pageNo++;
      this.loading = true;
      for ( let k in  res.data.result) {
        res.data.result[k]['isShow'] = false;
      }
      this.items =this.items.concat(res.data.result);
      if (infiniteScroll) {
        this.events.publish('infinite',{'infiniteScroll':infiniteScroll,'items': this.items});
        if(res.data.result.length < 20) {
          this.loading = false;
          this.events.publish('loadOver','true');
        }
      }
      else {
        let searModal = this.modalCtrl.create("WholesaleSalesReturnModalPage", {
          item: this.items,
          loading: this.loading
        });
        searModal.present();
      }
    })
  }
}
