import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import { AppService } from "../../../app/app.service";
import { StorageProvider } from '../../../providers/storage/storage';
import  { GeolocationProvider } from "../../../providers/geolocation/geolocation";
import 'rxjs/add/operator/map'; //RxJS库为Observable提供了map函数

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild("header") header;
  // @ViewChild('myNav') nav: NavController
  // @ViewChild(Content) content: Content;
  @ViewChild('content') content;
  wholesaleUserInfo = [];
  token = '';
  userInfo = [];
  isLogin = false;
  isWholesaleUser = false;
// 定位经纬度
  public addressLngLat;
  // 定位地址
  addressLocation = '';
  // 附近小店信息
  public nearShop = [];
  //是否显示'千'；
  public thousandShow = false;
  // 1500米是否有商铺
  public haveShop = true;
  // 幻灯片数组
  slides: Array<any> = [];
  // 批发通告
  itemsNew = [];
  // 分类数组
  categories: Array<any> = [];
  // 批发展示数据
  WholesaleCategories: Array<any> = [];
  // 商城广告位
  MallAdvertising0 = [];
  MallAdvertising1 = [];
  MallAdvertising2 = [];
  MallAdvertising3 = [];
  MallAdvertising4 = [];
  MallAdvertising5 = [];
  MallAdvertising6 = [];
  MallAdvertising7 = [];
  // 商城商品
  mallItems = [];
  public products: Array<any> = [];
  constructor(public navCtrl: NavController, public appService: AppService,
              public GeolocationProvider: GeolocationProvider, public storage: StorageProvider,) {
    // 商城广告位数据
    this.getMallAdvertising();
    //商城商品数据
    this.getMallRecommend();
    this.slides = [
      'http://i8.yunmayi.com/upload/2018/03/13/1edec5d36452dd82499b781da641c9ac.jpgXXXXX!!!!!_700x700.jpg',
      'http://i8.yunmayi.com/upload/2017/12/30/80ff06e151702a951f4adb662e817d65.jpgXXXXX!!!!!_700x700.jpg',
      'http://i8.yunmayi.com/upload/2018/02/05/bdb4def1f5a44d1f99b93d98eb914736.jpgXXXXX!!!!!_700x700.jpg'
    ];
    this.categories = [
      {class:"c2", title:"蚂蚁小店", go:"MinishopHomePage"},{class:"c3", title:"蚂蚁批发", go:"WholesaleHomePage"},
      {class:"c1", title:"蚂蚁商场", go:"MallHomePage"},{class:"c4", title:"蚂蚁会员", go:"MemberCenterPage"},
      {class:"c5", title:"吃遍中国", go:"MallSearchPage", id:"100288"}, {class:"c6", title:"超值9.9", go:"MallSearchPage", id:"100287"},
      {class:"c7", title:"企业合作", go:"MallCooperationPage"},{class:"c8", title:"服务承诺", go:"MallCommitmentPage"}
      ];
  }
  ionViewDidLoad() {
    //附近小店定位
    this.locationFromGeolocation();
  }
  //初始化
  onIt(){
    setTimeout(()=>{
      // //获取用户信息
      // this.storage.getDate('userInfo', res=>{
      //   this.userInfo = res;
      // });
      //获取批发用户信息
      this.storage.getDate('wholesaleUser',(res)=> {
        if ( Object.keys(res).length  > 0) {
          this.isWholesaleUser = true;
          this.wholesaleUserInfo = res;
          this.getNoticeList(res);
          this.getWholesaleItem(res)
        }
        else {
          this.appService.httpJsonp('wholesale.product.getAppProduct',{agent_number:99999999},res=>{
            this.WholesaleCategories = res.data;
            this.isWholesaleUser = false;
          })
        }
      });
    },500);
  }
  ionViewWillEnter() {
    this.isLogin = false;
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      if (res && res != this.token) {
        this.isLogin = true;
        this.token = res;
        this.onIt();
      }
      else if (res){
        this.isLogin = true;
      }
    });
  }
  // 导航栏渐变
  // scrollEvent(e) {
  //   // console.log(this.header._elementRef.nativeElement.firstElementChild.style);
  //   let opacity = ( e.scrollTop ) / 135;
  //   // this.header._elementRef.nativeElement.style.opacity = opacity;
  //   this.header._elementRef.nativeElement.firstElementChild.style.backgroundColor = "rgba(255, 0, 0, " + opacity + ")";
  // }

  // 计算小店与用户当前经纬度的距离
  distanceCompute(lng, lat, i?) {
    let distance:number = 0;
    if (this.addressLngLat) {
      let shopLngLat = this.GeolocationProvider['MaGeolocation'].LngLat(lng, lat);
      distance = this.addressLngLat.distance(shopLngLat);
      if ( distance >= 1000) {
        distance = distance / 1000;
        this.thousandShow = true;
        return distance.toFixed(2);
      }
      else if ( distance > 1500 ) {
        this.haveShop = true;
      }
    }
    return distance.toFixed(0);
  }
  // 定位地址信息
  locationFromGeolocation() {

    this.GeolocationProvider['MaGeolocation'].getGeolocation(res => {
      if (res != '定位失败') {
        this.addressLocation = res.aois[0].name;
        this.addressLngLat = this.GeolocationProvider['MaGeolocation'].LngLat(res.position.lng, res.position.lat);
        this.storage.setDate('location',{
          addressINfo : res.addressComponent,
          address: this.addressLocation,
          lng: res.position.lng,
          lat: res.position.lat
        });
        let params = {
          "lng": res.position.lng,
          "lat": res.position.lat,
          "page_no": 1,
          "page_size": 20
        };
        return this.appService.httpJsonp("mini.shop.nearbyShop", params, res=>{
          this.haveShop = false;
          if(res.data.list.length == 0) {
            this.haveShop = true;
            return false;
          }
          this.nearShop = res.data.list[0];
          this.nearShop['total'] = res.data.total;
          this.nearShop['logo_url'] = this.appService.changeImgUrl(this.nearShop['logo_url'],160);
          this.nearShop['distance'] = this.distanceCompute(this.nearShop['longitude'] / 1000000, this.nearShop['latitude'] / 1000000);
          // this.nearShop = res.data.list;
          // for(let k in this.nearShop) {
          //   this.nearShop[k]['distance'] = this.distanceCompute(this.nearShop[k]['longitude']/ 1000000, this.nearShop[k]['latitude'] / 1000000);
          // }
        })
      }
      else {
        this.addressLocation = res;
      }
    });
    //
    // this.GeolocationProvider.MbGeolocation(res=>{
    //   // 转换腾讯坐标
    //   return this.MQGeolocation.coordTranslate(res.longitude, res.latitude, 1, res=>{
    //     this.addressLngLat = this.MAGeolocation.LngLat(res.locations[0].lng, res.locations[0].lat);
    //     return this.MQGeolocation.getAddress(res.locations[0].lng, res.locations[0].lat,5 , res=>{
    //       console.log(res)
    //       this.addressLocation = res.result.address_component.street_number ? res.result.address_component.street_number : res.result.address_component.street;
    //       this.storage.setDate('location',{
    //         addressINfo : res.result.address_component,
    //         address: this.addressLocation,
    //         lng: res.result.location.lng,
    //         lat: res.result.location.lat
    //       });
    //       let params = {
    //         "lng": res.result.location.lng,
    //         "lat": res.result.location.lat,
    //         "page_no": 1,
    //         "page_size": 20
    //       };
    //       return this.appService.httpJsonp("mini.shop.nearbyShop", params, res=>{
    //         if(res.data.total == 0) {
    //           this.haveShop = true;
    //           return false;
    //         }
    //         this.nearShop = res.data.list[0];
    //         this.nearShop['total'] = res.data.total;
    //         this.nearShop['logo_url'] = this.appService.changeImgUrl(this.nearShop['logo_url'],160);
    //         this.nearShop['distance'] = this.distanceCompute(this.nearShop['longitude'] / 1000000, this.nearShop['latitude'] / 1000000);
    //         // this.nearShop = res.data.list;
    //         // for(let k in this.nearShop) {
    //         //   this.nearShop[k]['distance'] = this.distanceCompute(this.nearShop[k]['longitude']/ 1000000, this.nearShop[k]['latitude'] / 1000000);
    //         // }
    //       })
    //     })
    //   });
    // });
  }
  // 获取批发快报
  getNoticeList (res) {
      let params = {
          "agent_number": res.agent_number,
          "user_id": res.user_id,
          "page_no": 1,
          "page_size": 100
    };
      this.appService.httpJsonp('wholesale.shop.getNoticeList', params, res=> {
        let k = 0;
        this.itemsNew = res.data.result[k];
        setInterval(()=>{
          k++;

          if (k >= res.data.result.length) {
            k = 0;
          }
          this.itemsNew = res.data.result[k];
        },5000);
      })
  }
  // 获取批发商品信息
  getWholesaleItem (res) {
    this.appService.httpJsonp('wholesale.product.getAppProduct',{agent_number:res.agent_number},res=>{
      this.WholesaleCategories = res.data;
      for(let k in this.WholesaleCategories) {
        this.WholesaleCategories[k]['noShow'] = true;
      }
    })
  }
  // 获取商城广告位数据
  getMallAdvertising () {
    this.appService.httpJsonp("mall/home/ads1", {}, res =>{
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
    },true)
  }
  //商城商品
  getMallRecommend () {
    this.appService.httpJsonp('mall.home.recommend',{},res=>{
      this.mallItems = res.data;
    })
  }

  // 跳转
  go (where,type) {
    if (type == 1 && this.wholesaleUserInfo.length > 0) {
      this.navCtrl.push(where);
    }
    else if (!this.token){
      this.navCtrl.push('LoginPage');
    }
    else if (this.token && type == 1){
      this.appService.toast('非批发用户','top','warning');
    }
    else if (type ==2 && this.token) {
      this.navCtrl.push(where);
    }
  }

  goDetaile () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude; //纬度
        let lag = position.coords.longitude; //经度
        this.appService.toast('纬度:'+lat+',经度:'+lag,'top','warning');
      }, error => {
        console.log(error)
      })
    }
    else {
      this.appService.toast('浏览器不支持地理定位','top','warning');
    }
  }
}

