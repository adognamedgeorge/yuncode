import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleBalanceConvertPage } from './wholesale-balance-convert';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleBalanceConvertPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleBalanceConvertPage),
    PipesModule
  ],
})
export class WholesaleBalanceConvertPageModule {}
