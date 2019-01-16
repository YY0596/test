import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {HttpService} from '../../../providers/http-service';
import {OrderComm} from '../../../providers/order-comm';
import {applyPerson} from './applyPerson.model';

/**
 * Generated class for the AnnouncementDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-announcement-detail', templateUrl: 'announcement-detail.html'})
export class AnnouncementDetailPage {
  model = new applyPerson("", "", "", "", "");
  canLoadMore : boolean = true;
  private params = {
    page: 1,
    limit: 10
  };
  listApplyResult : any = [];
  constructor(public navCtrl : NavController, public navParams : NavParams, public httpService : HttpService, private comm : OrderComm, private modalCtrl : ModalController) {
    this.model.jggsType = navParams.get("param");
    this.model.paramId = navParams.get("type");
  }

  ionViewDidLoad() {
    this.toPostData();
  }
  toPostData() {
    let ele = "limit=" + this.params.limit + "&page=" + this.params.page + "&jggsType=" + this.model.jggsType + "&paramId=" + this.model.paramId + "&name=" + this.model.name + "&idcard=" + this.model.idcard + "&applyno=" + this.model.applyno;
    this.listApplyResult = [];
    this.gettApplyResult(this.listApplyResult, ele).then(res=>{
      console.log(res);
    });
  }
  //获取申请信息
  gettApplyResult(list, ele) {
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(1, "getJjgsListByPage.action?" + ele)
        .then(res => {
          if (res.code == 0) {
            let count=res.data.length;
            for (var i = 0; i < count; i++) {
              list.push({
                GGSJ: res.data[i].GGSJ,
                GZDW: res.data[i].GZDW,
                HJSZCQMC: res.data[i].HJSZCQMC,
                HJSZJDMC: res.data[i].HJSZJDMC,
                JTRS: res.data[i].JTRS,
                JTZSR: res.data[i].JTZSR,
                JTZZC: res.data[i].JTZZC,
                JZDZ: res.data[i].JZDZ,
                NSQQY: res.data[i].NSQQY,
                PZFS: res.data[i].PZFS,
                R: res.data[i].R,
                RJCZFJZMJNEW: res.data[i].RJCZFJZMJNEW,
                RJZYCQJZMJNEW: res.data[i].RJZYCQJZMJNEW,
                SFZH: res.data[i].SFZH,
                SQBBH: res.data[i].SQBBH,
                SQRXM: res.data[i].SQRXM,
                SQSJ: res.data[i].SQSJ,
                PZSJ: res.data[i].PZSJ,
                XJZFFCXZ: res.data[i].XJZFFCXZ,
                ZLBTJE: res.data[i].ZLBTJE
              });
            }
            resolve(count);
          } else {
            this
              .comm
              .showAlert("查询公示公告无结果！");
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
  //上拉刷新
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      this.params.page++;
      let ele = "limit=" + this.params.limit + "&page=" + this.params.page + "&jggsType=" + this.model.jggsType + "&paramId=" + this.model.paramId + "&name=" + this.model.name + "&idcard=" + this.model.idcard + "&applyno=" + this.model.applyno;
      this
        .gettApplyResult(this.listApplyResult, ele)
        .then(res => {
          if (res == 0) {
            this.canLoadMore = false;
            infiniteScroll.enable(false);
            this
              .comm
              .showLoadingEx("没有更多了！", 500);
          } else {
            this.params.page++;
          }
          infiniteScroll.complete();
        });
    }, 500); // 延迟500ms
  }
  //打开模态框进行输入
  openModal(item) {
    // let profileModal = this
    //   .modalCtrl
    //   .create("DetailModalPage", {param: item});
    // profileModal.onDidDismiss(data => {

    // });
    // profileModal.present();
    this.navCtrl.push("DetailModalPage",{param: item});
  }
  goBack() {
    this
      .navCtrl
      .pop();
  }
}
