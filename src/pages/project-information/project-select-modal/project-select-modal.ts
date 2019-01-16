import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpService } from '../../../providers/http-service';
import { OrderComm } from '../../../providers/order-comm';

/**
 * Generated class for the ProjectSelectModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-project-select-modal', templateUrl: 'project-select-modal.html' })
export class ProjectSelectModalPage {
  selectOptions: any;
  zone: any = "";
  projName: string = "";
  ProjResult: Array<any> = [];
  change: any;
  //配租结果
  private params = {
    pageNo: 1,
    limit: 10
  };
  zoneList: Array<{
    parentId: string,
    name: string,
    value: number
  }> = [];
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, private comm: OrderComm) {
    this.change = this.navParams.get("change");
    this.initZone();
  }

  ionViewDidLoad() {

    this.selectOptions = {
      title: '选择房源所在地区',
      // subTitle: '选择地区',
      mode: 'md'
    };

  }
  initZone() {
    let url = "findCq.action?";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(2, url)
        .then(res => {
          this.zoneList = res;
          resolve(res);
        })
        .catch(error => {
          this
            .comm
            .showAlert("请检查网络连接！");
          reject();
        });
    });
  }
  // selectEmployment() {
  //   let ele = "name=" + this.projName + "&limit=" + this.params.limit + "&pageNo=" + this.params.pageNo;
  //   this.ProjResult = [];
  //   let url = "findXmForPage.action?";
  //   this
  //     .gettProjList(url, ele)
  //     .then(res => {
  //       // let result : any = res;
  //       // for (var i = 0; i < result.data.length; i++) {
  //       //   this
  //       //     .ProjResult
  //       //     .push({id: result.data[i].id, name: result.data[i].name});
  //       // }
  //     });
  // }
  //根据区域筛选
  filterZone() {
    let ele = "regionId=" + this.zone + "&limit=" + this.params.limit + "&pageNo=" + this.params.pageNo;
    this.ProjResult = [];
    let url = "findXmForPage.action?";
    this
      .gettProjList(url, ele)
      .then(res => {
        //  let result : any = res;

        // for (var i = 0; i < result.data.length; i++) {
        //   this
        //     .ProjResult
        //     .push({id: result.data[i].id, name: result.data[i].name});
        // }
        // this.ProjResult=res;
      });
  }
  // filterByName() {
  //   let ele = "query=" + this.projName + "&limit=10";
  //   this.ProjResult = [];
  //   let url = "findXmForFast.action?";
  //   this
  //     .gettProjList(url, ele)
  //     .then(res => {
  //       let result : any = res;
  //       for (var i = 0; i < result.data.length; i++) {
  //         this
  //           .ProjResult
  //           .push({id: result.data[i].id, name: result.data[i].name});
  //       }
  //     });
  // }

  //获取项目列表
  gettProjList(url, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(2, url + ele)
        .then(res => {
          if (res.code == 0) {
            if (res.count > 0) {
              this.ProjResult = res.data;
              resolve(res.data);
            }
            else {
              this
                .comm
                .showAlert("查询不到结果！");
              reject();
            }
          } else {
            this
              .comm
              .showAlert("查询项目信息无结果！");
            reject();
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("请检查网络连接！");
          reject();
        });
    });
  }
  chooseThisProj(item) {
    this.navCtrl.push("ProjHouseListPage", { id: item.id });
  }
  locateThisProj(item) {
    let datas = { 'item': item.shape };
    // this.viewCtrl.dismiss(data);
    let self = this;
    this.viewCtrl.dismiss().then(res => {
      self.change.emit(datas);
    });
  }
}
