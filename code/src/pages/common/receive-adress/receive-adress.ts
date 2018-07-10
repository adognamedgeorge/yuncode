import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController} from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";
import { GeolocationProvider } from "../../../providers/geolocation/geolocation";

/**
 * Generated class for the ReceiveAdressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-receive-adress',
  templateUrl: 'receive-adress.html',
})
export class ReceiveAdressPage {
  token = '';
  userInfo = {};
  // 地址列表
  addressList = [];
  addressLocation = '';
  comeForm = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public modalCtrl: ModalController, public viewCtrl: ViewController,
              public appService: AppService, public storage : StorageProvider,
              public GeolocationProvider: GeolocationProvider, public loadingCtrl: LoadingController ) {
    this.comeForm = this.navParams.get('comeForm');
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
    });
    this.location();
  }

  ionViewDidLoad() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getAddressList();
    });
  }
  // 获取地址
  getAddressList() {
    this.appService.httpJsonp('common.address.list',{
      token: this.token
    },res => {
      this.addressList = res.data;
    },true)
  }
  // 选中地址
  selectAddress (item) {
    this.viewCtrl.dismiss({
      'addressId': item['id']
    });

  }
  // 定位当前地址
  locationHere() {
    let loading = this.loadingCtrl.create({
      content: '定位中...'
    });
    loading.present();
    this.storage.setDate('location',"");

    this.GeolocationProvider['MaGeolocation'].getGeolocation(res => {
      if(res == "定位失败") {
        this.appService.toast('定位失败','top','warning');
      }
      else {
        this.addressLocation = res.aois[0].name;
        this.storage.setDate('location',{
          addressINfo : res.addressComponent,
          address: this.addressLocation,
          lng: res.position.lng,
          lat: res.position.lat
        });
        if (this.comeForm) {
          this.viewCtrl.dismiss({'locationHere':true});
        }
      }
      loading.dismiss();

    });
  }
  // 定位地址
  location () {
    this.storage.getDate('location',res => {
      this.addressLocation =  res.address;
    })
  }
  // 删除地址
  removeItem (item) {
    this.appService.confirm('是否要删除该地址?','',() => {
      this.appService.httpJsonp('common.address.del',{
        "address_id": item['id'],
        "user_id": this.userInfo['id'],
        "token": this.token
      }, res=> {
        this.getAddressList();
      },false,()=>{
        this.getAddressList();
      })
    })
  }
  // 编辑地址
  edit (item) {
    let addAdressModal = this.modalCtrl.create("AddAdressModalPage",{
      'item': item,
      'title': '编辑地址'
    });
    addAdressModal.onDidDismiss(data => {
      if (data) {
        this.getAddressList();
      }
    });
    addAdressModal.present()
  }

  // 关闭模版
  modalClose () {
    this.viewCtrl.dismiss();
  }
  /*
  新增地址
   */
  addAdress () {
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
      if (!this.userInfo['id']) {
        this.navCtrl.push('LoginPage');
        return false;
      }
      let addAdressModal = this.modalCtrl.create("AddAdressModalPage",{
        'title': '添加地址',
      });
      addAdressModal.onDidDismiss(data => {
        if (data) {
          this.getAddressList();
        }
      });
      addAdressModal.present()
    });

  }
}
