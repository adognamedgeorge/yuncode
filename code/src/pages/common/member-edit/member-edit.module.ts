import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberEditPage } from './member-edit';

@NgModule({
  declarations: [
    MemberEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberEditPage),
  ],
})
export class MemberEditPageModule {}
