import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Content, Events} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-product-list',
  templateUrl: 'wholesale-product-list.html',
})
export class WholesaleProductListPage {
  @ViewChild(Content) content: Content;
  @ViewChild('scroll') scrollElement: any;
  @ViewChild('spinner') spinnerElement: any;
  @ViewChild("scrollContent") scrollContent;
  wholesaleUserInfo = [];
  token = '';
  loading = true;
  isLock = false;
  brandId = 0;
  catId = 0;
  pageNo = 1;
  // 商品列表
  public products: Array<any> = [];
  // 类目列表
  public categories :Array<any> = [];
  //展示类目
  public CategoriesStatus :boolean = false;
  // 选中顶级类目下标
  public top_Index: number = 0;
  // 选中二级类目下标
  public second_Index: number = -1;
  // 选中三级类目下标
  public third_Index: number = -1;
  // 选中四级类目下标
  public four_Index: number = -1;
  // 顶级类目
  topCatItems = [];
  // 二级类目
  secondCatItems = [];
  // 三级类目
  thirdCatItems = [];
  // 四级品牌类目
  fourCatItems = [];
  secondWidth = '';
  thirdWidth = '';
  fourWidth = '';
  // 购物车信息
  cartInfo = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              public events: Events) {
    events.subscribe('cartUpdate', res => {
      if(res) {
        this.getCartInfo();
      }
    })
  }

  ionViewDidLoad() {
    this.addScrollEventListener();
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
        this.token = res;
    });
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
        this.wholesaleUserInfo = res;
        // this.selectTopCat(0,0);
      this.getItemLoadPromise();
      this.getTopCatLoadPromise(res);
      this.getCartInfo();
    });
  }
  // 是否现实分类
  openCategories() {
    this.CategoriesStatus = !this.CategoriesStatus;
    // this.content.scrollToTop();
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
  // 选中顶级类目
  selectTopCat(id, index) {
    this.top_Index = index;
    // 选中二级类目下标
    this.second_Index = -1;
    // 选中三级类目下标
    this.third_Index = -1;
    // 选中四级类目下标
    this.four_Index = -1;
    this.pageNo = 1;
    this.brandId = 0;
    this.catId = id;
    this.products = [];
    this.secondCatItems = [];
    // 三级类目
    this.thirdCatItems = [];
    // 四级品牌类目
    this.fourCatItems = [];
    this.getItemLoadPromise();
    if (id == 0) {
      return false;
    }
    this.appService.httpJsonp('wholesale.category.getSecondCat', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "cat_id" : id
    },res=>{
      this.secondCatItems = res.data;
      this.secondWidth = this.secondCatItems.length * 100 + "px";
    })

  }
  // 选中二级类目
  selectSecondCat(id, index) {
    this.pageNo = 1;
    this.brandId = 0;
    this.catId = id;
    this.products = [];
    this.second_Index = index;
    // 选中三级类目下标
    this.third_Index = -1;
    // 选中四级类目下标
    this.four_Index = -1;
    // 三级类目
    this.thirdCatItems = [];
    // 四级品牌类目
    this.fourCatItems = [];
    this.getItemLoadPromise();
    this.appService.httpJsonp('wholesale.category.getSecondCat', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "cat_id" : id
    },res=>{
      this.thirdCatItems = res.data;
      this.thirdWidth = this.thirdCatItems.length * 100 + "px";
    })
  }
  // 选中三级类目
  selectThirdCat(id, index) {
    this.pageNo = 1;
    this.brandId = 0;
    this.catId = id;
    this.products = [];
    this.third_Index = index;
    // 选中四级类目下标
    this.four_Index = -1;
    // 四级品牌类目
    this.fourCatItems = [];
    this.getItemLoadPromise();
    this.appService.httpJsonp('wholesale.product.getBrandListByCid', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "cat_id" : id
    },res=>{
      this.fourCatItems = res.data;
      this.fourWidth = this.fourCatItems.length * 100 + "px";
    })
  }
  // 选中四级类目
  selectFourCat(id, index) {
    this.pageNo = 1;
    this.four_Index = index;
    this.brandId = id;
    this.catId = 0;
    this.products = [];
    this.getItemLoadPromise();
  }
  // 商品数据加载
  getItemLoadPromise () {
    this.loading = true;
    this.isLock = true;
    this.appService.httpJsonp('wholesale.category.getGoodsListByCid', {
      "agent_number": this.wholesaleUserInfo['agent_number'],
      "user_id": this.wholesaleUserInfo['user_id'],
      "cid": this.catId,
      "page_no": this.pageNo,
      "page_size": 20,
      "bid": this.brandId
    },res=>{
      this.isLock = false;
      this.products = this.products.concat(res.data.category_product);
      this.pageNo++;
      if (res.data.category_product.length < 20) {
        this.loading = false;
      }
    })
  }
  // 商品顶级类目加载
  getTopCatLoadPromise(res) {
    this.appService.httpJsonp('wholesale.category.getTopCat', {
      "agent_number": res.agent_number,
    },res=>{
      this.topCatItems = res.data;
      this.topCatItems.unshift({
        "id": 0,
        'name': '全部'
      });
    })
  }
  // 获取购物车数据
  getCartInfo () {
    this.appService.httpJsonp('wholesale.product.loadCartInfo', {
      "user_id": this.wholesaleUserInfo['user_id']
    }, res=>{
      this.cartInfo = res.data;
    })
  }
  // 下拉加载
  doInfinite() {
    if (this.isLock) {
      return;
    }
    if (!this.loading) {
      return false;
    }
    this.getItemLoadPromise();
  }
}
