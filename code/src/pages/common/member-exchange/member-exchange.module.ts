import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberExchangePage } from './member-exchange';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MemberExchangePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberExchangePage),
    PipesModule
  ],
})
export class MemberExchangePageModule {}
