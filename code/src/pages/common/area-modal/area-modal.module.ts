import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreaModalPage } from './area-modal';

@NgModule({
  declarations: [
    AreaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AreaModalPage),
  ],
})
export class AreaModalPageModule {}
