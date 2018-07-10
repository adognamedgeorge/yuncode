import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleRecommendPage } from './wholesale-recommend';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WholesaleRecommendPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleRecommendPage),
    ComponentsModule
  ],
})
export class WholesaleRecommendPageModule {}
