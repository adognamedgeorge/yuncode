import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopOrderPage } from './minishop-order';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    MinishopOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopOrderPage),
    ComponentsModule
  ],
})
export class MinishopOrderPageModule {}
