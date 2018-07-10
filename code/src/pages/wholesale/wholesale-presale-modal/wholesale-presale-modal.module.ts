import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesalePresaleModalPage } from './wholesale-presale-modal';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    WholesalePresaleModalPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesalePresaleModalPage),
    PipesModule

  ],
})
export class WholesalePresaleModalPageModule {}
