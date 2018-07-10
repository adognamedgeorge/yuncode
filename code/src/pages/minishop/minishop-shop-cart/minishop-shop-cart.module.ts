import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopShopCartPage } from './minishop-shop-cart';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopShopCartPage,
  ],
  imports: [
    IonicPageModule.forChild(MinishopShopCartPage),
    PipesModule
  ],
})
export class MinishopShopCartPageModule {}
