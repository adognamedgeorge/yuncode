import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, App, ModalController, Events} from 'ionic-angular';
import {StorageProvider} from "../../../providers/storage/storage";
import {AppService} from "../../../app/app.service";
import {WholesaleInfoProvider} from "../../../providers/wholesale-info/wholesale-info";
/**
 * Generated class for the WholesaleHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-wholesale-home',
  templateUrl: 'wholesale-home.html',
})
export class WholesaleHomePage {
  @ViewChild("header") header;
  isWholesaleUser = false;
  wholesaleUserInfo = [];
  userInfo = [];
  token = '';
  isLogin = false;
  // 批发通告
  itemsNew = [];
  // 批发账户余额
  yueManage = [];
  // 分类数组
  categories: Array<any> = [];
  // 推荐商品
  recomProduct = [];
  // 限时特价商品
  specialProduct = [] ;
  // 限时特价商品
  presaleList = [];
  // 轮播图
  posterList: Array<any> = [];
  // 优惠券数量
  couponNum = 0 ;
  // 是否签到
  isCheckin = false;
  // 购物车信息
  cartInfo = [];
  // 幻灯片数组
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: StorageProvider, public appService: AppService,
              public wholesaleInfoProvider: WholesaleInfoProvider,
              private app: App, public modalCtrl: ModalController,
              public events: Events) {
    this.events.subscribe('isWholesaleUser', (isWholesaleUser) => {
      console.log(isWholesaleUser)
      if (!isWholesaleUser) {
        // this.navCtrl.push('LoginPage');
        // return false
      }
    });
    this.categories = [
      {class:"c1",title:"商品分类", go:"WholesaleProductListPage"},
      {class:"c2",title:"我常购买", go:"WholesaleAlwaysBuyPage"},
      {class:"c3",title:"我的收藏", go:"WholesaleMyTaskPage"},
      {class:"c4",title:"预购活动", go:"WholesalePresaleListPage"}
      ];
  }
  //初始化
  onIt(){
    setTimeout(()=>{
      this.isWholesaleUser = false;
      //获取用户信息
      this.storage.getDate('userInfo', res=>{
        this.userInfo = res;
      });
      //获取批发用户信息
      this.storage.getDate('wholesaleUser',(res)=> {
        if (typeof res == "object") {
          this.wholesaleUserInfo = res;
          this.isWholesaleUser = true
          this.getCartInfo();
          // 轮播图
          this.getPoster(res);
          // 优惠券数量
          this.getCouponNum(res);
          // 获取批发用户信息
          this.getNoticeList(res);
          // 推荐商品
          this.getRecomProduct(res);
          // 限时特价
          this.getSpecialProduct(res);
          // 预售活动
          this.getPresaleList(res);
          // 获取账户余额
          this.getYueManage();
          // 是否签到
          this.getSign(res);
        }
      });
    },100);
  }
  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      if (res && !this.isLogin) {
        this.isLogin = true;
        this.token = res;
        this.onIt();
      }
      else if (res && res != this.token) {
        this.onIt();
      }
      else {
        // 购物车信息
        this.getCartInfo();
      }
    });
  }
  // 获取批发账户余额
  getYueManage () {
    this.appService.httpJsonp('wholesale.shop.yueManage',{
      "user_id": this.wholesaleUserInfo['user_id']
    },res=>{
      this.yueManage = res.data;
    })
  }

// 导航栏渐变
  scrollEvent(e) {
    // console.log(this.header._elementRef.nativeElement.firstElementChild.style);

    let opacity = ( e.scrollTop ) / 135;
    // this.header._elementRef.nativeElement.style.opacity = opacity;
    this.header._elementRef.nativeElement.firstElementChild.style.backgroundColor = "rgba(255, 255, 255, " + opacity + ")";
  }
  // 获取优惠券数量
  getCouponNum(res) {
    this.couponNum = 0;
    this.appService.httpJsonp('wholesale.shop.couponList', {
      "agent_number": res.agent_number,
      "user_id": res.user_id,
      "page_no":1,
      "page_size":9999
    },res=>{
      for(let i in res.data.result){
        if(res.data.result[i].used == 0){
         this.couponNum++;
        }
      }
    })
  }
  // 是否签到
  getSign(res){
    this.appService.httpJsonp('wholesale.shop.sign', {
      "user_id": res.user_id,
    }, res=> {
      if ( res.data == false ){
        this.isCheckin = false;
      }
      else {
        this.isCheckin = true;
      }
    })
  }
  // 去签到
  checkin () {
    this.appService.httpJsonp('wholesale.shop.clock', {
      "user_id": this.wholesaleUserInfo['user_id'],
    }, res=> {
      this.isCheckin = true;
      if(res.data.error == false){
        // 获取账户余额
        this.getYueManage();
      }
      else{
        this.isCheckin = false;
      }
      this.appService.toast(res.data.info,'top','warning');
    })
  }
  // 获取批发快报
  getNoticeList (res) {
    let params = {
      "agent_number": res.agent_number,
      "user_id": res.user_id,
      "page_no": 1,
      "page_size": 100
    };
    this.appService.httpJsonp('wholesale.shop.getNoticeList', params, res=> {
      let k = 0;
      this.itemsNew = res.data.result[k];
      setInterval(()=>{
        k++;
        if (k >= res.data.result.length) {
          k = 0;
        }
        this.itemsNew = res.data.result[k];
      },5000);
    })
  }
  //加载轮播图
  getPoster(res) {
    this.appService.httpJsonp('wholesale.shop.poster', {
      "agent_number": res.agent_number,
      "token": this.token,
    },res=>{
      this.posterList = res.data;
    },true)
  }
  //加载预购活动
  getPresaleList(res) {
    this.appService.httpJsonp('wholesale/coupon/presaleList', {
      "agentNumber": res.agent_number,
      "userId": res.user_id,
      "page": 1,
      "pageSize": 50
    },res=>{
      this.presaleList = res.data.presaleList;
    })
  }
    //推荐商品
  getRecomProduct(res) {
    this.appService.httpJsonp('wholesale.product.getRecomProduct', {
      "agent_number": res.agent_number,
      "user_id": res.user_id
    },res=>{
      this.recomProduct = res.data;
    })
  }
    //限时特价
  getSpecialProduct(res) {
    this.appService.httpJsonp('wholesale.product.getSpecialProduct', {
      "agent_number": res.agent_number,
      "user_id": res.user_id
    },res=>{
      this.specialProduct = res.data;
    })
  }
  // 获取购物车数据
  getCartInfo () {
    this.appService.httpJsonp('wholesale.product.loadCartInfo', {
      "user_id": this.wholesaleUserInfo['user_id']
    }, res=>{
      this.cartInfo = res.data;
    })
  }
  // 轮播图跳转
  goDetaile (link) {
    console.log(link)
    let id = '';
    if (link.indexOf('notice') >= 0){
      id = link.substring( link.indexOf('new=') + 4);
      this.navCtrl.push('WholesaleNoticaInfoPage',{'id':id})
    }
    else if (link.indexOf('product') >= 0){
      if(link.indexOf("cid=") >= 0){
        id = link.substring( link.indexOf('cid=') + 4 );
        //搜索页
        this.navCtrl.push('WholesaleSearchPage',{'catId':id})
      }
      else {

        id = link.substring( link.indexOf("id=") + 3);
        this.navCtrl.push('WholesaleDetailPage',{'itemId':id})
      }
    }
    else if( link.indexOf("q=") >= 0){
      id = decodeURIComponent( link.substring( link.indexOf("q=") + 2 ));
      if (id.length > 0) {
        //搜索页
        this.navCtrl.push('WholesaleSearchPage',{'keyword':id})
      }
    }
    else if ( link.indexOf("presaleId") >= 0 ) {
      id= link.substring( link.indexOf( "presaleId=" ) + 10 );
      this.appService.httpJsonp('wholesale/coupon/presaleList',{
        'userId': this.wholesaleUserInfo['user_id'],
        "agentNumber": this.wholesaleUserInfo['agent_number'],
        "presaleId": id
      },res=>{
        this.navCtrl.push('WholesalePresaleModalPage',{'presaleId': res.data.presaleList[0],'wholesaleUserInfo':this.wholesaleUserInfo})
      })
    }
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
  //扫描
  qrscanner () {
    this.app.getRootNav().push('QrscannerPage');
  }
  // 加入购物车
  addCart (item) {
    // item.pic_url = this.appService.changeImgUrl(item.pic_url, 200);
    this.getIsPresale(item);
    // this.isBackdrop = true;
    let addCartModal = this.modalCtrl.create('WholesaleDetailModalPage',{
      'item': item,
      'wholesaleUserInfo': this.wholesaleUserInfo,
      'cartInfo': this.cartInfo
    });
    addCartModal.onDidDismiss(data => {
      if (data) {
        this.getCartInfo();
      }
    });
    addCartModal.present();
  }
  // 获取是否为预售商品信息
  getIsPresale (item) {
    item['presaleList'] = [];
    this.appService.httpJsonp('wholesale.product.isPresaleItem',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "pid": item.id,
    },res=>{
      if (Object.keys(res.data).length) {
        for (let i in res.data) {
          res.data[i].quantity = 0;
          item['presaleList'].push(res.data[i]);
        }
      }
    });
  }
}
