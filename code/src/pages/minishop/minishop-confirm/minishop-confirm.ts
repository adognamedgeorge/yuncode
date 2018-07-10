import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
import { Platform } from 'ionic-angular';
// 地图申明
declare const AMap;
declare const cordova: any;
declare const Wechat;
/**
 * Generated class for the MinishopConfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-confirm',
  templateUrl: 'minishop-confirm.html',
})
export class MinishopConfirmPage {
  token = '';
  isBackdrop = false;
  shopCart = {};
  // 地址Id
  addressId = 0;
  // 地址信息
  addressInfo = [];
  // 地址信息
  shopInfo = [];
  //  备注
  remark = '';
  // 应付
  costsPrice = 0;
  // 不参加满就减活动的商品总价
  fullsendTotal = 0;
  // 不参加优惠券活动的商品总价
  couponTotal = 0;
  // 满减减去的金额
  reductionDecreaseAmount = 0;
  // 满减过后的金额
  afterReductionTotalPrice = this.navParams.get('cartTotalPrice');
  // 可获得优惠券
  shopCoupon = {};
  // 可使用优惠券列表
  useCoupon = [];
  // 使用优惠券
  coupon = {};
  // 支付方式
  payType = 'online';
  // 店铺Id
  shopId = 0;
  // 购物车商品总额
  cartTotalPrice = 0;
  // 是否支持优惠券
  isCoupon = false;
  // 是否超出配送范围
  isInDeliveryRange = true;
  shopLngLat : any;
  addressLngLat : any;
  private confirmTimes = 0;
  tradeId;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public platform: Platform,
              public storage: StorageProvider, public modalCtrl: ModalController,
              public alertCtrl: AlertController,) {
    this.shopCart = this.navParams.get('shopCart');
    this.shopId = this.navParams.get('shopId');
    this.cartTotalPrice = this.navParams.get('cartTotalPrice');
    this.getFullsendTotal();
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItemLoad();
    });
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
    this.isInDeliveryRange = true;
    this.appService.httpJsonp('common.address.get',{
      "token": this.token,
      "id": this.addressId
    },res => {
      this.addressInfo = res.data;
      this.addressLngLat = new AMap.LngLat(res.data.longitude, res.data.latitude);
      this.isInDeliveryRange = this.shopLngLat.distance(this.addressLngLat) <= this.shopInfo['delivery_range'];
    })
  }
  // 选择支付方式
  selectPayType (type) {
    this.payType = type;
    this.blancePrice();
  }
  // 获取基础数据
  getItemLoad() {
    this.appService.httpJsonp('mini.shop.get',{
      "id": this.shopId
    },res => {
      this.shopInfo = res.data;
      this.shopLngLat = new AMap.LngLat(this.shopInfo['longitude'] / 1000000, this.shopInfo['latitude'] / 1000000);
      this.isCoupon =this.shopInfo['max_return_cash'] > 0;
      // 设置小店支付方式
      if (res.data.support_cod == 2) {
        this.payType = 'cod';
      }
      if (res.data.support_online == 2) {
        this.payType = 'online';
      }
      this.getShopReduction();
    })
  }
  // 获取满减活动
  getShopReduction() {
    let  total_price = (this.cartTotalPrice - this.fullsendTotal) / 100;
    this.appService.httpJsonp('mini.promotion.getFullMinusPromoForTrade', {
      "token": this.token,
      "shop_id": this.shopId,
      "total_price": total_price
    }, res => {
      if(res.data){
        if(res.data.is_amount_multiple == 1){
          this.reductionDecreaseAmount = Math.floor(this.cartTotalPrice / res.data.total_price) * res.data.decrease_amount;
        }else{
          this.reductionDecreaseAmount = res.data.decrease_amount;
        }
        this.afterReductionTotalPrice = this.cartTotalPrice - this.reductionDecreaseAmount;
      }
      this.blancePrice();
      this.getUseableListForTrade();
      this.getShopCoupon();
    })
  }
  // 可使用优惠券
  getUseableListForTrade() {
    this.appService.httpJsonp('mini.coupon.tradeUseable', {
      "token": this.token,
      "shop_id": this.shopId,
      "total": (this.afterReductionTotalPrice - this.couponTotal) / 100
    }, res => {

      this.useCoupon = res.data || [];
      for (let k in this.useCoupon) {
        this.useCoupon[k].selected = false;
      }
    })
  }
  // 可获得优惠券
  getShopCoupon() {
    this.appService.httpJsonp('mini.promotion.getCouponPromoForTrade', {
      "token": this.token,
      "shop_id": this.shopId,
      "total_price": (this.afterReductionTotalPrice - this.couponTotal) / 100
    }, res => {
      this.shopCoupon = res.data;
    })
  }
  // 获取不参加满就减活动的商品总价 和 不参加优惠券活动的商品总价
  getFullsendTotal () {
    for(let k in this.shopCart){
      if(this.shopCart[k]['black']){
        if(this.shopCart[k]['black']['is_fullsend'] == 2){
          this.fullsendTotal += this.shopCart[k].sellPrice * this.shopCart[k].inCartQuantity;
        }
      }
      if(this.shopCart[k]['black']){
        if(this.shopCart[k]['black']['is_coupon'] == 1){
          this.couponTotal += this.shopCart[k].sellPrice * this.shopCart[k].inCartQuantity;
        }
      }
    }
  }
  // 打开优惠券模版
  openCouponModal () {
    this.isBackdrop = true;
    let couponModal = this.modalCtrl.create('MinishopCouponModalPage',{
      'coupon': this.useCoupon,
    });
    couponModal.onDidDismiss(data=>{
      this.useCoupon = data;
      for (let k in this.useCoupon) {
        if (this.useCoupon[k].selected == true) {
          this.coupon = this.useCoupon[k];
        }
      }
      this.blancePrice();
      this.isBackdrop = false;
    });
    couponModal.present();
  }
  // 计算价格
  blancePrice () {
    this.costsPrice = this.cartTotalPrice + this.shopInfo['delivery_fee'];
    if (this.payType == 'cod') {
      return false;
    }
    else if (this.payType == 'online' && this.isCoupon && this.coupon['denomination']) {
      this.costsPrice = this.costsPrice - this.reductionDecreaseAmount - this.coupon['denomination']
    }
    else {
      this.costsPrice = this.costsPrice - this.reductionDecreaseAmount
    }
  }
  // 去支付
  onlinePay() {
    if (!this.isInDeliveryRange) {
      this.appService.toast('当前地址超出小店配送范围, 请重新选择','top','warning');
      return false;
    }
    if (this.addressId == 0) {
      this.appService.toast('请选择配送地址','top','warning');
      return false;
    }
    let cartInfo = '';
    for (let k in this.shopCart) {
      let cart = this.shopCart[k];
      cartInfo += cart.itemId + ":" + cart.inCartQuantity + ';';
    }
    let params = {
      token: this.token,
      shop_id: this.shopId,
      address_id: this.addressId,
      pay_type:this.payType,
      remark: this.remark,
      coupon_id: this.coupon['id'] ? this.coupon['id'] : 0,
      data: cartInfo
    };
    if (this.platform._platforms[1] == 'ios') {
      params['trade_from'] = 5;
    }
    else {
      params['trade_from'] = 4;
    }
    if (this.payType == 'online') {
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

          this.createTrade(params, res => {
            this.tradeId = res.data;
            // 调用支付
            switch (payPlatform) {
              case "weixinpay":
                this.wechatPay(res.data);
                break;
              case "alipay":
                this.alipayPay(res.data);
                break;
            }
          })
        }
      }).present();
    }else {
      this.createTrade(params, res => {
        this.appService.toast('下单成功','top','warning');
        this.navCtrl.pop();
        this.appService.httpJsonp('mini.trade.wechatTradeMessage',{
          token: this.token,
          trade_id: res.data
        }, '');
        this.appService.httpJsonp('mini.trade.pushSellerNotification',{
          token: this.token,
          trade_id: res.data
        }, '');
      })
    }


  }

  // 创建订单
  createTrade(params, callback?) {
    callback = typeof callback == "function" ? callback : function () {};
    this.appService.httpJsonp('mini.trade.create', params, res => {
      if (res.status == 'success') {
        callback(res);
        this.storage.getDate('cartInfo', res=> {
          let cartInfo = res ? JSON.parse(res) : {};
          delete cartInfo[this.shopId];
          this.storage.setDate('cartInfo', JSON.stringify(cartInfo));
        });

      }
    });
  }
  // 微信支付
  wechatPay(tradeId) {
    this.appService.httpJsonp('/mini/wechat_pay/index',{
      token: this.token,
      tradeId: tradeId,
      type: 'APP'
    }, res => {
      Wechat.isInstalled( (installed) =>{
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
    this.appService.httpJsonp('/mini/alipay_pay/index',{
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
        this.appService.toast(JSON.stringify(error.memo),'top','warning');
      });
    })
  }
  // 确认支付成功
  confirmPay () {
    this.appService.httpJsonp('mini.trade.get', {
      "token": this.token,
      "trade_id": this.tradeId
    }, res => {
      if (res.data.status == 2) {
        this.appService.toast('支付成功','top','warning');
        setTimeout(() => {
          this.navCtrl.push('MinishopOrderPage');
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
            this.navCtrl.push('MinishopOrderPage');
          },2000)
        }
      }
    })
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
