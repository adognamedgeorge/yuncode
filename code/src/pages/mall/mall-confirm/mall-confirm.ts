import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, AlertController, ModalController, Platform} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
declare const cordova: any;
declare const Wechat;
/**
 * Generated class for the MallConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-confirm',
  templateUrl: 'mall-confirm.html',
})
export class MallConfirmPage {
  token = '';
  wholesaleUserInfo = {};
  isWholesaleUser = false;
  cartIds : any;
  // 商品列表
  products  = [];
  //  关键词
  keyWord = '';
  // 总价
  priceAll = 0;
  // 邮费
  postage = 0;
  // 应付
  costsPrice = 0;
  // 批发积分
  wholesalePoints = 0;
  // 蚂蚁金币
  goldCash = 0;
  // 是否用积分
  isGoldCash = false;
  // 是否用金币
  iswholesalePoints = false;
  // 地址信息
  addressInfo = [];
  // 地址Id
  addressId = 0;
  private tradeId;
  private confirmTimes = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public appService: AppService,
              public storage: StorageProvider, public modalCtrl: ModalController,
              public platform: Platform) {
    this.cartIds = this.navParams.get('cartIds');
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (typeof res == "object") {
        this.wholesaleUserInfo = res;
        this.isWholesaleUser = true;
      }
    });

  }

  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItemLoad();
      this.getGoldCash();
    });
  }
  // 去付款
  onlinePay() {
    if (this.addressId == 0) {
      this.appService.toast('请选择配送地址','top','warning');
      return false
    }
    let alert = this.alertCtrl.create({cssClass:'onlinePay'});
    alert.setTitle('选择支付方式');
    alert.addInput({
      type: 'radio',
      label: '微信',
      value: 'weixinpay',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '支付宝',
      value: 'alipay'
    });

    alert.addButton({
      text:'取消',
    });
    alert.addButton({
      text: '确认',
      handler: payPlatform => {
        this.appService.httpJsonp('mall.trade.create',{
          "token": this.token,
          "cart_ids": this.cartIds,
          "deliver_address_id": this.addressId,
          "buyer_message": this.keyWord,
          "use_gold_coin": this.isGoldCash ? 1 : 0,
          "gold_coin": this.goldCash,
          "use_wholesale_point": this.iswholesalePoints ? 1 : 0,
          "wholesale_point": this.wholesalePoints
        },res => {
          if (res.status != 'fail') {
            this.tradeId = res.data;
            switch (payPlatform) {
              case "weixinpay":
                this.wechatPay(res.data);
                break;
              case "alipay":
                this.alipayPay(res.data);
                break;
            }
            //  删除购物车
            this.appService.httpJsonp('mall.cart.delete',{
              "token": this.token,
              "cart_ids": this.cartIds,
            }, '');
          }
        });
      }
    });
    alert.present();
  }
  // 获取商品信息
  getItemLoad() {
    this.priceAll = 0;
    this.appService.httpJsonp('mall.cart.getByCartIdsV2',{
      "token": this.token,
      "cart_ids": this.cartIds
    },res => {
      for (let k in res.data) {
        let propsMeassage = '';
        this.wholesalePoints += res.data[k].wholesalePoint;
        for (let i in res.data[k].props) {
          propsMeassage = propsMeassage + res.data[k].props[i].vname + ' ';
        }
        res.data[k]['checked'] = false;
        res.data[k]['propsMeassage'] = propsMeassage;
      }
      if (this.isWholesaleUser) {
        // 获取账户余额
        this.getYueManage();
      }
      this.products = res.data;
      for (let k in  this.products) {
        this.priceAll +=  this.products[k]["sellPrice"] *  this.products[k]["num"];
      }
      if ( this.priceAll /100 < 2) {
        this.postage = 500;
      }
      this.imputedPrice();
    })
  }
  // 计算价格
  imputedPrice() {
    let WholesalePoints = 0;
    let GoldCash = 0;
    this.costsPrice = 0;
    if (this.iswholesalePoints) {
      WholesalePoints = this.wholesalePoints;
    }
    if (this.isGoldCash) {
      GoldCash = this.goldCash;
    }
    this.costsPrice = this.priceAll -  GoldCash  - WholesalePoints / 10 + this.postage;
  }
  // 获取蚂蚁金币
  getGoldCash () {
    this.appService.httpJsonp('common.user.getUserGoldCoinNum',{
      "token": this.token
    },res=>{
      this.goldCash = res.data;
    })
  }

  // 获取批发账户余额
  getYueManage () {
    this.appService.httpJsonp('wholesale.shop.yueManage',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number']
    },res=>{
      this.wholesalePoints = Math.min(res.data.integral == undefined ? 0 : res.data.integral, this.wholesalePoints);
    })
  }
  //打开地址模版
  openAdreesModal () {
    let AdreesModal = this.modalCtrl.create("ReceiveAdressPage");
    AdreesModal.onDidDismiss(data => {
      if (data) {
        this.addressId = data.addressId;
        this.getAddress();
      }
    });
    AdreesModal.present()
  }
  getAddress() {
    this.appService.httpJsonp('common.address.get',{
      "token": this.token,
      "id": this.addressId
    },res => {
      this.addressInfo = res.data;
      console.log(res)
    })
  }
  // 微信支付
  wechatPay(tradeId) {
    this.appService.httpJsonp('/mall/wechat_pay/index',{
      token: this.token,
      tradeId: tradeId,
      type: 'APP'
    }, res => {
      Wechat.isInstalled((installed) => {
        if (installed) {
          Wechat.sendPaymentRequest(res.data,  () => {
            this.confirmPay();
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
  alipayPay(tradeId) {
    this.appService.httpJsonp('/mall/alipay_pay/index',{
      token: this.token,
      tradeId: tradeId
    }, res => {
      cordova.plugins.alipay.payment(res.data, res => {
        if (res.resultStatus == 9000 || res.resultStatus == 8000) {
          this.appService.presentLoading('正在获取支付结果',5000);
          this.confirmPay();
        }
        else if (res.resultStatus == 6001) {
          this.appService.toast('亲，您取消了支付操作','top','warning');
        }
      },error => {
        this.appService.toast(JSON.stringify(error.memo),'bottom','warning');
        setTimeout(() => {
          this.navCtrl.push('MallOrderPage');
        },2000)
      });
    })
  }
  // 确认支付成功
  confirmPay () {
    this.appService.httpJsonp('mall.trade.get', {
      "token": this.token,
      "trade_id": this.tradeId
    }, res => {
      if (res.data.status == 2) {
        this.appService.toast('支付成功','top','warning');
        setTimeout(() => {
          this.navCtrl.push('MallOrderPage');
        },2000)
      }
      else {
        if (this.confirmTimes <= 5) {
          setTimeout(() => {
            this.confirmPay();
          },1000)
        }
        else {
          this.appService.toast('支付状态未对接成功','top','warning');
          setTimeout(() => {
            this.navCtrl.push('MallOrderPage');
          },2000)
        }
      }
    })
  }
}
