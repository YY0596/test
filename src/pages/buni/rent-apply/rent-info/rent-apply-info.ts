import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams } from 'ionic-angular';
import { StorageService } from '../../../../providers/localstorage';
import { HttpService } from '../../../../providers/http-service';
import { OrderComm } from '../../../../providers/order-comm';
import { NativeService } from '../../../../providers/NativeService';

/**
 * 配租意向登记 
 */
@IonicPage()
@Component({
  selector: 'page-rent-apply-info',
  templateUrl: 'rent-apply-info.html',
})
export class RentApplyInfoPage {

  rentProposerInfo = new RentProposerInfo(); // 申请人与配偶信息
  intentionItem: Array<any> = []; // 意向项目
  childrenList: Array<any>; // 子女列表
  selectedItem: string; // 选择的意向项目
  remark: string = ''; //备注
  selectedBatch: string; // 选择的批次 0,1,2
  batch: Array<any>;  // 批次初始值
  showBatch: any; // 显示的批次
  promptInfo: string; // 配租意向登记提示信息
  hiddenInfo: boolean = true;  // 是否隐藏提示信息
  @ViewChild(Navbar) navBar: Navbar;
  constructor(private navCtrl: NavController,
    private httpService: HttpService,
    private comm: OrderComm,
    private nativeService: NativeService,
    private storage: StorageService,
    private navParams: NavParams
  ) {
    this.batch = [
      {
        'key': "1",//优先批次
        'sub': [
          { 'value': 0, 'name': '65周岁以上老人' },
          { 'value': 0, 'name': '残疾' },
          { 'value': 0, 'name': '大病' },
          { 'value': 0, 'name': '服从调剂' },
        ]
      },
      {
        'key': "2",//无障碍批次
        'sub': [
          { 'value': 0, 'name': '65周岁以上老人' },
          { 'value': 0, 'name': '残疾' },
          { 'value': 0, 'name': '大病' },
          { 'value': 0, 'name': '服从调剂' },
        ]
      },
      {
        'key': "3",//第三批次
        'sub': [
          { 'value': 0, 'name': '低保' },
          { 'value': 0, 'name': '烈士遗属' },
          { 'value': 0, 'name': '优抚对象' },
          { 'value': 0, 'name': '特困职工' },
          { 'value': 0, 'name': '重大疾病' },
          { 'value': 0, 'name': '残疾' },
          { 'value': 0, 'name': '市级以上劳模、先进人物' },
          { 'value': 0, 'name': '65周岁以上老人' }
        ]
      }
    ]
  }

  ionViewDidLoad() {
    this.getRentInfo();
  }

  getRentInfo() {
    let response = this.navParams.get("rentInfo");
    this.rentProposerInfo = response.yxzyxx;
    this.intentionItem = response.xmList;
    if (!response.znList || response.znList.length <= 0) {
      this.childrenList = null;
    } else {
      this.childrenList = response.znList;
    }
    this.getPromptInfo();

    // let userInfo: any = this.storage.read("userInfo");
    // let url = 'getBzsqSpinfoOfYxdj.action';
    // let body = 'zjlx=1010&zjhm=' + userInfo.crdt_No;
    // this.httpService.httpPost(8, url, body).then(response => {
    //   if (response.code == "0") {
    //     this.rentProposerInfo = response.yxzyxx;
    //     this.intentionItem = response.xmList;
    //     if (!response.znList || response.znList.length <= 0) {
    //       this.childrenList = null;
    //     } else {
    //       this.childrenList = response.znList;
    //     }
    //     this.getPromptInfo();
    //   } else {
    //     this.nativeService.alert(response.msg);
    //   }
    // }).catch(err => {
    //   this.nativeService.alert(err);
    // });
  }

  // 获取意向登记提示信息
  getPromptInfo() {
    let url = 'findTpgWwxzBySzcqAndLx.action';
    let body = 'szcq=' + this.rentProposerInfo.szcq + '&ids=16';
    this.httpService.httpPost(9, url, body).then(response => {
      if (response.code == "0") {
        this.promptInfo = response.data[0].nr;
      } else {
        this.nativeService.alert(response.msg);
      }
    }).catch(err => {
      this.nativeService.alert(err);
    });
  }

  changeBatch() {
    this.showBatch = this.batch.filter(x => { return x.key == this.selectedBatch })[0].sub;
    console.log(this.showBatch);
  }

  // 将ture or false值转换成 1 or 0
  convertValue(value) {
    return value == true ? 1 : 0;
  }

  // 保存信息
  save() {
    if (!this.selectedItem) {
      this.comm.showSmallToast("请先选择意向项目！");
      return;
    }
    // 检查选择批次后是否勾选具体原因
    let continueFlag = false;
    if (this.selectedBatch) {
      this.showBatch.forEach(element => {
        if (element.value) {
          continueFlag = true;
        }
      });
    }
    if (!continueFlag) {
      this.comm.showSmallToast("请勾选申请批次原由！");
      return;
    }
    this.comm.showConfirm("CCB建融家园公租房","确认是否保存？", () => {
      let subBody: string;
      if (this.selectedBatch == '1') {// 优先批次
        subBody = '&xt.sqdlc=1' + '&xt.sqwzahx=' + '' + '&xt.sqdspc=' + '' + '&xt.sqdlc_lr=' +
          this.convertValue(this.showBatch[0].value) + '&xt.sqdlc_cj=' +
          this.convertValue(this.showBatch[1].value) + '&xt.sqdlc_db=' +
          this.convertValue(this.showBatch[2].value) + '&xt.sqdlc_fctj=' +
          this.convertValue(this.showBatch[3].value);
      } else if (this.selectedBatch == '2') {// 无障碍批次
        subBody = '&xt.sqdlc=' + '' + '&xt.sqwzahx=1' + '&xt.sqdspc=' + '' + '&xt.sqwzahx_lr=' +
          this.convertValue(this.showBatch[0].value) + '&xt.sqwzahx_cj=' +
          this.convertValue(this.showBatch[1].value) + '&xt.sqwzahx_db=' +
          this.convertValue(this.showBatch[2].value) + '&xt.sqwzahx_fctj=' +
          this.convertValue(this.showBatch[3].value);
      } else if (this.selectedBatch == '3') {// 第三批次
        subBody = '&xt.sqdlc=' + '' + '&xt.sqwzahx=' + '' + '&xt.sqdspc=1' + '&xt.sqdspc_db=' +
          this.convertValue(this.showBatch[0].value) + '&xt.sqdspc_lsys=' +
          this.convertValue(this.showBatch[1].value) + '&xt.sqdspc_yfdx=' +
          this.convertValue(this.showBatch[2].value) + '&xt.sqdspc_tkzg=' +
          this.convertValue(this.showBatch[3].value) + '&xt.sqdspc_zdjb=' +
          this.convertValue(this.showBatch[4].value) + '&xt.sqdspc_cj=' +
          this.convertValue(this.showBatch[5].value) + '&xt.sqdspc_lm=' +
          this.convertValue(this.showBatch[6].value) + '&xt.sqdspc_lr=' +
          this.convertValue(this.showBatch[7].value);
      } else {
        subBody = '&xt.sqdlc=' + '' + '&xt.sqwzahx=' + '' + '&xt.sqdspc='; // 未选择任何批次
      }
      let data = this.rentProposerInfo;
      let url = 'saveYxdj.action';
      let timestamp = Date.parse(new Date() + "") / 1000;
      let body = 'szcq=' + data.szcq + '&yxzyDTO.id=' + data.id + '&yxzyDTO.sqbid=' + data.sqbid +
        '&yxzyDTO.wblsh=' + timestamp + '&yxzyDTO.jtcyxm=' + data.jtcyxm + '&yxzyDTO.jtcyzjhm=' + data.jtcyzjhm +
        '&yxzyDTO.zgzh=' + data.zgzh + '&yxzyDTO.bzdxlx=' + data.bzdxlx + '&yxzyDTO.jtrk=' + data.jtrk +
        '&yxzyDTO.lxdh=' + data.lxdh + '&yxzyDTO.fzsj=' + data.fzsj + '&yxzyDTO.sqsj=' + data.sqsj +
        '&yxzyDTO.hjdz=' + data.hjdz + '&yxzyDTO.xjzd=' + data.xjzd + '&yxzyDTO.poxm=' + data.poxm +
        '&yxzyDTO.posfzh=' + data.posfzh + '&yxzyDTO.yxxq=' + this.selectedItem + '&xt.pzyx=' + this.remark +
        '&x=on' + subBody;
      this.comm.showLoading('保存中...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.success) {
          this.storage.write('timestamp', timestamp);
          this.navCtrl.push('RentUploadImageInfoPage', { item: data.szcq });
          this.comm.closeLoading();
        } else {
          this.nativeService.alert(response.msg);
          this.comm.closeLoading();
        }
      }).catch(err => {
        this.nativeService.alert(err);
        this.comm.closeLoading();
      });
    });
  }
}

export class RentProposerInfo {
  bzdxlx: string; //"第二类家庭"
  fzsj: string; //"2018-08-22"
  hjdz: string; //"广东"
  id: string; // ""
  jtcyxm: string; // "张十"
  jtcyzjhm: string; // "430211197709299196"
  jtrk: number; // 2
  lxdh: string; // "15175458010"
  posfzh: string; // "360101198809050038"
  poxm: string;//"张三丰"
  sqbid: number;//857
  sqsj: string;//"2018-08-22"
  szcq: number;//2
  wblsh: string; // ""
  xjzd: string;//"福田"
  yxxq: string;//""
  zgzh: string;//"1802080042"
  // znList: string;//null
}
