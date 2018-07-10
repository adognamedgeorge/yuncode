import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the MemberEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-edit',
  templateUrl: 'member-edit.html',
})
export class MemberEditPage {
  token = '';
	public userinfo = {
    token: '',
    name: '',
    mobile: '',
    idNumber: '',
    sex: '',
    birthday: ''
	};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
        this.token = res;
        this.getItem()
    });
  }
  getItem () {
    this.appService.httpJsonp('cashier.platformvip.get', {
      "token": this.token
    }, res => {
      if (res.status == 'success') {
        this.userinfo = {
          token: this.token,
          name: res.data.user_name,
          mobile: res.data.user_mobile,
          idNumber: res.data.user_certify_id,
          sex: res.data.user_sex,
          birthday: res.data.user_birthday
        }
      }
    })
  }
  save () {
    this.appService.httpJsonp('cashier.platformvip.edit', this.userinfo, res => {
      console.log(res)
      if (res.info == 'OK') {
        this.navCtrl.pop();
      }
      this.appService.toast(res.data.info,'top','warning');

    })
  }
}
