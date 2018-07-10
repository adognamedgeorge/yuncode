import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { HotCodePush } from "@ionic-native/hot-code-push";
import { StorageProvider } from '../../../providers/storage/storage';
import { AppService } from "../../../app/app.service";

import { MainTabsPage } from "../main-tabs/main-tabs";

declare const AppUpdate;

@Component({
  selector: 'page-launch-screen',
  templateUrl: 'launch-screen.html',
})
export class LaunchScreenPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public hotCodePush: HotCodePush, public loadingCtrl: LoadingController,
              public storage: StorageProvider, public appService: AppService) {
    // this.appVersionUpdateCheck();
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      let token = res;
      this.appService.httpJsonp('common.passport.auth',{token:token},res=>{
        if (res.status  != 'fail') {
          this.storage.setDate('userInfo',res.data);
        }
        else {
          this.storage.setDate('MS_AUTH_TOKEN', {});
          this.storage.setDate('userInfo', []);
        }
      });
      this.appService.httpJsonp('wholesale.user.get',{token:token},res=>{
        if (res.data) {
          this.storage.setDate('wholesaleUser',res.data);
        }
        else {
          this.storage.setDate('wholesaleUser',{});
        }
      })
    });
    this.checkAppVersionUpdate();
    this.navCtrl.setRoot(MainTabsPage);
  }

  /**
   * app版本更新检测
   */
  checkAppVersionUpdate() {
    var updateUrl = "http://api.h5.yunmayi.com/app/yunmayi-app.xml";
    if (typeof AppUpdate != 'undefined') {
      AppUpdate.checkAppUpdate(function(){
        console.log("app update success");
      }, function(){
        console.log("app update failure");
      }, updateUrl);
    }
  }

}
