import {Component, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, Keyboard} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
import  { GeolocationProvider } from "../../../providers/geolocation/geolocation";

/**
 * Generated class for the MinishopHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-minishop-home',
  templateUrl: 'minishop-home.html',
})
export class MinishopHomePage {
  @ViewChild("searchbar") searchbar;
  @ViewChild("searchForm") searchForm;
  @ViewChild("scrollContent") scrollContent;
  @ViewChild("header") header;
  token = '';
  loading = true;
  pageNo = 1;
  pageSize = 20;
  isDoRefresh = false;
  keyWord = '';
  addressLocation = {};
  nearShop = [];
  // 店铺满减列表
  shopReductionList = {};
  // 店铺优惠券列表
  shopCouponList = {};
  lng : any;
  lat : any;
  addressId = 0;
  // 滚动搜索变化
  scrollBoolean:boolean = false;
  // 定位经纬度
  public addressLngLat;
  public searchbarTop : any;
// 幻灯片数组
  slides: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              public GeolocationProvider: GeolocationProvider,public modalCtrl: ModalController,
              private  keyboard: Keyboard) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      // this.getItemLoad();
    });
    this.location();
    this.slides = ['http://i1.yunmayi.com/upload/2016/09/08/0d4c7f6a68f33a5baa01ce901f416fc1.jpgXXXXX!!!!!_700x700.jpg','http://dd.v2.yunmayi.com/app_sources/img/home/banner3.jpg','http://dd.v2.yunmayi.com/app_sources/img/home/banner4.jpg'];
  }

  ionViewDidLoad() {
    this.searchbarTop = this.searchbar._elementRef.nativeElement.offsetTop;
  }

  scrollEvent (e) {
    let searchbarStyle = this.searchbar._elementRef.nativeElement.style;
    let searchFormStyle = this.searchForm.nativeElement.style;
    if (e.scrollTop - 180 >= this.searchbarTop && !this.scrollBoolean) {
      if (this.isDoRefresh) {
        // searchFormStyle.top = this.header.nativeElement.clientHeight + e.scrollTop - 57 + 'px';
      }
      else {
        searchFormStyle.position = 'fixed';
        searchFormStyle.top = this.header.nativeElement.clientHeight  + 'px';
        searchbarStyle.padding = 0;
      }
      this.scrollBoolean = true;
    }
    else if ( e.scrollTop - 180 < this.searchbarTop && this.scrollBoolean ){
      searchFormStyle.position = 'absolute';
      searchFormStyle.top = 'auto' ;
      searchbarStyle.padding = '8px';
      this.scrollBoolean = false;
    }
  }
  // 定位地址
  location () {
    this.storage.getDate('location', res => {
      this.addressLocation = null;
      if (res != "") {
        this.addressLocation = res.address;
        this.addressLngLat = this.GeolocationProvider['MaGeolocation'].LngLat( res['lng'], res['lat'] );
        this.lng = res['lng'];
        this.lat = res['lat'];
        this.getItemLoad();
      }
    })
  }
  // 加载附近店铺
  getItemLoad (infiniteScroll?) {
    let params = {
      "lng": this.lng,
      "lat": this.lat,
      "page_no": this.pageNo,
      "page_size": this.pageSize
    };
    this.appService.httpJsonp("mini.shop.nearbyShop", params, res=>{
      this.pageNo++;
      let shopIds = [];
      for(let k in res.data.list) {
        res.data.list[k]['distance'] = this.distanceCompute(res.data.list[k]['longitude']/ 1000000, res.data.list[k]['latitude'] / 1000000);
        if ( res.data.list[k]['distance'] >= 1000) {
          res.data.list[k]['distance'] = ( res.data.list[k]['distance'] / 1000).toFixed(2);
          res.data.list[k]['thousandShow'] = true;
        }
        else {
          res.data.list[k]['distance'] = res.data.list[k]['distance'].toFixed(0);

        }
        shopIds.push(res.data.list[k]['id']);
      }

      this.nearShop = this.nearShop.concat(res.data.list)
      if(res.data.list.length < 20) {
        this.loading = false;
      }
      if (infiniteScroll) {
        infiniteScroll.complete();
      }
      this.appService.httpJsonp('mini.promotion.getShopPromoInfo',{"shop_id": shopIds.join(',')},res => {
        this.shopReductionList = res.data.full_send_promo_list;
        this.shopCouponList = res.data.coupon_promo_list;
      })
    })
  }
  // 计算小店与用户当前经纬度的距离
  distanceCompute(lng, lat, i?) {
    let distance:number = 0;
    if (this.addressLngLat) {
      let shopLngLat = this.GeolocationProvider['MaGeolocation'].LngLat(lng, lat);
      distance = this.addressLngLat.distance(shopLngLat);
    }
    return distance
  }
  // 搜索
  getSearch(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.keyWord = val;
    }
  }
  search() {
    this.pageNo =1;
    this.keyboard.close();
    setTimeout(() => {
      if(this.keyWord == ""){
        this.appService.toast('请输入店铺名称或者店铺ID','top','warning');
        return false
      }
      else{
        this.appService.httpJsonp('mini.shop.searchShopByName', {
          "page": this.pageNo,
          "page_size":999,
          "shopName": this.keyWord
        }, res => {
          if(res.data.length == 0) {
            this.appService.toast('没有搜索到你要的店铺','top','warning');
          }
          else {
            this.nearShop = res.data;
          }
        })
      }
    },500)
  }

  // 打开定位模块
  openLocationModal() {
    let addAdressModal = this.modalCtrl.create("ReceiveAdressPage",{
      'comeForm': 'minishop',
    });
    addAdressModal.onDidDismiss(data => {
      if (data) {
        this.loading = true;
        this.pageNo = 1;
        this.nearShop = [];
        if (data.addressId) {
          this.addressId = data.addressId;
          this.getAddress();
          return false;
        }
        else if (data.locationHere) {
          this.location();
        }
      }
    });
    addAdressModal.present()
  }
  getAddress() {
    this.appService.httpJsonp('common.address.get',{
      "token": this.token,
      "id": this.addressId
    },res => {
      this.addressLocation = res.data['address'];
      this.addressLngLat = this.GeolocationProvider['MaGeolocation'].LngLat( res.data['longitude'], res.data['latitude'] );
      this.lng = res.data['longitude'];
      this.lat = res.data['latitude'];
      this.getItemLoad();
    })
  }
  // 下拉加载
  doInfinite(infiniteScroll){
    this.getItemLoad(infiniteScroll);
  }
  // 上拉更新

  doRefresh(refresher) {
    this.pageNo =1;
    setTimeout(() => {
      this.isDoRefresh = true;
      this.nearShop = [];
      this.getItemLoad();
      refresher.complete();
    }, 2000);
  }
  goShop(shopId) {
    this.navCtrl.push('MinishopShopPage',{
      shopId: shopId
    }, { duration: 0 })
  }
  searchText;
  oppp() {
    alert(this.searchText);
  }
}
