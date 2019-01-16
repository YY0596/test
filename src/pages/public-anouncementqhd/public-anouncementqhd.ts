import {Component,  Injector} from '@angular/core';
import { InfiniteScroll, IonicPage, NavController, NavParams} from 'ionic-angular';
import {OrderComm} from '../../providers/order-comm';
import {HttpService} from '../../providers/http-service';
import {ChangeDetectorRef} from '@angular/core';
import { DHCPage } from '../../components/index';
import { SERVICE_ACTIONS } from '../../app/config';

/**
 * Generated class for the PublicAnouncementqhdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-public-anouncementqhd',
  templateUrl: 'public-anouncementqhd.html',
})
export class PublicAnouncementqhdPage extends DHCPage {
canLoadMoreAuditResults : boolean = true;
ifFirstInAuditResults : boolean = true;
AuditResults : Array < {
  title: string,
  time: string
} >= [];


//审核结果
private paramsAuditResults = {
  page: 1,
  limit: 10
};

constructor(public navCtrl : NavController, public navParams : NavParams, public cd : ChangeDetectorRef, public comm : OrderComm, public httpService : HttpService, private _inject : Injector) {
  super(_inject); //构造基类对象，传入DI容器
}

ionViewDidLoad() {

this.AuditResults = [];
this.selectAuditResults();

}



//审核上拉刷新
doInfiniteAuditResults(infiniteScroll : InfiniteScroll) {

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
      .httpGet(1, SERVICE_ACTIONS.notice, ele, {showEmpty: false})
      .then(res => {
        if (res.code == 0 && res.count != 0) {
          for (var i = 0; i < res.data.length; i++) {
            list.push({id: res.data[i].CS, title: res.data[i].LB, time: res.data[i].CRTIME});
          }
          resolve(res.data.length);
        } else {
          // this   .comm   .showAlert("查询审核结果无结果！");
          var detailContent = document.getElementById("Audit");
          var img = '<div id="AuditDiv"><img class="template-icon" src="assets/info/empty.png"><h4 cl' +
              'ass="template-title">没有查询到结果</h4><h5 class="template-sub-title"></h5><div></div>' +
              '</div>';
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
