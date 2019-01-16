import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpService } from '../../../../../../providers/http-service';
import { StorageService } from '../../../../../../providers/localstorage';
import { FamilyInfo } from '../change-family-info';
import { OrderComm } from '../../../../../../providers/order-comm';
import { Utils } from '../../../../../../providers/Utils';

@Component({
  selector: 'page-add-change-family-info',
  templateUrl: 'add-change-family-info.html',
})
export class AddChangeFamilyInfoPage {
  applygx: string;//人员关系
  userInfo: any;//用户登录信息
  name: string;//姓名
  phone: string; //手机号
  zjhm: string;//证件号码
  totalIncome: string;//前12个月总收入
  workUnits: string;//工作单位
  contact: string;//联系方式
  xm: string;
  xb: string;//性别
  hyzk: string;//婚姻状况
  czhj: string;//本市城镇户籍
  bsgz: string;//本市工作或居住
  bsfc: string;//转移房产
  gfyh: string;//购房优惠
  cs: string;//超生且未缴纳
  bzdx: string;//保障对象
  jtryJson: Array<FamilyInfo> = [];
  rygxList: Array<any> = [];//人员关系list
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
  familyInfo: FamilyInfo = new FamilyInfo();
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public local: StorageService,
    public httpService: HttpService,
    public comm: OrderComm) {
  }

  ionViewDidLoad() {
    this.rygxList = this.navParams.get('rygxList');
    let info = this.navParams.get('item');
    console.log(JSON.stringify(info));
    if (info) { // 传过来参数表示是编辑状态
      status = 'edit';
      this.familyInfo = info;
      this.local.write("change-info", info);
    } else {
      status = 'add';
    }
    if (this.familyInfo.jtry_isfgby == "0") {
      document.getElementById("fbykssj").hidden = true;
      document.getElementById("fbyjssj").hidden = true;
    } else {
      document.getElementById("fbykssj").hidden = false;
      document.getElementById("fbyjssj").hidden = false;
    }
  }

  //根据不同关系改变不同的值(与申请人关系)
  changeRygx(data) {
    let gxArray = this.rygxList.filter((x) => { return x.key == data });
    this.familyInfo.jtry_gx_text = gxArray[0].value;
    if (this.familyInfo.jtry_gx == "1") {
      this.userInfo = this.local.read("userInfo");
      this.familyInfo.jtry_xm = this.userInfo.cst_Nm;
      this.familyInfo.jtry_gddh = this.userInfo.mblPh_No;
      this.familyInfo.jtry_zjhm = this.userInfo.crdt_No;
      let crdtNo: string = this.userInfo.crdt_No;
      if (parseInt(crdtNo.charAt(16)) % 2 == 1) { //基数 男性
        this.familyInfo.jtry_xb = this.xbList[0].key;
        this.familyInfo.jtry_xb_text = "男";
      } else {// 偶数 女性
        this.familyInfo.jtry_xb = this.xbList[1].key;
        this.familyInfo.jtry_xb_text = "女";
      }
      this.familyInfo.jtry_sndkzpsr_text = " ";
      this.familyInfo.jtry_hyzk = " ";
      this.familyInfo.jtry_sfczhj = " ";
      this.familyInfo.jtry_sfbsgzhjz = " ";
      this.familyInfo.jtry_sfzyfc = " ";
      this.familyInfo.jtry_sfxsgyhzc = " ";
      this.familyInfo.jtry_isfgby = " ";
      this.familyInfo.jtry_fbykssj = " ";
      this.familyInfo.jtry_fbyjssj = " ";
    } else {
      this.familyInfo.jtry_xm = " ";
      this.familyInfo.jtry_gddh = " ";
      this.familyInfo.jtry_zjhm = " ";
      this.familyInfo.jtry_xb = " ";
    }
  }
  //根据不同关系改变不同的值（性别）
  changeXB(data) {
    let xbArray = this.xbList.filter((x) => { return x.key == data });
    if (xbArray.length > 0) {
      this.familyInfo.jtry_xb_text = xbArray[0].value;
    }
    console.log(this.familyInfo.jtry_xb_text);
  }
  //根据不同关系改变不同的值（婚姻状况）
  changeHYZK(data) {
    let hyzkArray = this.hyzkList.filter((x) => { return x.key == data });
    if (hyzkArray.length > 0) {
      this.familyInfo.jtry_hyzk_text = hyzkArray[0].value;
    }
    console.log(this.familyInfo.jtry_hyzk_text);
  }
  //根据不同关系改变不同的值（是否属本市城镇户籍）
  changeBSHJ(data) {
    let bshjArray = this.czhjList.filter((x) => { return x.key == data });
    if (bshjArray.length > 0) {
      this.familyInfo.jtry_sfczhj_text = bshjArray[0].value;
    }
    console.log(this.familyInfo.jtry_sfczhj_text);
  }
  //根据不同关系改变不同的值（是否在本市工作或居住）
  changeBSGZ(data) {
    let bsgzArray = this.bsgzList.filter((x) => { return x.key == data });
    if (bsgzArray.length > 0) {
      this.familyInfo.jtry_sfbsgzhjz_text = bsgzArray[0].value;
    }

    console.log(this.familyInfo.jtry_sfbsgzhjz_text);
  }
  //根据不同关系改变不同的值（是否五年内本市转移房产）
  changeZYFC(data) {
    let zyfcArray = this.bsfcList.filter((x) => { return x.key == data });
    if (zyfcArray.length > 0) {
      this.familyInfo.jtry_sfzyfc_text = zyfcArray[0].value;
    }
    console.log(this.familyInfo.jtry_sfzyfc_text);
  }
  //根据不同关系改变不同的值（是否享受过购房优惠）
  changeGFYH(data) {
    let gfyhArray = this.gfyhList.filter((x) => { return x.key == data });
    if (gfyhArray.length > 0) {
      this.familyInfo.jtry_sfxsgyhzc_text = gfyhArray[0].value;
    }
    console.log(this.familyInfo.jtry_sfxsgyhzc_text);
  }
  //根据不同关系改变不同的值（是否服过兵役）
  changeFBY(data) {
    this.familyInfo.jtry_fbyjssj = "";
    this.familyInfo.jtry_fbykssj = "";
    let fbyArray = this.fbyList.filter((x) => { return x.key == data });
    if (fbyArray.length > 0) {
      this.familyInfo.jtry_isfgby_text = fbyArray[0].value;
    }

    if (this.familyInfo.jtry_isfgby == "0") {
      console.log("服兵役开始时间：" + this.familyInfo.jtry_fbykssj);
      document.getElementById("fbykssj").hidden = true;
      document.getElementById("fbyjssj").hidden = true;
    } else {
      document.getElementById("fbykssj").hidden = false;
      document.getElementById("fbyjssj").hidden = false;
    }
    console.log(this.familyInfo.jtry_isfgby_text);
  }

  save() {
    console.log("===" + JSON.stringify(this.familyInfo));
    console.log("this.familyInfo.jtry_gx:" + this.familyInfo.jtry_gx);
    console.log("this.familyInfo.jtry_xm:" + this.familyInfo.jtry_xm);
    console.log("this.familyInfo.jtry_zjhm:" + this.familyInfo.jtry_zjhm);
    console.log("this.familyInfo.jtry_gddh:" + this.familyInfo.jtry_gddh);
    console.log("this.familyInfo.jtry_xb:" + this.familyInfo.jtry_xb);
    console.log("this.familyInfo.jtry_sndkzpsr_text:" + this.familyInfo.jtry_sndkzpsr_text);
    console.log("this.familyInfo.jtry_hyzk:" + this.familyInfo.jtry_hyzk);
    console.log("this.familyInfo.jtry_sfczhj:" + this.familyInfo.jtry_sfczhj);
    console.log("this.familyInfo.jtry_gzdw:" + this.familyInfo.jtry_gzdw);
    console.log("this.familyInfo.jtry_sfbsgzhjz:" + this.familyInfo.jtry_sfbsgzhjz);
    console.log("this.familyInfo.jtry_sfzyfc:" + this.familyInfo.jtry_sfzyfc);
    console.log("this.familyInfo.jtry_sfxsgyhzc:" + this.familyInfo.jtry_sfxsgyhzc);
    console.log("this.familyInfo.jtry_isfgby:" + this.familyInfo.jtry_isfgby);
    var IdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var phonePattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!this.familyInfo.jtry_gx.toString().trim()) {
      this.comm.showSmallToast("请选择预申请人关系！");
      return;
    } else if (!this.familyInfo.jtry_xm.toString().trim()) {
      this.comm.showSmallToast("请输入姓名！");
      return;
    } else if (!this.familyInfo.jtry_zjhm.trim().toString().trim()) {
      this.comm.showSmallToast("请输入证件号码！");
      return;
    } else if (!this.familyInfo.jtry_gddh.toString().trim().match(phonePattern)) {
      this.comm.showSmallToast("手机号码输入格式错误！");
      return;
    } else if (!this.familyInfo.jtry_zjhm.toString().trim().match(IdCard)) {
      this.comm.showSmallToast("证件号码输入错误！");
      return;
    } else if (!this.familyInfo.jtry_xb.toString().trim()) {
      this.comm.showSmallToast("请选择性别！");
      return;
    } else if (!this.familyInfo.jtry_sndkzpsr_text.toString().trim()) {
      this.comm.showSmallToast("请输入上年度可支配收入！");
      return;
    } else if (!this.familyInfo.jtry_hyzk.toString().trim()) {
      this.comm.showSmallToast("请选择婚姻状况！");
      return;
    } else if (!this.familyInfo.jtry_sfczhj.toString().trim()) {
      this.comm.showSmallToast("请选择是否属本市城镇户籍！");
      return;
    } else if (!this.familyInfo.jtry_gzdw.toString().trim()) {
      this.comm.showSmallToast("请输入工作单位！");
      return;
    }
    else if (!this.familyInfo.jtry_sfbsgzhjz.toString().trim()) {
      this.comm.showSmallToast("请选择是否在本市工作或居住！");
      return;
    } else if (!this.familyInfo.jtry_sfzyfc.toString().trim()) {
      this.comm.showSmallToast("请选择是否五年内本市转移房产！");
      return;
    } else if (!this.familyInfo.jtry_sfxsgyhzc.toString().trim()) {
      this.comm.showSmallToast("请选择是否享受过购房优惠！");
      return;
    }
    else if (!this.familyInfo.jtry_isfgby.toString().trim()) {
      this.comm.showSmallToast("请选择是否服过兵役！");
      return;
    } else if (this.familyInfo.jtry_isfgby == "1" && !this.familyInfo.jtry_fbykssj.toString().trim()) {
      this.comm.showSmallToast("请选择服兵役开始时间！");
      return;
    } else if (this.familyInfo.jtry_isfgby == "1" && !this.familyInfo.jtry_fbyjssj.toString().trim()) {
      this.comm.showSmallToast("请选择服兵役结束时间！");
      return;
    } else if (Date.parse(this.familyInfo.jtry_fbykssj) > Date.parse(this.familyInfo.jtry_fbyjssj)) {
      this.comm.showSmallToast("服兵役开始时间不能大于服兵役结束时间！")
      return;
    }
    else {
      this.familyInfo.jtry_id = Utils.getRandom(12);
      if (this.familyInfo.jtry_isfgby == "1") {
        this.familyInfo.jtry_fbyjssj_text = this.familyInfo.jtry_fbyjssj;
        this.familyInfo.jtry_fbykssj_text = this.familyInfo.jtry_fbykssj;
      } else {
        this.familyInfo.jtry_fbyjssj_text = "";
        this.familyInfo.jtry_fbykssj_text = "";
      }
      console.log("familyinfo:" + JSON.stringify(this.familyInfo));
      this.familyInfo.jtry_bz = "";
      this.familyInfo.jtry_sndkzpsr = this.familyInfo.jtry_sndkzpsr_text;
      this.viewCtrl.dismiss(this.familyInfo);
    }
  }

  cancel() {

    if (status == 'add') {
      this.viewCtrl.dismiss(null);
    } else {
      this.viewCtrl.dismiss(this.local.read("change-info"));
    }
  }
}
