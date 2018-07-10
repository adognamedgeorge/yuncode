import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallOrderDetailPage } from './mall-order-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MallOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MallOrderDetailPage),
    PipesModule
  ],
})
export class MallOrderDetailPageModule {}
