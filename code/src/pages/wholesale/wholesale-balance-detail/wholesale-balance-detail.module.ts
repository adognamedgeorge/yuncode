import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleBalanceDetailPage } from './wholesale-balance-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleBalanceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleBalanceDetailPage),
    PipesModule
  ],
})
export class WholesaleBalanceDetailPageModule {}
