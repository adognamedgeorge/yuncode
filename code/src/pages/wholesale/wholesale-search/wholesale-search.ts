import { Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, MenuController, App, Events, Platform, Keyboard} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['WholesaleHomePage','WholesaleProductListPage']
})
@Component({
  selector: 'page-wholesale-search',
  templateUrl: 'wholesale-search.html',
})
export class  WholesaleSearchPage {
  @ViewChild("header") header;
  @ViewChild("scrollContent") scrollContent;
  keyword = this.navParams.get('keyword') || "";
  wholesaleUserInfo = {};
  pageSize = 20;
  pageNo = 1;
  token = '';
  loading = true;
  comeForm = this.navParams.get('comeForm') || "";
  brandId = this.navParams.get('brandId') || "";
  vendorId = this.navParams.get('vendorId') || "";
  // 品牌选中
  brandIndex = -1;
  // 类目选中
  fstCatIndex = -1;
  // 类目数组
  fstCatList = [];
  // 品牌数组
  brandList = [];
  // 类目
  fstCatName = this.navParams.get('catId') || "";
  // 品牌
  brandName = '';
  // 升序降序
  sortDirection = '';
  // 排序
  sort = '';
  // 销量状态
  salesVolumeStatus = false;
  // 价格状态
  priceVolumeStatus = false;
  // 销量通用状态
  allSalesVolumeStatus = true;
  // 价格通用状态
  allPriceVolumeStatus = true;
  public hotList = [];//热搜列表
  public historyList = [];//历史列表
  public searchStatus = false;//搜索状态
  public products: Array<any> = [];
  private filtrate : any;
  private tops : number;
  // 购物车信息
  cartInfo = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public menuCtrl: MenuController, public appService: AppService,
              public storage: StorageProvider, private app: App,
              public events: Events, private platform: Platform,
              private keyboard: Keyboard) {
    events.subscribe('cartUpdate', res => {
      if(res) {
        this.getCartInfo();
      }
    });
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (Object.keys(res)['length'] >0) {
        this.wholesaleUserInfo = res;
        this.getCartInfo();
      }
    });
  }

  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getLoadItem();
    });

    this.hotList = ['女装','男装','童装','洗衣机','苹果','电脑','可口可乐','圣诞节','喜欢你','礼物','你开心就好','我是大帅哥','草泥马','滚球吧'];
    this.historyList = ['可口可乐1','圣诞节','喜欢你','礼物','你开心就好','我是大帅哥','草泥马','滚球吧','圣诞节','喜欢你','礼物','你开心就好','我是大帅哥','草泥马','滚球吧11'];
  }

  // 选择类目
  selectFstCat (index, item) {
    if (this.fstCatIndex == index) {
      this.fstCatIndex = -1;
      this.fstCatName = '';
    }
    else {
      this.fstCatIndex = index;
      this.fstCatName = item;
    }
  }
  // 选择品牌
  selectbrand (index, item) {
    if (this.brandIndex == index) {
      this.brandIndex = -1;
      this.brandName = '';
    }
    else {
      this.brandIndex = index;
      this.brandName = item;
    }
  }
  //开始滚动
  ionScrollStart(e) {
    if (this.scrollContent.directionY == 'up' && this.tops > this.scrollContent._hdrHeight) {
      this.tops = 0;
    }
  }
  //滚动
  scrollEvent(e) {
    if (!this.searchStatus) {
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
        if (this.platform.is('ios')) {
          _hdrHeight -= 18;
        }
        this.header.nativeElement.style.top ='-' + _hdrHeight + "px";
      }

    }
  }
  // 获取购物车数据
  getCartInfo () {
    this.appService.httpJsonp('wholesale.product.loadCartInfo', {
      "user_id": this.wholesaleUserInfo['user_id']
    }, res=>{
      this.cartInfo = res.data;
    })
  }
  //控制销量状态
  salesVolume() {
    this.salesVolumeStatus = !this.salesVolumeStatus;
    this.allPriceVolumeStatus = true;
    this.allSalesVolumeStatus = false;
    this.loading = true;
    this.pageNo = 1;
    this.products = [];
    this.sort = 'sales_volume';
    if (this.salesVolumeStatus) {
      this.sortDirection = 'ASC';
    }
    else {
      this.sortDirection = 'DESC';
    }
    this.getLoadItem();
  };
  //控制价格状态
  priceVolume() {
    this.priceVolumeStatus = !this.priceVolumeStatus;
    this.allSalesVolumeStatus = true;
    this.allPriceVolumeStatus = false;
    this.loading = true;
    this.pageNo = 1;
    this.products = [];
    this.sort = 'sell_price';
    if (this.priceVolumeStatus) {
      this.sortDirection = 'ASC';
    }
    else {
      this.sortDirection = 'DESC';
    }
    this.getLoadItem();
  }
  //筛选
  choose() {
    this.comeForm = '';
    this.loading = true;
    this.pageNo = 1;
    // this.sort = '';
    // this.keyword = '';
    // this.sortDirection = '';
    this.products = [];
    this.getLoadItem();
  }
  // 重置
  reset() {
    this.comeForm = '';
    this.loading = true;
    this.products = [];
    this.pageNo = 1;
    this.brandIndex = -1;
    this.brandName = '';
    this.fstCatIndex = -1;
    this.fstCatName = '';
    this.getLoadItem();
  }
  // 加载数据
  getLoadItem(infiniteScroll?) {
    this.brandList = [];
    this.fstCatList = [];
    this.loading = false;
    this.appService.httpJsonp('wholesale.product.searchByKeywords', {
      "token": this.token,
      "brandName": this.brandName,
      "fstCatName": this.fstCatName,
      "page": this.pageNo,
      "pageSize": this.pageSize,
      "keywords": this.keyword,
      "sort": this.sort,
      "sortDirection": this.sortDirection,
      "brandId": this.brandId,
      'userId': this.vendorId,
    },res=>{
      this.loading = true;
      this.pageNo++;
      this.products = this.products.concat(res.data.productList);
      for (let k in res.data.fstCatList) {
        if (res.data.fstCatList[k] != 0) {
          this.fstCatList.push(k)
        }
      }
      for (let k in res.data.brandList) {
        if (res.data.brandList[k] != 0) {
          this.brandList.push(k)
        }
      }
      this.filtrate = this.scrollContent._scrollContent.nativeElement.children[0];
      // if (!this.searchStatus) {
      //   this.filtrate.lastElementChild.children[0]['style']['paddingTop'] = "136px";
      // }
      if (res.data.productList.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }
  // 下拉加载
  doInfinite(infiniteScroll) {
    this.getLoadItem(infiniteScroll);
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
  //扫描
  qrscanner () {
    this.app.getRootNav().push('QrscannerPage');
  }
  openMenu(){
    this.menuCtrl.enable(true,'whosaleSearch');
    this.menuCtrl.open();
  }
  // 搜索
  getSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.keyword = val;
    }
  }
  // 搜索关键词
  goSearch() {
    this.comeForm = '';
    this.products = [];
    this.loading = true;
    this.pageNo = 1;
    this.brandIndex = -1;
    this.fstCatIndex = -1;
    this.fstCatName = '';
    this.brandName = '';
    this.sortDirection = '';
    this.sort = '';
    this.brandId = '';
    this.vendorId = '';
    this.allSalesVolumeStatus = true;
    this.allPriceVolumeStatus = true;
    this.salesVolumeStatus = false;
    this.priceVolumeStatus = false;
    setTimeout(() => {
      if(this.keyword == ""){
        this.appService.toast('请输入要搜索的词','top','warning');
        return false
      }
      this.keyboard.close();
      this.getLoadItem();
    },500)
  }
}
