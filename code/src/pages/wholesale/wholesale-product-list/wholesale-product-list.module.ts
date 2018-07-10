import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleProductListPage } from './wholesale-product-list';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WholesaleProductListPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleProductListPage),
    ComponentsModule
  ],
})
export class WholesaleProductListPageModule {}
