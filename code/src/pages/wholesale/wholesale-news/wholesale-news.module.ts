import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WholesaleNewsPage } from './wholesale-news';

@NgModule({
  declarations: [
    WholesaleNewsPage,
  ],
  imports: [
    IonicPageModule.forChild(WholesaleNewsPage),
  ],
})
export class WholesaleNewsPageModule {}
