import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleSalesReturnModalPage } from './wholesale-sales-return-modal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleSalesReturnModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleSalesReturnModalPage),
    PipesModule
  ],
})
export class WholesaleSalesReturnModalPageModule {}
