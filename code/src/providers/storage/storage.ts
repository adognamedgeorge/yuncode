import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {
  public wholesaleUserInfo = [];
  constructor(public http: HttpClient, public storage: Storage) {

  }
  getDate(name,callback):any {
    callback = typeof callback == "function" ?callback : function () {};
    this.storage.get(name).then(val=>{
      callback(JSON.parse(val));
    });
  }
  setDate(name,data) {
    let newDate = JSON.stringify(data);
    this.storage.set(name, newDate);
  }

  // // 获取token
  // getToken (callback) {
  //   callback = typeof callback == "function" ?callback : function () {};
  //   this.getDate('MS_AUTH_TOKEN', (res)=>{
  //     console.log(res);
  //     callback(res);
  //   })
  // }
  // set(key, value) {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }
  // get(key) {
  //   return JSON.parse((localStorage.getItem(key)));
  // }
  // remove(key) {
  //   localStorage.removeItem(key);
  // }
}
