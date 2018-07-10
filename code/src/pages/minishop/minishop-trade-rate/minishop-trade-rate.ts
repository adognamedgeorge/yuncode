import {Component,} from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the MinishopTradeRatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-minishop-trade-rate',
  templateUrl: 'minishop-trade-rate.html',
})
export class MinishopTradeRatePage {
  orderType = this.navParams.get('orderType');
  token = this.navParams.get('token');
  tradeId = this.navParams.get('tradeId');
  items = {};
  content: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public appService: AppService, public events: Events) {
    this.getItem();
  }
  score: any = {
    service: 0,
    delivery: 0,
    items: {},
    starMap: [
      '不满意',
      '还行',
      '一般',
      '满意',
      '很满意',
    ]
  };
  chooseStar(e, type, id){
    let star = parseInt(e.target.dataset.index);
    if (e.target.dataset.index) {
      if (type == 'service') {
        this.score.service = star;
      }
      else if (type == 'delivery'){
        this.score.delivery = star;
      }
      else {
        this.score.items[id] = star;
      }
    }

  }
  getItem() {
    this.appService.httpJsonp('mini.trade.get', {
      "token": this.token,
      "trade_id": this.tradeId
    }, res => {
      this.items = res.data
      for( let k in res.data.orders) {
        this.score.items[res.data.orders[k]['id']] = 0;
      }
      console.log(res)
    })
  }
  // 提交评价
  confirm () {
    if ( this.score.service == 0 ) {
      this.appService.toast('请评价服务态度','top','warning');
    }
    else if ( this.score.delivery == 0 ) {
      this.appService.toast('请评价配送速度','top','warning');
    }
    else {
      let itemsStr = '', itemScore;
      for (let k in this.score.items) {
        itemScore = this.score.items[k] * 2;
        itemsStr += k + ":" + itemScore + ";";
      }
      this.appService.httpJsonp('mini.trade.buyerRate', {
        "token": this.token,
        "trade_id": this.tradeId,
        "service_score": this.score.service * 2,
        "delivery_score": this.score.delivery * 2,
        "item_scores": itemsStr,
        "content": this.content
      }, res => {
        if(res.status == 'success') {
          this.appService.toast('评价成功','top','warning');
          this.events.publish('orderType', this.orderType.index);
          this.navCtrl.pop();
        }
      })
    }
  }
}
