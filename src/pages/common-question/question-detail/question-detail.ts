import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { OrderComm } from '../../../providers/order-comm';
import { HttpService } from '../../../providers/http-service';
import { FileTransfer } from '@ionic-native/file-transfer';
import { fileHelper } from '../../../providers/fileHelper';

// import {FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';

/**
 * Generated class for the QuestionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({ selector: 'page-question-detail', templateUrl: 'question-detail.html' })
export class QuestionDetailPage {
  id: string;
  fileExist: boolean = false;
  questionDetail: any = {
    title: "",
    time: "",
    content: "",
    personName: "",
    attachments: null
  }
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public httpService: HttpService,
    private comm: OrderComm,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    public platform: Platform
  ) {
    this.id = navParams.get("param");
  }

  ionViewDidLoad() {
    if (this.id) {
      this
        .fillHtml()
        .then((res) => {
          var detailContent = document.getElementById("detailContent");
          detailContent.innerHTML = this.questionDetail.content;
          // this.cd.detectChanges();

        });
    }

  }
  fillHtml() {
    let ele = "id=" + this.id + "&base64Flag=false";
    let self = this;
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGet(1, "getWzxxById.action?" + ele)
        .then((res) => {
          if (res.code == 0) {
            self.questionDetail.content = res.data.nr;
            self.questionDetail.title = res.data.wzbt;
            self.questionDetail.time = res.data.wzfbrq;
            self.questionDetail.personName = res.data.wzly;
            if (res.data.fjList.length != 0) {
              self.fileExist = true;
              self.questionDetail.attachments = res.data.fjList;
            }
            resolve(res);
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
    this.comm.showLoading("正在下载...");
    var self = this;
    fileTransfer.download(downUri, filePath).then(function () {
      self.comm.closeLoading();
      self.comm.showConfirm("提示信息", "文件已下载完成，是否打开？", () => self.openFile(filePath));
    }).catch((err) => {
      self.comm.closeLoading();
      self.comm.showAlert('下载文件失败!');
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
        self.comm.showAlert('打开文件失败!');
      });
  }
}
