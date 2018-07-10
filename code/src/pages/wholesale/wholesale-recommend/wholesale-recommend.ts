import {Component, ViewChild} from '@angular/core';
import {IonicPage, Slides} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleRecommendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-recommend',
  templateUrl: 'wholesale-recommend.html',
})
export class WholesaleRecommendPage {
  @ViewChild(Slides) slides: Slides;
  vm: any = {
    selectedSegment: 's0'
  };
  wholesaleUserInfo = {};
  speItems = [];
  recItems = [];
  // 商品列表
  constructor(public appService: AppService, public storage: StorageProvider) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.itemLoad()
      }
    });
  }
  itemLoad () {
    this.appService.httpJsonp('wholesale.product.getSpecialProduct', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      this.speItems = res.data;
    });
    this.appService.httpJsonp('wholesale.product.getRecomProduct', {
      "user_id": this.wholesaleUserInfo['user_id'],
      "agent_number": this.wholesaleUserInfo['agent_number'],
    }, res => {
      this.recItems = res.data;
    })
  }
  /**
   * slide切换处理
   */
  onSlideWillChange() {
    let index: number = this.slides.getActiveIndex();
    if(index >= 0 && index <=1){
      //由于索引直接用数字的话，内部方法有的转换为字符串，有的转为整型，避免不必要麻烦，所以用字符串处理
      this.vm.selectedSegment = "s" + index;
    }
  }

  /**
   * segment点击切换slide滑动
   * @param index 索引
   */
  goToSlide(index: number) {
    if(this.vm.selectedSegment != 's' + index){
      this.slides.slideTo(index, 500);
    }
  }
}
