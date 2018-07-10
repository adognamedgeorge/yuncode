import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleBalanceManagePage } from './wholesale-balance-manage';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleBalanceManagePage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleBalanceManagePage),
    PipesModule
  ],
})
export class WholesaleBalanceManagePageModule {}
