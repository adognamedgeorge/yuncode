import {Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import { MainTabsPage } from "../../pages/common/main-tabs/main-tabs";
import {StorageProvider} from "../../providers/storage/storage";
import {AppService} from "../../app/app.service";
/**
 * Generated class for the IonCategoriesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ion-categories',
  templateUrl: 'ion-categories.html'
})
export class IonCategoriesComponent {
  @Input() categories: Array<any>;
  @Input() isWholesaleUser: boolean;
  @Input() isLoad: boolean;

  constructor(public navCtrl: NavController,
              public MainTabsPage: MainTabsPage, public storage: StorageProvider,
              public appService: AppService) {
    // this.text = 'Hello World';
  }
  go (link, id?) {
    if ( link == 'MinishopHomePage' ){
      this.MainTabsPage.goTabs(1);
    }
    else if ( link == 'WholesaleHomePage' ) {
      if ( this.isWholesaleUser && this.isLoad ) {
        this.MainTabsPage.goTabs(2);
      }
      else if ( !this.isWholesaleUser && this.isLoad ){
        this.appService.toast('非批发用户','top','warning');
      }
      else if ( !this.isLoad ) {
        this.navCtrl.push('LoginPage');
      }
    }
    else if ( link == 'MallHomePage' ) {
      this.MainTabsPage.goTabs(3);
    }
    else {
      if ( link == 'MemberCenterPage' && !this.isLoad) {
        this.navCtrl.push('LoginPage');
        return false;
      }
      else if ( link == 'MallSearchPage' ) {
        this.navCtrl.push(link,{'id': id});
        return false;
      }
      else {
        this.navCtrl.push(link);
      }
    }
  }
}
