import {Component, ElementRef, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import JsBarcode  from 'jsbarcode';

/**
 * Generated class for the MemberExchangeDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-exchange-detail',
  templateUrl: 'member-exchange-detail.html',
})
export class MemberExchangeDetailPage {
  @ViewChild('barcode1') barcode : ElementRef;
  item = this.navParams.get('item');
	constructor(public navCtrl: NavController, public navParams: NavParams ,
              public viewCtrl: ViewController, public appService: AppService) {
	}
	closeModal(){
		this.viewCtrl.dismiss();
	}
  ionViewDidLoad() {
    this.getCode();
  }
  getCode () {
    JsBarcode(this.barcode.nativeElement, this.item['redeemCode'], {
      lineColor: "#000",
      format: "CODE128",
      width:10,
      height:200,
      displayValue: false
    })
  }
}
