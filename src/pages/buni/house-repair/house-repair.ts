import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { StorageService } from '../../../providers/localstorage';
import { HttpService } from '../../../providers/http-service';
import { NativeService } from '../../../providers/NativeService';
import { OrderComm } from '../../../providers/order-comm';

/**
 * Generated class for the HouseRepairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-repair',
  templateUrl: 'house-repair.html',
})
export class HouseRepairPage {
  repairInfo: RepairInfo = new RepairInfo();
  repairItem: string;
  phone: string;
  hiddenApplyRepair: boolean = true;
  hiddenRepairRecord: boolean = false;
  hiddenApplyError: boolean = false;
  hiddenRepairInfoError: boolean = false;
  response: any;
  hj_dict = []

  idList = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: StorageService,
    private httpService: HttpService,
    private nativeService: NativeService,
    private comm: OrderComm,
    private alertCtrl: AlertController) {
    this.response = this.navParams.get('response');
    this.repairInfo = this.response.pfxx;
    for (let k = 0; k < this.response.wxxx_hjxx.length; k++) {
      let id = {
        barId: 'barid' + k,
        lineId: 'lineid' + k,
        no: this.response.wxxx_hjxx[k].wxxx.wxbh
      }
      this.idList.push(id);
    }
  }

  ionViewDidLoad() {
    this.applyRepair();
  }

  applyRepair() {
    let status = this.navParams.get('status');

    if (status == 'no-repair') {
      this.repairInfo = this.response.pfxx;
      this.hiddenApplyError = true;
      this.hiddenRepairInfoError = false;
    } else if (status == 'has-repair') {
      this.hiddenApplyError = false;
      this.hiddenRepairInfoError = true;
      let hj_dict = this.response.hj_dict.split(';')
      // 判断是否有维修编码待审核
      if (this.response.hasOwnProperty('curr_wxbh') && this.response.curr_wxbh == 'no') {
        this.hiddenApplyError = true;
      }
      //提交维修申请;受理维修申请;准备配件;维修中;维修完成
      for (let index = 0; index < this.response.wxxx_hjxx.length; index++) {
        let hjxx = this.response.wxxx_hjxx[index].hjxx;
        document.getElementById(this.idList[index].barId).setAttribute("style", "");
        let currentNodeBeforeFlag = true;
        let style = document.createElement("style");
        style.type = "text/css";
        style.style.marginBottom = "120px";
        for (let i = 0; i < hj_dict.length; i++) {
          let content = hj_dict[i];
          let precent = parseInt(100 / (hj_dict.length) * (i + 1) + "") + "%";

          let css = ".node" + i + ":after{content:'" + content + "';position:absolute;top:30px;width:10px;z-index:0;color:black;font-size:14px;margin-left:4px;line-height: 1.2}";
          let createDiv = document.createElement("span");
          createDiv.className = "nodeCircle node" + i;
          createDiv.id = this.idList[index].barId + i.toString();
          if (i < hjxx.length) {
            createDiv.onclick = () => {
              for (let j = 0; j < hjxx.length; j++) {
                let sp = document.getElementById(this.idList[index].barId + j.toString());
                sp.style.backgroundColor = 'green'
              }
              createDiv.style.backgroundColor = '#7CFC00';
              this.open(hjxx[i]);
            };
          }
          createDiv.style.left = precent;
          if (!currentNodeBeforeFlag) {
            createDiv.style.background = "#ccc";
          }
          if (hjxx[hjxx.length - 1].hjmc == hj_dict[i]) {
            let obj = document.getElementById(this.idList[index].lineId);
            obj.style.cssText = "width:" + precent;
            currentNodeBeforeFlag = false;
          }
          document.getElementById(this.idList[index].barId).appendChild(createDiv);
          style.appendChild(document.createTextNode(css));
        }
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(style);

      }
    }
  }

  saveApply() {
    if (!this.phone) {
      this.comm.showSmallToast('请填写联系电话！');
      return;
    }
    if (!this.repairItem) {
      this.comm.showSmallToast('请填写维修项目！');
      return;
    }
    this.comm.showConfirm("CCB建融家园公租房","确定提交？", () => {
      this.comm.showLoading('保存中...');
      let url = 'applyFwwx.action?random=0.5829094459458546';
      let body = 'fyid=' + this.repairInfo.fyid + '&zh=' + this.repairInfo.zh + '&dy=' + this.repairInfo.dy + '&fh='
        + this.repairInfo.fh + '&xqmc=' + this.repairInfo.xqmc + '&fwzl=' + this.repairInfo.fwzl + '&xm='
        + this.repairInfo.xm + '&lxdh=' + this.phone + '&wxxm=' + this.repairItem;
      this.httpService.httpPost(14, url, body).then(response => {
        if (response.save == 'success') {
          this.nativeService.showToast('提交成功');
          this.navCtrl.pop();
        }
        this.comm.closeLoading();
      }).catch(err => {
        this.comm.closeLoading();
        this.nativeService.alert(err);
      });
    })
  }

  changePage(flag) {
    if (flag == 1) { //维修记录
      this.hiddenApplyRepair = true;
      this.hiddenRepairRecord = false;
    } else { // 申请维修
      this.hiddenRepairRecord = true;
      this.hiddenApplyRepair = false;
    }
  }

  open(data) {
    let alert = this.alertCtrl.create({
      title: data.hjmc + '-' + data.wxbh,
      // subTitle: 'text2',
      message: '<html>' +
        '<p>受理单位 ：' + data.sldw + '</p>' +
        '<p>受理部门 ：' + data.slbm + '</p>' +
        '<p>受理人员 ：' + data.slry + '</p>' +
        '<p>受理时间 ：' + data.slry + '</p>' +
        '<p>受理意见 ：' + data.slyj + '</p></html>',
      buttons: ['确认']
    });
    alert.present();
  }

  openRepairInfo(no) {
    let list = this.response.wxxx_hjxx.filter((x) => { return x.wxxx.wxbh == no })
    let bxdh = list[0].wxxx.bxdh; //报修电话
    let bxnr = list[0].wxxx.bxnr; //报修内容
    let bxsj = list[0].wxxx.bxsj; //保修时间
    let location = this.response.pfxx.fwzl + '' + this.response.pfxx.zh + '栋' + this.response.pfxx.dy + '单元' + this.response.pfxx.fh + '室';

    let alert = this.alertCtrl.create({
      title: no,
      // subTitle: 'text2',
      message: '<html>' +
        '<div>房屋地址：' + location + '</div>' +
        '<div>申请时间：' + bxsj + '</div>' +
        '<div>报修电话：' + bxdh + '</div>' +
        '<div>维修内容：' + bxnr + '</div></html>',
      buttons: ['确认']
    });
    alert.present();
  }
}

export class RepairInfo {
  dy: string;
  fh: string;
  fwzl: string;
  fycode: number;
  fyid: number;
  rzrq: string;
  sqbid: number;
  xm: string;
  xqmc: string;
  zgzh: string;
  zh: string;
  zjhm: string;
  constructor() {
    this.fwzl = '';
    this.xm = '';
    this.zjhm = '';
    this.rzrq = '';
  }
}