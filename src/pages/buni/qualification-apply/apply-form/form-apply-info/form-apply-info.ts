import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { StorageService } from '../../../../../providers/localstorage';
import { HttpService } from '../../../../../providers/http-service';
import { OrderComm } from '../../../../../providers/order-comm';
import { NativeService } from '../../../../../providers/NativeService';

@IonicPage()
@Component({
  selector: 'page-form-apply-info',
  templateUrl: 'form-apply-info.html',
})
export class FormApplyInfoPage {
  /**
   * 页面信息request
   */
  sqrxm: string;//申请人姓名
  zjlb: string;//证件类别
  sqrzjhm: string;//证件号码

  selectedhjdcq: string;//户籍所在区
  // selectedhjdjd: string;//户籍所在街道
  // selectedhjdjw: string;//户籍所在居委

  sqrhjddz: string;//户籍地址

  selectedSqcq: string;//申请城区
  // selectedSqjd: string;//申请街道
  // selectedSqjw: string;//申请居委

  selectedBzzflx: string;//申请保障性住房类型
  jtrk: string;//家庭人口
  bzrk: string;//保障人口
  selectedJtsrqk: string;//家庭收入情况
  rjysr: string;//人均月收入
  dbzh: string;//低保证号
  dbpzsj: string;//低保证批准时间
  dbbzrs: string;//低保人数

  sqrlxdh: string;//固定电话
  sqrsjhm: string;//手机号码

  hjxxdz: string;//户籍详细地址
  jzxxdz: string;//居住地详细地址

  hjcqList: Array<any> = [];//户籍地城区list
  // hjjdList: Array<any> = [];//户籍地街道list
  // hjjwhList: Array<any> = [];//户籍地居委会list
  jzcqList: Array<any> = [];//居住地城区list
  // jzjdList: Array<any> = [];//居住地街道list
  // jzjwhList: Array<any> = [];//居住地居委会list
  ip: string; //根据不同城市获取到的域名或ip地址

  userInfo: any;//用户信息
  jtlb: any;//家庭类别
  bzzflxList: Array<any> = [];//保障住房类型
  jtsrqkList: Array<any> = [];//家庭收入情况
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
    let cache: any = this.local.read('qualificationApply-applyInfoCache');
    if (cache) {
      this.sqrxm = cache.sqrxm;
      this.sqrzjhm = cache.zjhm;
      this.selectedhjdcq = cache.selectedhjdcq;
      // this.selectedhjdjd = cache.selectedhjdjd;
      // this.selectedhjdjw = cache.selectedhjdjw;
      this.hjxxdz = cache.hjxxdz;
      this.selectedSqcq = cache.selectedSqcq;
      // this.selectedSqjd = cache.selectedSqjd;
      // this.selectedSqjw = cache.selectedSqjw;
      this.jzxxdz = cache.jzxxdz;
      this.sqrlxdh = cache.sqrlxdh;
      this.sqrsjhm = cache.sqrsjhm;
      // this.hjjdList = cache.hjjdList;
      // this.hjjwhList = cache.hjjwhList;
      // this.jzjdList = cache.jzjdList;
      // this.jzjwhList = cache.jzjwhList;

      this.sqrhjddz = cache.sqrhjddz;
      this.selectedBzzflx = cache.selectedBzzflx;
      this.jtrk = cache.jtrk;
      this.bzrk = cache.bzrk;
      this.selectedJtsrqk = cache.selectedJtsrqk;
      this.rjysr = cache.rjysr;
      this.dbzh = cache.dbzh;
      this.dbpzsj = cache.dbpzsj;
      this.dbbzrs = cache.dbbzrs;
    }
    this.navBar.backButtonClick = this.back;
    this.getuserInfo();
    // this.gethjcq();
    this.getDicList();
  }

  // 返回
  back = (e: UIEvent) => {
    this.cacheData();
    this.navCtrl.pop();
  }

  //获取登录信息
  getuserInfo() {
    this.userInfo = this.local.read("userInfo")
    this.sqrxm = this.userInfo.cst_Nm;
    this.sqrsjhm = this.userInfo.mblPh_No;
    this.sqrzjhm = this.userInfo.crdt_No;
  }
  //获取字典信息
  getDicList() {
    let url = "getDicListByKey.action";
    let body = "ywlb=BZZFLX,JTSRQK,ZFBZ_RYGX,XB,HYZK,SQJTHJ,JTZFLX";
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.jzcqList = this.hjcqList = response.pList.filter((x) => { return x.dicName == 'SQJTHJ' })[0].dicList // 城区
        this.bzzflxList = response.pList.filter((x) => { return x.dicName == 'BZZFLX' })[0].dicList // 保障住房类型
        this.jtsrqkList = response.pList.filter((x) => { return x.dicName == 'JTSRQK' })[0].dicList // 保障住房类型
        this.storage.write('qualificationApply-dicList', response.pList);
      } else {
      }
    }, err => {

    });
  }
  //户籍所属城区
  // gethjcq() {
  //   let url = 'getAllCqjdDic.action'
  //   let body = "aa=" + new Date();
  //   this.httpService.httpPost(8, url, body).then(response => {
  //     if (response.code == 0) {
  //       this.hjcqList = response.pList
  //       this.jzcqList = response.pList.filter((x) => { return x.cqid != "99" }); //排除掉'非本市户籍'
  //     } else {
  //       this.nativeService.alert('城区信息获取失败');
  //     }
  //   }, err => {
  //     this.nativeService.alert(err);
  //   });
  // }
  //改变户籍不同城区选择不同街道
  // changehjArea() {
  //   this.selectedhjdjd = "";
  //   this.selectedhjdjw = "";
  //   this.hjjwhList = [];
  //   let area = this.hjcqList.filter(x => { return (x.cqid.toString() == this.selectedhjdcq) });
  //   this.hjjdList = area[0]['chObj'];
  // }
  // changehjjd() {
  //   this.selectedhjdjw = "";
  //   let url = "getYwhDicByJdid.action?parentId=" + this.selectedhjdjd;
  //   this.httpService.httpGet(8, url).then(response => {
  //     if (response.code == 0) {
  //       this.hjjwhList = response.pList
  //     } else {
  //       this.nativeService.alert('街道信息获取失败');
  //     }
  //   }, err => {
  //     this.nativeService.alert(err);
  //   });
  // }
  //改变居住地不同城区选择不同的街道
  // changejzArea() {
  //   this.selectedSqjd = "";
  //   this.selectedSqjw = "";
  //   this.jzjwhList = [];
  //   let area = this.jzcqList.filter(x => { return (x.cqid.toString() == this.selectedSqcq) });
  //   this.jzjdList = area[0]['chObj'];
  // }
  // changejzjd() {
  //   this.selectedSqjw = "";
  //   let url = "getYwhDicByJdid.action?parentId=" + this.selectedSqjd;
  //   this.httpService.httpGet(8, url).then(response => {
  //     if (response.code == 0) {
  //       this.jzjwhList = response.pList
  //     } else {
  //       this.nativeService.alert('街道信息获取失败');
  //     }
  //   }, err => {
  //     this.nativeService.alert(err);
  //   });
  // }

  // 缓存页面上的数据
  cacheData() {
    let cache = {
      sqrxm: this.sqrxm,
      zjhm: this.sqrzjhm,
      hjxxdz: this.hjxxdz,
      jzxxdz: this.jzxxdz,
      sqrlxdh: this.sqrlxdh,
      sqrsjhm: this.sqrsjhm,
      selectedhjdcq: this.selectedhjdcq,
      // selectedhjdjd: this.selectedhjdjd,
      // selectedhjdjw: this.selectedhjdjw,
      selectedSqcq: this.selectedSqcq,
      // selectedSqjd: this.selectedSqjd,
      // selectedSqjw: this.selectedSqjw,
      // hjjdList: this.hjjdList,
      // hjjwhList: this.hjjwhList,
      // jzjdList: this.jzjdList,
      // jzjwhList: this.jzjwhList,
      sqrhjddz: this.sqrhjddz,
      selectedBzzflx: this.selectedBzzflx,
      jtrk: this.jtrk,
      bzrk: this.bzrk,
      selectedJtsrqk: this.selectedJtsrqk,
      rjysr: this.rjysr,
      dbzh: this.dbzh,
      dbpzsj: this.dbpzsj,
      dbbzrs: this.dbbzrs
    }
    this.local.write('qualificationApply-applyInfoCache', cache);
  }

  //下一步保存用户信息
  save() {
    var phonePattern = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
    var callPattern = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!this.selectedhjdcq) {
      this.comm.showSmallToast("请选择户籍所在区")
      return
    // } else if (!this.selectedhjdjd && this.selectedhjdcq != "99") {
    //   this.comm.showSmallToast("请选择户籍所在街道")
    //   return
    // } else if (!this.selectedhjdjw && this.hjjwhList.length > 0) {
    //   this.comm.showSmallToast("请选择户籍所在居委")
    //   return
    } else if (!this.sqrhjddz) {
      this.comm.showSmallToast("请填写户籍地址")
      return
    } else if (!this.selectedSqcq) {
      this.comm.showSmallToast("请选择申请城区")
      return
    // } else if (this.selectedSqjd != "99" && !this.selectedSqjd) {
    //   this.comm.showSmallToast("请选择申请街道")
    //   return
      // } else if (!this.selectedjzdjw && this.jzjwhList.length > 0) {
      //   this.comm.showSmallToast("请选择申请居委")
      //   return
    } else if (!this.selectedBzzflx) {
      this.comm.showSmallToast("请选择申请保障性住房类型")
      return;
    } else if (!this.bzrk) {
      this.comm.showSmallToast("请填写保障人口")
      return;
    } else if (!this.selectedJtsrqk) {
      this.comm.showSmallToast("请填写家庭收入情况")
      return;
    } else if (!this.rjysr) {
      this.comm.showSmallToast("请填写人均月收入")
      return;
    } else if (!this.dbzh) {
      this.comm.showSmallToast("请填写低保证号")
      return;
    } else if (!this.dbpzsj) {
      this.comm.showSmallToast("请填写低保证批准时间")
      return;
    } else if (!this.dbbzrs) {
      this.comm.showSmallToast("请填写低保人数")
      return;
    } else if (!this.sqrsjhm) {
      this.comm.showSmallToast("请填写手机号码");
      return;
    } else if (!this.sqrsjhm.match(phonePattern)) {
      this.comm.showSmallToast("手机号码输入格式错误！");
      return;
    } else {
      if (!this.sqrlxdh) {
        this.sqrlxdh = '';
      }
      this.comm.showConfirm("CCB建融家园公租房", "确认是否保存？", () => {
        var date = new Date();
        var timestamp = Date.parse(date + "") / 1000;
        this.local.write("timestamp", timestamp);
        // this.jtlb = this.local.read("qualificationApply-homeStyle")[0].key;
        // "bpCategoryCode=web233050" +
        let body = "&sqrxxDTO.id=" +
          "&sqrxxDTO.wblsh=" + timestamp +
          "&sqrxxDTO.sqrxm=" + this.sqrxm +
          "&sqrxxDTO.sqrzjlb=" + "2000" +
          "&sqrxxDTO.sqrzjhm=" + this.sqrzjhm +
          "&sqrxxDTO.sqrhjdcq=" + this.selectedhjdcq +
          // "&sqrxxDTO.sqrhjdjd=" + this.selectedhjdjd +
          // "&sqrxxDTO.sqrhjdjw=" + this.selectedhjdjw +
          "&sqrxxDTO.sqrhjddz=" + this.sqrhjddz +
          "&sqrxxDTO.sqcq=" + this.selectedSqcq +
          // "&sqrxxDTO.sqjd=" + this.selectedSqjd +
          // "&sqrxxDTO.sqjw=" + this.selectedSqjw +
          "&sqrxxDTO.bzzflx=" + this.selectedBzzflx +
          "&sqrxxDTO.jtrk=" + this.jtrk +
          "&sqrxxDTO.bzrk=" + this.bzrk +
          "&sqrxxDTO.jtsrqk=" + this.selectedJtsrqk +
          "&sqrxxDTO.rjysr=" + this.rjysr +
          "&sqrxxDTO.dbzh=" + this.dbzh +
          "&sqrxxDTO.dbpzsj=" + this.dbpzsj +
          "&sqrxxDTO.dbbzrs=" + this.dbbzrs +
          "&sqrxxDTO.sqrlxdh=" + this.sqrlxdh +
          "&sqrxxDTO.sqrsjhm=" + this.sqrsjhm;

        let url = "saveSqrxx.action";
        this.comm.showLoading('保存中...');
        this.httpService.httpPost(8, url, body).then(response => {
          if (response.success == true) {
            this.cacheData();
            this.navCtrl.push("FormFamilyInfoPage");
          } else {
            this.nativeService.alert(response.msg);
          }
          this.comm.closeLoading();
        }, err => {
          this.comm.closeLoading();
          this.nativeService.alert(err);
        }
        )
      }, null);
    }
  }
}
