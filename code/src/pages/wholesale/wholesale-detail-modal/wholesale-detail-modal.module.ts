import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleDetailModalPage } from './wholesale-detail-modal';
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleDetailModalPage),
    PipesModule
  ],
})
export class WholesaleDetailModalPageModule {}
