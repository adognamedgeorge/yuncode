import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MallSearchPage } from './mall-search';
import {ComponentsModule} from "../../../components/components.module";

@NgModule({
  declarations: [
    MallSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MallSearchPage),
    ComponentsModule
  ],
})
export class MallSearchPageModule {}
