import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime, Navbar } from 'ionic-angular';
import { HttpService } from '../../providers/http-service';
import { OrderComm } from '../../providers/order-comm';
import { StorageService } from '../../providers/localstorage';

/**
 * Generated class for the PrepareApplyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prepare-apply',
  templateUrl: 'prepare-apply.html',
})
export class PrepareApplyPage {
  @ViewChild(Navbar) navBar: Navbar;
  city: any;
  userInfo: any;
  sqrxm: string = "";    //申请人姓名
  zjhm: string = "";     //证件号码
  lxdh: string = "";     //联系电话
  jtsr: string = "";     //家庭收入
  jtzfqk: string = "";   //家庭住房情况
  fwzl: string = "";     //房屋坐落
  jzmj: string = "";     //建筑面积 
  hjszdxxdz: string = "";//户籍所在地详细地址 
  marriage: string = ""; //婚姻状况
  sex: string = "";      //性别
  zjlx: string = "";     //证件类型
  cq: string = "";       //城区
  jd: string = "";       //街道
  jwh: string = "";      //居委会
  jtsrfs: string = "";   //家庭收入方式
  hjqk: string = "";     //户籍情况
  sexList: Array<{
    key: number,
    value: string
  }> = [];
  zjlxList: Array<{
    key: number,
    value: string
  }> = [];
  marriageList: Array<{
    key: number,
    value: string
  }> = [];
  cqList: Array<{
    cqid: number,
    cqmc: string,
    chObj: any
  }> = [];
  jdList: Array<{
    cqid: number,
    jdid: number,
    jdmc: string
  }> = [];
  jwhList: Array<{
    cqid: number,
    cqmc: string
  }> = [];
  hjqkList: Array<{
    any
  }> = [];
  jtcyList: Array<{
    any
  }> = [];
  jtzfqkList: Array<{
    jtzfid: number,
    jtzf: string
  }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService,
    private comm: OrderComm, private local: StorageService) {
    this.sqrxm = navParams.get("name");
    this.zjhm = navParams.get("cardId");
    this.city = navParams.get("city");
  }
  ionViewDidLoad() {
    this.getHomeIncomeType(this.city);
    // if (this.local.read("jtsrfs") == 0) {
    //   this.jtsrfs = "家庭月收入";
    // }else{
    //   this.jtsrfs = "家庭年收入";
    // }
    this.getZJLB_GR();
    this.getXB();
    this.getMarriage();
    this.getSQJTHJ();
    this.getJTZFQK();
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    this.city = this.local.read("city");
    this.userInfo = this.local.read("userInfo");
    if (this.userInfo != null) {
      this.navCtrl.setRoot("HomePage", { param: this.city });
    } else {
      this.navCtrl.pop();
    }
  }
  //证件类型接口 
  getZJLB_GR() {
    let ele = "ywlb=ZJLB_GR";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "getDicListByKey.action?", ele)
        .then(res => {
          if (res.code == 0) {
            this.zjlxList = res.pList[0].dicList
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //性别接口
  getXB() {
    let ele = "ywlb=XB";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "getDicListByKey.action?", ele)
        .then(res => {
          if (res.code == 0) {
            // this.comm.showAlert(res.pList[0].dicList);
            this.sexList = res.pList[0].dicList
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //婚姻状况接口
  getMarriage() {
    let ele = "ywlb=HYZK";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "getDicListByKey.action?", ele)
        .then(res => {
          if (res.code == 0) {
            // this.comm.showAlert(res.pList[0].dicList);
            this.marriageList = res.pList[0].dicList
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //家庭住房情况
  getJTZFQK() {
    let ele = "ywlb=JTZFLX";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "getDicListByKey.action?", ele)
        .then(res => {
          if (res.code == 0) {
            if (res.pList.length > 0) {
              this.jtzfqkList = res.pList[0].dicList
            }
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //户籍情况
  getSQJTHJ() {
    let ele = "ywlb=SQJTHJ" + "&id=" + "1";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "getDicListByKey.action?", ele)
        .then(res => {
          this.hjqkList = res.pList[0].dicList;
        })
        .catch(error => {
          reject();
        });
    });
  }
  //下一步提交
  next() {
    var pattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (this.sex.length == 0) {
      this.comm.showSmallToast("请选择性别！");
      return;
    } else if (this.lxdh.length == 0) {
      this.comm.showSmallToast("请输入联系电话！");
      return;
    } else if (!this.lxdh.match(pattern)) {
      this.comm.showSmallToast("联系电话输入格式错误！");
      return;
    } else if (this.jtsr.length == 0) {
      this.comm.showSmallToast("请输入家庭收入资金！");
      return;
    } else if (this.hjqk == "") {
      this.comm.showSmallToast("请选择户籍情况！");
      return;
    } else {
      this.comm.showConfirm("CCB建融家园公租房", "请确认是否提交您的预申请信息!", () => {
        var date = new Date();
        var timestamp = Date.parse(date + "") / 1000;
        this.saveApplyInformation(timestamp, this.sqrxm, this.zjlx, this.zjhm,
          this.sex, this.lxdh, this.jtsr, this.jtzfqk, this.fwzl, this.jzmj, this.marriage,
          this.hjqk, this.hjszdxxdz, this.cq, this.jd, this.jwh);
      }, null);
    }
  }
  //申请人信息
  saveApplyInformation(timestamp, sqrxm, zjlx, zjhm, xb, lxdh, jtsr, jtzfqk, fwzl, jzmj, hyzk, hjqk, hjszdxxdz, cqid, jdid, jwhid) {
    let ele = "sqrxxDTO.id=" + "&sqrxxDTO.wblsh=" + timestamp + "&sqrxxDTO.hjszcqmc=" +
      "&sqrxxDTO.hjszjdmc=" + "&sqrxxDTO.hjssjwhmc=" + "&sqrxxDTO.jzdszcqmc=" +
      "&sqrxxDTO.jzdszjdmc=" + "&sqrxxDTO.jzdssjwhmc=" + "&sqrxxDTO.xm=" + sqrxm + "&sqrxxDTO.zjlb=" + "2000" +
      "&sqrxxDTO.zjhm=" + zjhm + "&sqrxxDTO.bzfs=" + "&sqrxxDTO.hjszcq=" + cqid + "&sqrxxDTO.hjszjd=" + jdid +
      "&sqrxxDTO.hjssjwh=" + jwhid + "&sqrxxDTO.hjdz=" + hjszdxxdz + "&sqrxxDTO.bzzflx=" + "2" + "&sqrxxDTO.bzrk=" +
      "1" + "&sqrxxDTO.jtrk=" + "1" + "&sqrxxDTO.jtsrqk=" + "2" + "&sqrxxDTO.rjysr=" + jtsr;

    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "saveSqrxx.action?", ele)
        .then(res => {
          if (res.success == true) {
            this.comm.showSmallToast("申请信息保存成功！");
            this.local.write("sqrxxid", res.sqrxxid);
            this.navCtrl.push("UploadImagePage");
            this.local.write("timestamp", timestamp);
            this.saveHomeMemberInformation(timestamp);
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //家庭成员信息
  saveHomeMemberInformation(timestamp) {
    let zgsqArray = [{
      "jtry_id": "", "jtry_xm": this.sqrxm, "jtry_gx": "1", "jtry_gx_text": "申请人", "jtry_zjhm": this.zjhm,
      "jtry_xb": this.sex, "jtry_xb_text": "", "jtry_gzdw": "", "jtry_hyzk": this.marriage, "jtry_hyzk_text": "",
      "jtry_hj": this.hjqk, "jtry_hj_text": "", "jtry_hjdz": this.hjszdxxdz, "jtry_jzdz": "",
      "jtry_gddh": "", "jtry_yddh": this.lxdh
    }]
    let jtryJson = JSON.stringify(zgsqArray);
    let ele = "jtryJson=" + jtryJson + "&wwsqbh=" + timestamp
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "saveJtry.action?", ele)
        .then(res => {
          if (res.status == 0) {
            this.saveHomeHouseInformation(timestamp);

          }
        })
        .catch(error => {
          reject();
        });
    });
  }
  //家庭住房情况
  saveHomeHouseInformation(timestamp) {
    let zfqkArray = [{
      "jtzf_id": "", "jtzf_jtzflx": this.jtzfqk, "jtzf_jtzflx_text": "",
      "jtzf_cqr": this.sqrxm, "jtzf_fwzl": this.fwzl, "jtzf_jzmj": this.jzmj, "jtzf_jzmj_text": this.jzmj,
      "jtzf_zysj": "", "jtzf_zysj_text": ""
    }]
    let zfqkJson = JSON.stringify(zfqkArray);
    let ele = "zfqkJson=" + zfqkJson + "&wwsqbh=" + timestamp;
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(7, "saveJtzfqkxx.action?", ele)
        .then(res => {

        })
        .catch(error => {
          reject();
        });
    });
  }
  //判断城市家庭收入方式，是否是年收入还是月收入
  getHomeIncomeType(city) {
    let ele = "cityCodeTscs.cityNo=" + "&cityCodeTscs.cityName=" + city;
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpPost(5, "getCityTscsList.action", ele)
        .then(res => {
          // if (city == "长寿" || city == "重庆" || city=="绍兴")
          // this.jtsrfs = "家庭月收入";
          // else
          //   this.local.write("jtsrfs", res.data[0].yearOrMonth); //0代表月收入方式，1代表年收入
          if (res.data.length > 0) {
            if (res.data[0].yearOrMonth == 0) {
              this.jtsrfs = "家庭月收入";
            } else if (city == "长寿" || city == "重庆" || city == "绍兴") {
              this.jtsrfs = "家庭月收入";
            } else {
              this.jtsrfs = "家庭年收入";
            }
          } else {
            this.jtsrfs = "家庭年收入";
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
}
