import { NativeService } from '../../providers/NativeService';
import { Component, ViewChild, EventEmitter } from "@angular/core";
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ModalController,
  Platform
} from 'ionic-angular';

import { AlertController, MenuController, Nav } from 'ionic-angular';
import { HttpService } from '../../providers/http-service';
import { StorageService } from "../../providers/localstorage";
import { OrderComm } from "../../providers/order-comm";
import { cityServices, MODULE_CONFIG_DEFAULT, specialServices, AppConfig, CITYCODEALL, MODULE_CONFIG_JDZ } from '../../app/config';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Base64Util } from '../../providers/base64Util';

declare let cordova: any;

@IonicPage()
@Component({ selector: "page-home", providers: [HttpService], templateUrl: "home.html" })
export class HomePage {
  cityChange = new EventEmitter();
  userInfo: any;
  sign: any;
  positionCity: any;
  iosNewVersion: any;
  iosBaseVersion: any;
  iosUpgradeUrl: any;
  iosTip: any;
  androidNewVersion: any;
  androidBaseVersion: any;
  androidUpgradeUrl: any;
  androidTip: any;
  result: Array<{
    "name": string,
    "citycode": string,
    "provincecode": string,
    "provicename": string
  }> = [];
  @ViewChild(Nav) nav: Nav;

  value: any;
  versionName: any;
  versionBuild: any;
  //定义rootPage 你也可以不设置使用menu.html rootPage: any = HelloIonicPage; 定义组件类型
  pages: Array<{
    title: string,
    component: any
  }>;
  modules: Array<any> = [];
  city: any;
  footeContent1: any;
  footeContent2: any;
  footeContent3: any;
  username: any;
  body: {
    txcode: string,
    wwdlUser: {
      usr_ID: string,
      cst_Nm: string,
      crdt_No: string,
      crdt_TpCd: string,
      mblPh_No: string
    }
    platFlowNo: string
  }
  constructor(public navCtrl: NavController, private iab: InAppBrowser, public nativeService: NativeService, public platform: Platform, private alertCtrl: AlertController, public loadingCtrl: LoadingController, public menuController: MenuController, private local: StorageService, private comm: OrderComm, public navParams: NavParams, private httpService: HttpService, private appVersion: AppVersion, public modalCtrl: ModalController, private appConfig: AppConfig) {
    if (this.platform.is("android")) {
      this
        .nativeService
        .statusBarStyle();
    }
    this.getCityModel();
    // 初始化模块
    this
      .getVersionNumber()
      .then(res => {
        this.versionName = res;
      });
    this
      .getVersionCode()
      .then(res => {
        this.versionBuild = res;
      });
  }

  ionViewDidLoad() {
    let address: any;
    if (this.platform.is("android")) {
      address = decodeURI(this.strSlice(window.location.href));
    } else {
      address = this
        .local
        .read("city");
    }
    // alert(decodeURI(address));

    if (address != "" && address != null && address != undefined) {
      this
        .choicePositionCity(address)
        .then(res => {
          let result: any = res;
          this
            .local
            .write("city", result.cityName);
          this
            .local
            .write("ip", result.cityIp);
          this
            .local
            .write("xpoint", result.xpoint);
          this
            .local
            .write("ypoint", result.ypoint);
          // alert(this   .local.read("ip"));
          let self = this;
          this
            .getCityModel()
            .then(res => {
              self.initFirstPage();
            });
        });
    } else {
      this.initFirstPage();
    }
    this.userInfo = this
      .local
      .read("userInfo");
    if (this.userInfo != null || this.userInfo != undefined) {
      this.queryUserInfo();
    }
    //检查更新 this.update();
  }
  //提取参数
  strSlice(str) {
    let stringToslice: string = str;
    if (stringToslice.indexOf("?") >= 0) {
      var s = stringToslice.split("?");
      var s1 = s[1].split("&")[0];
      var value = s1.split("=")[1];
      return value;
    } else {
      return "";
    }
  }
  //定位城市
  choicePositionCity(code) {
    let self = this;
    let ele = "page.currentPageNo=1&page.pageSize=1&cityCode.cityName=" + code;
    let url = cityServices + "/citycode/getAppUrlList.action?";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGetWithUrl(url, ele)
        .then(res => {
          if (res.code == 1 && res.count > 0) {
            resolve({ cityName: res.data[0].cityName, cityIp: res.data[0].appVistUrl, xpoint: res.data[0].xpoint, ypoint: res.data[0].ypoint });
          } else {
            resolve({
              cityName: "蓝海",
              cityIp: self
                .appConfig
                .getDebugUrl()
            });
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //初始化menu菜单选项
  initMenu(login, loginout, personnalCenter, userCancellation) {
    if (loginout == "none") {
      this.pages = [
        {
          title: login,
          component: "LoginPage"
        }, {
          title: personnalCenter,
          component: "userManager"
        }, {
          title: userCancellation,
          component: "userCancellation"
        }
      ];
    } else {
      this.pages = [
        {
          title: login,
          component: "LoginPage"
        }, {
          title: loginout,
          component: "logout"
        }, {
          title: personnalCenter,
          component: "userManager"
        }, {
          title: userCancellation,
          component: "userCancellation"
        }
      ];
    }

  }
  //初始化菜单
  initFirstPage() {
    //初始化menu菜单选项
    this.userInfo = this
      .local
      .read("userInfo");
    if (this.userInfo != null) {
      this.initMenu("您好,欢迎来到" + this.local.read("city") + "!", "退出登录", "个人中心", "用户注销");
    } else {
      this.initMenu("登录", "none", "个人中心", "用户注销");
    }
    if (this.local.read("city") == null || this.local.read("city") == undefined) {
      this.city = "蓝海";
      this.positionCity = "蓝海•公租";
      this
        .local
        .write("city", "蓝海");
      this
        .local
        .write("ip", this.appConfig.getDebugUrl());

      this.footeContent1 = "版权所有 中国建设银行版权所有";
      this.footeContent2 = "本APP“蓝海市”仅用于演示,不对应任何真实城市公共租赁住房服务";
      this.footeContent3 = "";
    } else {
      this.positionCity = this
        .local
        .read("city") + "•公租";
      this.city = this
        .local
        .read("city");
    }
    if (this.local.read("city") == "蓝海") {
      this.footeContent1 = '©版权所有 中国建设银行版权所有';
      this.footeContent2 = "本APP“蓝海市”仅用于演示,不对应任何真实城市公共租赁住房服务";
      this.footeContent3 = "";
    } else {
      this.footeContent1 = " ";
      this.footeContent2 = " ";
      this.footeContent3 = "";
    }

  }

  findByCityName(cityName) {
    this.result = [];
    for (let i = 0; i < CITYCODEALL.length; i++) {
      if (CITYCODEALL[i].item.length > 0) {
        let itemTemp = CITYCODEALL[i].item;
        for (let j = 0; j < itemTemp.length; j++) {
          // console.log("i = " + i.toString() + ", j = " + j.toString());
          // console.log(itemTemp[j].name.value);
          if (itemTemp[j].name.value.indexOf(cityName) > -1) {
            this.result.push({
              "name": itemTemp[j].name.value,
              "citycode": itemTemp[j].value.value,
              "provincecode": CITYCODEALL[i].value.value,
              "provicename": CITYCODEALL[i].name.value
            });
          }
        }
      }
    }
    return this.result;
  }
  /**
   * 打开模块
   * @param mod 模块参数
   */
  openModule(mod) {
    let tmpCity = this.local.read("city");
    // console.log("tmpCity = " + tmpCity);
    if (mod.disabled)
      return;
    if (mod.id == 'queryProgress') {
      this.gotoProgressQueryPage();
    } else if (mod.id == 'applyGuarantee') {
      this.gotoPrepareApply();
    } else if (mod.id == 'joyLife') {
      let res = this.findByCityName(tmpCity);
      if (res.length > 0) {
        let ele = res[0].name + ',' + res[0].citycode + ',' + res[0].provicename + ',' + res[0].provincecode;
        console.log("ele = " + ele);
        this.iab.create('http://m.ccb.com/cn/jump/mobileV3.html?func=life&cityCode=' + ele, '_blank', 'location=no,footer=yes,footercolor=#32000000,closebuttoncaption=✕     ,');
      } else {
        this
          .comm
          .showConfirm("CCB建融家园公租房", "您所在城市未找到相关内容，是否切换至广州市？", () => {
            this.iab.create('http://m.ccb.com/cn/jump/mobileV3.html?func=life&cityCode=广州市,440100,广东省,440000', '_blank', 'location=no,footer=yes,footercolor=#32000000,closebuttoncaption=✕     ,');
          });
      }
    } else if (mod.action == 'checkLogin') {
      this.validateLogin(mod);
    } else {
      this
        .navCtrl
        .push(mod.uri, { action: mod.action });
    }
  }

  // 校验是否登陆，登陆则直接进入，未登陆跳到登陆画面
  validateLogin(mod) {
    let userInfo: any = this.local.read("userInfo");
    if (userInfo) {
      if (userInfo.crdt_No) { //没有身份证号表示未实名认证
        let url = 'validateApplication.action';
        if (mod.id == 'businessApplication') { // 资格申请
          let body = 'ywlb=web233050&zjhm=' + userInfo.crdt_No;
          this.httpService.httpPost(8, url, body).then(response => {
            if (response.result == 'success') {
              this.navCtrl.push(mod.uri);
            } else {
              this.nativeService.alert(response.msg);
            }
          }).catch(err => {
            this.nativeService.alert('系统异常,未获取到数据');
          });
        } 

        // this.navCtrl.push(mod.uri);
      } else {
        this.comm.showAlert("请到个人中心进行实名认证！");
      }
    } else {
      this.navCtrl.push("LoginPage", { jumpUri: mod.uri });
    }
  }

  //选择城市
  choiceCity() {
    // this.navCtrl.push("ChoiceCityPage", { param: this.city }); 打开模态框进行输入

    let self = this;
    let ChoiceCityModal = this
      .modalCtrl
      .create("ChoiceProvincePage", {});
    ChoiceCityModal.onDidDismiss(data => {
      self
        .comm
        .showLoading("初始化中...");
      self
        .getCityModel()
        .then(res => {
          self.initFirstPage();
          self
            .comm
            .closeLoading();
        });
    });
    ChoiceCityModal.present();
  }
  //获取城市模块信息
  getCityModel() {
    let self = this;
    let url = "";
    if (this.local.read("ip") != null) {
      url = this
        .local
        .read("ip") + "/wwfb/getInvalidLmb.action?appFlag=app";
    } else {
      url = this
        .appConfig
        .getDebugUrl() + "/wwfb/getInvalidLmb.action?appFlag=app";
    }

    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGetWithUrl(url, "")
        .then(res => {
          if (res.code == 0) {
            if (this.local.read("city") == "景德镇") {
              self.modules = MODULE_CONFIG_JDZ;
            } else {
              self.modules = MODULE_CONFIG_DEFAULT;
            }
            if (this.local.read("city") == "泸州" || this.local.read("city") == "绵阳") {
              self.modules.forEach(element => {
                if (element.id == "serviceInfo") {
                  element.name = "信用披露";
                  element.action = "room1";
                }
              });
            } else {
              self.modules.forEach(element => {
                if (element.id == "serviceInfo") {
                  element.name = "服务信息";
                  element.action = "room";
                }
              });
            }
            self
              .modules
              .forEach(element => {
                element.disabled = false;
                element.image = element.image1;
              });
            let i = 0;
            for (; i < res.data.length; i++) {
              if (res.data[i].lmzt == 2) {
                let j = 0;
                for (; j < self.modules.length; j++) {
                  if (self.modules[j].id == res.data[i].lmbs) {
                    self.modules[j].disabled = true;
                    self.modules[j].image = self.modules[j].image2;
                  }
                }
              } else if (res.data[i].lmzt == 3) {
                self.modules = self
                  .modules
                  .filter(t => t.id != res.data[i].lmbs);
              }
            }
            resolve();
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("无法获取城市配置信息！");
          reject();
        });
    });
  }
  //提示框
  showAlert(msg) {
    let alert = this
      .alertCtrl
      .create({ title: "公共租赁住房平台", subTitle: msg, buttons: ["确认"] });
    alert.present();
  }

  loading(content, duration) {
    let loading = this
      .loadingCtrl
      .create({ spinner: "hide", content: content, duration: duration });
    loading.present();
  }
  //获取App版本号
  getVersionNumber(): Promise<string> {
    return new Promise((resolve) => {
      this
        .appVersion
        .getVersionNumber()
        .then((value: string) => {
          resolve(value);
        })
        .catch(err => {
          // this.comm.showAlert("获取版本号失败！");
        });
    });
  }
  //获取App技术版本号
  getVersionCode(): Promise<string> {
    return new Promise((resolve) => {
      this
        .appVersion
        .getVersionCode()
        .then((value: string) => {
          resolve(value);
        })
        .catch(err => {
          // this.comm.showAlert("获取版本号失败！");
        });
    });
  }

  //获取加密ccbParam
  getCcbParam() {
    let ele = "wwdlUser.usr_ID=" + this.userInfo.usr_ID + "&platFlowNo=" + this.userInfo.pLAT_FLOW_NO + "&wwdlUser.cst_Nm=" + this.userInfo.cst_Nm + "&wwdlUser.crdt_No=" + this.userInfo.crdt_No + "&wwdlUser.crdt_TpCd=" + this.userInfo.crdt_TpCd + "&wwdlUser.mblPh_No=" + this.userInfo.mblPh_No;
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(5, "getAppCcbParam.action?", ele)
        .then(res => {
          this
            .local
            .write("ccbParam", res.success);
          this
            .navCtrl
            .push("BrowserPage", {
              browser: {
                title: "个人中心",
                url: specialServices + "/LanHaiDedicatedService?TXCODE=SJ0014&Chnl_TpCd=H3&ccbParam=" + res.success
              }
            });
        })
        .catch(error => {
          this
            .comm
            .showAlert("个人中心无响应！");
          reject();
        });
    });
  }

  //进度查询
  gotoProgressQueryPage() {
    //判断登录状态，用户信息不为空时，跳到进度查询
    this.userInfo = this
      .local
      .read("userInfo");
    if (this.userInfo != null && this.userInfo.crdt_No != "") {
      this
        .navCtrl
        .push("ProgressQueryPage");
    } else if (this.userInfo != null && this.userInfo.crdt_No == "") {
      this.comm.showAlert("请到个人中心进行实名认证！");
      return;
    } else {
      this
        .navCtrl
        .push("LoginPage", { param: "jinduchaxun" });
    }
  }
  //预申请跳转
  gotoPrepareApply() {
    //判断登录状态，用户信息不为空时，跳到进度查询
    this.userInfo = this
      .local
      .read("userInfo");
    if (this.userInfo != null && this.userInfo.crdt_No != "") {
      this
        .navCtrl
        .push("PrepareApplyPage", { name: this.userInfo.cst_Nm, cardId: this.userInfo.crdt_No, city: this.local.read("city") });
    } else if (this.userInfo != null && this.userInfo.crdt_No == "") {
      this.comm.showAlert("请到个人中心进行实名认证！");
      return;
    } else {
      this
        .navCtrl
        .push("LoginPage", { param: "apply" });
    }
  }
  //进入文件上传下载测试页面
  gotoUploadTestPage() {
    this
      .nav
      .push("UploadFilePage");
  }
  //进入用户管理界面
  openMenu() {
    this
      .menuController
      .open();
  }
  
  /**
   * 打开监听
   */
  menuOpened() {
    //根据userinfo，判断是否Login状态
    this.userInfo = this
      .local
      .read("userInfo");
  }
  /**
   * 关闭监听
   */
  menuClosed() { }
  /**
   * 处理每个点击事件
   */
  openPage(page) {
    if (page.component == "logout") {
      //点击注销，清空本地用户信息，跳转登录界面
      this.userInfo = this
        .local
        .read("userInfo");
      if (this.userInfo != null) {
        this
          .comm
          .showConfirm("CCB建融家园公租房", "您确定要退出登录？", () => {
            this
              .local
              .remove("userInfo");
            this
              .local
              .remove("ccbParam");
            this.initMenu("登录", "none", "个人中心", "用户注销");
            this
              .navCtrl
              .push("LoginPage", { param: page.component });
          }, null);
      } else {
        this.initMenu("登录", "none", "个人中心", "用户注销");
        this
          .comm
          .showAlert("您还没有登录！");
        return;
      }
    } else if (page.component == "userManager") {
      this.userInfo = this
        .local
        .read("userInfo");
      if (this.userInfo != null) {
        this.getCcbParam();
      } else {
        // this   .comm   .showAlert("您还没有登录！");
        this
          .navCtrl
          .push("LoginPage", { param: "userManager" });
      }
    } else if (page.component == "userCancellation") {
      //用户注销用户注销
      this
        .comm
        .showConfirm("CCB建融家园公租房", "注销将删除用户，您确定要注销吗？", () => {
          this.initMenu("登录", "退出登录", "个人中心", "用户注销");
          this
            .navCtrl
            .push("BrowserPage", {
              browser: {
                title: "用户注销",
                url: specialServices + "/LanHaiDedicatedService?TXCODE=SJ0039&Chnl_TpCd=H3"
              }
            });
        }, null);

    } else {
      //设置当前显示组件
      this.userInfo = this
        .local
        .read("userInfo");
      if (this.userInfo != null) {
        // this
        //   .comm
        //   .showAlert("您已经登录！");
      } else {
        this
          .navCtrl
          .push(page.component, { param: page.component });
      }
    }
    this
      .menuController
      .close();
  }
  //查询用户信息
  queryUserInfo() {
    let ele = "usr_ID=" + this.userInfo.usr_ID;
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(5, "appGetUserInfo.action", ele)
        .then(res => {
          let success = res.success;
          let fail = res.fail;
          this.saveUserInfoToLocalStorage(success);
          if (fail != undefined) {
            this
              .local
              .remove("userInfo");
            this.initMenu("登录", "退出登录", "个人中心", "用户注销");

          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //
  saveUserInfoToLocalStorage(data: any) {
    this
      .local
      .write("userInfo", data);
  }

  lick(){
    alert(1)
  }
  //版本更新
  update() {
    let ele = "";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(6, "appGetSjbbgl.action", ele)
        .then(res => {
          if (res.code == 0) {
            this.iosNewVersion = res.data.iosNewVersion
            //ios技术版本号
            this.iosBaseVersion = res.data.iosBaseVersion
            //ios更新地址
            this.iosUpgradeUrl = res.data.iosUpgradeUrl
            //ios提示信息
            this.iosTip = res.data.iosTip
            this.androidNewVersion = res.data.androidNewVersion
            //android技术版本号
            this.androidBaseVersion = res.data.androidBaseVersion
            //android更新地址
            this.androidUpgradeUrl = res.data.androidUpgradeUrl
            //android提示信息
            this.androidTip = res.data.androidTip
            if (this.platform.is("android")) {
              if (this.androidBaseVersion != this.versionBuild) {
                this
                  .comm
                  .showConfirm("CCB建融家园公租房", this.androidTip, () => {
                    window.location.href = this.androidUpgradeUrl;
                  }, null);
              }
            } else {
              if (this.iosBaseVersion != this.versionBuild) {
                this
                  .comm
                  .showConfirm("CCB建融家园公租房", this.iosTip, () => {
                    window.location.href = this.iosUpgradeUrl;
                  }, null);
              }
            }
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
}
