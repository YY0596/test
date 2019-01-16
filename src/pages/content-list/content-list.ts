import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DHCPage } from '../../components';
import { SERVICE_ACTIONS, CMS_TYPES } from '../../app/config';

/**
 * 内容管理列表显示模块
 */
@IonicPage()
@Component({
  selector: 'content-list',
  templateUrl: 'content-list.html'
})
export class ContentListPage extends DHCPage {
  /**
   * 栏目信息
   */
  contentInfo: any;

  /**
   * 列表数据源
   */
  data: Array<any> = [];

  /**
   * 下拉刷新是否已到底
   */
  canLoadMore: boolean = true;

  /**
   * 刷新操作锁定(防止多次刷新)
   */
  refreshEnabled: boolean = true;

  /**
   * 分页参数
   */
  pageInfo = {
    page: 1,
    limit: 10
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _inject: Injector
  ) {
    super(_inject); //构造基类对象，传入DI容器
    this.contentInfo = CMS_TYPES[navParams.get('action')];
  }

  /**
   * 模块加载完成获取内容列表数据
   */
  ionViewDidLoad() {
    let params = {
      page: this.pageInfo.page,
      limit: this.pageInfo.limit,
      lmid: this.contentInfo.id
    }
    this.httpGet(1, SERVICE_ACTIONS.cmsList, params).then(res => {
      this.adaptContentData(res);
    });
  }

  /**
   * 上拉刷新
   * @param refresher 
   */
  doRefresh(refresher) {
    this.refreshEnabled = false;
    let params = {
      page: 1,
      limit: this.pageInfo.limit,
      lmid: this.contentInfo.id
    }
    this.httpQuietGet(1, SERVICE_ACTIONS.cmsList, params).then(res => {
      this.pageInfo.page = 1;
      this.canLoadMore = true;
      this.adaptContentData(res, false);
      this.orderComm.showToastEx("数据刷新成功", false, 1000);
    }).catch((error) => {
      this.orderComm.showLoadingEx("获取数据失败！", 1000);
    }).then(() => {
      refresher.complete();
      this.refreshEnabled = true;
    });
  }

  /**
   * 下拉加载
   * @param infiniteScroll 
   */
  doInfinite(infiniteScroll) {
    this.refreshEnabled = false;
    let params = {
      page: this.pageInfo.page,
      limit: this.pageInfo.limit,
      lmid: this.contentInfo.id
    }
    this.httpQuietGet(1, SERVICE_ACTIONS.cmsList, params).then(res => {
      this.adaptContentData(res);
      if (res.data.length == 0) {
        this.canLoadMore = false;
        this.orderComm.showToastEx("没有更多了！", false, 1000, 'bottom');
      }
    }).catch((error) => {
      this.orderComm.showLoadingEx("获取数据失败！", 1000);
    }).then(() => {
      infiniteScroll.complete();
      this.refreshEnabled = true;
    });
  }

  /**
   * 查看文章详情
   * @param {object} item 文章信息
   */
  viewDetail(item) {
    this.navCtrl.push("ContentDetailPage", {
      navInfo: {
        id: item.id,
        name: this.contentInfo.name,
        type: this.contentInfo.id
      }
    });
  }

  /**
   * 适配内容列表信息
   * @param {object} res 返回结果数据
   * @param {boolend} isAppend 是否是在列表末尾增加数据，默认为true
   */
  adaptContentData(res, isAppend = true) {
    var recordCount = res.data.length;
    !isAppend && (this.data = []);
    for (var i = 0; i < recordCount; i++) {
      res.data[i].priority = this.getArticlePriority(res.data[i].yxj);
      res.data[i].symbol = this.getArticleSymbol(res.data[i].xwzbz);
      this.data.push(res.data[i]);
      if (res.data[i].zz == "" ||res.data[i].zz == null) {
        res.data[i].zz="-";
      }
    }
    recordCount > 0 && this.pageInfo.page++;
  }

  /**
   * 获取文章优先级
   * @param {number} priority 文章优先级标志
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
   * @param {number} flag 文章符号标志
   */
  getArticleSymbol(flag) {
    return flag == 1 ? "<span class='badge badge-orange'>新文章</span>" : '';
  }
}
