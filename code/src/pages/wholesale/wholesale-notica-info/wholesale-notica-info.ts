import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the WholesaleNoticaInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-wholesale-notica-info',
  templateUrl: 'wholesale-notica-info.html',
})
export class WholesaleNoticaInfoPage {
  public newsItem:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService,
              public storage: StorageProvider,) {}

  ionViewDidLoad() {
    this.storage.getDate('wholesaleUser',(res)=>{
      console.log(res)
      let params = {
        "agent_number": res.agent_number,
        "user_id": res.user_id,
        "id": this.navParams.get('id')
      };
      this.appService.httpJsonp('wholesale.shop.getNoticeInfoById', params, res=>{
        this.newsItem = res.data.content.replace(/\/upload/g, "http://pifa.yunmayi.com/upload");
      })
    });
  }

}
