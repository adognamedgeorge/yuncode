import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the UserMarketingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-marketing',
  templateUrl: 'user-marketing.html',
})
export class UserMarketingPage {
  items = [];
  token = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,public appService: AppService,
              public storage: StorageProvider,) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.itemLoad();
    });
  }
  itemLoad () {
    this.appService.httpJsonp('mall.trade.getItemPopReturnPointList', {
      "token": this.token,
    }, res => {
      for (let k in res.data) {
        this.items.push(res.data[k]);
      }
    }, true);
  }
  marketing() {
    let actionSheet = this.actionSheetCtrl.create({
      cssClass:'share',
      title: '分享',
      buttons: [
        {
          text: '分享给微信朋友',
          // icon:'weixin',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: '分享到微信朋友圈',
          // icon:'pengyouquan',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: '取消',
          role: 'cancel',
          cssClass:'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
