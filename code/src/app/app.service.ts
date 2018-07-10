import { StorageProvider} from "../providers/storage/storage";
import { LoadingController, AlertController, ToastController } from "ionic-angular";
import {Injectable} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Md5 } from "ts-md5/dist/md5";

@Injectable()
export class AppService {
  public wholesaleUserInfo = [];
  private App_ID = 1000001;
  private APP_SECRET = "sUTARdb9fjM2W10PF54xQiLHwpvEJXOk";
  // private APP_VERSION = "1.0.1";
  private API_URL = "http://api.h5.yunmayi.com/index.php/";
  // private API_URL = "http://api.mountaineers.com/index.php/";
  // private ASSET_URL = "http://dd.v2.yunmayi.com/appAssets/sellerApp/assets/";
  private CALLBACK_PARAM = "callback";
  constructor(
    public http: HttpClient, public alertCtrl: AlertController,
    public toasCtrl: ToastController, public loadingCtrl: LoadingController,
    public storage: StorageProvider
  ) {
    //获取批发用户信息
    this.storage.getDate('wholesaleUser',(res)=> {
      if (res) {
        this.wholesaleUserInfo = res;
      }
    })
  }
  httpJsonp(url: string, params: any, callback, loader: boolean = false, errorFn?) {
    callback = typeof callback == "function" ? callback : function(){};
    let loading = this.loadingCtrl.create({});
    let api = url.replace(/\./g,"/");
    if (loader) {
      loading.present();
    }
    this.http.jsonp(this.API_URL + api + "?" + this.createSign(params), this.CALLBACK_PARAM ).subscribe(res=>{
      if(loader) {
        loading.dismiss();
      }
      callback(res);
    },error => {
      if(loader) {
        loading.dismiss();
      }
      if (typeof errorFn == 'function') {
        errorFn();
      }
      console.log(error);
    })
  }
  public createSign(params:any):string {
    params = params || {};
    let timestamp = new Date().getTime() / 1000 + "";
    let str = "";
    let key = "";
    params["app_id"] = this.App_ID;
    params["timestamp"] = parseInt(timestamp);
    let keyDist = Object.keys(params).sort();
    for (let k in keyDist) {
      key = keyDist[k];
      if (params[key] !== ""){
        str += key + "=" + params[key] + "&";
      }
    }
    str += "app_secret=" + this.APP_SECRET;
    params['sign'] = Md5.hashStr(str).toString().toUpperCase();
    params=  this.toHttpParams(params);
    return params;
  }
  private toHttpParams(params) {
    return Object.getOwnPropertyNames(params).reduce((p, key) => p.set(key, params[key]), new HttpParams());
  }
  alert(title='提示', callback?) {
    callback = typeof callback == "function" ? callback : function () {};
    if (callback) {
      let alert = this.alertCtrl.create({
        title: title,
        buttons:[{
          text:'确认',
          handler: data => {
            callback();
          }
        }]
      });
      alert.present();
    } else {
      let alert = this.alertCtrl.create({
        title: title,
        buttons: ["确认"]
      });
      alert.present();
    }
  }
  confirm(message, title='提示', agree?, disagree?) {
    agree = typeof agree == "function" ? agree : function () {};
    disagree = typeof disagree == "function" ? disagree : function () {};
      let confirm = this.alertCtrl.create({
        title: title,
        message: message,
        buttons: [{
          text:'取消',
          handler: () => {
            disagree()
          }
        },{
          text: '确定',
          handler: () => {
            agree();
          }
        }
        ]
      });
      confirm.present();
  }
  toast(message, position?, cssClass?, time?, callback?) {
    time = time || 2000;
    callback = typeof callback == "function" ? callback : function () {};
    let toast = this.toasCtrl.create({
      message: message,
      duration: time,
      // dismissOnPageChange: true,
      position: position,
      cssClass:cssClass
    });
    toast.present();
    if(callback) {
      callback();
    }
  };
  presentLoading(message?, time=3000) {
    let loader = this.loadingCtrl.create({
      content: message,
      duration: time
    });
    loader.present();
    setTimeout(loader.dismiss(),5500);
  }

  // 替换图片地址
  changeImgUrl (url, size) {
    if( url.indexOf('pifa.yunmayi.com') != -1 ) {
      return url.replace(/pifa.yunmayi.com/g,"i8.yunmayi.com") + "XXXXX!!!!!_" + size + "x" + size + ".jpg";
    }
    else if ( url.indexOf('i1.yunmayi.com') != -1 ) {
      return  url + "XXXXX!!!!!_" + size + "x" + size + ".jpg";
    }
    else if (  url.indexOf('admin.yunmayi.com') != -1 ) {
      return url.replace(/admin.yunmayi.com/g,"i8.yunmayi.com") + "XXXXX!!!!!_" + size + "x" + size + ".jpg";
    }
    else {
      return 'http://i8.yunmayi.com' + url + "XXXXX!!!!!_" + size + "x" + size + ".jpg";
    }
  }
  // 获取验证码
  sendVerifyCode( mobile, callback? ) {
    callback = typeof callback == "function" ? callback : function(){};
    this.httpJsonp('common.passport.sendRegisterSmsVerifyCode', {mobile:mobile}, res=>{
      callback(res);
    })
  }
// 获取数组大小值
  getMaxMin (arr, type) {
    if (type == 'max') {
      return Math.max.apply([], arr);
    }
    else if (type == 'min') {
      return Math.min.apply([], arr);
    }
  }
  // 获取当前时间小时
  getCurrentTime() {
    let date : any;
    let hour : any;
    let minute : any;
    date = new Date();
    hour = date.getHours();
    minute = date.getMinutes();
    hour = hour < 10 ? "0" + hour : "" + hour;
    minute = minute < 10 ? "0" + minute : "" + minute;
    return hour + ":" + minute;
  };
  // // 设置本地回话
  // setItem(key: string, obj: any) {
  //   try {
  //     let json = JSON.stringify(obj);
  //     window.localStorage[key] = json;
  //   }
  //   catch (e) {
  //     console.error("window.localStorage error:" + e)
  //   }
  // }
  // // 获取本地回话
  // getItem(key: string, callback?) {
  //   try{
  //     let json = window.localStorage[key];
  //     let obj = JSON.parse(json);
  //     callback(obj);
  //   }
  //   catch (e) {
  //     console.error("window.localStorage error:" + e);
  //   }
  // }
}
