import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopConfirmPage } from './minishop-confirm';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopConfirmPage),
    PipesModule
  ],
})
export class MinishopConfirmPageModule {}
