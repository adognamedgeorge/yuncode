import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the QrscannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qrscanner',
  templateUrl: 'qrscanner.html',
})
export class QrscannerPage {
  @ViewChild('canvas') canvas : ElementRef;

  light: boolean = false;
  frontCamera: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private qrScanner: QRScanner, public viewChtrl: ViewController) {
    alert(this.viewChtrl.index);
    console.log(this.viewChtrl);

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        this.qrScanner.show();
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.navCtrl.push('WholesaleSearchPage',{
              keyword: text
            });
            this.qrScanner.disableLight();
            this.qrScanner.useBackCamera();
            this.qrScanner.hide();
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          alert('未开启相机许可');
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  // 开灯
 btn1() {
   if (!this.light) {
     this.qrScanner.enableLight();
   } else {
     this.qrScanner.disableLight();
   }
   this.light = !this.light;
 }
 // 前置
 btn2() {
   if (!this.frontCamera) {
     this.qrScanner.useFrontCamera();
   } else {
     this.qrScanner.useBackCamera();
   }
   this.frontCamera = !this.frontCamera;
 }
  ionViewDidLeave() {
    this.navCtrl.remove(this.viewChtrl.index,1);
    this.qrScanner.disableLight();
    this.qrScanner.useBackCamera();
    this.qrScanner.hide();
  }
}
