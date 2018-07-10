import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallDetailPage } from './mall-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MallDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MallDetailPage),
    PipesModule
  ],
})
export class MallDetailPageModule {}
