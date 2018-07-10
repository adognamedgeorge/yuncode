import {Component, ViewChild} from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, Keyboard} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MallSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-search',
  templateUrl: 'mall-search.html',
})
export class MallSearchPage {
  @ViewChild("header") header;
  @ViewChild("scrollContent") scrollContent;
  private tops : number;
  private filtrate : any;
  keyword = '';
  pageSize = 20;
  pageNo = 1;
  token = '';
  loading = true;
  itemId : any;
  products = [];
  pIdList = [];
  cartNum = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public menuCtrl: MenuController,
              public storage: StorageProvider, private  keyboard: Keyboard) {
    // events.subscribe('cartUpdate', res => {
    //   if(res) {
    //     this.getCartInfo();
    //   }
    // });

    this.itemId = this.navParams.get('id') | 0;
  }
  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getCartInfo();
    });
  }
  ionViewDidLoad() {
    this.getLoadItem(true);
    this.getByPid();
  }
  // 获取顶级分类
  getByPid() {
    this.appService.httpJsonp('mall.category.getByPid',{
      "pid":0
    },res => {
      this.pIdList = res.data;
    })
  }
  //开始滚动
  ionScrollStart(e) {
    if (this.scrollContent.directionY == 'up' && this.tops > this.scrollContent._hdrHeight) {
      this.tops =0;
    }
  }
//滚动
  scrollEvent(e) {
    let top = e.scrollTop;
    let _hdrHeight = this.scrollContent._hdrHeight;
    let filtrateStylefs = this.filtrate.firstElementChild.style;
    let contentStyle = this.scrollContent._elementRef.nativeElement.lastElementChild.style;
    if (this.scrollContent.directionY == 'up') {
      if ( top < _hdrHeight ) {
        this.tops =_hdrHeight - top;
        contentStyle.marginTop = this.tops + "px";
      }
      this.header.nativeElement.style.top = 0;
      filtrateStylefs.top = _hdrHeight + "px";
    }
    else{
      if ( top >= _hdrHeight) {
        top = _hdrHeight;
      }
      contentStyle.marginTop = '-' + top + "px";
      filtrateStylefs.top = 0;
      this.header.nativeElement.style.top ='-' + _hdrHeight + "px";
    }
  }
  // 加载搜索数据
  getLoadItem (load?,infiniteScroll?) {
    this.appService.httpJsonp('mall.item.list', {
      "page": this.pageNo,
      "size": this.pageSize,
      "keyword": this.keyword,
      "category_id": this.itemId
    },res => {
      this.pageNo++;
      this.filtrate = this.scrollContent._scrollContent.nativeElement.children[0];
      this.products = this.products.concat(res.data.data);
      if (res.data.data.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    },load)
  }

  // 搜索类目
  goCategorySearch (id) {
    this.menuCtrl.close();
    this.itemId = id;
    this.products = [];
    this.loading = true;
    this.pageNo = 1;
    this.keyword = '';
    this.getLoadItem(true);
  }
  // 下拉加载
  doInfinite(infiniteScroll){
    this.getLoadItem(false,infiniteScroll);
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
  openMenu(){
    this.menuCtrl.enable(true,'mallSearch');
    this.menuCtrl.open();
  }


  // 搜索关键词
  goSearch() {
    this.keyboard.close();
    this.products = [];
    this.loading = true;
    this.pageNo = 1;
    this.itemId = 0;
    setTimeout(() => {
      if(this.keyword == ""){
        this.appService.toast('请输入要搜索的词','top','warning');
        return false
      }
      this.getLoadItem();
    },500)
  }
  // 搜索
  getSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.keyword = val;
    }
  }
  // 获取购物车信息
  getCartInfo () {
    this.appService.httpJsonp('mall.cart.list',{
      "token": this.token
    },res => {
      this.cartNum = res.data.length;
    })
  }
}
