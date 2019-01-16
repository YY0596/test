import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../../../providers/http-service';
import { OrderComm } from '../../../../providers/order-comm';
import { StorageService } from '../../../../providers/localstorage';
import { NativeService } from '../../../../providers/NativeService';

/**
 * Generated class for the PlacementStylePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placement-style',
  templateUrl: 'placement-style.html',
})
export class PlacementStylePage {

  areaList: Array<any> = []; // 城区/县数据
  townList: Array<any> = []; // 乡镇/街道数据
  areaNotes: any; // 申请地注意事项
  homeStyleNotice: any; //申请家庭类型注意事项
  homeStyleList: Array<any> = []; // 保障家庭类型数据
  selectedArea: string; // 选择的城区/县
  selectedTown: string; // 选择的乡镇
  selectedHomeStyle: string // 选择的家庭类别
  nextPageInfo: Array<any>; // 下一步需要的信息

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    private comm: OrderComm,
    private storage: StorageService,
    private nativeService: NativeService
  ) {
  }

  ionViewDidLoad() {
    this.initApplyArea();
    this.initHomestyle();
  }

  // 初始化申请地
  initApplyArea() {
    let url = "getAllCqjdDic.action"
    let body = "aa=" + new Date();
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.areaList = response.pList.filter((x)=>{return x.cqid!="99"}); //排除掉'非本市户籍'
        this.selectedArea = this.areaList[0]['cqid'];
        this.changeArea();
      } else {
        this.nativeService.alert('申请地信息获取失败');
      }
    }, err => {
      this.nativeService.alert('申请地信息获取失败');
    });
  }
  // 初始化城镇家庭类型
  initHomestyle() {
    let url = "getDicListByKey.action"
    let body = "ywlb=BZJTLX";
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        this.homeStyleList = response.pList[0]['dicList']
        this.selectedHomeStyle = this.homeStyleList[0]['key'];
      } else {
        this.nativeService.alert('城镇家庭类型获取失败');
      }
    }, err => {
      this.nativeService.alert('城镇家庭类型获取失败');
    });
  }

  /**
   * 选择城区改变街道信息和 标注信息 
   */
  changeArea() {
    this.areaNotes = "";
    this.homeStyleNotice = "";
    let area = this.areaList.filter(x => { return (x.cqid.toString() == this.selectedArea) });
    this.townList = area[0]['chObj'];
    this.selectedTown = area[0]['chObj'][0]['jdid'];

    let url = "findTpgWwxzBySzcqAndLx.action";
    let body = "szcq=" + this.selectedArea + "&ids=22,23,24,25,26";
    this.storage.write('szcq', this.selectedArea);
    this.httpService.httpPost(9, url, body).then(response => {
      if (response.code == 0) {
        response.data.forEach(element => {
          if (element['lx'] == 23) { // 桥东区申请地注意事项（配售）
            this.areaNotes = element['nr'];
          } else if (element['lx'] == 24) { //桥东区申请类型注意事项（配售）
            this.homeStyleNotice = element['nr'];
          } else if (element['lx'] == 26) { // 桥东区收件资料说明（配售）
            // this.storage.write('review-imgInfoNotice', element['nr']);// 缓存上传图片信息注意事项
          }
        });
        this.nextPageInfo = response.data.filter(x => { return (x['lx'] != 23 && x['lx'] != 24 && x['lx'] != 26) });
      } else {
      }
    }, err => {

    });
  }

  /**
   * 选择街道信息
   */
  changeStreets() {

  }

  nextPage() {
    if (!this.selectedArea) {
      this.comm.showSmallToast("请选择申请地城区/县!");
      return;
    } else if (!this.selectedTown) {
      this.comm.showSmallToast("请选择申请地街道/乡镇 !");
      return;
    } else if (!this.selectedHomeStyle) {
      this.comm.showSmallToast("请选择保障家庭类型!");
      return;
    }

    this.storage.write('placement-sqcq', this.selectedArea);
    this.storage.write('placement-sqjd', this.selectedTown)
    this.navCtrl.push("PlacementNoticePage", { nextPageInfo: this.nextPageInfo });
  }
}
