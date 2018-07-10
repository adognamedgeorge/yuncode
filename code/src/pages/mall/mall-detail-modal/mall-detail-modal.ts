import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AppService} from "../../../app/app.service";


@IonicPage()
@Component({
  selector: 'page-mall-detail-modal',
  templateUrl: 'mall-detail-modal.html',
})
export class MallDetailModalPage {
  items = [];
  propsList = [];
  token = '';
  type = '';
  hintMessage = '';
  skusId = [];
  skuId = '';
  skuPrice = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public viewCtrl: ViewController) {
    this.items = this.navParams.get('item');
    this.token = this.navParams.get('token');
    for (let k in this.items['props']) {
      this.propsList.push(this.items['props'][k])
    }
    this.type = this.navParams.get('type');
    this.items['quantity'] = 1;
  }
  // 选中sku
  checked(item, items) {
    this.hintMessage = '';
    this.skusId = [];
    for (let k in  items.values) {
      items.values[k].checked = false
    }
    items.checked = true;
    item.checked = true;
    for (let k in this.items['props']) {
      for (let i in this.items['props'][k].values) {
        if ( this.items['props'][k].values[i].checked ) {
          this.skusId.push(this.items['props'][k].values[i].vid);
          this.hintMessage = this.hintMessage + this.items['props'][k].values[i].vname + ' ';
        }
      }
    }
    this.skusId.sort();
    for ( let i in this.items['skus']) {
      if (this.skusId.toString() == this.items['skus'][i]['values'].toString()){
        this.skuPrice = this.items['skus'][i]['price'];
      }
    }
  }
  /*关闭模板*/
  modalClose () {
    this.viewCtrl.dismiss(false);
  }
  // 加数量
  addNum() {
    if( this.items['quantity'] >= this.items['stockNum']){
      this.appService.toast('商品库存不足','top','warning');
      return false;
    }
    else {
      this.items['quantity']++;
    }
  }
  // 减数量
  decrementNum (item) {
    if ( item.quantity == 1 ) {
      return false
    }
    else {
        item.quantity--;
    }
  }
  // 确认
  confirm () {
    let hint = false;
    let hintMessage = '';
    if (this.items['status'] !=4) {
      this.appService.toast('商品已下架','top','warning');
      return false;
    }
    else {
      for ( let k in this.items['props']) {
        if(!this.items['props'][k]['checked']) {
          hint = true;
          hintMessage = hintMessage + this.items['props'][k].name + ' ';
        }
      }
      if (hint) {
        this.appService.toast('请选择：'+ hintMessage,'top','warning');
      }
      else {
        for ( let k in this.items['skus']) {
          if(this.skusId.toString() == this.items['skus'][k]['values'].toString()){
            this.skuId = k;
            this.skuPrice = this.items['skus'][k]['price'];
          }
        }
        if (this.type == 'addCart') {
          this.appService.httpJsonp('mall.cart.incrementAdd', {
            "token": this.token,
            "item_id": this.items['id'],
            "num": this.items['quantity'],
            "sku_id": this.skuId
          }, res => {
            if(res.status == 'success') {
              this.viewCtrl.dismiss(true);
              this.appService.toast('加入购物车成功','top','warning');
            }
           else {
              this.appService.toast(res.info,'top','warning');
            }
          })
        }
        else {
          if (this.skuPrice * this.items['quantity'] /100 <= 9) {
            this.appService.confirm('订单金额少于9元,需付5元邮费!','',()=>{
              this.nowBuy();
            })
          }
          else {
            this.nowBuy();
          }
        }
      }
    }
  }
  // 立即购买
  nowBuy () {
    let cartId = [];
    this.appService.httpJsonp('mall.cart.add',{
      "token": this.token,
      "item_id": this.items['id'],
      "num": this.items['quantity'],
      "sku_id": this.skuId
    },res=> {
      if(res.status != 'fail') {
        this.appService.httpJsonp('mall.cart.list',{
          "token": this.token,
        }, res => {
          for (let k in res.data) {
            if (res.data[k]['itemId'] == this.items['id']){
              cartId.push(res.data[k].cartId);
              this.navCtrl.push('MallConfirmPage',{'cartIds': cartId})
            }
          }
        });
      }
      else {
        this.appService.toast(res.info,'top','warning');
      }
    })
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
