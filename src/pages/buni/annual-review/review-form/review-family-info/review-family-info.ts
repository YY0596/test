import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, ModalController } from 'ionic-angular';
import { AddReviewFamilyInfoPage } from './add-review-family-info/add-review-family-info';
import { StorageService } from '../../../../../providers/localstorage';
import { HttpService } from '../../../../../providers/http-service';
import { OrderComm } from '../../../../../providers/order-comm';
import { NativeService } from '../../../../../providers/NativeService';
import { Utils } from '../../../../../providers/Utils';

@IonicPage()
@Component({
  selector: 'page-review-family-info',
  templateUrl: 'review-family-info.html',
})
export class ReviewFamilyInfoPage {
  jtryJson: Array<FamilyInfo> = []; // 家庭人员信息
  rygxList: Array<any> = [];//人员关系
  userInfo: any;
  xbList: Array<any> = [
    {
      "key": "2101",
      "value": "男"
    },
    {
      "key": "2102",
      "value": "女"
    }
  ];//性别
  hyzkList: Array<any> = [
    {
      "key": "1001",
      "value": "未婚"
    },
    {
      "key": "1002",
      "value": "已婚"
    },
    {
      "key": "1003",
      "value": "离异"
    },
    {
      "key": "1004",
      "value": "丧偶"
    }
  ];//婚姻状况
  czhjList: Array<any> = [
    {
      "key": "1",
      "value": "是"
    },
    {
      "key": "0",
      "value": "否"
    }
  ];//是否属本市城镇户籍
  bsgzList: Array<any> = [
    {
      "key": "1",
      "value": "是"
    },
    {
      "key": "0",
      "value": "否"
    }
  ];//是否在本市工作或居住
  bsfcList: Array<any> = [
    {
      "key": "1",
      "value": "是"
    },
    {
      "key": "0",
      "value": "否"
    }
  ];//是否五年内本市转移房产
  gfyhList: Array<any> = [
    {
      "key": "1",
      "value": "是"
    },
    {
      "key": "0",
      "value": "否"
    }
  ];//是否享受过购房优惠
  fbyList: Array<any> = [
    {
      "key": "1",
      "value": "是"
    },
    {
      "key": "0",
      "value": "否"
    }
  ];//是否服过兵役
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
    let cache: any = this.storage.read('review-familyInfoCache');
    if (cache) {
      this.jtryJson = cache.jtryJson,
        this.rygxList = cache.rygxList
    }
    this.navBar.backButtonClick = this.back;
    this.getSQRGX();
    if (this.jtryJson.length <= 0) {
      this.getJtcyxx();
    }

  }

  // 返回 
  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }

  addFamilyInfo() {
    let profileModal = this.modalCtrl.create(AddReviewFamilyInfoPage, { rygxList: this.rygxList});
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      // 判断当前姓名的资产是否已添加
      if (this.jtryJson.filter((x) => { return (x.jtry_xm == data.jtry_xm) }).length != 0) {
        this.naticeService.alert(data.jtry_xm + '已添加')
        return;
      }
      this.jtryJson.push(data);
    });
    profileModal.present()
  }

  //获取家庭成员信息
  getJtcyxx() {
    this.userInfo = this.local.read("userInfo");
    let url = "getJtcyxx.action";
    let body = "zjlx=1000" + "&zjhm=" + this.userInfo.crdt_No;
    this.httpService.httpPost(10, url, body).then(response => {
      if (response.length > 0) {
        response.forEach(element => {
          let familyInfo = new FamilyInfo();
          familyInfo.jtry_id = "";
          familyInfo.jtry_gx = element.jtry_gx;
          let gxArray = this.rygxList.filter((x) => { return x.key == familyInfo.jtry_gx });
          familyInfo.jtry_gx_text = gxArray[0].value;
          familyInfo.jtry_xm = element.jtry_xm;
          familyInfo.jtry_xb = element.jtry_xb;
          let xbArray = this.xbList.filter((x) => { return x.key == familyInfo.jtry_xb });
          if (xbArray.length > 0) {
            familyInfo.jtry_xb_text = xbArray[0].value;
          }
          familyInfo.jtry_zjhm = element.jtry_zjhm;
          familyInfo.jtry_sndkzpsr = element.jtry_sndkzpsr;
          familyInfo.jtry_sndkzpsr_text = element.jtry_sndkzpsr;
          familyInfo.jtry_hyzk = element.jtry_hyzk;
          let hyzkArray = this.hyzkList.filter((x) => { return x.key == familyInfo.jtry_hyzk });
          if (hyzkArray.length > 0) {
            familyInfo.jtry_hyzk_text = hyzkArray[0].value;
          }
          familyInfo.jtry_sfczhj = element.jtry_sfczhj;
          let bshjArray = this.czhjList.filter((x) => { return x.key == familyInfo.jtry_sfczhj });
          if (bshjArray.length > 0) {
            familyInfo.jtry_sfczhj_text = bshjArray[0].value;
          }
          familyInfo.jtry_sfbsgzhjz = element.jtry_sfbsgzhjz;
          let bsgzArray = this.bsgzList.filter((x) => { return x.key == familyInfo.jtry_sfbsgzhjz });
          if (bsgzArray.length > 0) {
            familyInfo.jtry_sfbsgzhjz_text = bsgzArray[0].value;
          }
          familyInfo.jtry_gzdw = element.jtry_gzdw;
          familyInfo.jtry_gddh = element.jtry_gddh;
          familyInfo.jtry_sfzyfc = element.jtry_sfzyfc;
          let zyfcArray = this.bsfcList.filter((x) => { return x.key == familyInfo.jtry_sfzyfc });
          if (zyfcArray.length > 0) {
            familyInfo.jtry_sfzyfc_text = zyfcArray[0].value;
          }
          familyInfo.jtry_sfxsgyhzc = element.jtry_sfxsgyhzc;
          let gfyhArray = this.gfyhList.filter((x) => { return x.key == familyInfo.jtry_sfxsgyhzc });
          if (gfyhArray.length > 0) {
            familyInfo.jtry_sfxsgyhzc_text = gfyhArray[0].value;
          }
          familyInfo.jtry_isfgby = element.jtry_isfgby;
          let fbyArray = this.fbyList.filter((x) => { return x.key == familyInfo.jtry_isfgby });
          if (fbyArray.length > 0) {
            familyInfo.jtry_isfgby_text = fbyArray[0].value;
          }
          if (element.jtry_isfgby == "0") {
            familyInfo.jtry_fbykssj = "";
            familyInfo.jtry_fbykssj_text = "";
            familyInfo.jtry_fbyjssj = "";
            familyInfo.jtry_fbyjssj_text = "";
          } else {
            familyInfo.jtry_fbykssj = Utils.timestampToTime(element.jtry_fbykssj.time);
            familyInfo.jtry_fbykssj_text = Utils.timestampToTime(element.jtry_fbykssj.time);
            familyInfo.jtry_fbyjssj = Utils.timestampToTime(element.jtry_fbyjssj.time);
            familyInfo.jtry_fbyjssj_text = Utils.timestampToTime(element.jtry_fbyjssj.time);
          }
          familyInfo.jtry_bz = element.jtry_bz;
          familyInfo.jtry_zjlb = element.jtry_zjlb;
          this.jtryJson.push(familyInfo);
        });
      }
    }, err => {
      this.naticeService.alert('家庭成员信息获取失败！');
    });
  }
  //与申请人关系
  getSQRGX() {
    let url = "getDicListByKey.action";
    let body = "ywlb=ZFBZ_RYGX";
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.rygxList = response.pList[0].dicList;
      } else {
      }
    }, err => {

    });
  }

  //编辑资产信息
  editFamilyInfo(item) {
    let profileModal = this.modalCtrl.create(AddReviewFamilyInfoPage, { item: item, rygxList: this.rygxList});
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      this.jtryJson.forEach((info) => {
        //更新修改的数据
        if (info.jtry_xm == data.jtry_xm) {
          info.jtry_id = data.jtry_id;

          info.jtry_gx=data.jtry_gx;
          info.jtry_gx_text=data.jtry_gx_text;

          info.jtry_xm=data.jtry_xm;

          info.jtry_zjhm=data.jtry_zjhm;

          info.jtry_xb=data.jtry_xb;
          info.jtry_xb_text=data.jtry_xb_text;

          info.jtry_sndkzpsr=data.jtry_sndkzpsr;
          info.jtry_sndkzpsr_text=data.jtry_sndkzpsr_text;

          info.jtry_sfbsgzhjz=data.jtry_sfbsgzhjz;
          info.jtry_sfbsgzhjz_text=data.jtry_sfbsgzhjz_text;

          info.jtry_hyzk=data.jtry_hyzk;
          info.jtry_hyzk_text=data.jtry_hyzk_text;

          info.jtry_sfczhj=data.jtry_sfczhj;
          info.jtry_sfczhj_text=data.jtry_sfczhj_text;

          info.jtry_gzdw=data.jtry_gzdw;

          info.jtry_gddh=data.jtry_gddh;

          info.jtry_sfzyfc=data.jtry_sfzyfc;
          info.jtry_sfzyfc_text=data.jtry_sfzyfc_text;

          info.jtry_sfxsgyhzc=data.jtry_sfxsgyhzc;
          info.jtry_sfxsgyhzc_text=data.jtry_sfxsgyhzc_text;

          info.jtry_isfgby=data.jtry_isfgby;
          info.jtry_isfgby_text=data.jtry_isfgby_text;

          info.jtry_fbykssj=data.jtry_fbykssj;
          info.jtry_fbykssj_text=data.jtry_fbykssj_text;

          info.jtry_fbyjssj=data.jtry_fbyjssj;
          info.jtry_fbyjssj_text=data.jtry_fbyjssj_text;

          info.jtry_bz=data.jtry_bz;

          info.jtry_zjlb=data.jtry_zjlb;
        }
      });
    });
    profileModal.present();
  }
  //删除住房信息
  delFamilyInfo(item) {
    this.comm.showConfirm("CCB建融家园公租房","确认是否删除？", () => {
      //删除选定资产信息
      for (let index = 0; index < this.jtryJson.length; index++) {
        if (this.jtryJson[index] == item) {
          this.jtryJson.splice(index, 1);
        }
      }
    }, null);
  }

  // 缓存页面上的数据
  cacheData() {
    let cache = {
      jtryJson: this.jtryJson,
      rygxList: this.rygxList
    }
    this.storage.write('review-familyInfoCache', cache);
  }

  // 下一步 保存
  save() {
    if (this.jtryJson.length == 0) {
      this.comm.showSmallToast("请填写家庭成员信息！");
      return;
    }
    this.comm.showConfirm("CCB建融家园公租房","确认是否保存？", () => {
      this.comm.showLoading('保存中...');
      let url = "saveJtry.action";
      let body = "bpCategoryCode=web233052&wwsqbh=" + this.local.read('timestamp') +
        "&jtryJson=" + JSON.stringify(this.jtryJson);
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.status == 0) {
          this.cacheData();
          this.navCtrl.push("ReviewHouseInfoPage");
          // 缓存家庭人员列表，家庭资产页面需要
          this.local.write("review-jtryList", response.data);
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
  jtry_id: string; // 家庭人员

  jtry_gx: string; // 与申请人关系
  jtry_gx_text: string;

  jtry_xm: string; // 姓名

  jtry_zjhm: string; //证件号码

  jtry_xb: string; //性别
  jtry_xb_text: string;

  jtry_sndkzpsr: string; //上年度可支配收入
  jtry_sndkzpsr_text: string;

  jtry_hyzk: string; //婚姻状况
  jtry_hyzk_text: string;

  jtry_sfczhj: string; //是否属本市城镇户籍
  jtry_sfczhj_text: string;

  jtry_sfbsgzhjz: string; //是否在本市工作或居住
  jtry_sfbsgzhjz_text: string;

  jtry_gzdw: string;//工作单位

  jtry_gddh: string;//联系电话

  jtry_sfzyfc: string; //是否转移房产
  jtry_sfzyfc_text: string;

  jtry_sfxsgyhzc: string; //是否享受过购房优惠
  jtry_sfxsgyhzc_text: string;

  jtry_isfgby: string;//是否服过兵役
  jtry_isfgby_text: string;

  jtry_fbykssj: string; //服兵役开始时间
  jtry_fbykssj_text: string;

  jtry_fbyjssj: string; //服兵役结束时间
  jtry_fbyjssj_text: string;

  jtry_bz: string;
  jtry_zjlb: string;
  constructor() {
    this.jtry_zjlb = '2000';
  }
}
