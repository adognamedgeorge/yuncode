import {Directive, Input, HostListener} from '@angular/core';
import {MainTabsPage} from "../../pages/common/main-tabs/main-tabs";
import {AppService} from "../../app/app.service";
import {NavController} from "ionic-angular";

/**
 * Generated class for the MyDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[goTabs]' // Attribute selector
})
export class GoTabsDirective {
  @Input('goTabs')
  tablink;
  isWholesaleUser = false;
  isLogin = false;
  constructor(public MainTabsPage: MainTabsPage,
              public appService: AppService, public navCtrl: NavController) {
  }
  @HostListener('click')
  onClick() {
    if ( this.tablink['type'] == 'MinishopHomePage' ) {
        this.MainTabsPage.goTabs(1);
      }
      else if ( this.tablink['type']  == 'WholesaleHomePage' ) {
      if ( this.tablink['isWhosaleUser'] && this.tablink['isLoad'] ) {
         this.MainTabsPage.goTabs(2);
       }
       else if ( !this.tablink['isWhosaleUser'] && this.tablink['isLoad'] ){
         this.appService.toast('非批发用户','top','warning');
       }
       else if (!this.tablink['isLoad']) {
         this.navCtrl.push('LoginPage');
       }
      }
      else if ( this.tablink['type']  == 'MallHomePage' ) {
        this.MainTabsPage.goTabs(3);
      }
  }

}
