import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the AreaModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-area-modal',
  templateUrl: 'area-modal.html',
})
export class AreaModalPage {
  // 省
  provIndex = -1;
  cityIndex = -1;
  provinces = [];
  cities = [];
  districts = [];
  params = {
    city_id: '',
    city_name: '',
    district_id: '',
    district_name: '',
    prov_id: '',
    prov_name: '',
  };
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.appService.httpJsonp('common.area.provinces',{},res=> {
      this.provinces = res.data;
    })

  }
  // 选择省
  selectedPro(item, index) {
    this.districts = [];
    this.cityIndex = -1
    if (this.provIndex == index) {
      this.provIndex = -1
    }
    else {
      this.provIndex = index;
    }
    this.params['prov_id'] =  item.number;
    this.params['prov_name'] =  item.name;
    this.params['city_id'] =  '';
    this.params['city_name'] =  '';
    this.params['district_id'] =  '';
    this.params['district_name'] =  '';
    this.appService.httpJsonp('common.area.cities',{'prov_id': item.number},res=> {
      this.cities = res.data;
      if (this.cities.length ==0) {
        this.viewCtrl.dismiss({
          'params': this.params
        });
      }
    })
  }
  // 选择城市
  selectedCity(item, index, event: Event) {
    if (this.cityIndex != index) {
      this.cityIndex = index;
    }
    else {
      this.cityIndex = -1
    }
    this.params['city_id'] =  item.number;
    this.params['city_name'] =  item.name;
    this.params['district_id'] =  '';
    this.params['district_name'] =  '';
    this.appService.httpJsonp('common.area.districts',{'city_id': item.number},res=> {
      console.log(res)
      this.districts = res.data;
      if (this.districts.length ==0) {
        this.viewCtrl.dismiss({
          'params': this.params
        });
      }
    });
    event.stopPropagation();
  }
  // 选择区
  selectedDistricts (item, event: Event) {
    this.params['district_id'] =  item.number;
    this.params['district_name'] =  item.name;
    this.viewCtrl.dismiss({
      'params': this.params
    });
    event.stopPropagation();
  }
  /* 关闭模板*/
  modalClose () {
    this.viewCtrl.dismiss();
  }
}
