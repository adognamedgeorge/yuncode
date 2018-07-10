import {Component} from '@angular/core';
import {IonicPage, NavController, App} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the UserAllCouponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-all-coupon',
  templateUrl: 'user-all-coupon.html',
})
export class UserAllCouponPage {
  selectedSegment = 's0';
  token = '';
  pageNo = 1;
  pageSize = 3;
  loading = true;
  // 商品列表
  public products: Array<any> = [];
  shopName = {};
  constructor(private navCtrl: NavController,public appService: AppService,
              public storage: StorageProvider, public appCtrl: App) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getMiniShopCoupon();
    });
  }
  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {
    if(this.selectedSegment != 's' + index){
    }
  }
  getMiniShopCoupon (infiniteScroll?) {
    this.appService.httpJsonp('mini.coupon.buyerList', {
      "token": this.token,
      "page_no": this.pageNo,
      "page_size": this.pageSize
    }, res => {
      this.pageNo++;
      this.loading = true;
      for (let k in res.data.list) {
        for (let i in res.data.shopNames) {
          if (res.data.list[k]['shop_id'] == i) {
            res.data.list[k]['shopName'] = res.data.shopNames[i];
          }
        }
      }
      this.products = this.products.concat(res.data.list);
      if (res.data.list.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    },true)
  }
  // 使用优惠券
  useCoupon (item) {
    if (item['shop_id'] == 0) {

      console.log( this.appCtrl.getRootNav())
      // this.appCtrl.getRootNav().push('MinishopHomePage')
    }
    else {
      this.navCtrl.push('MinishopShopPage',{
        shopId: item['shop_id']
      })
    }
  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.getMiniShopCoupon (infiniteScroll);
    this.loading = false;
  }
}
