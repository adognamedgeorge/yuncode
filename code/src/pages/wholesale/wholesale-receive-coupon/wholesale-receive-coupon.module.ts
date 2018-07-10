import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleReceiveCouponPage } from './wholesale-receive-coupon';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleReceiveCouponPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleReceiveCouponPage),
    PipesModule
  ],
})
export class WholesaleReceiveCouponPageModule {}
