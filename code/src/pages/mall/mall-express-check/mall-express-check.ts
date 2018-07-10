import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the MallExpressCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-express-check',
  templateUrl: 'mall-express-check.html',
})
export class MallExpressCheckPage {
  expressType = '';
  expressOrderNo = '';
  imgUrl = '';
  items = [];
  express = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService) {
    this.expressType = this.navParams.get('expressType');
    this.expressOrderNo = this.navParams.get('expressOrderNo');
    this.imgUrl = this.navParams.get('imageUrl');
  }

  ionViewDidLoad() {
    this.appService.httpJsonp('common.logistic.getCompanyById',{
      "id": this.expressType
    }, res => {
      if (res.status != 'fail') {
        this.express = res.data;
        return this.appService.httpJsonp('mini.KdApiSearch.getOrderTracesByJson', {
          "shipperCode": res.data.code,
          "logisticCode": this.expressOrderNo
        }, res =>{
          this.items = res.data.Traces.reverse();
          console.log(this.items)
        })
      }
      else {
        this.express['name'] = '';
      }
    })
  }

}
