import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
/**
 * Generated class for the WholesaleComfirmPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-comfirm',
  templateUrl: 'wholesale-comfirm.html',
})

export class WholesaleComfirmPage {
  token = '';
  wholesaleUserInfo = [];
  // 用户信息
  userInfo = [];
  // 商品列表
  groups = {};
  // 通用优惠券
  coupon1= [];
  // 通用优惠券ID
  couponId = 0;
  // 品牌优惠券
  coupon2= [];
  // 品牌优惠券IDs
  brand_coupon_ids = [];
  // 品牌满就减IDs
  brandMjsIds = '';
  // 供应商优惠券
  coupon3= [];
  // 供应商优惠券IDs
  vendor_coupon_ids = [];
  // 供应商满就减IDs
  vendorMjsIds = '';
  // 总计
  total = [];
  // 折扣
  discountTotal = [];
  // 备注
  remark = '';
  // 预售商品总价
  presalePrice = 0;
  // 应付总价
  blance = 0;

  isBackdrop = false;
  public payType = '2';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              public modalCtrl: ModalController) {}
  ionViewDidEnter () {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.wholesaleUserInfo['user_id'] = 100673;
      this.laodInfo();
    });
    this.storage.getDate('wholesaleUser',(res)=>{
      this.wholesaleUserInfo = res;
    });
  }
  // 加载数据
  laodInfo () {
    this.appService.httpJsonp('wholesale.trade.loadData1',{
      "token": this.token,
      "agent_number": this.wholesaleUserInfo['agent_number']
    }, res => {
      this.userInfo = res.data['user'];
      this.groups = res.data.groups;
      this.total = res. data.total;
      this.discountTotal = res.data.discountTotal;
      this.coupon1 = res.data.commonCoupons;
      this.coupon2 = res.data.brandCouponGroups;
      this.coupon3 = res.data.vendorCouponGroups;
      this.brandMjsIds = res.data.brandMjsIds.join(",");
      this.vendorMjsIds= res.data.vendorMjsIds.join(",");
      this.loadPresale();
    },true)
  }
  // 预售商品信息
  loadPresale () {
    this.appService.httpJsonp('wholesale.product.countPresaleDiscount',
      {'userId': this.wholesaleUserInfo['user_id']},
      res=>{
        this.presalePrice = res.data.discountTotal | 0;
        if( this.presalePrice ==  this.total['origin']) {
          this.coupon1 = [];
          this.coupon2 = [];
          this.coupon3 = [];
          this.brandMjsIds = '';
          this.vendorMjsIds= '';
        }
        this.blancePrice();
        if ( this.blance > this.userInfo['balance'] || this.blance == 0) {
          this.payType = '1';
          this.blancePrice();
          }
      })
  };
  // 打开优惠券模版
  openCouponModal () {
    this.isBackdrop = true;
    let couponModal = this.modalCtrl.create('WholesaleCouponModalPage',{
      'coupon1': this.coupon1,
      'coupon2': this.coupon2,
      'coupon3': this.coupon3
    });
    couponModal.onDidDismiss(data=>{
      this.coupon1 = data.coupon1;
      this.coupon2 = data.coupon2;
      this.coupon3 = data.coupon3;
      this.blancePrice();
      this.isBackdrop = false;
    });
    couponModal.present();
  }
  // 选择支付方式
  selectPayType (type) {
    this.payType = type;
    this.blancePrice();
  }
  // 计算总价
  blancePrice () {
    this.blance = this.total['origin'] - this.presalePrice - this.discountTotal['discount'];
    for ( let k in this.coupon1) {
      if (this.coupon1[k].selected) {
        this.couponId = this.coupon1[k].id;
        this.blance -= this.coupon1[k].denomination
      }
    }
    for (let k in this.coupon2) {
      for (let i in this.coupon2[k]['list']){
        if (this.coupon2[k]['list'][i].selected) {
          this.blance -= this.coupon2[k]['list'][i].denomination;
          this.brand_coupon_ids.push(this.coupon2[k]['list'][i].id);
        }
      }
    }
    for (let k in this.coupon3) {
      for (let i in this.coupon3[k]['list']){
        if (this.coupon3[k]['list'][i].selected) {
          this.blance -= this.coupon3[k]['list'][i].denomination;
          this.vendor_coupon_ids.push(this.coupon3[k]['list'][i].id);
        }
      }
    }

    if ( this.payType == '1') {
      this.blance -= this.discountTotal['codMjj'];
    }
    else {
      this.blance -= this.discountTotal['onlineMjj'];
    }

  }
  // 去支付
  onlinePay() {
    this.appService.httpJsonp('wholesale.trade.createOrder1',{
      "pay_type": this.payType,
      "user_id": this.wholesaleUserInfo['user_id'],
      "id":this.couponId,
      "remark": this.remark,
      "brand_coupon_ids": this.brand_coupon_ids.join(","),
      "vendor_coupon_ids": this.vendor_coupon_ids.join(","),
      "token": this.token,
      "brand_mjs_ids": this.brandMjsIds,
      "vendor_mjs_ids": this.vendorMjsIds
    },res=>{
      if (res.data.error == true) {
        let logicErrors = res.data.logicErrors  ? true :false;
        if(logicErrors){
          this.appService.toast('部分商品库存不足或已下架','top','warning');
          this.navCtrl.push('WholesaleCartPage')
        }else{
          this.appService.toast(res.data.info,'top','warning');
        }
        return false;
      }
      else {
        this.appService.toast(res.data.info,'top','warning');
      }
      setTimeout(()=>{
        this.navCtrl.popToRoot()
      },2000)
    });
  }
  // 对象转换数组
  getKeys(item) {
    // console.log(Object.keys(item))
    return Object.keys(item);
  }
}
