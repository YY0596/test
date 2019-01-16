import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { HttpService } from '../../providers/http-service';
import { OrderComm } from '../../providers/order-comm';

/**
 * Generated class for the CommonQuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-common-question', templateUrl: 'common-question.html' })
export class CommonQuestionPage {
  private canLoadMoreQuestions: boolean = true;
  questions: Array<{
    title: string,
    time: string,
    btys: string,
    personName: string,
    priority: string,
    symbol: string
  }> = [];
  //常见问题列表默认参数
  private paramsQuestions = {
    page: 1,
    key: "",
    limit: 10
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public httpService: HttpService, private comm: OrderComm) { }

  ionViewDidLoad() {
    let ele =
      "page=" +
      this.paramsQuestions.page +
      "&limit=" +
      this.paramsQuestions.limit +
      "&lmid=43";
    this.getQuestion(this.questions, ele).then(res => {
      this.paramsQuestions.page++;
    });
  }
  //查看问题详情
  chooseThisDetial(item) {
    this.navCtrl.push("QuestionDetailPage", { param: item.id });
  }
  getQuestion(list, ele) {
    var self = this;
    return new Promise((resolve, reject) => {
      this.httpService
        .httpGet(1, "getWzzbListByPage.action?" + ele)
        .then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.length; i++) {
              list.push({
                id: res.data[i].id,
                title: res.data[i].wzbt,
                time: res.data[i].wzfbrq,
                btys: res.data[i].btys,
                personName: res.data[i].cyz,
                priority: self.getArticlePriority(res.data[i].yxj),
                symbol: self.getArticleSymbol(res.data[i].xwzbz)
              });
            }
            resolve(res.data.length);

          } else {
            this.comm.showAlert("查询常见问题无结果！");
          }
        })
        .catch(error => {
          this.comm.showAlert("请检查服务器连接！");
          reject();
        });
    });
  }
  //常见问题上拉刷新
  doInfiniteQuestions(infiniteScroll) {

    setTimeout(() => {
      let ele =
        "page=" +
        this.paramsQuestions.page +
        "&limit=" +
        this.paramsQuestions.limit +
        "&lmid=43";
      this.getQuestion(this.questions, ele).then(res => {
        if (res == 0) {
          this.canLoadMoreQuestions = false;
          infiniteScroll.enable(false);
          this
            .comm
            .showLoadingEx("没有更多了！", 500);
        }
        else {
          this.paramsQuestions.page++;
        }
        infiniteScroll.complete();
      });
    }, 500); // 延迟500ms
  }
  loading(content, duration) {
    let loading = this.loadingCtrl.create({
      spinner: "hide",
      content: content,
      duration: duration
    });
    loading.present();
  }
  /**
   * 获取文章优先级
   * @param {Number} priority 文章优先级标志
   */
  getArticlePriority(priority) {
    var strPriority = '';
    if (priority == 2) {
      strPriority = "<span class='badge'>重要</span>";
    }
    else if (priority == 3) {
      strPriority = "<span class='badge badge-black'>置顶</span>";
    }
    return strPriority;
  }
  /**
   * 获取文章显示符号
   * @param {Number} flag 文章符号标志
   */
  getArticleSymbol(flag) {
    return flag == 1 ? "<span class='badge badge-orange'>新文章</span>" : '';
  }
}
