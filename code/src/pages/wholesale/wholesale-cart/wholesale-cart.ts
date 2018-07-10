import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
/**
 * Generated class for the WholesaleCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-cart',
  templateUrl: 'wholesale-cart.html',
})
export class WholesaleCartPage {
  token = '';
  wholesaleUserInfo = [];
  // 商品数据
  groups = {};
  // 预购数据
  presale = [];
  // 应付
  prices = 0;
  items = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              ) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.storage.getDate('wholesaleUser',(res)=>{
        this.wholesaleUserInfo = res;
        this.loadCartInfo();
      });
    });

  }
  ionViewDidEnter() {
    // 获取token
    // this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
    //   this.token = res;
    //   this.storage.getDate('wholesaleUser',(res)=>{
    //     this.wholesaleUserInfo = res;
    //     this.loadCartInfo();
    //   });
    // });


  }
  loadCartInfo (callback?, loader=true, type=true) {
    callback = typeof callback == "function" ? callback : function () {};
    this.appService.httpJsonp('wholesale.trade.getCartFullData1', {
      "token": this.token,
      "agent_number": this.wholesaleUserInfo['agent_number']
    },res => {
      this.items = res.data;
      // this.getKeys(res.data.groups);
      this.groups = res.data['groups'];
      this.prices = res.data.total.origin;
      callback(res.data);
      if (type) {
        this.appService.httpJsonp('wholesale.product.countPresaleDiscount', {
          "userId": this.wholesaleUserInfo['user_id'],
        },res=>{
          this.presale = res.data ?  res.data : [];
          for (let k in this.presale['num']) {
            for (let i in this.groups) {
              for (let z in this.groups[i].items){
                if( k == this.groups[i].items[z].productId) {
                  this.groups[i].items[z]['presalePrice'] = this.presale['num'][k] * this.groups[i].items[z].price;
                }
              }
            }
          }
        });
      }
    },loader)
  }

  //  加入购物车
  addCart (item, callback?) {
    callback = typeof callback == "function" ? callback : function () {};
    this.appService.httpJsonp('wholesale.product.addItemToCart',{
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "user_id": this.wholesaleUserInfo['user_id'],
      "product_id":item.productId,
      "quantity": item.quantity,
      "load_info" : 0,    // 加入购物车成功后，是否加载购物车信息
      "mode":2           // 数量加入购物车的模式 1叠加模式 2覆盖模式
    },res=>{
      this.loadCartInfo('',false,false);
      callback(res);

    },true)
  }
  //  加数量
  addProduct (item) {
    if(item.state==0||item.delete){
      this.appService.toast('商品已下架,请从购物车中删除!','top','warning');
      return false;
    }
    ++item.quantity;
    this.addCart(item, res=>{
      if (res.info == 'fail') {
        item.quantity--;
        this.appService.toast(res.data,'top','warning');
        return false
      }
      else if (res.data.error){
        item.quantity--;
        this.appService.toast(res.data.info,'top','warning');
      }
      // else {
      //   this.loadCartInfo('',false);
      // }
    });
  }
  // 减少购物车
  minusProduct (item) {
    if( item.state==0 || item.delete || item.minSoldNum > Math.max(item.stock.stock, item.stock.warehouse_stock) ) {
      this.appService.toast('商品已下架或库存不足,请从购物车中删除!','top','warning');
      return false;
    }
    if ( item.quantity <= item.minSoldNum) {
      this.removeItem (item, true, '购买数量小于最小起批量,是否将此商品从购物车中删除?');
    }
    else {
      if(item.quantity >= Math.max(item.stock.stock, item.stock.warehouse_stock)){
        item.quantity = Math.max(item.stock.stock, item.stock.warehouse_stock);
      }
      else{
        --item.quantity;
        this.addCart(item, res => {
          if (res.data.error) {
            // 发送错误
            ++item.quantity;
            this.appService.toast(res.data.info,'top','warning');
          }
        })
      }
    }
  }
  // 删除商品
  removeItem (item, type=true, message='是否将此商品从购物车中删除?') {
    this.appService.confirm(message,'',() => {
      this.appService.httpJsonp('wholesale.product.deleteCartItem',{
        "user_id": this.wholesaleUserInfo['user_id'],
        "cart_id": item.cartId
      },res=>{
        if (res.data.error) {
          this.appService.toast(res.data.info,'top','warning');
        }
        else {
          if (type) {
            this.loadCartInfo('',false);
          }
          this.appService.toast('商品已从购物车中删除','top','warning');
        }
      })
    })
  }
  // 清空购物车
  removeAll () {
    this.appService.confirm('确定要清空购物车吗？','',() => {
      this.appService.httpJsonp('wholesale.product.clearCart',{
        "user_id": this.wholesaleUserInfo['user_id'],
        "agent_number":  this.wholesaleUserInfo['agent_number']
      },res => {
        if (res.data.error == false) {
          this.loadCartInfo('',false);
          this.appService.toast(res.data.info,'top','warning');
        } else {
          this.appService.toast(res.data.info,'top','warning');
        }
      })
    },true)
  }
  // 去结算
  submitOrder () {
    let undercarriage = false;
    for (let k in this.groups) {
      for (let i in this.groups[k]['items']) {
        let item = this.groups[k]['items'][i];
        if (item.state !=1 || item.delete || item.minSoldNum > Math.max( item['stock']['stock'], item['stock']['warehouse_stock'])) {
          this.appService.httpJsonp('wholesale.product.deleteCartItem',{
            "user_id": this.wholesaleUserInfo['user_id'],
            "cart_id": item.cartId
          },res=>{
            undercarriage = true;
          })
        }
        else if (item.quantity > Math.max( item['stock']['stock'], item['stock']['warehouse_stock'])) {
          undercarriage = true;
          item.quantity  = Math.max( item['stock']['stock'], item['stock']['warehouse_stock']);
          this.addCart(item);
        }
      }
    }
    if (undercarriage) {
      this.loadCartInfo('',false,false);
      this.appService.confirm('部分商品库存不足、已下架或已删除，已处理，确认继续下单？','',()=>{
        if(this.prices >= this.items['agent']['minSellPrice']) {
          this.navCtrl.push('WholesaleComfirmPage');
        }
        else {
          this.appService.toast('订单金额不足' + (this.items['agent']['minSellPrice']/100).toFixed(2) + '元','top','warning')
        }
      })
    }
    else {
      if(this.prices >= this.items['agent']['minSellPrice']) {
        this.navCtrl.push('WholesaleComfirmPage');
      }
      else {
        this.appService.toast('订单金额不足' + (this.items['agent']['minSellPrice']/100).toFixed(2)  + '元','top','warning')
      }
    }
  }

  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
