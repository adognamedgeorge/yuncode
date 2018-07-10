import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
declare const cordova: any;
// declare const Wechat;
/**
 * Generated class for the WholesalePresaleModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-presale-modal',
  templateUrl: 'wholesale-presale-modal.html',
})
export class WholesalePresaleModalPage {
  token = '';
  items = {};
  item = [];
  wholesaleUserInfo = [];
  payType = 'yue';
  num = 1;
  private confirmTimes = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
  }

  ionViewDidLoad() {
    let arry = [];
    this.items = this.navParams.get('presaleId');
    console.log(this.items)
    this.wholesaleUserInfo = this.navParams.get('wholesaleUserInfo');
    for ( let k in this.items['items']) {
      arry.push(this.items['items'][k] );
    }
    this.item = arry;
  }
  //增加数量
  add() {
    if (this.num< this.items['buy_max_group']) {
      this.num++;
    }
  };
  //减少数量
  minus() {
    if ( this.num != 1 ){
      this.num--
    }
  };
  //购买预售活动
  createOrder(){
    this.appService.httpJsonp('/wholesale/trade/pay', {
      "agentNumber": this.wholesaleUserInfo['agent_number'],
      "userNumber": this.wholesaleUserInfo['number'],
      "presaleId": this.items['id'],
      "userId": this.wholesaleUserInfo['user_id'],
      "payType": this.payType,
      "buyGroup": this.num,
      "total": this.items['total_fee'] / 100,
    },res=>{
      if (res.info== 'alipay'){
        cordova.plugins.alipay.payment(res.data.alipayParams, res => {
          if (res.resultStatus == 9000 || res.resultStatus == 8000) {
            this.appService.presentLoading('正在获取支付结果',5000);
            this.confirmPay(res.data.userPresaleId);
          }
          else if (res.resultStatus == 6001) {
            this.appService.toast('亲，您取消了支付操作','top','warning');
          }
        },error => {
          this.appService.toast(JSON.stringify(error.memo),'top','warning');
        });
      }
      else {
        this.appService.toast(res.info,'top','warning');
      }
    })
  };
  // 对象转换数组
  getKeys(item) {
    console.log(Object.keys(item))
    return Object.keys(item);
  }
  // 确认支付成功
  confirmPay (id) {
    this.appService.httpJsonp('wholesale/trade/isPaySuccess', {
      "userPresaleId": id
    }, res => {
      if (res.data.status == 2) {
        this.appService.toast('支付成功','top','warning');
        setTimeout(() => {
          this.navCtrl.push('WholesalePresaleListPage');
        },2000)
      }
      else {
        if (this.confirmTimes <= 5) {
          setTimeout(() => {
            this.confirmPay(id);
            this.navCtrl.push('WholesalePresaleListPage');
          },1000)
        }
        else {
          this.appService.toast('支付状态未对接成功','top','warning');
          setTimeout(() => {
            this.navCtrl.push('WholesalePresaleListPage');
          },2000)
        }
      }
    })
  }

}
