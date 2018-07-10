import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopCouponModalPage } from './minishop-coupon-modal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopCouponModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopCouponModalPage),
    PipesModule
  ],
})
export class MinishopCouponModalPageModule {}
