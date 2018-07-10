import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopOrderDetailPage } from './minishop-order-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopOrderDetailPage),
    PipesModule
  ],
})
export class MinishopOrderDetailPageModule {}
