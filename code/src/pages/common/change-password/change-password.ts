import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AppService} from "../../../app/app.service";
import {StorageProvider} from "../../../providers/storage/storage";

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  userInfo = {};
  tabs = 'password';
  oldPassword : any = '';
  newPassword : any = '';
  newPassword1 : any = '';
  newPassword2 : any = '';
  public countDown = 60;
  // 验证类型
  public verificationType = 0;
  // 手机号
  public telNum:any;
  mobile : any;
  VerificationNum = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService,  public storage: StorageProvider,) {
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
      this.mobile = res['mobile'];
      this.telNum = res['mobile'].substring(0, 3)+"****"+ res['mobile'].substring(7,11);
    });
  }
  //发送验证码
  sendVerification() {
    this.countDown = 60;
    this.appService.httpJsonp('common.passport.getDynamicPassword',{username: this.mobile}, res=>{
      if(res.info != 'OK') {
        this.appService.toast(res.info,'top','warning');
        // if( res.info =="用户不存在" ){
        //   this.appService.sendVerifyCode(this.mobile, res=>{
        //     if (res.info != 'OK') {
        //       this.appService.toast(res.info,'top','warning');
        //     }
        //     if(res.status != 'fail') {
        //       this.timeInterval();
        //       this.verificationType = 1;
        //     }
        //   });
        // }
        // else {
        //   this.appService.toast(res.info,'top','warning');
        //   // this.appService.toast(res.info,'top','warning');
        // }
      }
      else {
        this.verificationType = 1;
        this.timeInterval();
      }
    })
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
      this.tabs = 'password'
    }
    else {
      this.tabs = 'identifying'
    }
  }
  // 确认修改
  change (type) {
    if ( type ==1 ) {
      if (this.oldPassword == '' || this.newPassword1 =='' || this.newPassword2 =='') {
        this.appService.toast('请完善信息','top','warning');
        return false ;
      }
      else if (this.newPassword1 !=  this.newPassword2) {
        this.appService.toast('2次输入的新密码不同','top','warning');
        return false ;
      }
      this.appService.httpJsonp('common.user.updatePassword', {
        "user_id": this.userInfo['id'],
        "old_passwd": this.oldPassword,
        "new_passwd": this.newPassword1,
        "re_new_passwd": this.newPassword2
      }, res => {
        this.appService.toast(res.data.info,'top','warning');
      })
    }
    else {
      if ( this.newPassword =='' ) {
        this.appService.toast('请完善信息','top','warning');
        return false;
      }
      this.appService.httpJsonp('common.passport.checkDynaminForUpdatePwd', {
        "mobile": this.mobile,
        "dynamic": this.VerificationNum,
        "newPassword": this.newPassword
      }, res => {
        if (res.status == 'success') {
          this.appService.toast(res.data,'top','warning');
        }
        else {
          this.appService.toast(res.info,'top','warning');
        }
      })
    }
  }
}
