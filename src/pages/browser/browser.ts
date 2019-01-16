/**
 * Created by DreamBoy on 2016/11/21.
 */
import { Component, ViewChild, style } from "@angular/core";
import { IonicPage, NavController, NavParams, Slides, Navbar } from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from "../../providers/localstorage";
import { specialServices } from "../../app/config";
import { window } from "ionic-native/node_modules/rxjs/operator/window";
// import { BrowserPopoverPage } from "./browser-popover";
@IonicPage()
@Component({ selector: "page-browser", templateUrl: "browser.html" })
export class BrowserPage {
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild("contentSlider") contentSlider: Slides;
  slides: any;
  title: string = "";
  city: any
  browser: {
    url: string;
    secUrl: any;
  };

  shareConfig: any = {
    isShow: false
  };
  kind: string = "";
  constructor(public navCtrl: NavController, private params: NavParams, private sanitizer: DomSanitizer, private local: StorageService) {
    let browsers = this
      .params
      .get("browser");
    if (browsers) {
      this.title = browsers.title;
      console.log(browsers.url);
      this.browser = {
        url: browsers.url,
        secUrl: this
          .sanitizer
          .bypassSecurityTrustResourceUrl(browsers.url)
      };
    } else { }
  }
  ionViewDidLoad() {
      // 消息处理...
    if (this.title == "个人中心") {
      document.getElementById("center").hidden = false;
    } else {
      document.getElementById("center").hidden = true;
    }
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    if (this.title == "个人中心" ||this.title == "用户注销") {
      this.city=this.local.read("city");
      this.navCtrl.setRoot("HomePage", { param: this.city });
    } else {
      this.navCtrl.pop();
    }
  }
  goCenter() {
    this
      .navCtrl
      .push("BrowserPage", {
        browser: { 
          title: "个人中心", 
          url: specialServices + "/LanHaiDedicatedService?TXCODE=SJ0014&Chnl_TpCd=H3&ccbParam=" + this.local.read("ccbParam")
        }
      });
  }
}