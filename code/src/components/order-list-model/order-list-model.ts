import {Component, Input, Output, EventEmitter} from '@angular/core';
import {AppService} from "../../app/app.service";
import {StorageProvider} from "../../providers/storage/storage";
import {AlertController, NavController} from "ionic-angular";
declare const cordova: any;
declare const Wechat;
/**
 * Generated class for the OrderListModelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'order-list-model',
  templateUrl: 'order-list-model.html'
})
export class OrderListModelComponent {
  @Input() orderType: any;
  @Input() products: any;
  @Output() childEvent = new EventEmitter<any>();
  token = '';
  wholesaleUserInfo = [];
  // 小店购物车信息
  cartInfo = {};
  private confirmTimes = 0;
  constructor(public appService: AppService, public  storage: StorageProvider,
              public alertCtrl: AlertController, public navCtrl: NavController) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (res) {
        this.wholesaleUserInfo = res;
      }
    });
  }
  // 批发取消订单
  wholesaleCancel (id) {
    this.appService.httpJsonp('wholesale.trade.applyCancel', {
      "order_id" : id,
      "user_id" : this.wholesaleUserInfo['user_id']
    }, res=>{
      if ( res.data.error == false ) {
        this.childEvent.emit(this.orderType.index);
      }
      this.appService.toast(res.data.info,'top','warning');

    })
  }
  // 批发再买一次
  wholesaleBuyAgain (id) {
    this.appService.httpJsonp('wholesale.product.buyAgain', {
      "order_id" : id,
      "user_id" : this.wholesaleUserInfo['user_id']
    }, res=>{
      this.appService.toast(res.data.info,'top','warning');

    })
  }
  // 商城取消订单
  mallCancel (id, target) {
    console.log(id)
    this.appService.httpJsonp('mall.trade.close', {
      "tradeId": id,
      "userId": this.wholesaleUserInfo['user_id'],
      "token": this.token,
    }, res=>{
      if(target==1){
        this.appService.toast('订单关闭成功','top','warning');
      }else if(target==2){
        this.appService.toast('订单申请取消成功，退款正在审核中，请耐心等待!','top','warning');
      }
      this.childEvent.emit(this.orderType.index);
    })
  }
  // 商城再买一次
  mallBuyAgain (orders) {
    console.log(orders)
    for (let k in orders) {
      this.appService.httpJsonp('mall.cart.incrementAdd',{
        "token": this.token,
        "item_id": orders[k].itemId,
        "num": orders[k].num,
        "sku_id":orders[k].skuId
      },'');
    }
    for (let k in orders) {
      this.appService.httpJsonp('mall.item.get', {
        "item_id": orders[k].itemId,
      }, res => {
        if (res.data.status != 4) {
          this.appService.toast('部分商品已下架,请重新下单!', 'top', 'warning');
          return false;
        }
        else {
          if( parseInt(k)+1 == (orders['length'])) {
            this.appService.toast('加入购物车成功', 'top', 'warning');
          }
        }
      });
    }
  }
 // 商城去付款
  mallpaying (tradeId){
    this.confirmTimes = 0;
    this.alertMOdal(tradeId, 'mall')

  }
  // 小店去付款
  minShopPaying (tradeId){
    this.confirmTimes = 0;
    this.alertMOdal(tradeId, 'mini')
  }
  // 小店取消订单
  minShopCancel(tradeId) {
    this.appService.confirm('确认取消订单?','', () => {
      this.appService.httpJsonp('mini.trade.cancelTrade', {
        "token": this.token,
        "trade_id": tradeId
      }, res => {
        console.log(res)
        this.appService.toast(res.info, 'top', 'warning');
        this.childEvent.emit(this.orderType.index);
      })
    })
  }
  // 小店再来一单
  minShopBuyAgain(trade) {
    this.storage.getDate('cartInfo', res=> {
      this.cartInfo = res ? JSON.parse(res) : {};
      this.cartInfo[trade.shop_id] = {};
    });
    this.appService.httpJsonp('mini.trade.get', {
      "token": this.token,
      "trade_id": trade.id
    }, res => {
      for (let k in res.data.orders) {
        let item = res.data.orders[k];
        let cart = {};
        cart['itemId'] = item.item_id;
        cart['itemName'] = item.title;
        cart['itemPicUrl'] = item.pic_url;
        cart['cateId'] = item.shop_cat_id;
        cart['sellPrice'] = item.price;
        cart['stockNum'] = item.stock_num;
        cart['salesVolume'] = item.sales_volume;
        cart['black'] = item.black;
        cart['shopId'] = item.shop_id;
        cart['inCartQuantity'] = item.quantity;
      }
    });
  }
  // 小店评价
  minShopGoRate(tradeId) {
    this.navCtrl.push('MinishopTradeRatePage', {
      tradeId: tradeId,
      token: this.token,
      orderType: this.orderType
    })
  }
  // 小店取确认收货
  minShopConfirm(tradeId) {
    this.appService.confirm('确认送达?','', () => {
      this.appService.httpJsonp('mini.trade.buyerConfirmTrade', {
        "token": this.token,
        "trade_id": tradeId
      }, res => {
        this.childEvent.emit(this.orderType.index);
      })
    })
  }

  // 微信支付
  wechatPay(tradeId,type) {
    this.appService.httpJsonp(type+'/wechat_pay/index',{
      token: this.token,
      tradeId: tradeId,
      type: 'APP'
    }, res => {
      Wechat.isInstalled(function (installed) {
        if (installed) {
          Wechat.sendPaymentRequest(res.data,  () => {
            this.appService.toast('支付成功','top','warning');
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
        this.childEvent.emit(this.orderType.index);
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
  alertMOdal(tradeId, type) {
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
        switch (payPlatform) {
          case "weixinpay":
            this.wechatPay(tradeId, type);
            break;
          case "alipay":
            this.alipayPay(tradeId, type);
            break;
        }
      }
    });
    alert.present();
  }
}
