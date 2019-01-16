import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController, Navbar } from 'ionic-angular';
import { AddReviewPropertyInfoPage } from './add-review-property-info';
import { OrderComm } from '../../../../../providers/order-comm';
import { StorageService } from '../../../../../providers/localstorage';
import { Utils } from '../../../../../providers/Utils';
import { HttpService } from '../../../../../providers/http-service';
import { NativeService } from '../../../../../providers/NativeService';
@IonicPage()
@Component({
  selector: 'page-review-property-info',
  templateUrl: 'review-property-info.html',
})
export class ReviewPropertyInfoPage {

  jtzcSumJson: PropertyTotal = new PropertyTotal(); // 家庭资产汇总信息
  zgsqJson: Array<PropertyInfo> = []; //资格申请数据
  homeMembers: any;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private comm: OrderComm,
    private storage: StorageService,
    public httpService: HttpService,
    private nativeService: NativeService) {
  }

  ionViewDidLoad() {
    let cache: any = this.storage.read('review-propertyInfoCache');
    this.homeMembers = this.storage.read('review-jtryList'); //获取家庭成员信息
    if (cache) {
      this.jtzcSumJson = cache.jtzcSumJson;
      this.zgsqJson = cache.zgsqJson;
    } else {
      // 获取家庭资产信息
      let userInfo: any = this.storage.read('userInfo');
      let url = "getJtzcqk.action";
      let body = "zjlx=1010&zjhm=" + userInfo.crdt_No;
      this.httpService.httpPost(10, url, body).then((response) => {
        if (response.jtzcqk && response.jtzcqk.length != 0) {
          this.getData(response.jtzcqk);
        }
        if (response.sumzc) {
          this.jtzcSumJson.jtzc_jdcls = this.jtzcSumJson.jtzc_jdcls_text = response.sumzc.jtzc_jdcls.toString();
          this.jtzcSumJson.jtzc_qtzcze = this.jtzcSumJson.jtzc_qtzcze_text = response.sumzc.jtzc_qtzcze.toString();
          this.jtzcSumJson.jtzc_tzlzcze = this.jtzcSumJson.jtzc_tzlzcze_text = response.sumzc.jtzc_tzlzcze.toString();
          this.jtzcSumJson.jtzc_xjze = this.jtzcSumJson.jtzc_xjze_text = response.sumzc.jtzc_xjze.toString();
          this.jtzcSumJson.jtzc_yhckze = this.jtzcSumJson.jtzc_yhckze_text = response.sumzc.jtzc_yhckze.toString();
          this.jtzcSumJson.jtzc_zcsbrq = this.jtzcSumJson.jtzc_zcsbrq_text = response.sumzc.jtzc_zcsbrq.toString();
        }
      }).catch((ex) => {
        this.nativeService.alert(ex);
      })
    }
    this.navBar.backButtonClick = this.back;
  }

  getData(data) {
    this.zgsqJson = [];
    data.forEach(element => {
      let propertyInfo = new PropertyInfo();
      propertyInfo.jtzc_id = element.jtzc_id;
      let homeMember;
      if (Utils.isNumber(element.jtzc_xm)) {
        homeMember = this.homeMembers.filter((x) => {
          return x.jtry_id == element.jtzc_xm
        })[0];
      } else {
        homeMember = this.homeMembers.filter((x) => {
          return x.jtry_xm == element.jtzc_xm
        })[0];
      }
      if (!homeMember) {
        return;
      }
      propertyInfo.jtzc_xm = propertyInfo.jtzc_xm_text = homeMember.jtry_xm.toString();
      propertyInfo.jtzc_gszc = element.jtzc_gszc.toString();
      propertyInfo.jtzc_gszc_text = element.jtzc_gszc == 1 ? '有' : '无';

      propertyInfo.jtzc_jdcsl = propertyInfo.jtzc_jdcsl_text = element.jtzc_jdcsl.toString();
      propertyInfo.jtzc_qt = propertyInfo.jtzc_qt_text = element.jtzc_qt.toString();
      propertyInfo.jtzc_scpgj = propertyInfo.jtzc_scpgj_text = element.jtzc_scpgj.toString();
      propertyInfo.jtzc_tzzcjz = propertyInfo.jtzc_tzzcjz_text = element.jtzc_tzzcjz.toString();
      propertyInfo.jtzc_yhck = propertyInfo.jtzc_yhck_text = element.jtzc_yhck.toString();
      this.zgsqJson.push(propertyInfo);
    });
  }

  //返回
  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }

  addPropertyInfo() {
    let profileModal = this.modalCtrl.create(AddReviewPropertyInfoPage);
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      // 判断当前姓名的资产是否已添加
      if (this.zgsqJson.filter((x) => { return (x.jtzc_xm_text == data.jtzc_xm_text) }).length != 0) {
        this.nativeService.alert(data.jtzc_xm_text + '资产已添加')
        return;
      }
      this.zgsqJson.push(data);
      // 资产汇总值初始化归0
      this.jtzcSumJson = new PropertyTotal();
      // 计算资产汇总值
      this.zgsqJson.forEach((info) => {
        this.jtzcSumJson.jtzc_xjze_text = this.jtzcSumJson.jtzc_xjze = (parseInt(this.jtzcSumJson.jtzc_xjze) + parseInt(info.jtzc_scpgj)).toString();
        this.jtzcSumJson.jtzc_yhckze_text = this.jtzcSumJson.jtzc_yhckze = (parseInt(this.jtzcSumJson.jtzc_yhckze) + parseInt(info.jtzc_yhck)).toString();
        this.jtzcSumJson.jtzc_jdcls_text = this.jtzcSumJson.jtzc_jdcls = (parseInt(this.jtzcSumJson.jtzc_jdcls) + parseInt(info.jtzc_jdcsl)).toString();
        this.jtzcSumJson.jtzc_tzlzcze_text = this.jtzcSumJson.jtzc_tzlzcze = (parseInt(this.jtzcSumJson.jtzc_tzlzcze) + parseInt(info.jtzc_tzzcjz)).toString();
        this.jtzcSumJson.jtzc_qtzcze_text = this.jtzcSumJson.jtzc_qtzcze = (parseInt(this.jtzcSumJson.jtzc_qtzcze) + parseInt(info.jtzc_qt)).toString();
      });
    });
    profileModal.present()
  }

  //编辑资产信息
  editPropertyInfo(item) {
    let profileModal = this.modalCtrl.create(AddReviewPropertyInfoPage, { item: item });
    profileModal.onDidDismiss(data => {
      if (!data) {
        return;
      }
      // 资产汇总值初始化归0
      this.jtzcSumJson = new PropertyTotal();
      this.zgsqJson.forEach((info) => {
        //更新修改的数据
        if (info.jtzc_xm_text == data.jtzc_xm_text) {
          // 这么写才能使info中的信息改变，不能写成 info = data（info中的信息不会改变-这是一个坑）
          info.jtzc_scpgj = data.jtzc_scpgj; //现金 
          info.jtzc_scpgj_text = data.jtzc_scpgj_text;

          info.jtzc_yhck = data.jtzc_yhck; // 银行存款
          info.jtzc_yhck_text = data.jtzc_yhck_text;

          info.jtzc_jdcsl = data.jtzc_jdcsl; //机动车数量
          info.jtzc_jdcsl_text = data.jtzc_jdcsl_text;

          info.jtzc_tzzcjz = data.jtzc_tzzcjz; // 投资类资产价值
          info.jtzc_tzzcjz_text = data.jtzc_tzzcjz_text;

          info.jtzc_qt = data.jtzc_qt;	//其他有价值资产估值(元)
          info.jtzc_qt_text = data.jtzc_qt_text;

          info.jtzc_gszc = data.jtzc_gszc //工商注册  0,  1
          info.jtzc_gszc_text = data.jtzc_gszc_text;   // 无，有
        }
        // 重新计算资产汇总值
        this.jtzcSumJson.jtzc_xjze_text = this.jtzcSumJson.jtzc_xjze = (parseInt(this.jtzcSumJson.jtzc_xjze) + parseInt(info.jtzc_scpgj)).toString();
        this.jtzcSumJson.jtzc_yhckze_text = this.jtzcSumJson.jtzc_yhckze = (parseInt(this.jtzcSumJson.jtzc_yhckze) + parseInt(info.jtzc_yhck)).toString();
        this.jtzcSumJson.jtzc_jdcls_text = this.jtzcSumJson.jtzc_jdcls = (parseInt(this.jtzcSumJson.jtzc_jdcls) + parseInt(info.jtzc_jdcsl)).toString();
        this.jtzcSumJson.jtzc_tzlzcze_text = this.jtzcSumJson.jtzc_tzlzcze = (parseInt(this.jtzcSumJson.jtzc_tzlzcze) + parseInt(info.jtzc_tzzcjz)).toString();
        this.jtzcSumJson.jtzc_qtzcze_text = this.jtzcSumJson.jtzc_qtzcze = (parseInt(this.jtzcSumJson.jtzc_qtzcze) + parseInt(info.jtzc_qt)).toString();
      });
    });
    profileModal.present();
  }

  //删除资产信息
  delPropertyInfo(item) {
    this.comm.showConfirm("CCB建融家园公租房","确认是否删除？", () => {
      //删除选定资产信息
      for (let index = 0; index < this.zgsqJson.length; index++) {
        if (this.zgsqJson[index] == item) {
          this.zgsqJson.splice(index, 1);
        }
      }
      // 资产汇总值初始化归0
      this.jtzcSumJson = new PropertyTotal();
      // 重新计算资产汇总值
      this.zgsqJson.forEach((info) => {
        this.jtzcSumJson.jtzc_xjze_text = this.jtzcSumJson.jtzc_xjze = (parseInt(this.jtzcSumJson.jtzc_xjze) + parseInt(info.jtzc_scpgj)).toString();
        this.jtzcSumJson.jtzc_yhckze_text = this.jtzcSumJson.jtzc_yhckze = (parseInt(this.jtzcSumJson.jtzc_yhckze) + parseInt(info.jtzc_yhck)).toString();
        this.jtzcSumJson.jtzc_jdcls_text = this.jtzcSumJson.jtzc_jdcls = (parseInt(this.jtzcSumJson.jtzc_jdcls) + parseInt(info.jtzc_jdcsl)).toString();
        this.jtzcSumJson.jtzc_tzlzcze_text = this.jtzcSumJson.jtzc_tzlzcze = (parseInt(this.jtzcSumJson.jtzc_tzlzcze) + parseInt(info.jtzc_tzzcjz)).toString();
        this.jtzcSumJson.jtzc_qtzcze_text = this.jtzcSumJson.jtzc_qtzcze = (parseInt(this.jtzcSumJson.jtzc_qtzcze) + parseInt(info.jtzc_qt)).toString();
      });
    }, null);
  }

  //下一步，保存
  save() {
    this.comm.showConfirm("CCB建融家园公租房","确认是否保存？", () => {
      this.jtzcSumJson.jtzc_zcsbrq_text = this.jtzcSumJson.jtzc_zcsbrq;
      let url = "saveJtzc.action";
      let body = "bpCategoryCode=web233050&wwsqbh=" + this.storage.read('timestamp') +
        "&zgsqJson=" + JSON.stringify(this.zgsqJson) + "&jtzcSumJson=" + JSON.stringify(this.jtzcSumJson);
      this.comm.showLoading('保存中...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.status == 0) {
          this.getData(response.data.data);
          this.cacheData();
          this.navCtrl.push("ReviewUploadImagePage");
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

  //缓存页面数据
  cacheData() {
    let cache = {
      jtzcSumJson: this.jtzcSumJson,
      zgsqJson: this.zgsqJson
    }
    this.storage.write('review-propertyInfoCache', cache);
  }
}

export class PropertyInfo {
  jtzc_id: string; // 家庭资产编号

  jtzc_xm: string; // 家庭资产姓名
  jtzc_xm_text: string; // 姓名

  jtzc_scpgj: string; // 现金
  jtzc_scpgj_text: string;

  jtzc_yhck: string; // 银行存款
  jtzc_yhck_text: string;

  jtzc_jdcsl: string; //机动车数量
  jtzc_jdcsl_text: string

  jtzc_tzzcjz: string; // 投资类资产价值
  jtzc_tzzcjz_text: string

  jtzc_qt: string;	//其他有价值资产估值(元)
  jtzc_qt_text: string

  jtzc_gszc: string //工商注册  0,  1
  jtzc_gszc_text: string;   // 无，有
  constructor() {
  }
}


export class PropertyTotal {
  jtzc_zcsbrq: string; //资产申报日期
  jtzc_zcsbrq_text: string;

  jtzc_xjze: string; //现金
  jtzc_xjze_text: string;

  jtzc_yhckze: string; // 银行存款
  jtzc_yhckze_text: string;

  jtzc_jdcls: string;  //机动车数量
  jtzc_jdcls_text: string;

  jtzc_tzlzcze: string; // 投资类资产价值
  jtzc_tzlzcze_text: string;

  jtzc_qtzcze: string; //其他有价值资产估值(元)
  jtzc_qtzcze_text: string;
  constructor() {
    // 初始化资产申报日期
    this.jtzc_zcsbrq = Utils.dateFormat(new Date(), 'yyyy-MM-dd');
    this.jtzc_xjze = this.jtzc_xjze_text = '0';
    this.jtzc_yhckze = this.jtzc_yhckze_text = '0';
    this.jtzc_jdcls = this.jtzc_jdcls_text = '0';
    this.jtzc_tzlzcze = this.jtzc_tzlzcze_text = '0';
    this.jtzc_qtzcze = this.jtzc_qtzcze_text = '0';

  }
}

