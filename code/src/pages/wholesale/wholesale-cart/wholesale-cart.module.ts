import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleCartPage } from './wholesale-cart';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleCartPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleCartPage),
    PipesModule
  ],
})
export class WholesaleCartPageModule {}
