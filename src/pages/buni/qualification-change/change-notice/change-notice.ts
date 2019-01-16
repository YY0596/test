import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-change-notice',
  templateUrl: 'change-notice.html',
})
export class ChangeNoticePage {
  applyNotice: any; // 申请须知信息
  nextPageInfo: Array<any>; // 传到下一个页面需要的信息
  isDisable: boolean = true; // 是否可用
  hasRead: boolean = false; // 是否已读
  intervalText: string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    let nextPageInfo = this.navParams.get("nextPageInfo");
    nextPageInfo.forEach(element => {
      if (element['lx'] == 11) {
        this.applyNotice = element['nr'];//获取申请须知信息
      }
    });
    this.nextPageInfo = nextPageInfo.filter(x => { return x['lx'] != 11 });
    let interval = 15; // 设置多少时间/s 后可用
    let timer = setInterval(() => {
      interval--;
      this.intervalText = ' (' + interval + ')s'
      if (interval == 0) {
        this.isDisable = false;
        this.intervalText = '';
        clearInterval(timer)
      }
    }, 1000);
  }

  nextPage() {
    if (this.hasRead) {
      this.navCtrl.push("ChangeCommitmentPage", { nextPageInfo: this.nextPageInfo });
    }
  }
}
