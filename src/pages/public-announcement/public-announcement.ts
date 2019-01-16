import { Component, ViewChild, Injector } from '@angular/core';
import { Slides, InfiniteScroll, IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderComm } from '../../providers/order-comm';
import { HttpService } from '../../providers/http-service';
import { ChangeDetectorRef } from '@angular/core';
import { DHCPage } from '../../components/index';
import { SERVICE_ACTIONS } from '../../app/config';
/**
 * Generated class for the PublicAnnouncementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-public-announcement', templateUrl: 'public-announcement.html' })
export class PublicAnnouncementPage extends DHCPage {
  @ViewChild('contentSlider') contentSlider: Slides;
  kind: any = "QualificationApplication";
  canLoadMoreQualificationApplications: boolean = true;
  ifFirstInQualificationApplications: boolean = true;
  canLoadMoreAuditResults: boolean = true;
  ifFirstInAuditResults: boolean = true;
  canLoadMoreRentResults: boolean = true;
  ifFirstInRentResults: boolean = true;
  QualificationApplications: Array<{
    title: string,
    time: string
  }> = [];
  AuditResults: Array<{
    title: string,
    time: string
  }> = [];
  RentResults: Array<{
    title: string,
    time: string
  }> = [];
  //资格申请
  private paramsQualificationApplications = {
    page: 1,
    limit: 10
  };
  //审核结果
  private paramsAuditResults = {
    page: 1,
    limit: 10
  };
  //配租结果
  private paramsRentResults = {
    page: 1,
    limit: 10
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public cd: ChangeDetectorRef, public comm: OrderComm, public httpService: HttpService, private _inject: Injector) {
    super(_inject); //构造基类对象，传入DI容器
  }

  ionViewDidLoad() {

    this.selectQualificationApplications();

  }
  //segment切换
  selectedChange(val) {
    this
      .contentSlider
      .slideTo(val, 500);
    if (val == 0) {
      this.QualificationApplications = [];
      this.paramsQualificationApplications.page = 1;
      this.kind = "QualificationApplication";
    } else if (val == 1) {
      this.AuditResults = [];
      this.paramsAuditResults.page = 1;
      this.kind = "AuditResult";
    } else {
      this.RentResults = [];
      this.paramsRentResults.page = 1;
      this.kind = "RentResult";
    }
  }
  //slide切换
  onSlideChanged() {
    let currentIndex = this
      .contentSlider
      .getActiveIndex();
    if (currentIndex == 0) {
      this
        .contentSlider
        .slideTo(0, 500);
      this.kind = "QualificationApplication";
      // if (this.ifFirstInQualificationApplications) {

      this.selectQualificationApplications();
      // }

    } else if (currentIndex == 1) {
      this
        .contentSlider
        .slideTo(1, 500);
      this.kind = "AuditResult";
      // if (this.ifFirstInAuditResults) {

      this.selectAuditResults();
      // }

    } else {
      this
        .contentSlider
        .slideTo(2, 500);
      this.kind = "RentResult";
      // if (this.ifFirstInRentResults) {

      this.selectRentResults();
      // }
    }
  }

  //资格申请上拉刷新
  doInfiniteQualificationApplications(infiniteScroll: InfiniteScroll) {

    setTimeout(() => {
      let params = {
        page: this.paramsQualificationApplications.page,
        limit: this.paramsQualificationApplications.limit,
        jggsType: 1
      }
      this
        .getAllQualificationApplications(this.QualificationApplications, params)
        .then(res => {
          if (res == 0) {
            this.canLoadMoreQualificationApplications = false;
            infiniteScroll.enable(false);
            this
              .comm
              .showLoadingEx("没有更多了！", 500);
          } else {
            this.paramsQualificationApplications.page++;
          }
          infiniteScroll.complete();
        });
    }, 500); // 延迟500ms
  }
  //根据名称查询
  selectQualificationApplications() {
    this.ifFirstInQualificationApplications = false;
    let params = {
      page: this.paramsQualificationApplications.page,
      limit: this.paramsQualificationApplications.limit,
      jggsType: 1
    }
    this
      .getAllQualificationApplications(this.QualificationApplications, params)
      .then(res => {
        this.paramsQualificationApplications.page++;
      });
  }
  //获取所有资格审核结果
  getAllQualificationApplications(list, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpGet(1, SERVICE_ACTIONS.notice, ele, { showEmpty: false })
        .then(res => {
          if (res.code == 0 && res.count != 0) {
            for (var i = 0; i < res.data.length; i++) {
              list.push({ id: res.data[i].CS, title: res.data[i].LB, time: res.data[i].CRTIME });
            }
            resolve(res.data.length);
          } else {
            var detailContent = document.getElementById("Qualification");
            var img = '<div id="QualificationDiv"><img class="template-icon" src="assets/info/empty.png"><h4 class="template-title' +
              '">没有查询到结果</h4><h5 class="template-sub-title"></h5><div></div></div>';
            detailContent.innerHTML = img;
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("请检查服务器连接！");
          reject();
        });
    });
  }
  chooseThisQADetial(item) {
    this
      .navCtrl
      .push("AnnouncementDetailPage", {
        param: 11,
        type: item.id
      });
  }
  //审核上拉刷新
  doInfiniteAuditResults(infiniteScroll: InfiniteScroll) {

    setTimeout(() => {
      // let ele = "limit=" + this.paramsAuditResults.limit + "&page=" +
      // this.paramsAuditResults.page + "&jggsType=2"
      let params = {
        page: this.paramsAuditResults.page,
        limit: this.paramsAuditResults.limit,
        jggsType: 2
      }
      this
        .getAllAuditResults(this.AuditResults, params)
        .then(res => {
          if (res == 0) {
            this.canLoadMoreAuditResults = false;
            infiniteScroll.enable(false);
            this
              .comm
              .showLoadingEx("没有更多了！", 500);
          } else {
            this.paramsAuditResults.page++;
          }
          infiniteScroll.complete();
        });
    }, 500); // 延迟500ms
  }
  //根据名称查询
  selectAuditResults() {
    this.ifFirstInAuditResults = false;
    let params = {
      page: this.paramsAuditResults.page,
      limit: this.paramsAuditResults.limit,
      jggsType: 2
    }
    this
      .getAllAuditResults(this.AuditResults, params)
      .then(res => {
        this.paramsAuditResults.page++;
      });;
  }
  //获取所有审核结果
  getAllAuditResults(list, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpGet(1, SERVICE_ACTIONS.notice, ele, { showEmpty: false })
        .then(res => {
          if (res.code == 0 && res.count != 0) {
            for (var i = 0; i < res.data.length; i++) {
              list.push({ id: res.data[i].CS, title: res.data[i].LB, time: res.data[i].CRTIME });
            }
            resolve(res.data.length);
          } else {
            // this
            //   .comm
            //   .showAlert("查询审核结果无结果！");
            var detailContent = document.getElementById("Audit");
            var img = '<div id="AuditDiv"><img class="template-icon" src="assets/info/empty.png' +
              '"><h4 class="template-title">没有查询到结果</h4><h5 class="template-sub-title"></h5><di' +
              'v></div></div>';
            detailContent.innerHTML = img;
          }
        })
        .catch(error => {
          this
            .comm
            .showAlert("请检查网路连接");
          reject();
        });
    });
  }
  chooseThisARDetial(item) {
    this
      .navCtrl
      .push("AnnouncementDetailPage", {
        param: 21,
        type: item.id
      });
  }

  //配租上拉刷新
  doInfiniteRentResults(infiniteScroll: InfiniteScroll) {

    setTimeout(() => {
      let params = {
        page: this.paramsRentResults.page,
        limit: this.paramsRentResults.limit,
        jggsType: 3
      }
      this
        .getAllRentResults(this.RentResults, params)
        .then(res => {
          if (res == 0) {
            this.canLoadMoreRentResults = false;
            infiniteScroll.enable(false);
            this
              .comm
              .showLoadingEx("没有更多了！", 500);
          } else {
            this.paramsRentResults.page++;
          }
          infiniteScroll.complete();
        });
    }, 500); // 延迟500ms
  }
  //根据名称查询配租
  selectRentResults() {
    this.ifFirstInRentResults = false;
    // let ele = "limit=" + this.paramsRentResults.limit + "&page=" +
    // this.paramsRentResults.page + "&jggsType=3";
    let params = {
      page: this.paramsRentResults.page,
      limit: this.paramsRentResults.limit,
      jggsType: 3
    }
    this
      .getAllRentResults(this.RentResults, params)
      .then(res => {
        this.paramsRentResults.page++;
      });;
  }
  //获取所有配租
  getAllRentResults(list, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpGet(1, SERVICE_ACTIONS.notice, ele)
        .then(res => {
          if (res.code == 0 && res.count != 0) {
            for (var i = 0; i < res.data.length; i++) {
              list.push({ id: res.data[i].CS, title: res.data[i].LB, time: res.data[i].CRTIME });
            }
            resolve(res.data.length);
          } else {
            var detailContent = document.getElementById("Rent");
            var img = '<div id="RentDiv"><img class="template-icon" src="assets/info/empty.png"><h4 cl' +
              'ass="template-title">没有查询到结果</h4><h5 class="template-sub-title"></h5><div></div>' +
              '</div>';
            detailContent.innerHTML = img;
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
  chooseThisRRDetial(item) {
    this
      .navCtrl
      .push("AnnouncementDetailPage", {
        param: 31,
        type: item.id
      });
  }
  goBack() {
    this
      .navCtrl
      .pop();
  }


  ionViewDidEnter() {

    this
      .cd
      .detectChanges();
  }



}