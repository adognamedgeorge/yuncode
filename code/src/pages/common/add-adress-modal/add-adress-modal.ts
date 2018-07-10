import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {StorageProvider} from "../../../providers/storage/storage";
import {AppService} from "../../../app/app.service";
import {GeolocationProvider} from "../../../providers/geolocation/geolocation";
// 地图申明
declare const AMap;

/**
 * Generated class for the AddAdressModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-adress-modal',
  templateUrl: 'add-adress-modal.html',
})
export class AddAdressModalPage {
  title = '';
  item = [];
  token = '';
  adressParams = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController, public modalCtrl: ModalController,
              public storage: StorageProvider, public appService: AppService,
              public GeolocationProvider: GeolocationProvider) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
        this.token = res;
    });
    this.title = this.navParams.get('title');
    if ( this.navParams.get('item') ) {
      this.item = this.navParams.get('item');
      console.log(this.item)
      this.adressParams = this.item;
      this.adressParams['type'] = 1;
      this.adressParams['isLocation'] = true;
      this.item['addressSSQ'] = this.item['prov_name'] + " " + this.item['city_name'] + " " + this.item['district_name']
    }
    else {
      this.storage.getDate('location',res => {
        console.log(res)
        this.adressParams = res.addressINfo;
        this.adressParams['type'] = 2;
        this.adressParams['isLocation'] = false;
        this.item['prov_name'] = res.addressINfo.province;
        this.item['city_name'] = res.addressINfo.city;
        this.item['district_name'] = res.addressINfo.district;
        // this.item['addressSSQ'] = this.item['prov_name'] + " " + this.item['city_name'] + " " + this.item['district_name']
      })
    }
  }

  ionViewDidLoad() {
  }
  // 保存
  save(){
    if (this.item['address'] && this.item['name'] && this.item['mobile'] && this.item['addressSSQ']) {
      if (!/^1[3|4|5|7|8]\d{9}$/g.test(this.item['mobile'] )) {
        this.appService.toast('手机号格式错误','top','warning');
        return false;
      }
      this.adressParams['address'] = this.item['address'];
      let city ;
      if (this.adressParams['type'] == 1) {
        city = this.getSpCityName(this.adressParams['prov_name'], this.adressParams['city_name']);
      }
      else {
        city = this.getSpCityName(this.adressParams['province'], this.adressParams['city']);
      }
      this.GeolocationProvider['MaGeolocation'].getLocation(this.adressParams['address'],{
        city: city
      },res => {
        console.log(res)
        if (res.info == "OK" && res.geocodes.length > 0) {
          if (res.geocodes[0].level == "未知") {
            this.appService.toast('亲，您的地址不规范哦，请重新填写','top','warning');
            return false;
          }
          if (this.adressParams['isLocation']) {
            let o = new AMap.LngLat(this.adressParams['longitude'], this.adressParams['latitude']);
            let distance = parseInt(res.geocodes[0].location.distance(o));
            if (distance > 200) {
              this.appService.toast("当前您设置的地图坐标与地址的坐标偏差超过" + distance + "米，请重新设置",'top','warning');
              return false;
            }
            else {
              this.item['longitude'] = res.geocodes[0].location.lng;
              this.item['latitude'] = res.geocodes[0].location.lat;
            }
          }
          else {
            this.item['longitude'] = res.geocodes[0].location.lng;
            this.item['latitude'] = res.geocodes[0].location.lat;
          }
        }
        else if (!this.adressParams['isLocation']) {
          this.appService.toast('当前地址定位坐标失败，请手动设置地图坐标','top','warning');
          return false;
        }
        console.log(this.item)
        console.log(this.adressParams);
        if (this.title == '编辑地址') {
          this.appService.httpJsonp('common.address.edit',{
            "token": this.token,
            "prov_id":  this.item['prov_id'],
            "city_id": this.item['city_id'],
            "district_id": this.item['district_id'],
            "address": this.item['address'],
            "name": this.item['name'],
            "mobile": this.item['mobile'],
            "longitude": this.item['longitude'],
            "latitude": this.item['latitude'],
            "address_id": this.item['id'],
          }, res => {
            this.appService.toast(res.info,'top','warning');
            this.viewCtrl.dismiss(true);
          });
        }
        else {
          this.appService.httpJsonp('common.address.add',{
            "token": this.token,
            "prov_id":  this.item['prov_id'],
            "city_id": this.item['city_id'],
            "district_id": this.item['district_id'],
            "address": this.item['address'],
            "name": this.item['name'],
            "mobile": this.item['mobile'],
            "longitude": this.item['longitude'],
            "latitude": this.item['latitude']
          }, res => {
            this.appService.toast(res.info,'top','warning');
            this.viewCtrl.dismiss(true);
          })
        }
      })
    }else {
      this.appService.toast('请完善信息','top','warning');
    }
  }
  selectedAddress () {
    let addAdressModal = this.modalCtrl.create("AreaModalPage");
    addAdressModal.onDidDismiss(data => {
      if (data) {
        this.adressParams = data.params;
        this.adressParams['type'] = 1;
        this.adressParams['isLocation'] = false;
        this.item['prov_name'] = data.params['prov_name'];
        this.item['city_name'] = data.params['city_name'];
        this.item['district_name'] = data.params['district_name'];
        this.item['prov_id'] = data.params['prov_id'];
        this.item['city_id'] = data.params['city_id'];
        this.item['district_id'] = data.params['district_id'];
        this.item['addressSSQ'] = this.item['prov_name'] + " " + this.item['city_name'] + " " + this.item['district_name']
      }
    });
    addAdressModal.present();
  }
  // 自动定位
  checkAddress () {
    if ( !this.item['address']) {
      this.appService.toast('请填写详细地址','top','warning');
    }else if( !this.item['addressSSQ']){
      this.appService.toast('请选择省市区','top','warning');
    }
    else {
      this.adressParams['address'] = this.item['address'];
      let openMapModal = this.modalCtrl.create('MapModalPage',{
        "adressParams": this.adressParams
      });
      openMapModal.onDidDismiss(data => {
        if (data) {
          this.adressParams = data.adressParams;
          console.log(data)
        }
      });
      openMapModal.present();
    }
  }
  getSpCityName(provName, cityName) {
    let sNameList = ["北京市", "天津市", "上海市", "重庆市"];
    if (sNameList.indexOf(provName) > -1) {
      cityName = provName;
    }
    return cityName;
  }
  /* 关闭模板*/
  modalClose () {
    this.viewCtrl.dismiss();
  }
}
