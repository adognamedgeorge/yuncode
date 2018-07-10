import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberExchangeDetailPage } from './member-exchange-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MemberExchangeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberExchangeDetailPage),
    PipesModule
  ],
})
export class MemberExchangeDetailPageModule {}
