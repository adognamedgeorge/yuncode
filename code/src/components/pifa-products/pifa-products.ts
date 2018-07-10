import { Component,Input } from '@angular/core';
import {AppService} from "../../app/app.service";
import {Events, ModalController, NavParams} from "ionic-angular";
import {StorageProvider} from "../../providers/storage/storage";

/**
 * Generated class for the PifaProductsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pifa-products',
  templateUrl: 'pifa-products.html'
})
export class PifaProductsComponent {
  @Input() products : Array<any>;
  @Input() CategoriesStatus : any;
  @Input() priceShow : any;
  @Input() price : any;
  @Input() cartInfo : any;
  wholesaleUserInfo = {};
  constructor(public appService: AppService, public modalCtrl: ModalController,
              public storage: StorageProvider, public navParams: NavParams,
              public  events: Events) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (typeof res == "object") {
        this.wholesaleUserInfo = res;
      }
    });

  }
  addCart (item, cartInfo) {
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
    // item.pic_url = this.appService.changeImgUrl(item.pic_url, 200);
    // this.isBackdrop = true;
    let addCartModal = this.modalCtrl.create('WholesaleDetailModalPage',{
      'item': item,
      'wholesaleUserInfo': this.wholesaleUserInfo,
      'cartInfo': cartInfo
    });
    addCartModal.onDidDismiss(data => {
      if (data) {
        this.events.publish('cartUpdate',true);
        // this.getProductInfo();
        // this.getCartInfo();
      }
      // this.isBackdrop = false;
    });
    addCartModal.present();
  }
  // 获取是否为预售商品信息
  getIsPresale (item) {

  }
}
