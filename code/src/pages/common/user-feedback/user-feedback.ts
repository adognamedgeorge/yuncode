import { Component } from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AppService} from "../../../app/app.service";
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {Md5} from "ts-md5";
import {StorageProvider} from "../../../providers/storage/storage";
/**
 * Generated class for the UserFeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-feedback',
  templateUrl: 'user-feedback.html',
})
export class UserFeedbackPage {
  path: string;
  fileTransfer: FileTransferObject = this.transfer.create();
  imageUrl: string;
  content = '';
  token = '';
  userInfo = {};
  mobile = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private camera: Camera, public appService: AppService,
              public actionSheetCtrl: ActionSheetController, private transfer: FileTransfer,
              public storage: StorageProvider) {
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
      console.log(res)
    });
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
    });
  }
  open () {
      let actionSheet = this.actionSheetCtrl.create({
        cssClass:'share',
        buttons: [
          {
            text: '拍照',
            handler: () => {

              this.getPictureByCamera();
            }
          },
          {
            text: '相册',
            handler: () => {
              this.getPictureByPhotoLibrary();
            }
          },
          {
            text: '取消',
            role: 'cancel',
            cssClass:'close',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
  }

  /**
   * 使用cordova-plugin-camera获取照片
   * @param options
   */
  getPicture(options) {
    const ops: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL, // 默认返回base64字符串,DATA_URL:base64   FILE_URI:图片路径
      quality: 90, // 图像质量，范围为0 - 100
      allowEdit: false, // 选择图片前是否允许编辑
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 1024, // 缩放图像的宽度（像素）
      targetHeight: 1024, // 缩放图像的高度（像素）
      saveToPhotoAlbum: false, // 是否保存到相册
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true, ...options
    };
    this.camera.getPicture(ops).then((imageData) => {
      this.upload(imageData);
    }, (err) => {
      // Handle error
    });
  }

  /**
   * 通过拍照获取照片
   * @param options
   */
  getPictureByCamera() {
    const ops: CameraOptions = {
      sourceType: this.camera.PictureSourceType.CAMERA,
    };
    this.getPicture(ops);
  }

  /**
   * 通过图库获取照片
   * @param options
   */
  getPictureByPhotoLibrary() {
    const ops: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };
    this.getPicture(ops);
  }

  /**
   * 文件上传
   */
  upload(imageData) {
    let params ={};
    let timestamp = new Date().getTime() / 1000 + "";
    let str = "";
    let key = "";
    params["app_id"] = 1000001;
    params["timestamp"] = parseInt(timestamp);
    let keyDist = Object.keys(params).sort();
    for (let k in keyDist) {
      key = keyDist[k];
      if (params[key] !== ""){
        str += key + "=" + params[key] + "&";
      }
    }
    str += "app_secret=" + "sUTARdb9fjM2W10PF54xQiLHwpvEJXOk";
    params['sign'] = Md5.hashStr(str).toString().toUpperCase();

    const apiPath ='http://api.h5.yunmayi.com/index.php/' + "common/uploader/image";

    let fileName = imageData.substr(imageData.lastIndexOf("/") + 1);
    if (fileName.indexOf("?") >= 0) {
      fileName = fileName.substr(0, fileName.indexOf("?"));
    }
    let options: FileUploadOptions = {
      fileKey: 'image',
      fileName: fileName + '.jpg',   //文件名称
      headers: {},
      params: params
    };
    this.fileTransfer.upload('data:image/jpeg;base64,' + imageData, encodeURI(apiPath), options)
      .then((response) => {
        let data = JSON.parse(response.response);
        if (data.status == 'success') {
          this.imageUrl = data.data;
          // If it's base64:
          this.path  = 'data:image/jpeg;base64,' + imageData;
          this.appService.toast('图片上传成功','top','warning');
        }
        else {
          this.appService.toast(data.info,'top','warning');
        }
      }, (err) => {
        this.appService.toast('图片上传失败','top','warning');
      });
  }
  confirm() {
    if (this.content == '') {
      this.appService.toast('反馈内容不能为空','top','warning');
      return false;
    }
    this.appService.httpJsonp('common.user.addFeedBack', {
      "token":this.token,
      "user_name": this.userInfo['username'],
      "image": this.imageUrl,
      "come_from":"app",
      "tel":  this.mobile,
      "content": this.content
    }, res => {
      this.appService.toast(res.data.info,'top','warning');
    })
  }
}
