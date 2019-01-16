import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Navbar } from 'ionic-angular';
import { StorageService } from '../../../providers/localstorage';
import { HttpService } from '../../../providers/http-service';
import { NativeService } from '../../../providers/NativeService';
import { OrderComm } from '../../../providers/order-comm';
import { RepairInfo } from '../house-repair/house-repair';

/**
 * Generated class for the RepairEvaluatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repair-evaluate',
  templateUrl: 'repair-evaluate.html',
})
export class RepairEvaluatePage {
  repairInfo: RepairInfo = new RepairInfo();
  phone: string; // 电话
  repairItem: string; // 维修项目
  evaluateList: Array<any> = []; // 满意度列表
  evaluate: string; // 满意度
  standbyPhone: string = ''; // 备用电话
  reason: string = ''; // 不满意原因
  hiddenReason: boolean = true;
  list: Array<any>;
  response: any;
  noList: Array<string>;
  no: string;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    private nativeService: NativeService,
    private comm: OrderComm) {
  }

  ionViewDidLoad() {
    this.response = this.navParams.get('response');
    this.repairInfo = this.response.pfxx;
    let evaList = this.response.myd_dict.split(';')
    evaList.forEach(element => {
      this.evaluateList.push({
        key: element.charAt(element.length - 1),
        value: element.substr(0, element.length - 1)
      })
    });
    this.noList = this.response.myddc_wxbh.split(';');
    this.no = this.noList[0];
    this.changeItemNo(this.no);// 选择不同的维修编号改变信息
  }

  changeItemNo(no) {
    this.list = this.response.wxxx_hjxx.filter((x) => { return x.wxxx.wxbh == no })
    this.phone = this.list[0].wxxx.bxdh;
    this.repairItem = this.list[0].wxxx.bxnr;
  }

  save() {
    if (!this.evaluate) {
      this.comm.showSmallToast('请选择满意度！');
      return;
    }
    this.comm.showConfirm("CCB建融家园公租房","确定提交？", () => {
      this.comm.showLoading('保存中...');
      let url = 'saveMyddc.action?random=0.7358810031489575';
      let body = 'id=' + this.list[0].wxxx.id + '&wxbh=' + this.list[0].wxxx.wxbh + '&lxdh=' + this.phone + '&myd='
        + this.evaluate + '&reason=' + this.reason + '&bywxdh=' + this.standbyPhone;
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

  change(value) {
    if (value == '2') {
      this.hiddenReason = true;
    } else {
      this.hiddenReason = false;
    }
  }
}
