import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserMarketingDetailPage } from './user-marketing-detail';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    UserMarketingDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(UserMarketingDetailPage),
    PipesModule
  ],
})
export class UserMarketingDetailPageModule {}
