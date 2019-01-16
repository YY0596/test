import { Component, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { fileHelper } from '../../providers/fileHelper';
import { DHCPage } from '../../components/index';
import { SERVICE_ACTIONS } from '../../app/config';
import { Platform } from 'ionic-angular/platform/platform';

@IonicPage()
@Component({
  selector: 'page-content-detail',
  templateUrl: 'content-detail.html',
})
export class ContentDetailPage extends DHCPage {
  /**
   * 数据源
   */
  data: any;
  nr:string;

  /**
   * 导航信息
   */
  navInfo: any;

  /**
   * 附件信息
   */
  attachments: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private _inject: Injector,
    public platform:Platform
  ) {
    super(_inject);
    this.navInfo = navParams.get("navInfo");
  }

  /**
   * 组件加载时加载数据
   */
  ionViewDidLoad() {
    let params = {
      id: this.navInfo.id,
      base64Flag: false,
    }
    this.httpGet(1, SERVICE_ACTIONS.cmsContent, params).then(res => {
      this.data =res.data;
      this.nr=res.data.nr;
      console.log(this.nr);
      this.attachments = res.data.fjList || [];
    });
  }

  /**
   * 下载文件
   * @param fileItem 下载信息
   */
  download(fileItem) {
    let fileTransfer = this.transfer.create();
    let downUri = encodeURI(this.httpService.svrUrl(1, "downLoad.action?" + "id=" + fileItem.id));
    let filePath = "";
    if(this.platform.is("android")){
      filePath=this.file.externalDataDirectory + fileItem.fileName;
    }
    else{
      filePath=this.file.documentsDirectory + fileItem.fileName;
    }
    this.orderComm.showLoading("正在下载...");
    var self = this;
    fileTransfer.download(downUri, filePath).then(() => {
      self.orderComm.closeLoading();
      self.orderComm.showConfirm("提示信息", "文件已下载完成，是否打开？", () => self.openFile(filePath));
    }).catch(() => {
      self.orderComm.closeLoading();
      self.orderComm.showAlert('下载文件失败!');
    });
  }

  /**
   * 打开文件
   * @param filePath 文件本地路径 
   */
  openFile(filePath: string) {
    var mimeType = fileHelper.getFileMimeType(filePath);
    var self = this;
    this.fileOpener.open(filePath, mimeType)
      .catch(() => {
        self.orderComm.showAlert('打开文件失败!');
      });
  }

}
