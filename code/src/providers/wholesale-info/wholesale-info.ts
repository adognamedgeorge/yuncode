import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from '../../app/app.service'
import {StorageProvider} from "../storage/storage";
/*
  Generated class for the WholesaleInfoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WholesaleInfoProvider {
  wholesaleUserInfo = {};
  constructor(public http: HttpClient, public appService: AppService,
              public storage: StorageProvider) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (typeof res == "object") {
        this.wholesaleUserInfo = res;
      }
    });
  }
  // 获取购物车信息
  getWholesaleCartInfo (callback) {
    callback = typeof callback == "function" ? callback : function () {};
    this.appService.httpJsonp('wholesale.product.loadCartInfo', {
      "user_id": this.wholesaleUserInfo['user_id']
      }, res=>{
        callback(res.data);
    })
  }
  // 预售商品加入购物车
  addPresaleCart (params,wholesaleUserInfo = this.wholesaleUserInfo,callback) {
    callback = typeof callback == "function" ? callback : function () {};
    this.appService.httpJsonp('wholesale.product.addPresaleItemToCart',{
      "user_id": wholesaleUserInfo['user_id'],
      "product_id": params.product_id,
      "quantity": params.quantity,
      "presaleId" : params.presaleId,
      "mode":1// 加入购物车成功后，是否加载购物车信息
    },res=>{
      callback(res)
    })
  }
}
