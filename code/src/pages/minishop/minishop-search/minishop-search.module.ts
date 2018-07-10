import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopSearchPage } from './minishop-search';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopSearchPage),
    PipesModule
  ],
})
export class MinishopSearchPageModule {}
