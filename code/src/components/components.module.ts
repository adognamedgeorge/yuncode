import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { DirectivesModule } from '../directives/directives.module';
import { MallProductsComponent } from './mall-products/mall-products';
import { PifaProductsComponent } from './pifa-products/pifa-products';
import { SearchHeaderComponent } from './search-header/search-header';
import { IonCategoriesComponent } from './ion-categories/ion-categories';
import { OrderListModelComponent } from './order-list-model/order-list-model';
// import {PricePipe} from "../pipes/price/price";
import {PipesModule} from "../pipes/pipes.module";
import { MiniShopListComponent } from './mini-shop-list/mini-shop-list';
import { CartComponent } from './cart/cart';

@NgModule({
	declarations: [MallProductsComponent,
    PifaProductsComponent,
    SearchHeaderComponent,
    IonCategoriesComponent,
    OrderListModelComponent,
    MiniShopListComponent,
    CartComponent,
    // PricePipe
    // PipesModule
  ],
	// imports: [BrowserModule],
	exports: [MallProductsComponent,
    PifaProductsComponent,
    SearchHeaderComponent,
    IonCategoriesComponent,
    OrderListModelComponent,
    MiniShopListComponent,
    CartComponent,
  ],
	imports: [
		IonicModule,
    DirectivesModule,
    PipesModule
	]

})
export class ComponentsModule {}
