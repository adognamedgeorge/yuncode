import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AppService} from "../../app/app.service";

// 地图申明
declare const AMap;
// declare const BMap;
// declare const BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW;
/*
  Generated class for the GeolocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeolocationProvider {
  constructor(public http: HttpClient, public appService: AppService) {
  }
  // toHttpParams(params) {
  //   return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  // }
  // 百度定位地图定位
  // MbGeolocation (callback) {
  //   callback = typeof callback == "function" ? callback : function () {};
  //   let geolocation = new BMap.Geolocation();
  //   geolocation.getCurrentPosition(position=>{
  //     if(geolocation.getStatus() == 0 ) {
  //       callback(position);
  //     }
  //     else {
  //       alert('B:定位失败，请手动定位'+ geolocation.getStatus());
  //     }
  //   },error=>{
  //     alert('B:定位失败，请手动定位'+ geolocation.getStatus());
  //     console.log(error)
  //   });
  // }
  // 高德地图
  MaGeolocation = {
    _geocoder: null,
    _geolocation: null,
    LngLat(lng, lat) {
      return new AMap.LngLat(lng, lat);
    },
    getGeolocation: function (callback) {
      callback = typeof callback == "function" ? callback : function () {};
      this._geolocation = new AMap.Map('iCenter');
      this._geolocation.plugin('AMap.Geolocation', function () {
        let geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          convert: false,
          useNative: true,
          GeoLocationFirst: true,
          extensions: 'all'
        });
        geolocation.getCurrentPosition((position, res) => {
          if (position == 'complete') {
            callback(res);
          }
          else {
            callback("定位失败");
          }
        },error => {
          callback("定位失败");
        });
      })
    },
     _get: function (opts,callback) {
       callback = typeof callback == "function" ? callback : function () {};
       AMap.service(["AMap.Geocoder"], () => {
         this._geocoder = new AMap.Geocoder(opts);
         callback(this._geocoder);
       });
    },
    getLocation: function (address, opts, callback) {
      callback = typeof callback == "function" ? callback : function () {};
      opts = opts || {};
      this._get(opts, geocoder=>{
        geocoder.getLocation(address, (status, result) => {
          if (status == 'complete') {
            callback(result);
          }
          else {
            callback("A:地址解析失败")
          }
        })
      })
    },
    getAddress: function (lng, lat, opts, callback) {
      callback = typeof callback == "function" ? callback : function () {};
      opts = opts || {};
      let _lnglat = new AMap.LngLat(lng, lat);
      this._get(opts, geocoder => {
        geocoder.getAddress(_lnglat, (status, result) => {
          if (status == 'complete') {
            callback(result);
          }
          else {
            callback("A:坐标解析失败");
          }
        })
      });
    }
  };
//腾讯地图配置
//   MQGeolocation = {
//     key: "XA3BZ-H6Z34-IDMUA-D42SY-4ZZHQ-BQF43",
//     toHttpParams: function(params){
//       return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
//     },
//     coordTranslate: function (lng, lat, type, callback) {
//       callback = typeof callback == "function" ? callback : function () {};
//       let url = "https://apis.map.qq.com/ws/coord/v1/translate?callback=JSON_CALLBACK";
//       let params= {
//         locations: lat + "," + lng,
//           type: type,
//           output: "jsonp",
//           key: this.key
//       };
//       params = this.toHttpParams(params);
//       this.http.jsonp(url+"?"+params, 'callback').subscribe(res=>{
//         if (res.status == 0 ) {
//           callback(res);
//         }
//         else {
//           callback("Q:坐标转换失败");
//         }
//       },error => {
//         console.log(error);
//       });
//     },
//     ipLocation: function (ip, callback) {
//       callback = typeof callback == "function" ? callback : function () {};
//       let url = "http://apis.map.qq.com/ws/location/v1/ip?callback=JSON_CALLBACK";
//       this.http.jsonp(url, {
//         params: {
//           ip: ip,
//           output: "jsonp",
//           key: this.key
//         }
//       }).subscribe(res=> {
//         if (res.status == 0 ) {
//           callback(res);
//         }
//         else {
//           callback("Q:IP定位失败");
//         }
//       },error => {
//         console.log(error);
//       })
//     },
//     getAddress: function (lng, lat, coordType, callback) {
//       callback = typeof callback == "function" ? callback : function () {};
//       let url = "http://apis.map.qq.com/ws/geocoder/v1?callback=JSON_CALLBACK";
//       coordType = coordType || 5;
//       this.http.jsonp(url, {
//         params: {
//           location: lat + "," + lng,
//           coord_type: coordType,
//           output: "jsonp",
//           key: this.key
//         }
//       }).subscribe(res=> {
//         if (res.status == 0 ) {
//           callback(res);
//         }
//         else {
//           callback("Q:坐标解析失败");
//         }
//       },error => {
//         console.log(error);
//       })
//     },
//     getLocation: function (address, city, callback) {
//       callback = typeof callback == "function" ? callback : function () {};
//       let url = "http://apis.map.qq.com/ws/geocoder/v1?callback=JSON_CALLBACK";
//       city = city || "";
//       this.http.jsonp(url, {
//         params: {
//           "address": address,
//           region: city,
//           output: "jsonp",
//           key: this.key
//         }
//       }).subscribe(res=> {
//         if ( res.status == 0 ) {
//           callback(res);
//         }
//         else {
//           callback("Q:地址解析失败");
//         }
//       },error => {
//         console.log(error);
//       })
//     }
//   }
}
// @Injectable()
// //腾讯地图配置
// export class MQGeolocationProvider {
//   public key:string = "XA3BZ-H6Z34-IDMUA-D42SY-4ZZHQ-BQF43";
//   constructor(public http: HttpClient,public Geolocation: GeolocationProvider) {
//   }
//   coordTranslate(lng, lat, type, callback) {
//     callback = typeof callback == "function" ? callback : function () {};
//     let url = "https://apis.map.qq.com/ws/coord/v1/translate?";
//     let params= {
//       locations: lat + "," + lng,
//       type: type,
//       output: "jsonp",
//       key: this.key
//     };
//     this.http.jsonp(url + this.Geolocation.toHttpParams(params), 'callback').subscribe(res => {
//       if ( res['status'] == 0 ) {
//         callback(res);
//       }
//       else {
//         callback("Q:坐标转换失败");
//       }
//     },error => {
//       console.log(error);
//     });
//   };
//   getAddress (lng, lat, coordType = 5, callback?) {
//     callback = typeof callback == "function" ? callback : function () {};
//     let url = "http://apis.map.qq.com/ws/geocoder/v1?";
//     let params = {
//       location: lat + "," + lng,
//       coord_type: coordType,
//       output: "jsonp",
//       key: this.key
//     };
//     this.http.jsonp(url + this.Geolocation.toHttpParams(params),'callback' ).subscribe(res=> {
//       if (res['status'] == 0 ) {
//         callback(res);
//       }
//       else {
//         callback("Q:坐标解析失败");
//       }
//     },error => {
//       console.log(error);
//     })
//   }
// }
// // 高德地图
// @Injectable()
// export class MaGeolocationProvider {
//   constructor(public http: HttpClient,public Geolocation: GeolocationProvider) {
//
//   }
//   LngLat(lng, lat) {
//     return new AMap.LngLat(lng, lat);
//   }
// }
