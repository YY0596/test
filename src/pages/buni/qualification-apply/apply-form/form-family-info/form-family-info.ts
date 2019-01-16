import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Navbar } from 'ionic-angular';
import { AddFamilyInfoPage } from './add-family-info/add-family-info';
import { HttpService } from '../../../../../providers/http-service';
import { OrderComm } from '../../../../../providers/order-comm';
import { StorageService } from '../../../../../providers/localstorage';
import { NativeService } from '../../../../../providers/NativeService';

@IonicPage()
@Component({
  selector: 'page-form-family-info',
  templateUrl: 'form-family-info.html',
})
export class FormFamilyInfoPage {
  jtryJson: Array<FamilyInfo> = []; // 家庭人员信息
  dicList: Array<any> = [];

  @ViewChild(Navbar) navBar: Navbar;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private local: StorageService,
    public modalCtrl: ModalController,
    public httpService: HttpService,
    public comm: OrderComm,
    private naticeService: NativeService,
    private storage: StorageService) {
  }

  ionViewDidLoad() {
    let cache: any = this.storage.read('qualificationApply-familyInfoCache');
    if (cache) {
      this.jtryJson = cache.jtryJson
    }
    this.navBar.backButtonClick = this.back;
  }

  // 返回 缓存页面上的所有数据
  back = (e: UIEvent) => {
    let cache = {
      jtryJson: this.jtryJson
    }
    this.storage.write('qualificationApply-familyInfoCache', cache);
    this.navCtrl.pop();
  }

  addFamilyInfo() {
    let profileModal = this.modalCtrl.create(AddFamilyInfoPage, { jtryJson: this.jtryJson });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      // 判断当前姓名的人员是否已添加
      if (this.jtryJson.filter((x) => { return (x.jtry_xm == data.jtry_xm) }).length != 0) {
        this.naticeService.alert(data.jtry_xm + '已添加')
        return;
      }
      this.jtryJson.push(data);
    });
    profileModal.present()
  }

  //获取字典信息
  // getDicList() {
  //   let url = "getDicListByKey.action";
  //   let body = "ywlb=BZZFLX,JTSRQK,ZFBZ_RYGX,XB,HYZK,SQJTHJ,JTZFLX";
  //   this.httpService.httpPost(8, url, body).then(response => {
  //     if (response.code == 0) {
  //       this.dicList = response.pList;
  //     } else {
  //     }
  //   }, err => {

  //   });
  // }

  //编辑家庭成员信息
  editFamilyInfo(item) {
    let profileModal = this.modalCtrl.create(AddFamilyInfoPage, { item: item });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.jtryJson.forEach((info) => {
        //更新修改的数据
        if (info.jtry_xm == data.jtry_xm) {
          info.jtry_id = data.jtry_id;
          info.jtry_xm = data.jtry_xm;

          info.jtry_gx = data.jtry_gx;
          info.jtry_gx_text = data.jtry_gx_text;

          info.jtry_zjhm = data.jtry_zjhm;

          info.jtry_xb = data.jtry_xb;
          info.jtry_xb_text = data.jtry_xb_text;

          info.jtry_gzdw = data.jtry_gzdw;

          info.jtry_hyzk = data.jtry_hyzk;
          info.jtry_hyzk_text = data.jtry_hyzk_text;

          info.jtry_hj = data.jtry_hj;
          info.jtry_hj_text = data.jtry_hj_text;

          info.jtry_hjdz = data.jtry_hjdz;
          info.jtry_jzdz = data.jtry_jzdz;
          info.jtry_gddh = data.jtry_gddh;
          info.jtry_yddh = data.jtry_yddh;
        }
      });
    });
    profileModal.present();
  }

  //删除家庭成员信息
  delFamilyInfo(item) {
    this.comm.showConfirm("CCB建融家园公租房", "确认是否删除？", () => {
      //删除选定资产信息
      for (let index = 0; index < this.jtryJson.length; index++) {
        if (this.jtryJson[index] == item) {
          this.jtryJson.splice(index, 1);
        }
      }
    }, null);
  }

  // 下一步 保存
  save() {
    // this.navCtrl.push("FormHouseInfoPage");
    if (this.jtryJson.length == 0) {
      this.comm.showSmallToast("请填写家庭成员信息！");
      return;
    }
    this.comm.showConfirm("CCB建融家园公租房", "确认是否保存？", () => {
      this.comm.showLoading('保存中...');
      let cache = {
        jtryJson: this.jtryJson
      }
      this.storage.write('qualificationApply-familyInfoCache', cache);
      let url = "saveJtry.action";
      // bpCategoryCode=web233050&
      let body = "wwsqbh=" + this.local.read('timestamp') +
        "&jtryJson=" + JSON.stringify(this.jtryJson);
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.status == 0) {
          this.navCtrl.push("FormHouseInfoPage");
          // 缓存家庭人员列表，家庭资产页面需要
          // this.local.write("qualificationApply-jtryList", response.data);
        } else {
          this.naticeService.alert('信息获取失败');
        }
        this.comm.closeLoading();
      }, err => {
        this.comm.closeLoading();
        this.naticeService.alert('信息获取失败');
      });
    }, null);
  }
}

export class FamilyInfo {
  jtry_id: string; // 家庭人员id
  jtry_xm: string; // 姓名

  jtry_gx: string; // 与申请人关系
  jtry_gx_text: string;

  jtry_zjhm: string; //证件号码

  jtry_xb: string; //性别
  jtry_xb_text: string;

  jtry_gzdw: string;//工作单位

  jtry_hyzk: string; //婚姻状况
  jtry_hyzk_text: string;

  jtry_hj: string; //户籍 3 SQJTHJ
  jtry_hj_text: string; // 开发区

  jtry_hjdz: string;//户籍所在地详细地址
  jtry_jzdz: string;//现居住地详细地址
  jtry_gddh: string;//固话
  jtry_yddh: string;//移动电话

  constructor() {
  }
}
