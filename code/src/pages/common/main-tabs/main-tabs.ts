import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Tabs, Events } from 'ionic-angular';
import { HomePage } from "../home/home";
import { UserCenterPage } from "../user-center/user-center";
import { MallHomePage } from "../../mall/mall-home/mall-home";
import { WholesaleHomePage } from "../../wholesale/wholesale-home/wholesale-home";
import { MinishopHomePage } from "../../minishop/minishop-home/minishop-home";
import {StorageProvider} from "../../../providers/storage/storage";

@Component({
  selector: 'page-main-tabs',
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage {
  @ViewChild("mainTabs") mytab: Tabs;

  home: any = HomePage;
  userCenter: any = UserCenterPage;
  mallHome: any = MallHomePage;
  wholesaleHome: any = WholesaleHomePage;
  minishopHome: any = MinishopHomePage;
  isWholesaleUser = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: StorageProvider, public events: Events) {
    this.getInfo();
    events.subscribe('isWholesaleUser', (isWholesaleUser) => {
      this.isWholesaleUser = isWholesaleUser;
    });
  }
  goTabs(index) {
    this.mytab.select(index);
  }
  aaa = {
    goTabs(index) {
      this.mytab.select(index);
    }
  }
  getInfo () {
    this.storage.getDate('MS_AUTH_TOKEN',(res)=>{
      if (res) {
        //获取批发用户信息
        this.storage.getDate('wholesaleUser',(res)=> {
          if ( Object.keys(res).length > 0 ) {
            this.isWholesaleUser = true;
          }
          else {
            this.isWholesaleUser = false;
          }
        });
      }
      else {
        this.isWholesaleUser = false;
      }
    });
  }

}
