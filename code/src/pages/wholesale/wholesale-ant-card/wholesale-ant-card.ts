import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleAntCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-ant-card',
  templateUrl: 'wholesale-ant-card.html',
})
export class WholesaleAntCardPage {
  token = '';
  info = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider) {
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
        this.token = res;
        this.getInfo();
    })
  }
  getInfo () {
    this.appService.httpJsonp('wholesale.mobilecard.get',{token: this.token}, result => {
      if(result.status == "success"){
        if(result.data.name == undefined){
          this.appService.toast('您还未办理蚂蚁云卡','top','warning');
          this.navCtrl.pop();
          return false;
        }else{
          this.info = result.data;
          this.info['name'] = this.info['name'].replace(this.info['name'].substring(1,2),"*");
          this.info['mobile'] = this.info['mobile'].substring(0, 3)+"****"+ this.info['mobile'].substring(7,11);
        }
      }
      else{
        this.appService.toast(result.info,'top','warning');
        this.navCtrl.pop();
      }
    })
  }
}
