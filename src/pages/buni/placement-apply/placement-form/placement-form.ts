import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { NativeService } from '../../../../providers/NativeService';
import { HttpService } from '../../../../providers/http-service';
import { StorageService } from '../../../../providers/localstorage';
import { OrderComm } from '../../../../providers/order-comm';

/**
 * Generated class for the PlacementFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placement-form',
  templateUrl: 'placement-form.html',
})
export class PlacementFormPage {
  userInfo: any;
  zgzh: string;//资格证号
  name: string;//申请人姓名
  identificationCategory;//证件类别
  identificationNo: string; //证件号码
  intentionItem: any;//意向小区
  intention: string;//申请认购意向
  selectedItem: any;//选择的意向小区

  jtlb: string;//家庭类别

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativeService: NativeService,
    private httpService: HttpService,
    private storage: StorageService,
    private comm: OrderComm) {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = this.back;
    this.userInfo = this.storage.read("userInfo");
    this.name = this.userInfo.cst_Nm;
    this.identificationCategory = '身份证';
    this.identificationNo = this.userInfo.crdt_No;
    this.getZgzh();
    this.getIntentionalCommunity();
  }

  back = (e: UIEvent) => {
    this.navCtrl.pop();
  }

  // 获取资格证号
  getZgzh() {
    let url = "findsqrxx.action"
    let body = "ywlb=233056&sqrzjhm=" + this.userInfo.crdt_No + "&type=init";
    this.httpService.httpPost(11, url, body).then(response => {
      if (response.status == 200) {
        this.jtlb = response.hfsq.jtlb;

        let url = "findsqrxx.action"
        let body = "ywlb=233057&sqrzjhm=" + this.userInfo.crdt_No + "&type=pssq";
        this.httpService.httpPost(11, url, body).then(response => {
          if (response.status == 200) {
            this.zgzh = response.hfsq.zgzh;
          } else {
            this.nativeService.alert('资格证号获取失败');
          }
        }, err => {
          this.nativeService.alert('资格证号获取失败');
        });
      } else {
        this.nativeService.alert('资格证号获取失败');
      }
    }, err => {
      this.nativeService.alert('资格证号获取失败');
    });
  }


  // 获取意向小区
  getIntentionalCommunity() {
    let sjhm = this.storage.read('szcq');
    this.storage.remove('szcq');
    let url = "findsqrxx.action"
    let body = "ywlb=233057&sqrzjhm=" + this.userInfo.crdt_No + "&type=findpsyxxq&sjhm=" + sjhm;
    this.httpService.httpPost(11, url, body).then(response => {
      if (response && response.length > 0) {
        this.intentionItem = response;
      } else {
        this.nativeService.alert('意向小区获取失败');
      }
    }, err => {
      this.nativeService.alert('意向小区获取失败');
    });
  }

  submit() {
    if (!this.selectedItem) {
      this.comm.showSmallToast("请选择意向小区");
      return;
    }
    if (!this.intention) {
      this.comm.showSmallToast("请填写认购意向");
      return;
    }

    let sqcq = this.storage.read('placement-sqcq');//申请城区cqid
    let sqjd = this.storage.read('placement-sqjd');//申请街道sqjd
    let timestamp = Date.parse(new Date() + "") / 1000;
    let url = 'savehfxx.action';
    let body = 'hfsqDTO.id=' + '&hfsqDTO.wblsh=' + timestamp + '&hfsqDTO.jtlb=' + this.jtlb +
      '&hfsqDTO.sqcq=' + sqcq + '&hfsqDTO.sqjd=' + sqjd + '&hfsqDTO.yxxqid=' + this.selectedItem.id +
      '&hfsqDTO.yxxqmc=' + this.selectedItem.xqmc + '&hfsqDTO.xm=' + this.name + '&hfsqDTO.zjlb=2000' +
      '&hfsqDTO.zjhm=' + this.identificationNo + '&hfsqDTO.zgzh=' + this.zgzh + '&hfsqDTO.yxxqid_view=' + this.selectedItem.id +
      '&hfsqDTO.sqrgyx=' + this.intention + '&ywlb=233057&type=submitps';

    this.comm.showConfirm("CCB建融家园公租房","确定提交申请？", () => {
      this.comm.showLoading('请稍后...');
      this.httpService.httpPost(11, url, body).then(response => {
        if (response.status == 200) {
          this.storage.remove('placement-sqcq');
          this.storage.remove('placement-sqjd');
          this.navCtrl.setRoot("HomePage").then(() => {
            this.nativeService.showToast('提交成功');
          });
        } else {
          this.nativeService.alert(response.msg);
        }
        this.comm.closeLoading();
      }).catch(err => {
        this.comm.closeLoading();
        this.nativeService.showToast('提交失败');
      });
    }, null);
  }
}
