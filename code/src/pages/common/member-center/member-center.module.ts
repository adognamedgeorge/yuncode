import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberCenterPage } from './member-center';

@NgModule({
  declarations: [
    MemberCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberCenterPage),
  ],
})
export class MemberCenterPageModule {}
