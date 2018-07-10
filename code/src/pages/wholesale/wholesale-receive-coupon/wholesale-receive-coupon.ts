import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleReceiveCouponPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-receive-coupon',
  templateUrl: 'wholesale-receive-coupon.html',
})
export class WholesaleReceiveCouponPage {
  token = '';
  pageNo = 1;
  pageSize = 20;
  couponItems = [];
  items = [];
  loading = true;
  wholesaleUserInfo = {};
  number = 0;
  selectedSegment = 's0';
  constructor(public appService: AppService, public storage: StorageProvider,
              public navCtrl: NavController) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      //获取批发用户信息
      this.storage.getDate('wholesaleUser',(res)=> {
        if (Object.keys(res)['length'] >0) {
          this.wholesaleUserInfo = res;
          this.getCouponCenter();
        }
      });
    });
  }
  getCouponCenter() {
    this.appService.httpJsonp('wholesale.coupon.center', {
      "token": this.token,
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      this.couponItems = res.data.couponList;
    }, true);
  }
  getItems(infiniteScroll?) {
    this.appService.httpJsonp('wholesale.shop.couponList', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "page_no": this.pageNo,
      "page_size": this.pageSize
    }, res => {
      this.loading = true;
      this.pageNo++;
      this.items = this.items.concat(res.data.result);
      if (res.data.result.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    }, true)
  }
  // 领取优惠券'
  getCoupon (item) {
    this.appService.httpJsonp('wholesale.coupon.getCoupon', {
      "couponId": item.id,
      "token": this.token
    }, res => {
      this.appService.toast(res.data.info,'top','warning');
    })
  }
  // 使用优惠券
  useCoupon (item) {
    console.log(item)
    let id;
    if (item.type == 2) {
      id = item.brand_id;
      this.navCtrl.push('WholesaleSearchPage',{
        comeForm: 'receiveCoupon',
        brandId: id
      })
    }
    else if (item.type == 3) {
      id = item.vendor_id;
      this.navCtrl.push('WholesaleSearchPage',{
        comeForm: 'receiveCoupon',
        vendorId: id
      })
    }
    else {
      this.navCtrl.push('WholesaleSearchPage');
      return false;
    }


  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.getItems (infiniteScroll);
    this.loading = false;
  }
  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {
    if (index == 1 && this.number != index) {
      this.loading = true;
      this.pageNo = 1;
      this.items = [];
      this.getItems()
    }
    this.number = index;
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
