import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallCartPage } from './mall-cart';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MallCartPage,
  ],
  imports: [
    IonicPageModule.forChild(MallCartPage),
    PipesModule
  ],
})
export class MallCartPageModule {}
