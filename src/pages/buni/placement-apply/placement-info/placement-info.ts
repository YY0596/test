import { Component, ViewChild, Injector } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Platform } from 'ionic-angular';
import { NativeService } from '../../../../providers/NativeService';
import { HttpService } from '../../../../providers/http-service';
import { StorageService } from '../../../../providers/localstorage';
import { OrderComm } from '../../../../providers/order-comm';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer } from '@ionic-native/file-transfer';
import { fileHelper } from '../../../../providers/fileHelper';
/**
 * Generated class for the PlacementFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-placement-info',
  templateUrl: 'placement-info.html',
})
export class PlacementInfoPage {
  userInfo: any;
  zgzh: string;//资格证号
  name: string;//申请人姓名
  identificationNo: string; //证件号码
  intentionItem: any;//意向小区
  intention: string;//申请认购意向
  selectedItem: any;//选择的意向小区
  bzlx: string;// 保障类型
  jtlb: string;//家庭类别

  placementInfo: any; // 配售申请信息

  @ViewChild(Navbar) navBar: Navbar;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private nativeService: NativeService,
    private httpService: HttpService,
    private storage: StorageService,
    private comm: OrderComm,
    private transfer: FileTransfer,
    private file: File,
    private fileOpener: FileOpener,
    private _inject: Injector,
    public platform: Platform) {
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = this.back;
    this.placementInfo = this.navParams.get('placementInfo');

    this.name = this.placementInfo.pssq.sqrxm;
    this.identificationNo = this.placementInfo.pssq.sqrsfzh;
    this.intentionItem = this.placementInfo.pssq.yxxqmc;
    this.intention = this.placementInfo.pssq.sqrgyx;
    this.zgzh = this.placementInfo.pssq.zgzh;
    this.bzlx = this.placementInfo.sqxxMap.bzlx;
  }

  back = (e: UIEvent) => {
    this.navCtrl.pop();
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

  downloadPdf() {
    let fileTransfer = this.transfer.create();//wwhfsq
    let downUri = encodeURI(this.httpService.svrUrl(11, "downPdf.action?" + "sqrzjhm=" + this.placementInfo.pssq.sqrsfzh));
    let filePath = "";
    if (this.platform.is("android")) {
      filePath = this.file.externalDataDirectory + 'placement.pdf';
    }
    else {
      filePath = this.file.documentsDirectory + 'placement.pdf';
    }
    this.comm.showLoading("正在下载...");
    fileTransfer.download(downUri, filePath).then(() => {
      this.comm.closeLoading();
      this.comm.showConfirm("CCB建融家园公租房","文件已下载完成，是否打开?", () => {
        this.openFile(filePath);
      })
    }).catch(() => {
      this.comm.closeLoading();
      this.comm.showAlert('下载文件失败!');
    });
  }
}
