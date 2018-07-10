import { Component } from '@angular/core';
import { AppService } from "../../../app/app.service";
import {
  ActionSheetController, IonicPage, ModalController, NavController, NavParams, Events
} from 'ionic-angular';
import {StorageProvider} from "../../../providers/storage/storage";
declare const Wechat;

/**
 * Generated class for the MinishopShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-shop',
  templateUrl: 'minishop-shop.html',
})
export class MinishopShopPage {
  token = '';
  userInfo = {};
  loading = true;
  loadingRate = true;
  isLock = false;
  isBackdrop = false;
  selectedSegment = 's0';
  shopId = '';
  pageNo = 1;
  pageNoRate = 1;
  pageSize = 20;
  // 再来一单
  buyAgain = false;
  // 店铺信息
  shopInfo = {};
  isShopOpen = false;
  // 评价信息
  ShopRate = [];
  // 购物车信息
  cartInfo = [];
  //购物车数量
  cartNum = 0;
  //购物总价
  cartPrice = 0;
  // 店铺购物车信息
  shopCart = {};
  // 顶级分类信息
  shopTopCat = [];
  // 2级分类信息
  shopSeconndCat = [];
  // 3级分类信息
  shopThirdCat = [];
  // 商品列表信息
  shopItemList = [];
  // 再来一单
  buyAgainTrade : any;
  catId = 0;
  // 优惠信息
  saleItems = {};
  constructor( public navParams: NavParams, public navCtrl: NavController,
              public appService: AppService, public storage: StorageProvider,
              public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
               public events: Events) {
    this.shopId = this.navParams.get('shopId');
    this.buyAgain = this.navParams.get('buyAgain');
    this.buyAgainTrade = this.navParams.get('buyAgainTrade');
    this.getShopList();
    this.getCategoryList();
    this.getItemList();
    this.getShopRate();
    this.getSale();
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
    });
  }
  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.events.publish('token',res);
    });
    this.getCartInfo();
  }
  //获取店铺数据
  getShopList() {
    this.appService.httpJsonp('mini.shop.get', {
      id: this.shopId,
    }, res=>{
      if (res.status == 'fail') {
        this.appService.toast('店铺已关闭~','top','warning');
        this.navCtrl.pop();
        return false;
      }
      this.shopInfo = res.data;
      if (this.shopInfo['shop_status'] == 2) {
        if (
          (this.shopInfo['day_open_time'] < this.appService.getCurrentTime() && this.shopInfo['day_close_time'] > this.appService.getCurrentTime()) ||
          (this.shopInfo['night_open_time'] < this.appService.getCurrentTime() && this.shopInfo['night_close_time'] > this.appService.getCurrentTime())
        ) {
          this.isShopOpen = true
        }
        else {
          this.appService.toast('店铺歇业中~','top','warning');
          this.isShopOpen = false
        }
      }
      else {
        this.appService.toast('店铺歇业中~','top','warning');
        this.isShopOpen = false
      }
    })
  }
  // 获取店铺优惠信息
  getSale() {
    this.appService.httpJsonp('mini.promotion.getShopPromoInfo',{"shop_id": this.shopId},res => {
      this.saleItems = res.data;
    })
  }
  // 获取评价
  getShopRate() {
    this.appService.httpJsonp('mini.shop.shopRate', {
      "shop_id": this.shopId,
      "page_no" : this.pageNoRate,
      "page_size" : this.pageSize
    }, res => {
      this.ShopRate = this.ShopRate.concat(res.data.list);
      this.pageNoRate++;
      if (res.data.list.length < 20) {
        this.loadingRate = false;
      }
    })
  }
  // 获取购物车信息
  getCartInfo() {
    this.cartNum = 0;
    this.cartPrice = 0;
    this.storage.getDate('cartInfo', res=> {
      this.cartInfo = res ? JSON.parse(res) : {};
      // 再来一单
      if ( this.buyAgain ) {
        this.shopCart = {};
        this.appService.httpJsonp('mini.trade.get', {
          "token": this.token,
          "trade_id": this.buyAgainTrade.id
        }, res => {
          let ids = [];
          for (let k in res.data.orders) {
            let item = res.data.orders[k];
            this.shopCart[item.item_id] = this.shopCart[item.item_id] ? this.shopCart[item.item_id] : {};
            ids.push(item.item_id);
            this.shopCart[item.item_id]['inCartQuantity'] = item.quantity;
          }
          this.appService.httpJsonp('/mini/item/getListByIds',{ids: ids.join(',')}, res => {
            for (let k in res.data) {
              let item = res.data[k];
              this.shopCart[item.id] =this.shopCart[item.id] ? this.shopCart[item.id] : {};
              this.shopCart[item.id]['itemId'] = item.id;
              this.shopCart[item.id]['itemName'] = item.title;
              this.shopCart[item.id]['itemPicUrl'] = item.pic_url;
              this.shopCart[item.id]['cateId'] = item.shop_cat_id;
              this.shopCart[item.id]['sellPrice'] = item.sell_price;
              this.shopCart[item.id]['stockNum'] = item.stock_num;
              this.shopCart[item.id]['salesVolume'] = item.sales_volume;
              this.shopCart[item.id]['black'] = item.black;
              this.shopCart[item.id]['shopId'] = item.shop_id;
            }
            let str = '';
            for (let k in this.shopCart) {
              let item = this.shopCart[k];
              if (item['stockNum'] == 0) {
                str += item['itemName'] + ' ';
                delete this.shopCart[k]
              }
              else if (item['stockNum'] <= item['inCartQuantity']) {
                str += item['itemName'] + ' ';
                item['inCartQuantity'] = item['stockNum'];
              }
            }
            if (str) {
              this.appService.toast(str + '库存不足','top','warning');
            }
            this.cartInfo[this.shopId] = this.shopCart;
            this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
            this.cartInfoLoad(this.shopCart)
          });
        });
      }
      else {
        this.shopCart = this.cartInfo[this.shopId] ? this.cartInfo[this.shopId] : {};
        this.cartInfoLoad(this.shopCart)
      }
    });
  }
  cartInfoLoad (items) {
    this.cartNum = 0;
    this.cartPrice = 0;
    this.shopCart = items;
    for(let k in items) {
      this.cartNum =this.cartNum + items[k].inCartQuantity;
      this.cartPrice += items[k].inCartQuantity * items[k].sellPrice;
    }
  }
  // 获取店铺分类列表
  getCategoryList() {
    this.appService.httpJsonp('mini.category.list', {
      shop_id: this.shopId
    }, res=>{
      this.shopTopCat = res.data;
      this.shopTopCat.unshift({
        "id": 0,
        'title': '全部'
      });
    })
  }
  // 获取商品列表
  getItemList() {
    this.loading = true;
    this.isLock = true;
    this.appService.httpJsonp('mini.item.list', {
      shop_id: this.shopId,
      page_no: this.pageNo,
      page_size: this.pageSize,
      shop_cat_id: this.catId
    }, res=>{
      this.isLock = false;
      for (let k in res.data.list) {
        res.data.list[k]['quantity'] = 0;
        this.shopCart = this.shopCart ? this.shopCart : {};
        if (this.shopCart[res.data.list[k].id]) {
          res.data.list[k]['quantity'] = this.shopCart[res.data.list[k].id]['inCartQuantity'];
        }
      }
      this.shopItemList = this.shopItemList.concat(res.data.list);
      this.pageNo++;
      if (res.data.list.length < 20) {
        this.loading = false;
      }
    })
  }
  //选中顶级类目
  slectTopCate (item) {
    this.shopItemList = [];
    this.shopSeconndCat = [];
    this.shopThirdCat= [];
    this.pageNo = 1;
    this.catId = item.id;
    this.getItemList();
    if (item.id != 0) {
      this.appService.httpJsonp('mini.shop.getMoreCategory', {
        "shop_id": this.shopId,
        "parent_cid": item.id
      }, res => {
        this.shopSeconndCat = res.data;
      })
    }
  }
  //选中2级类目
  slectSecondCate(item) {
    this.shopItemList = [];
    this.shopThirdCat= [];
    this.pageNo = 1;
    this.catId = item.id;
    this.getItemList();
    this.appService.httpJsonp('mini.shop.getMoreCategory', {
      "shop_id": this.shopId,
      "parent_cid": item.id
    }, res => {
      this.shopThirdCat = res.data;
    })
  }
  //选中3级类目
  slectThirdCate(item) {
    this.shopItemList = [];
    this.pageNo = 1;
    this.catId = item.id;
    this.getItemList();
  }
  // 打开购物车
  openCart() {
    if (Object.keys(this.shopCart).length == 0) {
      return false
    }
    this.isBackdrop = true;
    let openCartModal = this.modalCtrl.create('MinishopShopCartPage',{
      'shopCart': this.shopCart,
      'shopId' : this.shopId,
      'cartInfo' : this.cartInfo
    });
    openCartModal.onDidDismiss(data => {
      this.cartInfo[this.shopId] = data;
      this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
      // if (Object.keys(data)['length'] >0) {
      //   this.cartInfo[this.shopId] = data;
      //   this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
      // }
      this.cartInfoLoad(data);
      this.isBackdrop = false;
    });
    openCartModal.present();
  }

  // 分享
  share() {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass:'share',
      title: '分享',
      buttons: [
        {
          text: '分享给微信朋友',
          // icon:'weixin',
          handler: () => {
            this.wechatPay(this.shopInfo, 2);
          }
        },
        {
          text: '分享到微信朋友圈',
          // icon:'pengyouquan',
          handler: () => {
            this.wechatPay(this.shopInfo, 1);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          cssClass:'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  // 微信分享
  wechatPay(item,type) {
    Wechat.isInstalled( (installed) => {
      if (installed) {
        Wechat.share({
          message: {
            title:item.title,
            description:"云蚂蚁小店分享",
            thumb:item.logo_url,
            media: {
              type: Wechat.Type.WEBPAGE,
              webpageUrl: 'http://dd.v2.yunmayi.com/weixin/goWeixin?app=ms&route=/shop/index/' + item.id + "/0"
            }
          },
          scene: type == 1 ? Wechat.Scene.TIMELINE : Wechat.Scene.SESSION
        }, function () {
          alert("Success");
        }, function (reason) {
          alert(reason);
        });

      }
      else {
        this.appService.toast('请检查微信是否为最新版本','top','warning');
      }
    }, (error) => {
      this.appService.toast(JSON.stringify(error),'top','warning');
    });
  }
  //下拉刷新
  infinite() {
    if (this.isLock) {
      return false;
    }
    if (!this.loading) {
      return false;
    }
    if (this.selectedSegment == 's0') {
      this.getItemList();
    }
    else {
      this.getShopRate();
    }
  }


  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {

  }

}
