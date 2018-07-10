import {Component,} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import { StorageProvider } from '../../../providers/storage/storage';
import { AppService } from "../../../app/app.service";

/**
 * Generated class for the LoginPage page.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  // 登录还是注册
  isUserExist = true;
	public tabs = 'passwordLogin';
  public password = '';
  public username = '';
  public countDown = 60;
  // 验证类型
  public verificationType = 0;
  // 手机号
  public telNum:number;
  public telNumOld:number;
  VerificationNum = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: StorageProvider, public appService: AppService,
              public events: Events,) {
  }
  // 登录
  login(type) {
    let params;
    if (this.isUserExist) {
      if (type == 1) {
        params ={
          username: this.username,
          password: this.password
        };
      }
      else {
        params ={
          username: this.telNum,
          password: this.VerificationNum
        };
      }
      this.appService.httpJsonp('common.passport.loginSupportDynamicPassword', params, res=>{
        if(!res.data) {
          this.appService.toast(res.info,'top','warning');
        }else {
          this.storage.setDate('MS_AUTH_TOKEN', res.data);
          this.appService.httpJsonp('common.passport.auth',{token:res.data},res=>{
            this.storage.setDate('userInfo',res.data);
          });
          this.appService.httpJsonp('wholesale.user.get',{token:res.data},res=>{
            if (res.data) {
              this.events.publish('isWholesaleUser',true);
              this.storage.setDate('wholesaleUser',res.data);
            }
            else {
              this.events.publish('isWholesaleUser',false);
              this.storage.setDate('wholesaleUser',{});
            }
          });
          this.navCtrl.pop();
        }
      })
    }
    else {
      params ={
        mobile: this.telNum,
        code: this.VerificationNum
      };
      this.appService.httpJsonp('common.passport.register', params, res=>{
        if (res.info == 'OK') {
          this.storage.setDate('MS_AUTH_TOKEN', res.data);
          this.appService.httpJsonp('common.passport.auth',{token:res.data},res=>{
            this.storage.setDate('userInfo',res.data);
          });
          this.appService.httpJsonp('wholesale.user.get',{token:res.data},res=>{
            if (res.data && res.status != 'fail') {
              this.storage.setDate('wholesaleUser',res.data);
            }
          });
          this.appService.toast('注册成功','top','warning');
          this.navCtrl.pop();
        }
        else {
          this.appService.toast(res.info,'top','warning');
        }



        console.log(res)
      })
    }
  }
  //发送验证码
  sendVerification() {
    this.isUserExist = true;
    this.appService.httpJsonp('common.passport.getDynamicPassword',{username: this.telNum}, res=>{
      this.telNumOld = this.telNum;
      if(res.info != 'OK') {
        if( res.info =="用户不存在" ){
          this.appService.sendVerifyCode(this.telNum, res=>{
            if (res.info != 'OK') {
              this.appService.toast(res.info,'top','warning');
            }
            if(res.status != 'fail') {
              this.isUserExist = false;
              this.timeInterval();
              this.verificationType = 1;
            }
          });
        }
        else {
          this.appService.toast('请输入正确的手机号码','top','warning');
        }
      }
      else {
        this.verificationType = 1;
        this.timeInterval();
      }
    })
  }
  //监听input
  changeDate(num) {
    if (this.telNumOld != num) {
      this.verificationType = 0;
    }
    else {
      this.verificationType = 1;
    }
  }
  //验证码定时器
  timeInterval () {
    let timer = setInterval(()=>{
      this.countDown--;
      if( this.countDown ==0){
        clearInterval(timer);
        this.countDown = 60;
        this.verificationType = 2;
      }
    },1000)
  }
  // 切换登录模式
  goToSlide (type) {
    if (type == 1) {
      this.tabs = 'passwordLogin'
    }
    else {
      this.tabs = 'identifyingLogin'
    }
  }
}
