import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PlacementCommitmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placement-commitment',
  templateUrl: 'placement-commitment.html',
})
export class PlacementCommitmentPage {
  commitmentInfo: string; //承诺书信息
  hasRead:boolean=false; //是否已读
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let nextPageInfo = this.navParams.get("nextPageInfo");
    nextPageInfo.forEach(element => {
      if (element['lx'] == 25) {
        this.commitmentInfo = element['nr'];//获取承诺书信息
      }
    });
  }

  nextPage() {
    if(this.hasRead){
      this.navCtrl.push("PlacementFormPage");
    }
  }
}
