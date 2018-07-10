import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import JsBarcode  from 'jsbarcode';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
declare const AppVersion;
/**
 * Generated class for the UserCenterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-center',
  templateUrl: 'user-center.html',
})
export class UserCenterPage {
  @ViewChild('barcode') barcode : ElementRef;
  token = '';
  userInfo = {};
  // 批发用户信息
  wholesaleUserInfo = {};
  // 是否为批发用户
  isWholesaleUser = false;
  // 批发账户余额
  yueManageBalance = 0;
  // 蚂蚁金币
  goldCash = 0;
  // 推广佣金
  markertingCash = 0;
  // 商品推广
  marketingNum =0;
  isLogin = false;
  //版本号
  version = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public appService: AppService,
              public storage: StorageProvider, public events: Events,
              ) {
    if(typeof AppVersion != 'undefined') {
      this.version = AppVersion.version;
    }
  }
  //初始化
  onIt(){
    setTimeout(()=>{
      //获取用户信息
      this.storage.getDate('userInfo', res=>{
        this.userInfo = res;
        if (res['id']) {
          this.isLogin = true;
          // 获取VIP信息
          this.getVip();
        }
      });
    },500);

  }

  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      if (res && !this.isLogin) {
        this.token = res;
        this.onIt();
      }
      else if (res && res != this.token) {
        this.onIt();
      }
    });
    setTimeout(()=>{
      this.isWholesaleUser = false;
      //获取批发用户信息
      this.storage.getDate('wholesaleUser',(res)=> {
        if (Object.keys(res)['length'] >0) {
          this.wholesaleUserInfo = res;
          this.isWholesaleUser = true;
          // this.events.publish('isWholesaleUser',this.isWholesaleUser);
          // 获取账户余额
          this.getYueManage();
        }
      });
    },500);

    // 获取蚂蚁金币
    this.getGoldCash();
    // 获取推广佣金
    this.getUserGoldCoin();
    // 获取推广商品
    this.getItemPopReturnPoint();
  }
  ionViewDidLoad() {}
  // 获取VIP会员信息
  getVip () {
    this.appService.httpJsonp('cashier.platformvip.get',{
      'token':this.token,
    },res=>{
      if (res.data) {
        JsBarcode(this.barcode.nativeElement, res.data['card_number'], {
          lineColor: "#000",
          format: "CODE128",
          width:10,
          height:200,
          displayValue: false
        })
      }
    })
  }
  // 获取批发账户余额
  getYueManage () {
    this.appService.httpJsonp('wholesale.shop.yueManage',{
      "user_id": this.wholesaleUserInfo['user_id']
    },res=>{
      this.yueManageBalance = res.data.balance;
    })
  }
  // 获取蚂蚁金币
  getGoldCash () {
    this.appService.httpJsonp('common.user.getUserGoldCoinNum',{
      "token": this.token
    },res=>{
      this.goldCash = res.data;
    })
  }
  // 获取推广佣金
  getUserGoldCoin () {
    this.appService.httpJsonp('common.user.getUserGoldCoinDetailList',{
      "token": this.token,
      "page": 1,
      "size": 99999,
      "type": "商城商品推广"
    },res=>{
      let allCash = 0;
      if (res.data) {
        for(let k in res.data.data) {
          allCash +=res.data.data[k].amount;
        }
      }

      this.markertingCash = allCash;
    })
  }
  // 获取推广商品
  getItemPopReturnPoint () {
    this.marketingNum = 0;
    let num = 0;
    this.appService.httpJsonp('mall.trade.getItemPopReturnPointList',{
      "token": this.token,
    },res=>{
      for(let k in res.data) {
        if (res.data[k].point !=0){
          num++;
        }
      }
      this.marketingNum = num;
    })
  }
  //打开地址模版
  openAdreesModal () {
    let AdreesModal = this.modalCtrl.create("ReceiveAdressPage");
    AdreesModal.present()
  }
  // 退出登录
  logout() {
    this.isWholesaleUser = false;
    this.isLogin = false;
    this.yueManageBalance = 0;
    // 蚂蚁金币
    this.goldCash = 0;
    // 推广佣金
    this.markertingCash = 0;
    // 商品推广
    this.marketingNum =0;
    this.storage.setDate('userInfo','');
    this.storage.setDate('MS_AUTH_TOKEN', '');
    this.storage.setDate('wholesaleUser','');
    this.navCtrl.push('LoginPage');
    this.events.publish('isWholesaleUser',this.isWholesaleUser);
  }
  // 跳转
  go (where,type) {
    if ( this.isWholesaleUser &&  type == 1) {
      this.navCtrl.push(where);
    }
    else if (!this.isLogin){
      this.navCtrl.push('LoginPage');
    }
    else if (this.token && type == 1 && !this.isWholesaleUser) {
      this.appService.toast('非批发用户','top','warning');
    }
    else if (type ==2 && this.token) {
      this.navCtrl.push(where);
    }
  }
  // 登陆
  login() {
    this.navCtrl.push('LoginPage')
  }
}
