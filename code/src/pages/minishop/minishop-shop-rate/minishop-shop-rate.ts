import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MinishopShopRatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-minishop-shop-rate',
  templateUrl: 'minishop-shop-rate.html',
})
export class MinishopShopRatePage {
  @ViewChild('scroll') scrollElement: any;
  @ViewChild('spinner') spinnerElement: any;
  @Input() ShopRate : Array<any>;
  @Input() loading : boolean;
  @Output() infinite = new EventEmitter<any>();
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
  ngOnInit() {
    this.addScrollEventListener();
  }
  // 添加滚动时间
  addScrollEventListener () {
    this.scrollElement._scrollContent.nativeElement.onscroll = event => {
      if (this.spinnerElement) {
        //元素顶端到可见区域顶端的距离
        let top = this.spinnerElement.nativeElement.getBoundingClientRect().top;
        //可见区域高度
        let clientHeight = document.documentElement.clientHeight;
        if (top <= clientHeight) {
          this.doInfinite();
        }
      }
    }
  }
  // 下拉加载
  doInfinite() {
    this.infinite.emit();
  }
}
