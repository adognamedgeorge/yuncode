import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleMyTaskPage } from './wholesale-my-task';
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    WholesaleMyTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleMyTaskPage),
    ComponentsModule
  ],
})
export class WholesaleMyTaskPageModule {}
