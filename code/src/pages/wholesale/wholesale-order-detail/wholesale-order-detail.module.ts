import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleOrderDetailPage } from './wholesale-order-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleOrderDetailPage),
    PipesModule
  ],
})
export class WholesaleOrderDetailPageModule {}
