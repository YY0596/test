import { Component, Injector, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { StorageService } from '../../providers/localstorage';
import { HttpService } from '../../providers/http-service';
import { OrderComm } from '../../providers/order-comm';
import { DHCPage } from '../../components/index';

/**
 * Generated class for the ProgressQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-progress-query',
  templateUrl: 'progress-query.html',
})
export class ProgressQueryPage {
  @ViewChild(Navbar) navBar: Navbar;
  private ywlb: string = "";
  private spjd: string = "";
  private slbh: string = "";
  private sqsj: string = "";
  private sqr: string = "";
  userInfo: any;
  hjmcArr: any;
  city: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private local: StorageService, private _inject: Injector, private comm: OrderComm, public httpService : HttpService) {
    
  }

  ionViewDidLoad() {
    this.userInfo = this.local.read("userInfo");
    //110101198001010010
    if (this.userInfo.crdt_No != null) {
      let ele = "sfzh=" + this.userInfo.crdt_No + "&random=" + Math.random();
      this.getProgressQueryInfo(ele);
    } else {
      this.comm.showAlert("没有查到身份证号！");
      return;
    }
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.city = this.local.read("city");
    this.userInfo = this.local.read("userInfo");
    if (this.userInfo != null) {
      this.navCtrl.setRoot("HomePage", { param: this.city });
    } else {
      this.navCtrl.pop();
    }
  }
  //获取进度查询
  getProgressQueryInfo(ele) {
    return new Promise((resolve, reject) => {
      this.httpService
        .httpPost(2, "gzfSpjdAppAndWz.action?" + ele, null)
        .then(res => {
          var process = document.getElementById("showProcess");
          if (res.code == 1) {
            process.setAttribute("style", "font-size:18px;color:#0168B7;");
            document.getElementById("shenhezhuangtai").setAttribute("style", "color:#000000;");
            document.getElementById("progressBar").setAttribute("style", "");
            document.getElementById("progressList").setAttribute("style", "");
            document.getElementById("record").setAttribute("style", "");
            process.innerHTML = "您的申请审核进度：";
            var style = document.createElement("style");
            style.type = "text/css";
            this.userInfo = this.local.read("userInfo");
            this.ywlb = res.ywlb;
            this.spjd = res.spjd;
            this.slbh = "申请编号：" + res.sqbbh;
            this.sqsj = "申请日期：" + res.sqsj;
            this.sqr = "申请人：" + this.userInfo.usr_Name;
            this.hjmcArr = res.hjmc;
            var hjmc = this.hjmcArr.split(";");
            var currentNodeBeforeFlag = true;
            for (var i = 0; i < hjmc.length; i++) {
              var content = hjmc[i];
              var precent = parseInt(100 / (hjmc.length) * (i + 1) + "") + "%";

              var css = ".node" + i + ":after{content:'" + content + "';position:absolute;top:30px;width:10px;z-index:0;color:black;font-size:14px;margin-left:4px;}";
              var createDiv = document.createElement("span");
              createDiv.className = "nodeCircle node" + i;
              createDiv.style.left = precent;
              if (!currentNodeBeforeFlag) {
                createDiv.style.background = "#ccc";
              }
              if (res.spjd == hjmc[i]) {
                var obj = document.getElementById("progress-line");
                obj.style.cssText = "width:" + precent;
                currentNodeBeforeFlag = false;
              } else if (res.spjd == "受理") {
                var obj = document.getElementById("progress-line");
                var precent = 6 + "%";
                obj.style.cssText = "width:" + precent;
                createDiv.style.background = "#ccc";
                currentNodeBeforeFlag = false;
              }
              document.getElementById('progressBar').appendChild(createDiv);
              try {
                style.appendChild(document.createTextNode(css));
              } catch (ex) {

              }
            }
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
          } else {
            document.getElementById("record").setAttribute("style", "font-size:18px;color:#0168B7;");
            document.getElementById("record").innerHTML = "我的申请记录：(暂无记录)";
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("未查到进度!");
          reject();
        });
    });
  }

}
