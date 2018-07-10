import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
import { DatePipe } from '@angular/common';
/**
 * Generated class for the WholesaleIntegralManagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-integral-manage',
  templateUrl: 'wholesale-integral-manage.html',
})
export class WholesaleIntegralManagePage {
  wholesaleUserInfo = {};
  today : any;
  number = 0;
  isShow = false;
  loading = true;
  pageNo = 1;
  pageSize = 20;
  selectedSegment = 's0';
  gitManageItem = {};
  yueManage = {};
  items = [];
  constructor(public appService: AppService, public storage: StorageProvider,
              public datePipe: DatePipe,) {

    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.itemLoad();
        if (this.wholesaleUserInfo['agent_number'] == 21000000 || this.wholesaleUserInfo['agent_number'] == 57100000) {
          this.isShow = true;
        }
        else {
          this.isShow = false;
        }
      }
    });
  }
  ngOnInit() {
    this.today = this.datePipe.transform(new Date(),'yyyy-MM-dd HH:mm:ss');
  }
  itemLoad() {
    // 积分兑换
    this.appService.httpJsonp('wholesale.shop.gitManage', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      this.gitManageItem = res.data;
    }, true);
    // 我的积分
    this.appService.httpJsonp('wholesale.shop.yueManage', {
      "user_id": this.wholesaleUserInfo['user_id'],
    }, res => {
      this.yueManage = res.data;
    });
  }
  getItems (type, infiniteScroll?) {
    if ( type == 1 ) {
      // 积分明细
      this.appService.httpJsonp('wholesale.shop.gift', {
        "user_id": this.wholesaleUserInfo['user_id'],
        "agent_number": this.wholesaleUserInfo['agent_number'],
        "page_no": this.pageNo,
        "page_size": this.pageSize
      }, res => {
        this.loading = true;
        this.items = this.items.concat(res.data.result);
        if (this.items.length < 20) {
          this.loading = false;
        }
      }, true);
    }
    else if (type ==2) {
      // 我的兑换
      this.appService.httpJsonp('wholesale.shop.exchange', {
        "user_id": this.wholesaleUserInfo['user_id'],
        "agent_number": this.wholesaleUserInfo['agent_number'],
        "page_no": this.pageNo,
        "page_size": this.pageSize
      }, res => {
        console.log(res)
        this.loading = true;
        this.items = this.items.concat(res.data.result);
        if (this.items.length < 20) {
          this.loading = false;
        }
      }, true);
    }
    else {
      this.loading = false;
      return false;
    }
    this.pageNo++;
    if (infiniteScroll) {
      infiniteScroll.complete();
    }
  }
  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {
    if (this.number == index) {
      return false
    }
    else {
      this.items = [];
      this.loading = true;
      this.selectedSegment = 's' + index;
      this.number = index;
      this.pageNo = 1;
      this.getItems(index);
    }
  }
  exchange (item) {
    this.appService.httpJsonp('wholesale.shop.giftExchange',{
      "user_id": this.wholesaleUserInfo['user_id'],
      "gift_id": item.id
    }, res => {
      this.appService.toast(res.data.info,'top','warning');
    })
  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.getItems (this.number,infiniteScroll);
    this.loading = false;
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
}
