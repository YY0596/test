import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { OrderComm } from '../../../../providers/order-comm';
import { HttpService } from '../../../../providers/http-service';
import { NativeService } from '../../../../providers/NativeService';
import { StorageService } from '../../../../providers/localstorage';
import { FileObj } from '../../../../model/FileObj';

@IonicPage()
@Component({
  selector: 'page-rent-upload-image-info',
  templateUrl: 'rent-upload-image-info.html',
})
export class RentUploadImageInfoPage {
  constructor(public navCtrl: NavController,
    private comm: OrderComm,
    private httpService: HttpService,
    private nativeService: NativeService,
    private storage: StorageService,
    private navParams: NavParams
  ) {
  }
  imgModule3 = true; // 每一行显示3张图片，若为false,则每一行显示2张图片，暂时只有这两种显示格式，默认为true
  max = 20; //最多允许上传图片数量
  imageInfoList: Array<ImageInfo>; // 上传图片信息
  ionViewWillEnter() {
    this.getUploadInfo();
  }

  getUploadInfo() {
    let szcq = this.navParams.get('item');
    let url = 'getSjzlList.action';
    let body = 'wwsqbh=' + this.storage.read('timestamp') + '&ywlb=233055' +
      '&zlzb=2700' +
      '&szcq=' + szcq;
    this.httpService.httpPost(8, url, body).then(response => {
      if (response.code == 0) {
        let list = response.data;
        this.imageInfoList = new Array<ImageInfo>();
        for (let index = 0; index < list.length; index++) {
          let imageInfo = new ImageInfo();
          imageInfo.id = list[index].id;
          imageInfo.zldyid = list[index].zldyid;
          imageInfo.zlmc = list[index].zlmc; //资料名称
          this.imageInfoList.push(imageInfo);
        }
      } else {
        this.nativeService.alert('信息获取失败');
      }
    }).catch(err => {
      this.nativeService.alert('信息获取失败');
    });
  }

  // 上传图片
  uploadImg() {
    let url = 'uploadImgForApp.action';
    let body = 'wwsqbh=' + this.storage.read('timestamp') + '&bpCategoryCode=web233055&imageInfoList=' + JSON.stringify(this.imageInfoList);
    this.comm.showConfirm("CCB建融家园公租房","确定提交配租申请？", () => {
      this.comm.showLoading('请稍后...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.code == 0) {
          let data = 'wwsqbh=' + this.storage.read('timestamp') + '&bpCategoryCode=web233055';
          this.httpService.httpPost(8, 'submitForm.action', data).then(res => {
            if (res.code == 0) {
              // 清除保障申请审核中的缓存信息
              this.storage.remove('change-applyInfoCache');
              this.storage.remove('change-familyInfoCache');
              this.storage.remove('change-houseInfoCache');
              this.storage.remove('change-propertyInfoCache');
              this.storage.remove('change-imgInfoNotice');
              this.storage.remove('change-jtryList');
              this.storage.remove('change-homeStyle');
              this.storage.remove('change-szcq');
              this.navCtrl.setRoot("HomePage").then(() => {
                this.nativeService.showToast('提交成功');
              });
            } else {
              this.nativeService.alert(res.msg);
            }
          });
        } else {
          this.nativeService.alert(response.msg);
        }
        this.comm.closeLoading();
      }).catch(err => {
        this.comm.closeLoading();
        this.nativeService.alert(err);
      });
    }, null);
  }
}

export class ImageInfo {
  id: number;
  zldyid: number;
  zlmc: string;
  base64List: Array<FileObj>;
  constructor() {
    this.base64List = new Array<FileObj>();
  }
}
