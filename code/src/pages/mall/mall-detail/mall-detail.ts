import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, IonicPage, ModalController, NavController, NavParams, Slides} from 'ionic-angular';
import {StorageProvider} from "../../../providers/storage/storage";
import {AppService} from "../../../app/app.service";
declare const Wechat;
/**
 * Generated class for the MallDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mall-detail',
  templateUrl: 'mall-detail.html',
})
export class MallDetailPage {
  @ViewChild("header") header;
  @ViewChild('content') content;
  @ViewChild('ionSlides') slides: Slides;
  itemId: any;
  userInfo = {};
  token = '';
  // 购物车数量
  cartNum = 0;
  isBackdrop = false;
  itemList = [];
  imageList = [];
  maxPrice = 0;
  minPrice = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public modalCtrl: ModalController,
              public storage: StorageProvider, public actionSheetCtrl: ActionSheetController) {
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
    });
  }

  ionViewDidLoad() {
    this.itemId = this.navParams.get('id');
    this.getItemList();
  }
  ionViewWillEnter() {
    // 获取token
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      this.token = res;
      this.getCartInfo();
    });
  }

  // 获取商品数据
  getItemList () {
    this.appService.httpJsonp('mall.item.getv2',{
      "item_id": this.itemId
    }, res=> {
      if ( res.data == null) {
        this.appService.alert('商品已下架')
        this.navCtrl.pop()
      }
      else {
        let items = res.data;
        this.imageList = res.data.images;
        let priceItem = [];
        for (let k in items.skus) {
          items.skus[k].values.sort();
          priceItem.push(items.skus[k].price);
        }
        for (let k in items.props) {
          items.props[k].checked = false;
          for(let i in items.props[k].values) {
            items.props[k].values[i].checked = false;
          }
        }
        this.maxPrice = this.appService.getMaxMin(priceItem, 'max');
        this.minPrice = this.appService.getMaxMin(priceItem, 'min');
        this.itemList  = items;
        if (this.itemList['content'].indexOf('/upload') > 0){
          this.itemList['content'] = res.data.content.replace(/\/upload/g, "http://pifa.yunmayi.com/upload");
        }
      }
    })
  }
  // 获取购物车信息
  getCartInfo () {
    this.appService.httpJsonp('mall.cart.list',{
      "token": this.token
    },res => {
      this.cartNum = res.data.length;
    })
  }

  // 加入购物车
  addCart (type) {
    if (this.token.length > 0) {
      this.isBackdrop = true;
      let addCartModal = this.modalCtrl.create('MallDetailModalPage',{
        'item': this.itemList,
        'type': type,
        'token': this.token
      });
      addCartModal.onDidDismiss(data => {
        if (data) {
          this.getCartInfo();
        }
        this.isBackdrop = false;
      });
      addCartModal.present();
    }
    else {
      this.navCtrl.push('LoginPage');
    }

  }
  // 分享
  share(item) {
    console.log(item)
    let actionSheet = this.actionSheetCtrl.create({
      cssClass:'share',
      title: '分享',
      buttons: [
        {
          text: "分享给微信朋友",
          // icon:'weixin',
          handler: () => {
            this.wechatPay(item,2);
          }
        },
        {
          text: "分享到微信朋友圈",
          // icon:'pengyouquan',
          handler: () => {
            this.wechatPay(item,1);
          }
        },
        {
          text: '取消',
          role: 'cancel',
          cssClass:'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  // 对象转换数组
  getKeys(item) {
    return Object.keys(item);
  }
  // 微信分享
  wechatPay(item,type) {
      Wechat.isInstalled( (installed) => {
        if (installed) {
          Wechat.share({
            message: {
              title:item.title,
              description:"云蚂蚁商品分享",
              thumb:"http://admin.yunmayi.com" + item.imageUrl,
              media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: 'http://dd.v2.yunmayi.com/weixin/goWeixin?app=mall&route=' +'/mall'+'/detail/' + item.id + '/' + this.userInfo['id']
          }
        },
          scene: type == 1 ? Wechat.Scene.TIMELINE : Wechat.Scene.SESSION
        }, function (res) {
            alert(JSON.stringify(res));
            alert("分享成功");
          }, function (reason) {
            alert(reason);
          });

        }
        else {
          this.appService.toast('请检查微信是否为最新版本','top','warning');
        }
      }, (error) => {
        this.appService.toast(JSON.stringify(error),'top','warning');
      });
  }
}
