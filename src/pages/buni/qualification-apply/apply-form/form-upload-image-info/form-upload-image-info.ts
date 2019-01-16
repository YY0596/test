import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { OrderComm } from '../../../../../providers/order-comm';
import { StorageService } from '../../../../../providers/localstorage';
import { HttpService } from '../../../../../providers/http-service';
import { NativeService } from '../../../../../providers/NativeService';
import { FileObj } from '../../../../../model/FileObj';
@IonicPage()
@Component({
  selector: 'page-form-upload-image-info',
  templateUrl: 'form-upload-image-info.html',
})
export class FormUploadImageInfoPage {
  constructor(public navCtrl: NavController,
    private comm: OrderComm,
    private httpService: HttpService,
    private nativeService: NativeService,
    private storage: StorageService
  ) {
  }
  hiddenInfo: boolean = true;  // 是否隐藏提示信息
  imgInfoNotice: any;//上传图片注意事项
  imgModule3 = true; // 每一行显示3张图片，若为false,则每一行显示2张图片，暂时只有这两种显示格式，默认为true
  max = 20; //最多允许上传图片数量
  imageInfoList: Array<ImageInfo>; // 上传图片信息
  ionViewWillEnter() {
    //获取上传图片注意事项
    // this.imgInfoNotice = this.storage.read('qualificationApply-imgInfoNotice');
    this.getUploadInfo();
  }

  getUploadInfo() {
    let url = 'getSjzlList.action';
    let body = 'wwsqbh=' + this.storage.read('timestamp') + '&ywlb=233050'; 
    // + '&zlzb=' + this.storage.read("qualificationApply-homeStyle")[0].key +
    //   '&szcq=' + this.storage.read("qualificationApply-szcq");
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
    // let homeStyle: any = this.storage.read('qualificationApply-homeStyle');
    let url = 'uploadImgForApp.action';
    let body = 'wwsqbh=' + this.storage.read('timestamp') + '&bpCategoryCode=web233050&imageInfoList=' + JSON.stringify(this.imageInfoList);
    this.comm.showConfirm("CCB建融家园公租房","确定提交申请？", () => {
      this.comm.showLoading('请稍后...');
      this.httpService.httpPost(8, url, body).then(response => {
        if (response.code == 0) {
          let data = 'wwsqbh=' + this.storage.read('timestamp') + '&bpCategoryCode=web233050';
          this.httpService.httpPost(8, 'submitForm.action', data).then(res => {
            if (res.code == 0) {
              // 清除保障申请审核中的缓存信息
              this.storage.remove('qualificationApply-applyInfoCache');
              this.storage.remove('qualificationApply-dicList');
              this.storage.remove('timestamp');
              this.storage.remove('qualificationApply-familyInfoCache');
              this.storage.remove('review-info');
              this.storage.remove('qualificationApply-houseInfoCache');
              this.storage.remove('origin-param');
              this.comm.successConfirm("CCB建融家园公租房","申请提交成功", () => {
                this.navCtrl.setRoot("HomePage");
              })
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
        this.nativeService.showToast('上传失败');
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
