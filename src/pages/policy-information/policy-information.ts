import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DHCPage } from '../../components';

@IonicPage()
@Component({ selector: 'page-policy-information', templateUrl: 'policy-information.html' })
export class PolicyInformationPage extends DHCPage {
  information: Array<{
    id: number,
    title: string,
    time: string,
    btys: string,
    personName: string,
    priority: string,
    symbol: string
  }> = [];
  canLoadMore: boolean = true;
  //新闻列表默认参数
  private baseUri: string = 'getWzzbListByPage.action?';
  private paramsPolicy = {
    page: 1,
    key: "",
    limit: 10
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _inject: Injector
  ) {
    super(_inject);
  }
  
  ionViewDidLoad() {
    let ele = "page=" + this.paramsPolicy.page + "&limit=" + this.paramsPolicy.limit + "&lmid=44";
    this.httpGet(1, this.baseUri + ele).then(res => {
      this.adaptPolicyData(res);
    });
  }
  //查看详情
  chooseThisDetial(item) {
    this
      .navCtrl
      .push("InformationDetailPage", { param: item.id });
  }

  /**
   * 适配政策信息
   */
  adaptPolicyData(res) {
    var recordCount = res.data.length;
    for (var i = 0; i < recordCount; i++) {
      this.information.push({
        id: res.data[i].id,
        title: res.data[i].wzbt,
        time: res.data[i].wzfbrq,
        btys: res.data[i].btys,
        personName: res.data[i].cyz,
        priority: this.getArticlePriority(res.data[i].yxj),
        symbol: this.getArticleSymbol(res.data[i].xwzbz)
      });
    }
    recordCount > 0 && this.paramsPolicy.page++;
  }

  //上拉刷新
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      let ele = "limit=" + this.paramsPolicy.limit + "&page=" + this.paramsPolicy.page + "&lmid=44";
      this.httpQuietGet(1, this.baseUri + ele).then(res => {
        this.adaptPolicyData(res);
        if (res.data.length == 0) {
          this.canLoadMore = false;
          infiniteScroll.enable(false);
          this.orderComm.showLoadingEx("没有更多了！", 500);
        }
        infiniteScroll.complete();
      }).catch((error) => {
        this.orderComm.showLoadingEx("获取数据失败！", 500);
      });
    }, 500); // 延迟500ms
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
