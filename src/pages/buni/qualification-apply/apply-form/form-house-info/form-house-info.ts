import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, Navbar } from 'ionic-angular';
import { OrderComm } from '../../../../../providers/order-comm';
import { HttpService } from '../../../../../providers/http-service';
import { AddHouseInfoPage } from './add-house-info';
import { NativeService } from '../../../../../providers/NativeService';
import { StorageService } from '../../../../../providers/localstorage';

@IonicPage()
@Component({
  selector: 'page-form-house-info',
  templateUrl: 'form-house-info.html',
})
export class FormHouseInfoPage {

  zfqkJson: Array<HouseInfo> = []; // 住房情况信息
  houseTypes: Array<any> = []; // 房屋类型
  @ViewChild(Navbar) navBar: Navbar;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private comm: OrderComm,
    private nativeService: NativeService,
    public httpService: HttpService,
    private storage: StorageService) {
  }

  ionViewDidLoad() {
    let cache: any = this.storage.read('qualificationApply-houseInfoCache');
    if (cache) {
      this.zfqkJson = cache.zfqkJson;
      this.houseTypes = cache.houseTypes;
    } else {
      // 获取家庭住房情况 (租住公房,非本市自由住房,借助其他住房...)
      let url = "getDicListByKey.action";
      let body = "ywlb=JTZFLX";
      this.httpService.httpPost(8, url, body).then((response) => {
        if (response.code == 0) {
          this.houseTypes = response.pList[0].dicList;
        } else {
          this.nativeService.alert('家庭住房信息获取失败');
        }
      }).catch((ex) => {
        this.nativeService.alert(ex);
      })
    }
    this.navBar.backButtonClick = this.back;
  }

  // 返回
  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }

  addHouseInfo() {
    let profileModal = this.modalCtrl.create(AddHouseInfoPage, { houseTypes: this.houseTypes });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.zfqkJson.push(data);
    });
    profileModal.present()
  }

  //编辑资产信息
  editHouseInfo(item) {
    let profileModal = this.modalCtrl.create(AddHouseInfoPage, { item: item, houseTypes: this.houseTypes });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.zfqkJson.forEach((info) => {
        //更新修改的数据
        if (info.jtzf_id == data.jtzf_id) {
          info.jtzf_jtzflx = data.jtzf_jtzflx;
          info.jtzf_jtzflx_text = data.jtzf_jtzflx_text;

          info.jtzf_cqr = data.jtzf_cqr;
          info.jtzf_fwzl = data.jtzf_fwzl;

          info.jtzf_jzmj = info.jtzf_jzmj_text = data.jtzf_jzmj;

          info.jtzf_zysj = info.jtzf_zysj_text = data.jtzf_zysj;
        }
      });
    });
    profileModal.present();
  }

  //删除住房信息
  delHouseInfo(item) {
    this.comm.showConfirm("CCB建融家园公租房","确认是否删除？", () => {
      //删除选定资产信息
      for (let index = 0; index < this.zfqkJson.length; index++) {
        if (this.zfqkJson[index] == item) {
          this.zfqkJson.splice(index, 1);
        }
      }
    }, null);
  }

  // 下一步保存
  save() {
    this.comm.showConfirm("CCB建融家园公租房","确认是否保存？", () => {
      let url = "saveJtzfqkxx.action"
      // bpCategoryCode=web233050&;
      let body = "wwsqbh=" + this.storage.read('timestamp') +
        "&zfqkJson=" + JSON.stringify(this.zfqkJson);
      this.comm.showLoading('保存中...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.status == 0) {
          this.cacheData();
          this.navCtrl.push("FormUploadImageInfoPage");
        } else {
          this.nativeService.alert('信息保存失败');
        }
        this.comm.closeLoading();
      }, err => {
        this.comm.closeLoading();
        this.nativeService.alert(err);
      });
    }, null);
  }

  // 缓存页面上的数据
  cacheData() {
    let cache = {
      zfqkJson: this.zfqkJson,
      houseTypes: this.houseTypes
    }
    this.storage.write('qualificationApply-houseInfoCache', cache);
  }
}

export class HouseInfo {
  jtzf_id: string; // 家庭住房ID

  jtzf_jtzflx: string; // 住房类型
  jtzf_jtzflx_text: string;

  jtzf_cqr: string; // 产权人

  jtzf_fwzl: string; //房屋坐落

  jtzf_jzmj: string; // 建筑面积
  jtzf_jzmj_text: string;

  jtzf_zysj: string; // 出售/转让时间
  jtzf_zysj_text: string

  constructor() {
  }
}