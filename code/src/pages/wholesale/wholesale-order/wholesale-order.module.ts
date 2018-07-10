import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleOrderPage } from './wholesale-order';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WholesaleOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleOrderPage),
    ComponentsModule
  ],
})
export class WholesaleOrderPageModule {}
