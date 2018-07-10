import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from "@ionic-native/network";
import { HotCodePush } from "@ionic-native/hot-code-push";
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import{ AppService } from "./app.service";
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { PipesModule} from "../pipes/pipes.module";
import { DatePipe } from "@angular/common";
import { MyApp } from './app.component';
import { LaunchScreenPage } from "../pages/common/launch-screen/launch-screen";
import { OfflinePage } from "../pages/common/offline/offline";
import { MainTabsPage } from "../pages/common/main-tabs/main-tabs";
import { HomePage } from "../pages/common/home/home";
import { UserCenterPage } from "../pages/common/user-center/user-center";
import { MallHomePage } from "../pages/mall/mall-home/mall-home";
import { WholesaleHomePage } from "../pages/wholesale/wholesale-home/wholesale-home";
import { MinishopHomePage } from "../pages/minishop/minishop-home/minishop-home";
import { IonicStorageModule } from "@ionic/storage";
import { StorageProvider } from '../providers/storage/storage';
import { FlyCartProvider } from '../providers/fly-cart/fly-cart';
import { GeolocationProvider } from '../providers/geolocation/geolocation';
import { WholesaleInfoProvider } from '../providers/wholesale-info/wholesale-info';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Camera } from '@ionic-native/camera';
import { File} from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Keyboard } from "@ionic-native/keyboard";

@NgModule({
  declarations: [
    MyApp,
    LaunchScreenPage,
    OfflinePage,
    MainTabsPage,
    HomePage,
    UserCenterPage,
    MallHomePage,
    WholesaleHomePage,
    MinishopHomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "",
      swipeBackEnabled: true,
      tabsHideOnSubPages:'true',//隐藏全部子页面tabs
    }),
    HttpClientModule,
    HttpClientJsonpModule,
    ComponentsModule,
    DirectivesModule,
    IonicStorageModule.forRoot(),
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LaunchScreenPage,
    OfflinePage,
    MainTabsPage,
    HomePage,
    UserCenterPage,
    MallHomePage,
    WholesaleHomePage,
    MinishopHomePage,

  ],
  providers: [
    AppService,
    StatusBar,
    SplashScreen,
    Network,
    HotCodePush,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StorageProvider,
    FlyCartProvider,
    GeolocationProvider,
    WholesaleInfoProvider,
    DatePipe,
    QRScanner,
    Camera,
    File,
    FileTransfer,
    Keyboard
  ]
})
export class AppModule {}
