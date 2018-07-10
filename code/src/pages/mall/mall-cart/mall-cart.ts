import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MallCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-cart',
  templateUrl: 'mall-cart.html',
})
export class MallCartPage {
  token = '';
  cartList = [];
  cartIds = [];
  allPrice = 0;
  allChecked = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {

  }

  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getItemLoad();
    });
  }
  getItemLoad () {
    this.appService.httpJsonp('mall.cart.listv2',
      {
        "token": this.token
      }, res=> {
      for (let k in res.data) {
        let propsMeassage = '';
        for (let i in res.data[k].props) {
          propsMeassage = propsMeassage + res.data[k].props[i].vname + ' ';
        }
        res.data[k]['checked'] = false;
        res.data[k]['propsMeassage'] = propsMeassage;
      }
        this.cartList = res.data;
      })
  }
  // 减数量
  minusProduct (item) {
    if (item.num == 1) {
     this.delete(item.cartId, '是否将此商品从购物车中删除?');
      return false
    }
    else{
      item.num--;
      this.changeNum(item);
    }
  }
  // 加数量
  addProduct(item) {
    if( item['num'] >= item['stockNum']){
      this.appService.toast('商品库存不足','top','warning');
    }
    else {
      item.num++;
      this.changeNum(item);
    }
  }
  // 数量变化
  changeNum (item) {
    this.appService.httpJsonp('mall.cart.add',{
      "token": this.token,
      "item_id": item['itemId'],
      "sku_id": item['skuId'],
      "num": item['num']
    }, res => {
      this.imputedPrice();
    },true);
  }
  //删除
  deleteCart() {
    let cartIds = [];
    for (let k in this.cartList) {
      if (this.cartList[k]['checked']) {
        cartIds.push(this.cartList[k]['cartId'])
      }
    }
    if (cartIds.length > 0) {
      this.delete(cartIds.join(','),'是否删除商品');
    }
    else {
      return false
    }
    this.imputedPrice();
  }
  // 购物车删除
  delete (cartId, title) {
    this.appService.confirm(title,'',()=>{
      this.appService.httpJsonp('mall.cart.delete',{
        "token": this.token,
        "cart_ids": cartId
      },res=>{
        if (res.status == 'success') {
          this.getItemLoad();
          this.appService.toast('删除成功','top','warning');
        }
        else {
          this.appService.toast(res.info,'top','warning');
        }
        this.imputedPrice();
      })
    })
  }
  // 选中商品
  checked (item) {
    this.imputedPrice();
  }
  // 全选
  allchecked () {
    if (this.allChecked) {
      for (let k in this.cartList) {
        this.cartList[k]['checked'] = true;
      }
    }
    else {
      for (let k in this.cartList) {
        this.cartList[k]['checked'] = false;
      }
    }
    this.imputedPrice();
  }
  // 计算价格
  imputedPrice() {
    this.allPrice = 0;
    for (let k in this.cartList) {
      if (this.cartList[k]['checked']) {
        this.allPrice += this.cartList[k]['sellPrice'] * this.cartList[k]['num']
      }
    }
  }
  // 结算
  submitOrder () {
    this.cartIds = [];
    for (let k in this.cartList) {
      if (this.cartList[k]['status'] != 4) {
        this.appService.toast('部分商品已下架，请删除','top','warning');
        return false;
      }
      else {
        if (this.cartList[k]['checked']) {
          this.cartIds.push(this.cartList[k]['cartId'])
        }
      }
    }
    if (this.cartIds.length == 0) {
      this.appService.toast('请选择需要购买的商品','top','warning');
      return false;
    }
    else if( this.allPrice / 100 <=2 ){
      this.appService.confirm('订单金额少于2元,需付5元邮费','',() => {
        this.navCtrl.push('MallConfirmPage',{'cartIds': this.cartIds.join(',')})
      });
    }
    else {
      this.navCtrl.push('MallConfirmPage',{'cartIds': this.cartIds.join(',')})
    }
  }
}
