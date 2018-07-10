import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAllCouponPage } from './user-all-coupon';

@NgModule({
  declarations: [
    UserAllCouponPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAllCouponPage),
  ],
})
export class UserAllCouponPageModule {}
