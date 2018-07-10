import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import  { GeolocationProvider } from "../../../providers/geolocation/geolocation";
import {AppService} from "../../../app/app.service";
// 地图申明
declare const AMap;
/**
 * Generated class for the MapModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-map-modal',
  templateUrl: 'map-modal.html',
})
export class MapModalPage {
  mapContainer : any;
  mapToolbar : any;
  mapCenterMarker : any;
  mapGeocoder : any;
  adressParams : any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public viewCtrl: ViewController,
              public GeolocationProvider: GeolocationProvider, public appService: AppService) {
    this.adressParams = this.navParams.get('adressParams');
    console.log( this.adressParams )
  }
  ionViewDidLoad() {
    this.loadMap();
  }
  loadMap () {

    this.mapContainer = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 8,
    });
    // 设置marker
    this.mapCenterMarker = new AMap.Marker(this.mapContainer.getCenter());
    this.mapCenterMarker.setMap(this.mapContainer);
    // 增加工具条
    this.mapContainer.plugin(["AMap.ToolBar"], () => {
      this.mapToolbar = new AMap.ToolBar();
      this.mapContainer.addControl(this.mapToolbar);
    });
    this.mapContainer.on("mapmove", () => {
      this.mapCenterMarker.setPosition(this.mapContainer.getCenter());
    });
    this.mapMarkerUpdate();
  }
  // 地图覆盖更新
  mapMarkerUpdate () {
    let provName;
    let cityName;
    let lng = '';
    let lat = '';
    if ( this.adressParams['type'] == 1 ) {
      provName = this.adressParams['prov_name'];
      cityName = this.adressParams['city_name'];
      lng = this.adressParams['longitude'];
      lat = this.adressParams['latitude'];
    }
    else {
      provName = this.adressParams['province'];
      cityName = this.adressParams['city'];
    }
    cityName = this.getSpCityName(provName,cityName);
    if ( !lng || !lat) {
      this.GeolocationProvider['MaGeolocation']._get({
        city: cityName
      },res=>{
        this.mapGeocoder = res;
        res.getLocation(this.adressParams['address'],( status, result )=>{
          if (status == "complete" && result.info == "OK" && result.geocodes.length > 0) {
            var _location = result.geocodes[0].location;
            var _lnglat = new AMap.LngLat(_location.lng, _location.lat);
            this.mapContainer.setCenter(_lnglat);
            this.mapContainer.setZoom(18);
            this.mapCenterMarker.setPosition(_lnglat);
          }
          else {
            this.appService.toast('地址定位失败,请手动选择正确的位置','top','warning');
            this.mapContainer.setCity(cityName);
          }
        });
      });
    }
    else {
      let _lnglat = new AMap.LngLat(lng, lat);
      this.mapContainer.setCenter(_lnglat);
      this.mapContainer.setZoom(17);
      this.mapCenterMarker.setPosition(_lnglat);
    }
  }
// 确认地图定位
  confirmMapLocation () {
    let _location = this.mapContainer.getCenter();
    this.adressParams['longitude'] = _location.lng;
    this.adressParams['latitude'] =  _location.lat;
    this.adressParams['isLocation'] = true;
    this.viewCtrl.dismiss({
      "adressParams" : this.adressParams
    });
    console.log(_location)
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
