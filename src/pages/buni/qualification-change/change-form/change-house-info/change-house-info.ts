import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, Navbar } from 'ionic-angular';
import { OrderComm } from '../../../../../providers/order-comm';
import { HttpService } from '../../../../../providers/http-service';
import { AddChangeHouseInfoPage } from './add-change-house-info';
import { NativeService } from '../../../../../providers/NativeService';
import { StorageService } from '../../../../../providers/localstorage';
import { Utils } from '../../../../../providers/Utils';

@IonicPage()
@Component({
  selector: 'page-change-house-info',
  templateUrl: 'change-house-info.html',
})
export class ChangeHouseInfoPage {

  zfqkJson: Array<HouseInfo> = []; // 住房情况信息
  houseTypes: Array<any> = []; // 房屋类型
  flag: number = 1;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private comm: OrderComm,
    private nativeService: NativeService,
    public httpService: HttpService,
    private storage: StorageService) {
  }

  ionViewDidLoad() {
    let cache: any = this.storage.read('change-houseInfoCache');
    if (cache) {
      this.zfqkJson = cache.zfqkJson;
      this.houseTypes = cache.houseTypes;
    } else {
      this.getDicListBykey();
    }
    this.navBar.backButtonClick = this.back;
  }

  // 获取家庭住房情况 (租住公房,非本市自由住房,借助其他住房...)
  async getDicListBykey() {
    let url = "getDicListByKey.action";
    let body = "ywlb=JTZFLX";
    await this.httpService.httpPost(8, url, body).then((response) => {
      if (response.code == 0) {
        this.houseTypes = response.pList[0].dicList;
        this.getHouseInfo();
      } else {
        this.nativeService.alert('家庭住房情况获取失败');
      }
    }).catch((ex) => {
      this.nativeService.alert(ex);
    })
  }

  // 获取家庭住房信息
  getHouseInfo() {
    let userInfo: any = this.storage.read('userInfo');
    let url = "getJtzfxxOfJtxxbg.action";
    let body = "zjlx=1010&zjhm=" + userInfo.crdt_No;
    this.httpService.httpPost(8, url, body).then((response) => {
      if (response.code == 0) {
        if (response.data.length != 0) {
          this.zfqkJson = new Array<HouseInfo>();
          this.getData(response.data, 1);
        }
      } else {
        this.nativeService.alert('家庭住房信息获取失败');
      }
    }).catch((ex) => {
      this.nativeService.alert(ex);
    })
  }

  // 获取response中需要的值
  getData(data, flag) {
    this.zfqkJson = [];
    data.forEach(element => {
      let houseInfo = new HouseInfo();
      houseInfo.jtzf_cqr = element.jtzf_cqr;
      houseInfo.jtzf_fwzl = element.jtzf_fwzl;
       // jtzf_id 在第一次从后台加载数据时点保存传到后台是传入 空值
      // 再重新做修改保存，jtzf_id 会取第一次保存后返回的jtzf_id 的值
      if (flag == 1) {
        this.flag = 1;
      } else {
        this.flag = 2;
      }

      houseInfo.jtzf_id = element.jtzf_id;
      houseInfo.jtzf_jtzflx = element.jtzf_jtzflx.toString();

      houseInfo.jtzf_jtzflx_text = this.houseTypes.filter(
        (x) => {
          return x.key == element.jtzf_jtzflx
        })[0].value;

      houseInfo.jtzf_jzmj_text = houseInfo.jtzf_jzmj = element.jtzf_jzmj.toString();
      houseInfo.jtzf_zysj_text = houseInfo.jtzf_zysj = element.jtzf_zysj;
      this.zfqkJson.push(houseInfo);
    });
  }

  // 返回
  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }

  addHouseInfo() {
    let profileModal = this.modalCtrl.create(AddChangeHouseInfoPage, { houseTypes: this.houseTypes });
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
    let profileModal = this.modalCtrl.create(AddChangeHouseInfoPage, { item: item, houseTypes: this.houseTypes });
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
      let url = "saveJtzfqkxx.action";
      if (this.flag == 1) {
        this.zfqkJson.forEach((element) => {
          //这里赋值为空的原因是年审中，在第一次进行保存时需要传空值后台才不会报错
          //不能传入返回过来的id值，只有在第二次保存时才能使用返回过来的值
          //这里flag 的作用用来判断是否是第一次还是第二次
          element.jtzf_id = "";
        });
      }
      let body = "bpCategoryCode=web233051&wwsqbh=" + this.storage.read('timestamp') +
        "&zfqkJson=" + JSON.stringify(this.zfqkJson);
      this.comm.showLoading('保存中...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.status == 0) {
          this.getData(response.data, 2);
          this.cacheData();
          this.navCtrl.push("ChangePropertyInfoPage");
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
    this.storage.write('change-houseInfoCache', cache);
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