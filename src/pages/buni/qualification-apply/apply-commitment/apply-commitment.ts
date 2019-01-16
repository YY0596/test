import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-apply-commitment',
  templateUrl: 'apply-commitment.html',
})
export class ApplyCommitmentPage {

  commitmentInfo: string; //承诺书信息
  hasRead:boolean=false; //是否已读

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let nextPageInfo = this.navParams.get("nextPageInfo");
    nextPageInfo.forEach(element => {
      if (element['lx'] == 4) {
        this.commitmentInfo = element['nr'];//获取承诺书信息
      }
    });
  }

  nextPage() {
    if(this.hasRead){
      this.navCtrl.push("FormApplyInfoPage");
    }
  }
}
