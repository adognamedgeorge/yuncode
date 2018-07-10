import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
/**
 * Generated class for the MemberExchangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-member-exchange',
  templateUrl: 'member-exchange.html',
})
export class MemberExchangePage {
	public tabs = 'convert';
	token = '';
  number: any;
  items = [];
  	constructor(public navCtrl: NavController, public navParams: NavParams,
                public modalCtrl:ModalController, public appService: AppService,
                public storage: StorageProvider) {
      // 获取token
      this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
        this.token = res;
        this.getItem()
      });
  	}
  	exchangeDetail(item):void{
	    let modal = this.modalCtrl.create('MemberExchangeDetailPage', {
	      item: item
      });
	    modal.present();
	}
	exchangeConfirm(item):void{
	    let modal = this.modalCtrl.create('MemberExchangeConfirmPage',{
	      item: item
      });
	    modal.present();
	}


  	getItem(status?) {
  	  if (status == 1 || status == 2) {
        this.appService.httpJsonp('cashier.point_trade.list', {
          "token": this.token,
          "status": status
        }, res => {
          this.items = res.data.list;
          console.log(res)
        })
      }
      else {
        this.appService.httpJsonp('cashier.point_item.list', {
          "token": this.token,
        }, res => {
          this.items = res.data.list;
          console.log(res)
        })
      }
    }
  goToSlide(index: number) {
    if (this.number == index) {
      return false
    }
    else {
      this.items = [];
      this.number = index;
      this.getItem(index);
    }
  }
}
