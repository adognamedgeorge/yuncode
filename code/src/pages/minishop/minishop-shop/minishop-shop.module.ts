import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinishopShopPage } from './minishop-shop';
import { ComponentsModule } from '../../../components/components.module';
import { MinishopShopInfoPage } from '../minishop-shop-info/minishop-shop-info';
import { MinishopShopRatePage } from '../minishop-shop-rate/minishop-shop-rate';
import { MinishopShopListPage } from '../minishop-shop-list/minishop-shop-list';
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    MinishopShopPage,
    MinishopShopInfoPage,
    MinishopShopRatePage,
    MinishopShopListPage
  ],
  imports: [
    IonicPageModule.forChild(MinishopShopPage),ComponentsModule,
    PipesModule,
    ComponentsModule
  ],
})
export class MinishopShopPageModule {}
