import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesalePresaleListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-presale-list',
  templateUrl: 'wholesale-presale-list.html',
})
export class WholesalePresaleListPage {
  userInfo = [];
  wholesaleUserInfo = [];
  pageNo = 1;
  pageSize = 20;
  //预售活动列表
  presaleActive: any = {};
  buyPresaleItems = [];
  loading = true;
  number = 0;
  // 商品列表
  selectedSegment = 's0';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
  }

  ionViewDidLoad() {

  }
  ionViewWillEnter() {
    //获取用户信息
    this.storage.getDate('wholesaleUser', res=>{
      this.wholesaleUserInfo = res;
      this.loadTradeList(true)
    });
  }
  // 加载可购买预售活动
  loadTradeList(load?) {
    this.appService.httpJsonp('wholesale/coupon/presaleList',{
      'userId': this.wholesaleUserInfo['user_id'],
      "agentNumber": this.wholesaleUserInfo['agent_number'],
      "presaleId": 0
    },res=>{
      this.presaleActive = res.data.presaleList;
    },load)
  }
  // 加载已购买预售活动
  loadBuyPresale (type, callback?, load?, infiniteScroll?){
    callback = typeof callback == 'function' ? callback : function(){};
    this.appService.httpJsonp('wholesale/coupon/userBuyPresaleList',{
      "userId": this.wholesaleUserInfo['user_id'],
      'is_show': type,
      "page": this.pageNo,
      "pageSize": this.pageSize
    },res=>{
      let arry = [];
      this.pageNo++;
      for (let i in res.data.presaleList) {
        arry.push(res.data.presaleList[i]);
        for (let k in res.data.presaleList[i].items) {
          res.data.presaleList[i].items[k].product_id = k;
          res.data.presaleList[i].items[k].quantity = 1;
        }
      }
      if (arry.length < 20) {
        this.loading = false;
      }
      this.buyPresaleItems = this.buyPresaleItems.concat(arry);
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      callback(res)
    },load)
  }
  getItems (type, load?, infiniteScroll?) {
    if(type == 0) {
      this.loadTradeList(load);
    }
    else if (type == 1) {
      this.loadBuyPresale(0,'',load, infiniteScroll);
    }
    else {
      this.loadBuyPresale(1,'',load, infiniteScroll);
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
      this.buyPresaleItems = [];
      this.presaleActive = {};
      this.loading = true;
      this.selectedSegment = 's' + index;
      this.number = index;
      this.pageNo = 1;
      this.getItems(index,true);
    }
  }
  // 预售加减数量
  decrementPresales(item) {
    if ( item.quantity != 1 ){
      item.quantity--;
    }
  };
  addPresale(item) {
    if ( item.quantity != item.amount ){
      item.quantity++;
    }
    else {
      item.quantity = item.amount
    }
  };
  // 预购加入购物车
  addPresaleCart(item, id) {
    this.appService.httpJsonp('wholesale.product.addPresaleItemToCart',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "product_id": item.product_id,
      "quantity": item.quantity,
      "presaleId" : id,    // 加入购物车成功后，是否加载购物车信息
      "mode":1
    },res=>{
      if (res.status != "fail") {
        item.amount = item.amount - item.quantity
      }
      this.appService.toast(res.info,'top','warning');
    })
  };
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
