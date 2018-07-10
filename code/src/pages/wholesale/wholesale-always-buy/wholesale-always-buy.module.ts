import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleAlwaysBuyPage } from './wholesale-always-buy';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    WholesaleAlwaysBuyPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleAlwaysBuyPage),
    ComponentsModule
  ],
})
export class WholesaleAlwaysBuyPageModule {}
