import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpService } from '../../providers/http-service';
import { OrderComm } from '../../providers/order-comm';

/**
 * Generated class for the ProjHouseListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-proj-house-list', templateUrl: 'proj-house-list.html' })
export class ProjHouseListPage {
  projId: string = "";
  dh: string = "";
  fh: string = "";
  canLoadMore: boolean = true;
  private params = {
    pageNo: 1,
    limit: 10
  };
  houseList: Array<{
    "sortnum": string,
    "xqmc": string,
    "dh": string,
    "fh": string,
    "fwcx": string,
    "mj": string,
    "dyh": string,
    "zjbz": string
  }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService, private comm: OrderComm) {
    let id = navParams.get("id");
    if (id != undefined) {
      this.projId = id;
    }
  }

  ionViewDidLoad() {

    let ele = "limit=" + this.params.limit + "&pageNo=" + this.params.pageNo + "&projectId=" + this.projId + "&buildno=" + this.dh + "&houseno=" + this.fh;
    let self = this;
    this
      .getPolicyByID(this.houseList, ele)
      .then(res => {
        self.params.pageNo++;
      });
  }

  selectByCondition() {
    this.params.pageNo = 1;
    this.houseList = [];
    let ele = "limit=" + this.params.limit + "&pageNo=" + this.params.pageNo + "&projectId=" + this.projId + "&buildno=" + this.dh + "&houseno=" + this.fh;
    let self = this;
    this
      .getPolicyByID(this.houseList, ele)
      .then(res => {
        self.params.pageNo++;
      });
  }
  //根据项目id获取政策信息
  getPolicyByID(list, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(2, "findfyxxForPage.action?" + ele)
        .then(res => {
          if (res.code == 0) {
            if (res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                list.push({
                  "sortnum": res.data[i].sortnum,
                  "xqmc": res.data[i].xqmc,
                  "dh": res.data[i].dh,
                  "fh": res.data[i].fh,
                  "dyh": res.data[i].dyh,
                  "fwcx": res.data[i].fwcx,
                  "mj": res.data[i].mj,
                  "zjbz": res.data[i].zjbz
                });
              }
            }
            else{
              this
              .comm
              .showAlert("查询不到结果！");
            }
            resolve(res.data.length);
          } else {
            this
              .comm
              .showAlert("网络连接错误！请联系系统管理员！");
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("未查到结果");
          reject();
        });
    });
  }

  //上拉刷新
  doInfinite(infiniteScroll) {

    let ele: any = "";
    let self = this;
    setTimeout(() => {
      ele = "limit=" + self.params.limit + "&pageNo=" + self.params.pageNo + "&projectId=" + self.projId + "&buildno=" + self.dh + "&houseno=" + self.fh;
      self
        .getPolicyByID(self.houseList, ele)
        .then(res => {
          if (res == 0) {
            self.canLoadMore = false;
            infiniteScroll.enable(false);
            self
              .comm
              .showLoadingEx("没有更多了！", 500);
          } else {
            self.params.pageNo++;
          }
          infiniteScroll.complete();
        });
    }, 500); // 延迟500ms
  }
}
