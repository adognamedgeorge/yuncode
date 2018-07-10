import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberExchangeConfirmPage } from './member-exchange-confirm';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MemberExchangeConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberExchangeConfirmPage),
    PipesModule
  ],
})
export class MemberExchangeConfirmPageModule {}
