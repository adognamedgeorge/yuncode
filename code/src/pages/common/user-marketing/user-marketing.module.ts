import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMarketingPage } from './user-marketing';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    UserMarketingPage,
  ],
  imports: [
    IonicPageModule.forChild(UserMarketingPage),
    PipesModule
  ],
})
export class UserMarketingPageModule {}
