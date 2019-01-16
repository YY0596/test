import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { StorageService } from '../../../../../providers/localstorage';
import { HttpService } from '../../../../../providers/http-service';
import { OrderComm } from '../../../../../providers/order-comm';
import { NativeService } from '../../../../../providers/NativeService';

@IonicPage()
@Component({
  selector: 'page-form-apply-info',
  templateUrl: 'change-apply-info.html',
})
export class ChangeApplyInfoPage {
  cache: any;//缓存
  sqrxm: string;//申请人姓名
  zjlb: string;//证件类别
  zjhm: string;//证件号码
  phone: string;//手机号码
  zgzh: string;//资格证号
  userInfo: any;//用户信息
  jtlb: any;//家庭类别
  selectedhjdcq: string;//户籍所属城区
  selectedhjdjd: string;//户籍所属街道
  selectedhjdjwh: string;//户籍居委会
  selectedjzdcq: string;//居住地所属城区
  selectedjzdjd: string;//居住地所属街道
  selectedjzdjwh: string;//居住地居委会
  hjxxdz: string;//户籍详细地址
  jzxxdz: string;//居住地详细地址
  call: string;//固话
  hjcqList: Array<any> = [];//户籍地城区list
  hjjdList: Array<any> = [];//户籍地街道list
  hjjwhList: Array<any> = [];//户籍地居委会list
  jzcqList: Array<any> = [];//居住地城区list
  jzjdList: Array<any> = [];//居住地街道list
  jzjwhList: Array<any> = [];//居住地居委会list
  ip: string; //根据不同城市获取到的域名或ip地址
  code: string; // 沿用保障申请审核的code值
  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public local: StorageService,
    public httpService: HttpService,
    private comm: OrderComm,
    private nativeService: NativeService,
    private storage: StorageService
  ) {
  }

  ionViewDidLoad() {
    this.userInfo = this.local.read("userInfo");
    this.cache = this.local.read('change-applyInfoCache');
    if (this.cache) {
      if (this.cache.zjhm == this.userInfo.crdt_No) {
        this.sqrxm = this.cache.sqrxm;
        this.zjhm = this.cache.zjhm;
        this.selectedhjdcq = this.cache.selectedhjdcq;
        this.selectedhjdjd = this.cache.selectedhjdjd;
        this.selectedhjdjwh = this.cache.selectedhjdjwh;
        this.hjxxdz = this.cache.hjxxdz;
        this.selectedjzdcq = this.cache.selectedjzdcq;
        this.selectedjzdjd = this.cache.selectedjzdjd;
        this.selectedjzdjwh = this.cache.selectedjzdjwh;
        this.jzxxdz = this.cache.jzxxdz;
        this.call = this.cache.call;
        this.phone = this.cache.phone;
        this.zgzh = this.cache.zgzh;
        this.hjjdList = this.cache.hjjdList;
        this.hjjwhList = this.cache.hjjwhList;
        this.jzjdList = this.cache.jzjdList;
        this.jzjwhList = this.cache.jzjwhList;
      } else { // 如果缓存信息的身份证号不是当前登陆的用户则清除所有缓存信息
        this.storage.remove('change-applyInfoCache');
        this.storage.remove('change-familyInfoCache');
        this.storage.remove('change-houseInfoCache');
        this.storage.remove('change-propertyInfoCache');
        this.storage.remove('change-jtryList');
      }
    }
    this.navBar.backButtonClick = this.back;
    this.getuserInfo();
    this.gethjcq();
  }

  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }
  //获取申请信息
  getSqrxx() {
    this.userInfo = this.local.read("userInfo");
    let url = "getSqxxOfJtxxbg.action";
    let body = "zjlx=1000" + "&zjhm=" + this.userInfo.crdt_No;
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.zgzh = response.sqxx.zgzh;
        this.selectedhjdcq = response.sqxx.sqrhjdcq;
        let hjarea = this.hjcqList.filter(x => { return (x.cqid.toString() == this.selectedhjdcq) });
        this.hjjdList = hjarea[0]['chObj'];
        this.selectedhjdjd = response.sqxx.sqrhjdjd;
        this.code = response.sqxx.code;
        if (!this.cache) {
          this.gethjjwhList();
        }
        this.selectedhjdjwh = response.sqxx.sqrhjdjw;
        this.hjxxdz = response.sqxx.sqrhjddz;
        this.selectedjzdcq = response.sqxx.sqrjzdcq;
        let jdarea = this.jzcqList.filter(x => { return (x.cqid.toString() == this.selectedjzdcq) });
        this.jzjdList = jdarea[0]['chObj'];
        this.selectedjzdjd = response.sqxx.sqrjzdjd;
        if (!this.cache) {
          this.getjzjwhList();
        }

        this.selectedjzdjwh = response.sqxx.sqrjddjw;
        this.jzxxdz = response.sqxx.sqrjzddz;
        this.call = response.sqxx.sqrlxdh;
        this.phone = response.sqxx.sqrsjhm;

      } else {
        this.nativeService.alert('申请信息获取失败');
      }
    }, err => {
      this.nativeService.alert(err);
    });
  }
  //获取登录信息
  getuserInfo() {
    this.userInfo = this.local.read("userInfo")
    this.sqrxm = this.userInfo.cst_Nm;
    this.phone = this.userInfo.mblPh_No;
    this.zjhm = this.userInfo.crdt_No;
  }
  //户籍所属城区
  gethjcq() {
    let url = 'getAllCqjdDic.action'
    let body = "aa=" + new Date();
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.hjcqList = response.pList
        this.jzcqList = response.pList.filter((x)=>{return x.cqid!="99"}); //排除掉'非本市户籍'
        this.getSqrxx();
      } else {
        this.nativeService.alert('城区信息获取失败');
      }
    }, err => {
      this.nativeService.alert(err);
    });
  }
  //改变户籍不同城区选择不同街道
  changehjArea() {
    if (!this.cache) {
      this.selectedhjdjd = "";
      this.selectedhjdjwh = "";
    }
    this.hjjwhList = [];
    let area = this.hjcqList.filter(x => { return (x.cqid.toString() == this.selectedhjdcq) });
    this.hjjdList = area[0]['chObj'];
  }
  changehjjd() {
    if (!this.cache) {
      this.selectedhjdjwh = "";
    }
    this.gethjjwhList();
  }
  //获取户籍居委会
  gethjjwhList() {
    let url = "getYwhDicByJdid.action?parentId=" + this.selectedhjdjd;
    this.httpService.httpGet(8, url).then(response => {
      if (response.code == 0) {
        this.hjjwhList = response.pList
      } else {
        this.nativeService.alert('居委会信息获取失败');
      }
    }, err => {
      this.nativeService.alert(err);
    });
  }
  //改变居住地不同城区选择不同的街道
  changejzArea() {
    if (!this.cache) {
      this.selectedjzdjd = "";
      this.selectedjzdjwh = "";
    }
    this.jzjwhList = [];
    let area = this.jzcqList.filter(x => { return (x.cqid.toString() == this.selectedjzdcq) });
    this.jzjdList = area[0]['chObj'];
  }
  changejzjd() {
    if (!this.cache) {
      this.selectedjzdjwh = "";
    }
    this.getjzjwhList();
  }
  //获取居住地居委会
  getjzjwhList() {
    let url = "getYwhDicByJdid.action?parentId=" + this.selectedjzdjd;
    this.httpService.httpGet(8, url).then(response => {
      if (response.code == 0) {
        this.jzjwhList = response.pList
      } else {
        this.nativeService.alert('街道信息获取失败');
      }
    }, err => {
      this.nativeService.alert(err);
    });
  }
  // 缓存页面上的数据
  cacheData() {
    let cache = {
      sqrxm: this.sqrxm,
      zjhm: this.zjhm,
      hjxxdz: this.hjxxdz,
      jzxxdz: this.jzxxdz,
      call: this.call,
      zgzh: this.zgzh,
      phone: this.phone,
      selectedhjdcq: this.selectedhjdcq,
      selectedhjdjd: this.selectedhjdjd,
      selectedhjdjwh: this.selectedhjdjwh,
      selectedjzdcq: this.selectedjzdcq,
      selectedjzdjd: this.selectedjzdjd,
      selectedjzdjwh: this.selectedjzdjwh,
      hjjdList: this.hjjdList,
      hjjwhList: this.hjjwhList,
      jzjdList: this.jzjdList,
      jzjwhList: this.jzjwhList
    }
    this.local.write('change-applyInfoCache', cache);
  }

  //保存申请信息 
  saveSqrxx(wblsh, jtlb, sqcq, sqjd, sqrxm, sqrzjlb, sqrzjhm, sqrhjdcq, sqrhjdjd,
    sqrhjdjw, sqrhjddz, sqrjzdcq, sqrjzdjd, sqrjddjw, sqrjzddz, sqrlxdh, sqrsjhm) {
    let ele = "bpCategoryCode=web233051" + "&sqrxxDTO.id=" + "&sqrxxDTO.wblsh=" + wblsh + "&sqrxxDTO.jtlb=" + jtlb + "&sqrxxDTO.code=" + this.code + "&sqrxxDTO.sqcq=" + sqcq +
      "&sqrxxDTO.sqjd=" + sqjd + "&sqrxxDTO.sqrxm=" + sqrxm + "&sqrxxDTO.sqrzjlb=" + "2000" + "&sqrxxDTO.sqrzjhm=" + sqrzjhm + "&sqrxxDTO.zgzh=" + this.zgzh +
      "&sqrxxDTO.sqrhjdcq=" + sqrhjdcq + "&sqrxxDTO.sqrhjdjd=" + sqrhjdjd + "&sqrxxDTO.sqrhjdjw=" + sqrhjdjw + "&sqrxxDTO.sqrhjddz=" + sqrhjddz +
      "&sqrxxDTO.sqrjzdcq=" + sqrjzdcq + "&sqrxxDTO.sqrjzdjd=" + sqrjzdjd + "&sqrxxDTO.sqrjddjw=" + sqrjddjw + "&sqrxxDTO.sqrjzddz=" + sqrjzddz + "&sqrxxDTO.sqrlxdh=" + sqrlxdh + "&sqrxxDTO.sqrsjhm=" + sqrsjhm;
    let url = "saveSqrxx.action";
    this.comm.showLoading('保存中...');
    this.httpService.httpPost(8, url, ele).then(response => {
      if (response.success == true) {
        this.cacheData();
        this.navCtrl.push("ChangeFamilyInfoPage", { wwsqbh: wblsh });
      } else {
        this.nativeService.alert(response.msg);
      }
      this.comm.closeLoading();
    }, err => {
      this.comm.closeLoading();
      this.nativeService.alert(err);
    }
    )
  }

  //下一步保存用户信息
  save() {
    console.log(this.selectedhjdcq + "========" + this.selectedhjdjd + "=========" + this.selectedjzdcq + "=======" +
      this.selectedjzdjd + "========" + this.phone + "======" + this.call + "======" + this.hjxxdz + "======" + this.jzxxdz + "=====" +
      this.sqrxm + "=====" + this.zjhm);
    var phonePattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    var callPattern = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!this.selectedhjdcq) {
      this.comm.showSmallToast("请选择户籍地所属城区/县")
      return
    } else if (!this.selectedhjdjd && this.selectedhjdcq != "99") {
      this.comm.showSmallToast("请选择户籍地所属街道/乡镇")
      return
    } else if (!this.selectedhjdjwh && this.hjjwhList.length > 0) {
      this.comm.showSmallToast("请选择户籍地所属居委会")
      return
    } else if (!this.selectedjzdcq) {
      this.comm.showSmallToast("请选择居住地所属城区/县")
      return
    } else if (this.selectedjzdcq != "99" && !this.selectedjzdjd) {
      this.comm.showSmallToast("请选择居住地所属街道/乡镇")
      return
    } else if (!this.selectedjzdjwh && this.jzjwhList.length > 0) {
      this.comm.showSmallToast("请选择居住地所属居委会")
      return
    } else if (!this.phone.match(phonePattern)) {
      this.comm.showSmallToast("手机号码输入格式错误！");
      return;
    } else if (!this.hjxxdz) {
      this.comm.showSmallToast("请输入户籍地址");
      return;
    } else if (!this.jzxxdz) {
      this.comm.showSmallToast("请输入居住地地址");
      return;
    } else {
      if (!this.call) {
        this.call = '';
      }
      this.comm.showConfirm("CCB建融家园公租房","确认是否保存？", () => {
        var date = new Date();
        var timestamp = Date.parse(date + "") / 1000;
        this.local.write("timestamp", timestamp);
        this.jtlb = this.local.read("change-homeStyle")[0].key;
        this.saveSqrxx(timestamp, this.jtlb, this.selectedhjdcq, this.selectedhjdjd,
          this.sqrxm, this.zjlb, this.zjhm, this.selectedhjdcq, this.selectedhjdjd, this.selectedhjdjwh,
          this.hjxxdz, this.selectedjzdcq, this.selectedjzdjd, this.selectedjzdjwh, this.jzxxdz, this.call, this.phone);
      }, null);
    }
  }
}
