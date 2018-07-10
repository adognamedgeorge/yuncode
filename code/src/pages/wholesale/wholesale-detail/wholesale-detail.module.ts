import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleDetailPage } from './wholesale-detail';
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleDetailPage),
    PipesModule
  ],
})
export class WholesaleDetailPageModule {}
