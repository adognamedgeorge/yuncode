import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleCouponModalPage } from './wholesale-coupon-modal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleCouponModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleCouponModalPage),
    PipesModule
  ],
})
export class WholesaleCouponModalPageModule {}
