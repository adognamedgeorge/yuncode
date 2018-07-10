import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MallHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-mall-home',
  templateUrl: 'mall-home.html',
})
export class MallHomePage {
  @ViewChild("header") header;
  token = '';
  pageNo = 1;
  pageSize = 20;
  loading = true;
  // 分类列表
  pIdList = [];
  // 购物车数量
  cartNum = 0;
  // 分类数组
  categories: Array<any> = [];
// 商城搜索页面
  public searchPage: any = 'SearchPage';
  // 购物车页面
  public MallCartPage: any = 'MallCartPage';
  // 幻灯片数组
  slides: Array<any> = [];
  // 商品列表
  public products: Array<any> = [];
  // 推荐商品
  recommendList = [];
  // 商城广告位
  MallAdvertising0 = [];
  MallAdvertising1 = [];
  MallAdvertising2 = [];
  MallAdvertising3 = [];
  MallAdvertising4 = [];
  MallAdvertising5 = [];
  MallAdvertising6 = [];
  MallAdvertising7 = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              public menuCtrl: MenuController) {}
  ionViewDidLoad() {
    this.categories = [{class:"c5", title:"吃遍中国", go:"MallSearchPage", id:"100288"},{class:"c6", title:"超值9.9", go:"MallSearchPage", id:"100287"},{class:"c7", title:"企业合作", go:"MallCooperationPage"},{class:"c8", title:"服务承诺", go:"MallCommitmentPage"}];
    this.getPoster();
    this.getads();
    this.getList();
    this.getRecommend();
    this.getByPid();
  }
  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getCartInfo();
    });
  }
  // 导航栏渐变
  scrollEvent(e) {
    // console.log(this.header._elementRef.nativeElement.firstElementChild.style);

    let opacity = ( e.scrollTop ) / 135 ;
    // this.header._elementRef.nativeElement.style.opacity = opacity;
    this.header._elementRef.nativeElement.firstElementChild.style.backgroundColor = "rgba(255, 255, 255, " + opacity + ")";
  }
  // 获取商城海报
  getPoster () {
    this.appService.httpJsonp('mall.home.poster', {}, res=>{
      this.slides = res.data;
    },true)
  }
  // 海报位跳转
  goDetaile (itemId) {
    let values = '';
    itemId = decodeURI( itemId );
    if( itemId.indexOf( 'search' ) >=0 ) {
      values = itemId.substring( itemId.indexOf('q=') + 2 );
      this.navCtrl.push('MallSearchPage',{'keyWord' : values});
    }
    else if ( itemId.indexOf('detail') >= 0 ) {
      values = itemId.substring( itemId.indexOf('id=') + 3 );
      this.navCtrl.push('MallDetailPage',{'id': values})
    }
    else {
      return false
    }
  }
  // 获取顶级分类
  getByPid() {
    this.appService.httpJsonp('mall.category.getByPid',{
      "pid":0
    },res => {
      this.pIdList = res.data;
    })
  }
  // 获取广告位
  getads () {
    this.appService.httpJsonp('mall.home.ads', {}, res=>{
      for(let k in res.data) {
        res.data[k].image = this.appService.changeImgUrl(res.data[k].image,600)
      }
      if (res.data.length) {
        this.MallAdvertising0 = res.data[0];
        this.MallAdvertising1 = res.data[1];
        this.MallAdvertising2 = res.data[2];
        this.MallAdvertising3 = res.data[3];
        this.MallAdvertising4 = res.data[4];
        this.MallAdvertising5 = res.data[5];
        this.MallAdvertising6 = res.data[6];
        this.MallAdvertising7 = res.data[7];
      }
    })
  }

  // 获取推荐商品
  getRecommend () {
    this.appService.httpJsonp('mall.home.recommend',{},res=>{
      this.recommendList = res.data;
    })
  }
  // 获取商品列表
  getList (infiniteScroll?) {
    this.appService.httpJsonp('mall.item.list',{
      "page": this.pageNo,
      "size": this.pageSize
    },res=>{
      this.pageNo++;
      this.products = this.products.concat(res.data.data);
      if(res.data.data.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
    })
  }
  // 获取购物车信息
  getCartInfo () {
    this.appService.httpJsonp('mall.cart.list',{
      "token": this.token
    },res => {
      this.cartNum = res.data.length;
    })
  }
  // 下拉加载
  doInfinite(infiniteScroll){
    this.getList(infiniteScroll);
  }
  openMenu(){
    this.menuCtrl.enable(true,'mallHomeMenu');
    this.menuCtrl.open();
  }
}
