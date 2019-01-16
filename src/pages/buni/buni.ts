import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Navbar } from 'ionic-angular';
import { StorageService } from '../../providers/localstorage';
import { NativeService } from '../../providers/NativeService';
import { BIZ_MODULES } from '../../app/config';
import { OrderComm } from '../../providers/order-comm';
import { HttpService } from '../../providers/http-service';

@IonicPage()
@Component({
  selector: 'page-buni',
  templateUrl: 'buni.html',
})
export class BuniPage {

  bizModules: Array<any> = []; //业务申请模块信息
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
    public nativeService: NativeService,
    public loadingCtrl: LoadingController,
    private storage: StorageService,
    public navParams: NavParams,
    private comm: OrderComm,
    private httpService: HttpService) {
  }

  ionViewDidLoad() {
    this.getInvalidLmb();//获取不显示和禁用的模块
    this.navBar.backButtonClick = this.backButtonClick;
  }

  // 后端配置控制相应模块是否隐藏或禁用
  getInvalidLmb() {
    let url = 'getInvalidLmb.action?appFlag=app';
    this.httpService.httpGet(1, url).then(response => {
      if (response.code == 0) {
        this.bizModules = BIZ_MODULES;
        this.bizModules.forEach(element => {
          element.disabled = false;
        });
        let modules = response.data;
        for (let i = 0; i < modules.length; i++) {
          if (modules[i].lmzt == 2) { // 2 表示显示模块但不能点击
            for (let j = 0; j < this.bizModules.length; j++) {
              if (this.bizModules[j].id == modules[i].id) {
                this.bizModules[j].disabled = true;
              }
            }
          } else if (modules[i].lmzt == 3) { // 3 表示隐藏模块
            for (let index = 0; index < this.bizModules.length; index++) {
              if (this.bizModules[index].id == modules[i].id) {
                this.bizModules.splice(index, 1);
              }
            }
          }
        }
      }
    }).catch(err => {

    });
  }

  backButtonClick = (e: UIEvent) => {
    let flag = this.navParams.get('flag');
    if (flag && flag == 'fromlogin') {
      this.navCtrl.setRoot("HomePage", { param: this.storage.read("city") });
    } else {
      this.navCtrl.pop();
    }
  }

  openModule(mod) {
    if (mod.disabled) {
      this.comm.showToast('功能维护中!');
      return;
    }
    let userInfo: any = this.storage.read('userInfo');
    let url = 'validateSqzg.action';
    if (mod.uri == 'ApplyStylePage') { // 资格申请
      let body = 'sqtype=qualificationApply&zjlx=2000&zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(10, url, body).then(response => {
        if (response.flag == 'success') {
          this.navCtrl.push(mod.uri);
        } else if (response.flag == 'nwdoing') {
          this.comm.showToast('存在正在办理业务,请确认!');
        } else if (response.flag == 'wwdoing') {
          this.comm.showToast('存在待办理业务,请确认!');
        } else if (response.flag == 'isExist') {
          this.comm.showToast('已通过保障申请审核,请勿重复申请!');
        }
      }).catch(err => {
        this.nativeService.alert('系统异常,未获取到数据');
      });
    } else if (mod.uri == "ReviewStylePage") { // 资格年审
      let body = 'sqtype=qualificationReview&zjlx=1010&zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(10, url, body).then(response => {
        if (response.flag == 'success') {
          this.navCtrl.push(mod.uri);
        } else if (response.flag == 'notExist') {
          this.comm.showToast('请先申请保障资格!');
        } else if (response.flag == 'nwdoing') {
          this.comm.showToast('存在正在办理业务,请确认!');
        } else if (response.flag == "wwdoing") {
          this.comm.showToast("您有一条业务申请待受理，不能同时发出多起业务申请，请确认!");
        } else if (response.flag == 'beforeNsDate') {
          this.comm.showToast("暂不符合年度复核条件,请于资格证到期当月前五个工做日内申请年度复核，谢谢配合");
        } else if (response.flag == 'beyondNsDate') {
          this.comm.showToast("对不起，当前日期已超过年度复核允许时间，请到申请地城区/县房管部门申请逾期补审，谢谢配合!");
        } else if (response.flag == 'noNsDate') {
          this.comm.showToast("不在设置的年审时间内!");
        } else if (response.flag == 'dateException') {
          this.comm.showToast("数据异常,请联系管理员!")
        }
      }).catch(err => {
        this.nativeService.alert('系统异常,未获取到数据');
      });
    } else if (mod.uri == "ChangeStylePage") { // 资格变更
      // this.navCtrl.push(mod.uri);
      let body = 'sqtype=qualificationChange&zjlx=1010&zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(10, url, body).then(response => {
        if (response.flag == 'success') {
          this.navCtrl.push(mod.uri);
        } else if (response.flag == 'notExist') {
          this.comm.showToast('请先申请保障资格!');
        } else if (response.flag == 'nwdoing') {
          this.comm.showToast('存在正在办理业务,请确认!');
        } else if (response.flag == "wwdoing") {
          this.comm.showToast("您有一条业务申请待受理，不能同时发出多起业务申请，请确认!");
        } else if (response.flag == "beyondNsDate") {
          this.comm.showToast("您没有在规定时间内提出资格年审，请与申请地房管部门联系!");
        } else if (response.flag == 'dateException') {
          this.comm.showToast("数据异常,请联系管理员!")
        }
      }).catch(err => {
        this.nativeService.alert('系统异常,未获取到数据');
      });
    } else if (mod.uri == "RentApplyInfoPage") { // 配租意向登记
      url = 'getBzsqSpinfoOfYxdj.action';
      let body = 'zjlx=1010&zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.code == '0') {
          this.navCtrl.push(mod.uri, { rentInfo: response });
        } else {
          this.comm.showToast(response.msg);
        }
      }).catch(err => {
        this.nativeService.alert('系统异常,未获取到数据');
      });

    } else if (mod.uri == "PlacementStylePage") { // 配售意向登记
      let body = 'sqtype=saleApply&zjlx=2000&zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(10, url, body).then(response => {
        if (response.flag == 'success') {
          let url = "findsqrxx.action"
          let body = "ywlb=233057&sqrzjhm=" + userInfo.crdt_No + "&type=pssqcheck";
          this.httpService.httpPost(11, url, body).then(response => {
            if (response.pssq) {  //pssq有数据表明申请过配售
              this.navCtrl.push("PlacementInfoPage", { placementInfo: response });
            } else {
              this.navCtrl.push(mod.uri);
            }
          })
        } else if (response.flag == 'wsh') {
          this.comm.showToast('您的配售申请未审核,请等待审核!');
        } else if (response.flag == 'failed' || response.flag == 'notExist') {
          this.comm.showToast('请先申请保障资格!');
        } else if (response.flag == 'logouting') {
          this.comm.showToast('资格已注销!');
        } else if (response.flag == 'anomaly') {
          this.comm.showToast('用户信息异常,请联系管理员!');
        } else if (response.flag == 'nwdoing') {
          this.comm.showToast('存在正在办理的业务,请确认!');
        } else if (response.flag == 'beyondNsDate') {
          this.comm.showToast('您没有在规定时间内提出资格年审，请与申请地房管部门联系!');
        } else if (response.flag == "wwdoing") {
          this.comm.showToast("您有一条业务申请待受理，不能同时发出多起业务申请，请确认!");
        } else if (response.flag == "nohfzg") {
          this.comm.showToast(response.info);
        } else {
          this.comm.showToast("暂不符合配售条件!")
        }
      }).catch(err => {
        this.nativeService.alert('系统异常,未获取到数据!');
      });
    } else if (mod.uri == "HouseRepairPage") { //房屋维修
      url = 'viewFwwx.action?random=0.44061897463135646';
      let body = 'sfzh=' + userInfo.crdt_No;
      this.httpService.httpPost(14, url, body).then(response => {
        if (response.pf_flag == 'no') {
          this.comm.showToast('您还未配租或租房合同未生效!');
        } else {
          let status = '';
          if (response.pf_flag == 'yes' && response.wxxx_flag == 'no') { //还未申请维修
            status = 'no-repair';
          } else if (response.pf_flag == 'yes' && response.wxxx_flag == 'yes') { //已经申请维修
            status = 'has-repair';
          }
          this.navCtrl.push(mod.uri, { status: status, response: response });
        }
      }).catch(err => {
        this.nativeService.alert(err);
      });
    } else if (mod.uri == "RepairEvaluatePage") { //维修满意度调查
      url = 'viewFwwx.action?random=0.44061897463135646';
      let body = 'sfzh=' + userInfo.crdt_No;
      this.httpService.httpPost(14, url, body).then(response => {
        if (response.pf_flag == 'no' || (response.myddc_wxbh && response.myddc_wxbh == 'no')) {
          this.comm.showToast('无可进行满意度调查的维修信息！');
        } else {
          this.navCtrl.push(mod.uri, { status: status, response: response });
        }
      }).catch(err => {
        this.nativeService.alert(err);
      });
    } else if (mod.uri == "QuitApplyPage") { //退出申请
      url = 'getBzxxByZjhm.action';
      let body = 'zjhm=' + userInfo.crdt_No;
      this.httpService.httpPost(13, url, body).then(response => {
        if (response[0].result == 'wbz') {
          this.navCtrl.push(mod.uri, { param: 'wbz' });
        } else if (response[0].result == 'wqht') {
          this.navCtrl.push(mod.uri, { param: 'wqht' });
        } else if (response[0].result == 'wbzysq') {
          this.comm.showToast('已申请退出保障，5个工作日内反馈申请信息!');
        }
      }).catch(err => {
        this.nativeService.alert(err);
      });
    } else {
      this.comm.showToast('功能未开通,敬请期待!');
    }
  }

}
