import {Component, ViewChild} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import { WholesaleInfoProvider } from "../../../providers/wholesale-info/wholesale-info"
import {StorageProvider} from "../../../providers/storage/storage";
/**
 * Generated class for the WholesaleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['WholesaleHomePage']
})
@Component({
  selector: 'page-wholesale-detail',
  templateUrl: 'wholesale-detail.html',
})
export class WholesaleDetailPage {
  @ViewChild("header") header;
  @ViewChild('content') content;
  @ViewChild('ionSlides') slides: Slides;
  token = '';
  wholesaleUserInfo = {};
  itemId:any;
  itemList = {};
  itemStockInfo = {};
  imageList = [];
  cartInfo = [];
  remark = '';
  isTack = false;
  isBackdrop = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public modalCtrl: ModalController,
              public wholesaleInfoProvider: WholesaleInfoProvider, public storage: StorageProvider) {
    this.itemId = this.navParams.get('itemId');
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (typeof res == "object") {
        this.wholesaleUserInfo = res;
        // 获取商品数据
        this.getProductInfo();
      }
    });
  }
  ionViewWillEnter () {
    // 获取购物车数据
    this.getCartInfo();
  }
  // 获取商品数据
  getProductInfo (type?) {
    this.appService.httpJsonp('wholesale.product.getProductByPid',{
      "product_id": this.itemId,
      "user_id":this.wholesaleUserInfo['user_id'],
    }, res=>{
      res.data['is_cart'] = false;
      res.data['remark'] = this.remark;
      this.isTack = false;
      for (let i in this.cartInfo['cart_info']) {
        if (this.cartInfo['cart_info'][i].product_id == this.itemId) {
          res.data['is_cart'] = true;
          res.data['cart_num'] = this.cartInfo['cart_info'][i].quantity;
        }
      }
      if (this.imageList.length == 0) {
        res.data.pic_list.split('"').forEach( v=> {
          if ( v.indexOf("upload") > 0){
            this.imageList.push( this.appService.changeImgUrl(v, 700) );
          }
        });
      }
      // res.data.pic_url = this.appService.changeImgUrl(res.data.pic_url, 200);
      this.itemStockInfo = res.data.stock_info;
      this.itemList = res.data;
      // 获取是否为预售商品信息
      this.getIsPresale ();
      if ( this.itemList['is_collect'].length > 0 ) {
        this.isTack = true
      }
    },!type);
  }
  // 获取是否为预售商品信息
  getIsPresale () {
    this.itemList['presaleList'] = [];
    this.appService.httpJsonp('wholesale.product.isPresaleItem',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "pid": this.itemId,
    },res=>{
      if (Object.keys(res.data).length) {
        for (let i in res.data) {
          res.data[i].quantity = 0;
          this.itemList['presaleList'].push(res.data[i]);
        }
      }
    });
  }
  // 获取购物车数据
  getCartInfo () {
    this.wholesaleInfoProvider.getWholesaleCartInfo(res=>{
      this.cartInfo = res;
    });
  }
  // 取消收藏
  untack () {
    this.appService.httpJsonp('wholesale.product.delCollect',{
      "token": this.token,
      "collect_id": this.itemList['is_collect'][0].id
    },res=>{
      this.appService.toast(res.data.info,'top','warning');
      this.getProductInfo(true);
    },true)
  }
  // 收藏
  tack () {
    this.appService.httpJsonp('wholesale.product.addToCollect',{
      "token": this.token,
      "productId":  this.itemId,
      "agent_number": this.wholesaleUserInfo['agent_number']
    },res=>{
      this.appService.toast(res.data.info,'top','warning');
      this.getProductInfo(true);
    },true);
  }
  // 加入购物车
  addCart () {
    this.isBackdrop = true;
    let addCartModal = this.modalCtrl.create('WholesaleDetailModalPage',{
      'item': this.itemList,
      'wholesaleUserInfo': this.wholesaleUserInfo,
      'cartInfo': this.cartInfo
    });
    addCartModal.onDidDismiss(data => {
      if (data) {
        this.getProductInfo();
        this.getCartInfo();
      }
      this.isBackdrop = false;
    });
    addCartModal.present();
  }
}
