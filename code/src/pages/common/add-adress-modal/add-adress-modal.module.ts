import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAdressModalPage } from './add-adress-modal';

@NgModule({
  declarations: [
    AddAdressModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAdressModalPage),
  ],
})
export class AddAdressModalPageModule {}
