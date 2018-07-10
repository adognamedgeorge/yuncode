import { Component,Input} from '@angular/core';
import {AppService} from "../../../app/app.service";

/**
 * Generated class for the MinishopShopInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-minishop-shop-info',
  templateUrl: 'minishop-shop-info.html',
})
export class MinishopShopInfoPage {
  @Input() shopInfo : object;
  @Input() saleItems : object;
  constructor(public appService: AppService) {
  }
}
