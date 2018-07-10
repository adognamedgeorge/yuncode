import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallConfirmPage } from './mall-confirm';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MallConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(MallConfirmPage),
    PipesModule
  ],
})
export class MallConfirmPageModule {}
