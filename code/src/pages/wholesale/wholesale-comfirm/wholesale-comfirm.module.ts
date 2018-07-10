import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleComfirmPage } from './wholesale-comfirm';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesaleComfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleComfirmPage),
    PipesModule
  ],
})
export class WholesaleComfirmPageModule {}
