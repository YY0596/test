import { CodePush } from '@ionic-native/code-push';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CallNumber } from '@ionic-native/call-number';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Network } from '@ionic-native/network';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Toast } from '@ionic-native/toast';
import { Camera } from '@ionic-native/camera';
import { NativeService } from '../providers/NativeService';
import { GlobalData } from '../providers/GlobalData';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { StorageService } from '../providers/localstorage';
import { OrderComm } from '../providers/order-comm';
import { HttpService } from '../providers/http-service';
import { BMapService } from '../providers/bMapService';
import { CompOverlay, CenterOfGravityOverlay } from '../providers/CompOverlay';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { AppVersion } from '@ionic-native/app-version';
import { FileService } from '../providers/FileService';
import { Logger } from '../providers/Logger';
import { IonicStorageModule } from "@ionic/storage";
import { AppConfig } from './config';
import { FormsModule } from '@angular/forms';

import { AddPropertyInfoPage } from '../pages/buni/qualification-apply/apply-form/form-property-info/add-property-info';
import { AddHouseInfoPage } from '../pages/buni/qualification-apply/apply-form/form-house-info/add-house-info';
import { AddFamilyInfoPage } from '../pages/buni/qualification-apply/apply-form/form-family-info/add-family-info/add-family-info';
import { AddChangePropertyInfoPage } from '../pages/buni/qualification-change/change-form/change-property-info/add-change-property-info';
import { AddChangeHouseInfoPage } from '../pages/buni/qualification-change/change-form/change-house-info/add-change-house-info';
import { AddChangeFamilyInfoPage } from '../pages/buni/qualification-change/change-form/change-family-info/add-family-info/add-change-family-info';
import { AddReviewFamilyInfoPage } from '../pages/buni/annual-review/review-form/review-family-info/add-review-family-info/add-review-family-info';
import { AddReviewHouseInfoPage } from '../pages/buni/annual-review/review-form/review-house-info/add-review-house-info';
import { AddReviewPropertyInfoPage } from '../pages/buni/annual-review/review-form/review-property-info/add-review-property-info';

@NgModule({
  declarations: [
    MyApp,
    AddPropertyInfoPage,
    AddHouseInfoPage,
    AddFamilyInfoPage,

    AddChangePropertyInfoPage,
    AddChangeHouseInfoPage,
    AddChangeFamilyInfoPage,

    AddReviewFamilyInfoPage,
    AddReviewHouseInfoPage,
    AddReviewPropertyInfoPage,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      swipeBackEnabled: 'false',
      mode: 'ios',
      iconMode: 'ios',
    }), IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AddPropertyInfoPage,
    AddHouseInfoPage,
    AddFamilyInfoPage,

    AddChangePropertyInfoPage,
    AddChangeHouseInfoPage,
    AddChangeFamilyInfoPage,

    AddReviewFamilyInfoPage,
    AddReviewHouseInfoPage,
    AddReviewPropertyInfoPage,
  ],
  providers: [
    HttpModule,
    JsonpModule,
    Network,
    StatusBar,
    ImagePicker,
    InAppBrowser,
    Logger,
    Toast,
    Camera,
    NativeService,
    HttpService,
    CodePush,
    Diagnostic,
    BarcodeScanner,
    CallNumber,
    AppMinimize,
    StorageService,
    OrderComm,
    CompOverlay,
    CenterOfGravityOverlay,
    BMapService,
    AppVersion,
    FileTransfer,
    FileService,
    GlobalData,
    AppConfig,
    File,
    FileOpener,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
