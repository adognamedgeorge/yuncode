import {Component, Input} from '@angular/core';
import {AppService} from "../../app/app.service";
import {NavController} from "ionic-angular";

/**
 * Generated class for the CartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'cart',
  templateUrl: 'cart.html'
})
export class CartComponent {
  @Input() comeFrom: any;
  @Input() showTrue: any;
  @Input() cartInfo: any;
  @Input() cartNum: any;
  constructor(public appService: AppService, public navCtrl: NavController) {
  }

  showCart(comeFrom) {
    if (comeFrom == 'whosesale') {
      this.navCtrl.push('WholesaleCartPage')
    }
    else if (comeFrom == 'mall') {
      this.navCtrl.push('MallCartPage')
    }
  }
}
