import { LoadingController, NavController, Platform, IonicPage, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OrderComm } from '../../providers/order-comm';
import { HttpService } from '../../providers/http-service';
import { Base64Util } from '../../providers/base64Util';
import { StorageService } from '../../providers/localstorage';
import { specialServices } from '../../app/config';
declare let cordova: any;
@IonicPage()
@Component({ selector: 'page-login', templateUrl: 'login.html' })
export class LoginPage {
  login_from: String;
  loginForm: FormGroup;
  city: any;
  public username: any = "";
  public password: any = "";
  public userInfo: any; //用户信息

  constructor(private nav: NavController, public navParams: NavParams, public platform: Platform, private formBuilder: FormBuilder, private local: StorageService, public loadingCtrl: LoadingController, private comm: OrderComm, public httpService: HttpService) {
    this.login_from = navParams.get("param");

    this.loginForm = formBuilder.group({
      username: [
        '', Validators.compose([
          Validators.minLength(4),
          Validators.maxLength(50),
          Validators.required
        ])
      ],
      password: [
        '', Validators.compose([
          Validators.required, Validators.minLength(4)
        ])
      ]
    })
    this.username = this.loginForm.controls['username'];
    this.password = this.loginForm.controls['password'];

  }
  //用户登录
  login(value) {
    if (this.username.value == "" || this.username.value == null) {
      this.comm.showSmallToast("用户名不能为空！");
      return;
    } else if (this.password.value == "" || this.password.value == null) {
      this.comm.showSmallToast("密码不能为空！");
      return;
    } else if (this.username.value.length < 4) {
      this.comm.showSmallToast("用户名不能少于4位！");
      return;
    } else if (this.password.value.length < 4) {
      this.comm.showSmallToast("密码不能少于4位！");
      return;
    }
    this
      .comm
      .showLoading("登录中,请稍候...");
    return new Promise((resolve, reject) => {
        let ele = "userName=" + Base64Util.encoder(this.username.value) + "&passWord=" + Base64Util.encoder(this.password.value);
        this
          .httpService
          .httpGet(5, "appLoginVerify.action?" + ele)
          .then(res => {
            this
              .comm
              .closeLoading();
            let success = res.success;
            let fail = res.fail;
            if (fail != undefined) {
              this
                .comm
                .showAlert(fail);
            }
            if (success != undefined) {
              this.saveUserInfoToLocalStorage(success);
              if (this.login_from == "jinduchaxun" && success.crdt_No != "") {
                this
                  .nav
                  .push("ProgressQueryPage");
              } else if (this.login_from == "jinduchaxun" && success.crdt_No == "") {
                this.loadingSuccess("请到个人中心进行实名认证！", 1000);
              } else if (this.login_from == "apply" && success.crdt_No == "") {
                this.loadingSuccess("请到个人中心进行实名认证！", 1000);
              } else if (this.login_from == "apply" && success.crdt_No != "") {
                this.nav.push("PrepareApplyPage", { name: success.cst_Nm, cardId: success.crdt_No ,city:this.local.read("city")});
              } else if (this.login_from == "userManager") {
                this.getCcbParam(success);
              } else {
                this.loadingSuccess("登录成功，欢迎回来！", 1000);
              }
            }
          })
          .catch(error => {
            this
              .comm
              .closeLoading();
            reject();
          });
    });
  }
  //获取CcbParam
  getCcbParam(success) {
    let ele = "&wwdlUser.usr_ID=" + success.usr_ID + "&platFlowNo=" + success.pLAT_FLOW_NO + "&wwdlUser.cst_Nm=" + success.cst_Nm + "&wwdlUser.crdt_No=" + success.crdt_No + "&wwdlUser.crdt_TpCd=" + success.crdt_TpCd + "&wwdlUser.mblPh_No=" + success.mblPh_No;
    return new Promise((resolve, reject) => {
        this
          .httpService
          .httpPost(5, "getAppCcbParam.action?", ele)
          .then(res => {
            this
              .local
              .write("ccbParam", res.success);
            this
              .nav
              .push("BrowserPage", {
                browser: {
                  title: "个人中心",
                  url: specialServices + "/LanHaiDedicatedService?TXCODE=SJ0014&Chnl_TpCd" +
                    "=H3&ccbParam=" + res.success
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

  saveUserInfoToLocalStorage(data: any) {
    this
      .local
      .write("userInfo", data);
  }

  //用于处理请求中body格式
  headleAjaxBodyParam(param) { 
    let bodyStr = [];
    for (let item in param) {
      bodyStr.push(item + '=' + param[item])
    }
    return bodyStr.join('&');
  }

  //注册
  gotoRegister() {
    this
      .nav
      .push("BrowserPage", {
        browser: {
          title: "注册",
          url: specialServices + "/B2CMainPlatV5?TXCODE=SJ0019&BRANCHID=530000000" +
            "&SERVLET_NAME=B2CMainPlatV5&CCB_IBSVersion=V6&PT_STYLE=10&Chnl_TpCd=H3"
        }
      });
  }
  //忘记密码
  gotoForgetPwd() {
    this
      .nav
      .push("BrowserPage", {
        browser: {
          title: "找回密码",
          url: specialServices + "/B2CMainPlatV5?TXCODE=SJ0031&BRANCHID=110000000" +
            "&SERVLET_NAME=B2CMainPlatV5&CCB_IBSVersion=V6&PT_STYLE=10&Chnl_TpCd=H3"
        }
      });
  }
  //登陆成功，返回主页
  loadingSuccess(content, duration) {
    this.city = this.local.read("city");
    let loading = this
      .loadingCtrl
      .create({ spinner: 'hide', content: content, duration: duration });
    loading.present();
    loading.onDidDismiss(() => {
      this
        .nav
        .setRoot("HomePage", { param: this.city });
    });
  }
}
