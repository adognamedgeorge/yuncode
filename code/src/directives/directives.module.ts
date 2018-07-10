import { NgModule } from '@angular/core';
import { GoTabsDirective } from './go-tabs/go-tabs';
import { BottomLineDirective } from './bottom-line/bottom-line';

@NgModule({
	declarations: [GoTabsDirective,
    BottomLineDirective],
	imports: [],
	exports: [GoTabsDirective,
    BottomLineDirective]
})
export class DirectivesModule {

}
