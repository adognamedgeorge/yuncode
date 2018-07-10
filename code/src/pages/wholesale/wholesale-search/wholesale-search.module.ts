import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleSearchPage } from './wholesale-search';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WholesaleSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleSearchPage),
    ComponentsModule
  ],
})
export class WholesaleProductListPageModule {}
