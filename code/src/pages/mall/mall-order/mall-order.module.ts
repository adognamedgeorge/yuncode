import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallOrderPage } from './mall-order';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    MallOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MallOrderPage),
    ComponentsModule
  ],
})
export class MallOrderPageModule {}
