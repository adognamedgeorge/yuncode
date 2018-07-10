import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoldDetailPage } from './gold-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    GoldDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GoldDetailPage),
    PipesModule
  ],
})
export class GoldDetailPageModule {}
