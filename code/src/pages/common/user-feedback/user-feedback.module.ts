import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserFeedbackPage } from './user-feedback';

@NgModule({
  declarations: [
    UserFeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(UserFeedbackPage),
  ],
})
export class UserFeedbackPageModule {}
