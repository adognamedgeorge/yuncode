import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
declare const cordova: any;
declare const Wechat;
/**
 * Generated class for the MemberExchangeConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-exchange-confirm',
  templateUrl: 'member-exchange-confirm.html',
})
export class MemberExchangeConfirmPage {
  item = this.navParams.get('item');
  token = '';
  payPlatform = 'alipay';
  private confirmTimes = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public appService: AppService,
              public storage: StorageProvider) {
    console.log(this.item)
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
  }

  closeModal(){
  	this.viewCtrl.dismiss();
  }
  // 兑换
  exchange () {
    if (this.item['payment']) {
      if (this.payPlatform == 'alipay') {
        this.alipayPay(this.item.tradeId,'mall')
      }
      else {
        this.wechatPay(this.item.tradeId,'mall')
      }
    }
    else {
      this.appService.httpJsonp('cashier.point_trade.exchange', {
        "token": this.token,
        'itemId': this.item.id,
        'payPlatform': this.payPlatform
      }, res => {
        this.appService.toast(res.info,'top','warning');
        if (res.status != 'fail' && res.data.needPay) {
          if (this.payPlatform == 'alipay') {
            this.alipayPay(this.item.tradeId,'mall')
          }
          else {
            this.wechatPay(this.item.tradeId,'mall')
          }
        }
      })
    }

  }


  // 微信支付
  wechatPay(tradeId,type) {
    this.appService.httpJsonp(type+'/wechat_pay/index',{
      token: this.token,
      tradeId: tradeId,
      type: 'APP'
    }, res => {
      Wechat.isInstalled((installed) => {
        if (installed) {
          Wechat.sendPaymentRequest(res.data,  () => {
            this.confirmPay(tradeId,type);
          },  error => {
            this.appService.toast(error,'top','warning');
          });
        }
        else {
          this.appService.toast('请检查微信是否为最新版本','top','warning');
        }
      }, (error) => {
        this.appService.toast(JSON.stringify(error),'top','warning');
      });

    })
  }
  //  支付宝支付
  alipayPay(tradeId, type) {
    this.appService.httpJsonp(type+'/alipay_pay/index',{
      token: this.token,
      tradeId: tradeId
    }, res => {
      cordova.plugins.alipay.payment(res.data, res => {
        if (res.resultStatus == 9000 || res.resultStatus == 8000) {
          this.appService.presentLoading('正在获取支付结果',5000);
          this.confirmPay(tradeId, type);
        }
        else if (res.resultStatus == 6001) {
          this.appService.toast('亲，您取消了支付操作','top','warning');
        }
      },error => {
        this.appService.toast(JSON.stringify(error.memo),'top','warning');
      });
    })
  }
  // 确认支付成功
  confirmPay (tradeId,type) {
    this.appService.httpJsonp( type + '.trade.get', {
      "token": this.token,
      "trade_id": tradeId
    }, res => {
      if (res.data.status == 2) {
        this.appService.toast('支付成功','top','warning');
      }
      else {
        if (this.confirmTimes <= 5) {
          setTimeout(() => {
            this.confirmPay(tradeId,type);
          },1000)
        }
        else {
          this.appService.toast('支付状态未对接成功','top','warning');
        }
      }
    })
  }


}
