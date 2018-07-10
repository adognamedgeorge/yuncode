import { Component, Input, Renderer2, ElementRef } from '@angular/core';
import { FlyCartProvider } from '../../providers/fly-cart/fly-cart';
import {AppService} from "../../app/app.service";

/**
 * Generated class for the IonProductsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mall-products',
  templateUrl: 'mall-products.html'
})
export class MallProductsComponent {
  @Input() products: Array<any>;
  @Input() mallHome: false;
  text: string;

  constructor( private flyCartProvider: FlyCartProvider, private renderer : Renderer2,
               private el: ElementRef, public appService: AppService) {
    this.text = 'Hello World';
  }

  addCart(e, i) {
    this.flyCartProvider.fly(e, this.el, this.renderer);
  }

}
