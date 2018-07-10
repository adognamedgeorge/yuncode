import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleIntegralManagePage } from './wholesale-integral-manage';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleIntegralManagePage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleIntegralManagePage),
    PipesModule
  ],
})
export class WholesaleIntegralManagePageModule {}
