import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-review-commitment',
  templateUrl: 'review-commitment.html',
})
export class ReviewCommitmentPage {

  commitmentInfo: string; //承诺书信息
  hasRead:boolean=false; //是否已读

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let nextPageInfo = this.navParams.get("nextPageInfo");
    nextPageInfo.forEach(element => {
      if (element['lx'] == 9) {
        this.commitmentInfo = element['nr'];//获取承诺书信息
      }
    });
  }

  nextPage() {
    if(this.hasRead){
      this.navCtrl.push("ReviewApplyInfoPage");
    }
  }
}
