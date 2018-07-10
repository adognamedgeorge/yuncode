import { NgModule } from '@angular/core';
import { PricePipe } from './price/price';
import { LimitToPipe } from './limit-to/limit-to';
@NgModule({
	declarations: [PricePipe,
    LimitToPipe],
	imports: [],
	exports: [PricePipe,
    LimitToPipe]
})
export class PipesModule {}
