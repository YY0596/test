
import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from '../../../providers/http-service';
import {OrderComm} from '../../../providers/order-comm';


/**
 * Generated class for the InformationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({selector: 'page-information-detail', templateUrl: 'information-detail.html'})
export class InformationDetailPage {
  id : string;
  informationDetail : any = {
    title: "",
    time: "",
    content: "",
    personName: ""
  }
  constructor(public navCtrl : NavController, public navParams : NavParams, public httpService : HttpService, private comm : OrderComm) {
    this.id = navParams.get("param");
  }

  ionViewDidLoad() {
    if (this.id) {
      this
        .fillHtml()
        .then(() => {
          var detailContent = document.getElementById("detailContent");
          detailContent.innerHTML = this.informationDetail.content;
          // this.cd.detectChanges();
        });
    }

  }
  fillHtml() {
    let ele = "id=" + this.id+"&base64Flag=false";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(1, "getWzxxById.action?" + ele)
        .then((res) => {
          if (res.code==0) {
            this.informationDetail.content =res.data.nr;
            this.informationDetail.title = res.data.wzbt;
            this.informationDetail.time = res.data.wzfbrq;
            this.informationDetail.personName = res.data.wzly;
            resolve();
          } else {
            this
              .comm
              .showLoadingEx("请联系系统管理员", 500);
            reject();
          }
        })
        .catch(error => {
          reject();
        });
    });
  }
}
