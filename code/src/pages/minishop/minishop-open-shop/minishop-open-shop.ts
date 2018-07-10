import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the MinishopOpenShopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-open-shop',
  templateUrl: 'minishop-open-shop.html',
})
export class MinishopOpenShopPage {
  item = [];
  adressParams = {};
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public appService: AppService) {
  }
  ionViewDidLoad() {
  }
  selectedAddress () {
    let addAdressModal = this.modalCtrl.create("AreaModalPage");
    addAdressModal.onDidDismiss(data => {
      if (data) {
        this.adressParams = data.params;
        this.adressParams['type'] = 1;
        this.adressParams['isLocation'] = false;
        this.item['prov_name'] = data.params['prov_name'];
        this.item['city_name'] = data.params['city_name'];
        this.item['district_name'] = data.params['district_name'];
        this.item['prov_id'] = data.params['prov_id'];
        this.item['city_id'] = data.params['city_id'];
        this.item['district_id'] = data.params['district_id'];
        this.item['addressSSQ'] = this.item['prov_name'] + " " + this.item['city_name'] + " " + this.item['district_name']
      }
    });
    addAdressModal.present();
  }
  confirm() {
    if(!this.item['name']){
      this.appService.toast('姓名不能为空','top','warning');
      return false
    }
    else if (!this.isphone(this.item['tel'])) {
      this.appService.toast('输入手机有误','top','warning');
      return false
    }
    else if (!this.item['shopName']) {
      this.appService.toast('店铺名字不能为空','top','warning');
      return false
    }
    else if (!this.item['addressSSQ']) {
      this.appService.toast('请选择省市区','top','warning');
      return false
    }
    else if (!this.item['address']) {
      this.appService.toast('小店地址不能为空','top','warning');
      return false
    }
    this.appService.httpJsonp('mini.shop.applyShop', {
      "leader": this.item['name'],
      "mobile": this.item['mobile'],
      "shop_name": this.item['shopName'],
      "shop_address" : this.item['address'],
      "telephone": this.item['tel'],
      "prov_id": this.item['prov_id'],
      "city_id": this.item['city_id'] ,
      "district_id": this.item['district_id']
    }, result => {
      if(result.data ==1){
        this.appService.toast('店铺已存在，直接修改密码成功','top','warning');
      }
      else if(result.data == -1){
        this.appService.toast('店铺申请失败','top','warning');
      }
      else if(result.data == -2){
        this.appService.toast('修改密码失败','top','warning');
      }
      else if(result.data==-3){
        this.appService.toast('店铺已申请,审核中','top','warning');
      }
      else if(result.data==-4){
        this.appService.toast('用户已存在,店铺已存在,发送短信失败','top','warning');

      }
      else{
        this.appService.toast('申请成功,待审核','top','warning');
        this.navCtrl.pop();
      }
    })
  }
  /*判断输入是否为合法的手机号码*/
  isphone(inputString) {
    let partten = /^1[3,5,8]\d{9}$/;
    if(partten.test(inputString)) {
      return true;
    }
    else {
      return false;
    }
  }
}
