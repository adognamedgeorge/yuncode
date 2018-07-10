import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallDetailModalPage } from './mall-detail-modal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MallDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MallDetailModalPage),
    PipesModule
  ],
})
export class MallDetailModalPageModule {}
