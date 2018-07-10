import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MinishopSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-search',
  templateUrl: 'minishop-search.html',
})
export class MinishopSearchPage {
  shopId = this.navParams.get('shopId');
  products = [];
  token = '';
  userInfo = [];
  loading = true;
  pageNo = 1;
  pageSize = 20;
  keyWord = '';
  oldBuyNum = 0;
  cartInfo = {};
  shopCart = this.navParams.get('shopCart');
  isShopOpen =  this.navParams.get('isShopOpen');
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService,public storage: StorageProvider,) {
    this.storage.getDate('MS_AUTH_TOKEN', res => {
      this.token = res;
    });

    this.storage.getDate('cartInfo', res=> {
      this.cartInfo = res ? JSON.parse(res) : {};
    });
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
    });
    // this.shopId = 1000182;
    this.getSearchItem();
  }
  getSearchItem(infiniteScroll?) {
    this.appService.httpJsonp('mini.item.list', {
      shop_id: this.shopId,
      page_no: this.pageNo,
      page_size: this.pageSize,
      keyword: this.keyWord
    }, res => {
      this.products = this.products.concat(res.data.list);
      if(res.data.list.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }
  // 搜索
  getSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.keyWord = val;
    }
  }
  search() {
    this.pageNo =1;
    this.products = [];
    setTimeout(() => {
      if(this.keyWord == ""){
        this.appService.toast('请输入商品名称','top','warning');
        return false
      }
      else{
        this.getSearchItem();
      }
    },500)
  }
  // 减数量
  minusProduct (item, shopCart) {
    shopCart[item.id]['inCartQuantity']--;
    if (shopCart[item.id]['inCartQuantity'] == 0) {
      this._delCart(shopCart, item);
      return false
    }
  }

  // 加数量
  addProduct(item, shopCart, e) {
    shopCart = shopCart ? shopCart : {};
    if (this.token.length > 0) {
      if (!shopCart[item['id']]) {
        item['quantity'] = 0;
      }
      if( item['quantity']  >= item['stockNum']){
        this.appService.toast('库存不够啦,看看其它商品吧~','top','warning');
      }
      else {
        item['quantity']++;
        if ( item['limit_num'] > 0 ) {
          this.appService.httpJsonp('mini.shop.stopBuyNum',{
            "item_id": item['id'],
            "buyer_id" : this.userInfo['id']
          }, res => {
            this.oldBuyNum = res.data;
            if (this.oldBuyNum + item['quantity'] > item['limit_num']) {
              this.appService.toast("该商品每天限购" + item['limit_num'] + "件,已经购买" + this.oldBuyNum + "件",'top','warning');
              return false;
            }
            else {
              this._addCart(shopCart, item, e)
            }
          })
        }
        else if ( item['limit_num'] == 0 ) {
          this._addCart(shopCart, item, e)
        }
      }
    }
    else {
      this.navCtrl.push('LoginPage');
    }
  }
  _addCart (shopCart, item, e, oldBuyNum?) {
    // this.flyCartProvider.fly(e, this.el, this.renderer);
    let cart = shopCart[item.id] ? shopCart[item.id] : {};
    if (item.stock_num > 0) {
      cart.itemId = item.id;
      cart.itemName = item.title;
      cart.itemPicUrl = item.pic_url;
      cart.cateId = item.shop_cat_id;
      cart.sellPrice = item.sell_price;
      cart.stockNum = item.stock_num;
      cart.salesVolume = item.sales_volume;
      cart.black = item.black;
      cart.shopId = item.shop_id;
      cart.inCartQuantity = item.quantity;
      this._updateCart(shopCart, cart)
    }
    else {
      this._delCart(shopCart, item);
    }

  }
  // 更新购物车
  _updateCart (shopCart, cart) {
    if (cart.inCartQuantity > 0) {
      shopCart[cart['itemId']] = cart;
      this.cartInfo[cart.shopId] = shopCart;
    }
    else {
      delete this.cartInfo[cart['shopId']][cart['itemId']];
    }
    this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
  }
  // 删除购物车
  _delCart (shopCart, item) {
    if ( shopCart && shopCart[item['id']]) {
      delete shopCart[item['id']];
      this.cartInfo[item['shop_id']] = shopCart;
      this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
    }
  }

  // 下拉加载
  doInfinite(infiniteScroll){
    this.getSearchItem(infiniteScroll);
  }
}
