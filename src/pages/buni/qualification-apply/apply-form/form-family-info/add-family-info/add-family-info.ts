import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpService } from '../../../../../../providers/http-service';
import { StorageService } from '../../../../../../providers/localstorage';
import { FamilyInfo } from '../form-family-info';
import { OrderComm } from '../../../../../../providers/order-comm';
import { Utils } from '../../../../../../providers/Utils';

@Component({
  selector: 'page-add-family-info',
  templateUrl: 'add-family-info.html',
})
export class AddFamilyInfoPage {
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

  jtry_gxReadOnly: boolean = false; //与申请人关系 是否只读
  jtry_xmReadOnly: boolean = false; //姓名 是否只读
  jtry_zjhmReadOnly: boolean = false; //证件号码 是否只读

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
  hjqkList: Array<any> = [];

  familyInfo: FamilyInfo = new FamilyInfo();
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public local: StorageService,
    public httpService: HttpService,
    public comm: OrderComm,
    private storage: StorageService) {
  }

  ionViewDidLoad() {
    let dicList: any = this.storage.read('qualificationApply-dicList');
    this.rygxList = dicList.filter((x) => { return x.dicName == 'ZFBZ_RYGX' })[0].dicList; //申请人关系
    this.hjqkList = dicList.filter((x) => { return x.dicName == 'SQJTHJ' })[0].dicList; // 户籍
    this.hyzkList = dicList.filter((x) => { return x.dicName == 'HYZK' })[0].dicList; // 婚姻状况
    this.xbList = dicList.filter((x) => { return x.dicName == 'XB' })[0].dicList; // 性别

    this.jtryJson = this.navParams.get('jtryJson');
    let info = this.navParams.get('item');
    if (info) { // 传过来参数表示是编辑状态
      status = 'edit';
      this.local.write("review-info", info);
      this.familyInfo = info;
      this.jtry_gxReadOnly = true;
      this.jtry_xmReadOnly = true;
      this.jtry_zjhmReadOnly = true;
    } else {
      status = 'add';
      this.jtry_gxReadOnly = false;
      this.jtry_xmReadOnly = false;
      this.jtry_zjhmReadOnly = false;
    }
  }

  //根据不同关系改变不同的值(与申请人关系)
  changeRYGX(data) {
    let gxArray = this.rygxList.filter((x) => { return x.key == data });
    this.familyInfo.jtry_gx_text = gxArray[0].value;
    if (this.familyInfo.jtry_gx == "1") {
      this.userInfo = this.local.read("userInfo");
      this.familyInfo.jtry_xm = this.userInfo.cst_Nm;
      this.familyInfo.jtry_yddh = this.userInfo.mblPh_No;
      this.familyInfo.jtry_zjhm = this.userInfo.crdt_No;
      let crdtNo: string = this.userInfo.crdt_No;
      if (parseInt(crdtNo.charAt(16)) % 2 == 1) { //基数 男性
        this.familyInfo.jtry_xb = this.xbList[0].key;
        this.familyInfo.jtry_xb_text = "男";
      } else {// 偶数 女性
        this.familyInfo.jtry_xb = this.xbList[1].key;
        this.familyInfo.jtry_xb_text = "女";
      }
    } else {
      this.familyInfo.jtry_xm = "";
      this.familyInfo.jtry_gddh = "";
      this.familyInfo.jtry_zjhm = "";
      this.familyInfo.jtry_xb = "";
    }
  }

  //性别改变
  changeXB(data) {
    let xbArray = this.xbList.filter((x) => { return x.key == data });
    if (xbArray.length > 0) {
      this.familyInfo.jtry_xb_text = xbArray[0].value;
    }
  }

  //婚姻状况改变
  changeHYZK(data) {
    let hyzkArray = this.hyzkList.filter((x) => { return x.key == data });
    if (hyzkArray.length > 0) {
      this.familyInfo.jtry_hyzk_text = hyzkArray[0].value;
    }
  }

  //户籍改变
  changeHJQK(data) {
    let hjArray = this.hjqkList.filter((x) => { return x.key == data });
    if (hjArray.length > 0) {
      this.familyInfo.jtry_hyzk_text = hjArray[0].value;
    }
  }

  save() {
    var IdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var phonePattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    if (!this.familyInfo.jtry_xm) {
      this.comm.showSmallToast("请填写姓名！");
      return;
    } else if (!this.familyInfo.jtry_gx) {
      this.comm.showSmallToast("请选择与申请人关系！");
      return;
    } else if (!this.familyInfo.jtry_zjhm) {
      this.comm.showSmallToast("请填写证件号码！");
      return;
    } else if (!this.familyInfo.jtry_zjhm.match(IdCard)) {
      this.comm.showSmallToast("证件号码输入错误！");
      return;
    } else if (!this.familyInfo.jtry_xb) {
      this.comm.showSmallToast("请选择性别！");
      return;
    } else if (!this.familyInfo.jtry_gzdw) {
      this.comm.showSmallToast("请填写工作单位！");
      return;
    } else if (!this.familyInfo.jtry_hyzk) {
      this.comm.showSmallToast("请选择婚姻状况！");
      return;
    } else if (!this.familyInfo.jtry_hj) {
      this.comm.showSmallToast("请选择户籍情况！");
      return;
    } else if (!this.familyInfo.jtry_hjdz) {
      this.comm.showSmallToast("请填写户籍所在地详细地址！");
      return;
    } else if (!this.familyInfo.jtry_jzdz) {
      this.comm.showSmallToast("请填写现居住地详细地址！");
      return;
    } else if (this.familyInfo.jtry_yddh) {
      if (!this.familyInfo.jtry_yddh.match(phonePattern)) {
        this.comm.showSmallToast("手机号码输入格式错误！");
        return;
      }
    }
    this.familyInfo.jtry_id = Utils.getRandom(12);
    console.log("familyinfo:" + JSON.stringify(this.familyInfo));
    this.viewCtrl.dismiss(this.familyInfo);

  }

  cancel() {
    if (status == 'add') {
      this.viewCtrl.dismiss(null);
    } else {
      this.viewCtrl.dismiss(this.local.read("review-info"));
    }
  }
}
