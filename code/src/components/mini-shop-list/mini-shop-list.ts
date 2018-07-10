import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {StorageProvider} from "../../providers/storage/storage";
import {Events, NavController, NavParams} from "ionic-angular";
import {AppService} from "../../app/app.service";
import {FlyCartProvider} from "../../providers/fly-cart/fly-cart";

/**
 * Generated class for the MiniShopListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mini-shop-list',
  templateUrl: 'mini-shop-list.html'
})
export class MiniShopListComponent {
  @ViewChild('scroll') scrollElement: any;
  @ViewChild('spinner') spinnerElement: any;
  // 商品列表
  @Input() products : Array<any>;
  @Input() shopId : any;
  @Input() isShopOpen : boolean;
  @Input() shopCart: {};
  @Input() loading : boolean;
  @Input() shopTopCat : Array<any>;
  @Input() shopSeconndCat : Array<any>;
  @Input() shopThirdCat : Array<any>;
  @Output() slectTopCate = new EventEmitter<any>();
  @Output() slectSecondCate = new EventEmitter<any>();
  @Output() slectThirdCate = new EventEmitter<any>();
  @Output() infinite = new EventEmitter<any>();
  @Output() cartInfoLoad = new EventEmitter<any>();
  token = '';
  userInfo = [];
  oldBuyNum = 0;
  cartInfo = {};
  // 选中顶级类目下标
  public chooseTopIndex: number = 0;
  // 选中2级类目下标
  public chooseSecondeIndex: number = -1;
  // 选中3级类目下标
  chooseThirdIndex:number = -1;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public storage: StorageProvider,
              private flyCartProvider: FlyCartProvider, private renderer : Renderer2,
              private el: ElementRef, public events: Events) {
    this.events.subscribe('token', res => {
      this.token = res;
    });
    this.storage.getDate('cartInfo', res=> {
      this.cartInfo = res ? JSON.parse(res) : {};
    });
    //获取用户信息
    this.storage.getDate('userInfo', res=>{
      this.userInfo = res;
    });
  }

  ngOnInit() {
    this.addScrollEventListener();
  }
  // 选中顶级类目
  chooseCate(item, i) {
    this.chooseTopIndex = i;
    this.chooseSecondeIndex = -1;
    this.chooseThirdIndex = -1;
    this.slectTopCate.emit(item);
  }
  // 选中2级类目
  chooseSecondeCate(item, i) {
    this.chooseSecondeIndex = i ;
    this.chooseThirdIndex = -1;
    this.slectSecondCate.emit(item);
  }
  // 选中3级类目
  chooseThirdCate(item, i) {
    this.chooseThirdIndex = i ;
    this.slectThirdCate.emit(item);
  }
  // 减数量
  minusProduct (item, shopCart) {
    let cart = shopCart[item['id']];
    item['quantity']--;
    if (item['quantity'] == 0) {
      this._delCart(shopCart, item);
      return false
    }
    else{
      cart.inCartQuantity = item['quantity'];
      this._updateCart(shopCart, cart);
    }
  }

  // 加数量
  addProduct(item, shopCart, e) {
    shopCart = shopCart ? shopCart : {};
    if (this.token.length > 0) {
      if (!shopCart[item['id']]) {
        item['quantity'] = 0;
      }
      if( item['quantity']  >= item['stockNum']){
        this.appService.toast('库存不够啦,看看其它商品吧~','top','warning');
      }
      else {
        item['quantity']++;
        if ( item['limit_num'] > 0 ) {
          this.appService.httpJsonp('mini.shop.stopBuyNum',{
            "item_id": item['id'],
            "buyer_id" : this.userInfo['id']
          }, res => {
            this.oldBuyNum = res.data;
            if (this.oldBuyNum + item['quantity'] > item['limit_num']) {
              this.appService.toast("该商品每天限购" + item['limit_num'] + "件,已经购买" + this.oldBuyNum + "件",'top','warning');
              return false;
            }
            else {
              this._addCart(shopCart, item, e)
            }
          })
        }
        else if ( item['limit_num'] == 0 ) {
          this._addCart(shopCart, item, e)
        }
      }
    }
    else {
      this.navCtrl.push('LoginPage');
    }
  }
  _addCart (shopCart, item, e, oldBuyNum?) {
    this.flyCartProvider.fly(e, this.el, this.renderer);
    let cart = shopCart[item.id] ? shopCart[item.id] : {};
    if (item.stock_num > 0) {
      cart.itemId = item.id;
      cart.itemName = item.title;
      cart.itemPicUrl = item.pic_url;
      cart.cateId = item.shop_cat_id;
      cart.sellPrice = item.sell_price;
      cart.stockNum = item.stock_num;
      cart.salesVolume = item.sales_volume;
      cart.black = item.black;
      cart.shopId = item.shop_id;
      cart.inCartQuantity = item.quantity;
      this._updateCart(shopCart, cart)
    }
    else {
      this._delCart(shopCart, item);
    }

  }
  // 更新购物车
  _updateCart (shopCart, cart) {
    if (cart.inCartQuantity > 0) {
      shopCart[cart['itemId']] = cart;
      this.cartInfo[cart.shopId] = shopCart;
    }
    else {
      delete this.cartInfo[cart['shopId']][cart['itemId']];
    }
    this.cartInfoLoad.emit(shopCart);
    this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
  }
  // 删除购物车
  _delCart (shopCart, item) {
    if ( shopCart && shopCart[item['id']]) {
      delete shopCart[item['id']];
      this.cartInfoLoad.emit(shopCart);
      this.cartInfo[item['shop_id']] = shopCart;
      this.storage.setDate('cartInfo', JSON.stringify(this.cartInfo));
    }
  }

  // 添加滚动时间
  addScrollEventListener () {
    this.scrollElement._scrollContent.nativeElement.onscroll = event => {
      if (this.spinnerElement) {
        //元素顶端到可见区域顶端的距离
        let top = this.spinnerElement.nativeElement.getBoundingClientRect().top;
        //可见区域高度
        let clientHeight = document.documentElement.clientHeight;
        if (top <= clientHeight) {
          this.doInfinite();
        }
      }
    }
  }

  // 下拉加载
  doInfinite() {

  }

}
