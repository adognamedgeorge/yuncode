import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UpdatePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {

	public tabs = 'passwordLogin';
	public visibled = 'md-eye-off';
	public inpType='password';
  public opsw='';
  public npsw='';
  public rpsw='';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePasswordPage');
  }
  visible(){
  	if(this.visibled.indexOf('off')!=-1){
  		this.visibled = 'md-eye';
  		this.inpType = 'text';
  	}else{
  		this.inpType = 'password';
  		this.visibled = 'md-eye-off';
  	}
  }

}
