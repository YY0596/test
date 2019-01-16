import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionSheetController, AlertController, IonicPage, ModalController } from 'ionic-angular';
import { FileObj } from '../../model/FileObj';
import { NativeService } from '../../providers/NativeService';
// import { PreviewPicturePage } from '../preview-picture/preview-picture';
import { FileService } from '../../providers/FileService';
import { GlobalData } from '../../providers/GlobalData';

@IonicPage()
@Component({
  selector: 'page-select-picture',
  templateUrl: 'select-picture.html',
})
export class SelectPicturePage {

  @Input() max = 4; // 最多可选择多少张图片，默认为4张
  @Input() allowAdd = true; // 是否允许新增
  @Input() allowDelete = true; // 是否允许删除
  @Input() fileObjList: FileObj[] = []; // 图片列表,与fileObjListChange形成双向数据绑定
  @Output() fileObjListChange = new EventEmitter<any>();
  @Input() imgModule3 = true; // 默认每一行显示3张图片
  constructor(private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private fileService: FileService,
    private globalData: GlobalData,
    private nativeService: NativeService) {
  }

  addPicture() {// 新增照片
    const that = this;
    that.actionSheetCtrl.create({
      buttons: [
        {
          text: '从相册选择',
          handler: () => {
            that.nativeService.getPictureByPhotoLibrary().subscribe(img => {
              that.getPictureSuccess(img);
            });
            //使用imagePicker的方式 获取相册库-可以多选-待以后需要多选功能时可作为研究
            // that.nativeService.getMultiplePicture({// 从相册多选
            //   maximumImagesCount: (that.max - that.fileObjList.length),
            //   destinationType: 1 // 期望返回的图片格式,1图片路径
            // }).subscribe(imgs => {
            //   for (const img of imgs as string[]) {
            //     that.getPictureSuccess(img);
            //   }
            // });
          }
        },
        {
          text: '拍照',
          handler: () => {
            that.nativeService.getPictureByCamera().subscribe(img => {
              that.getPictureSuccess(img);
            });
          }
        },
        {
          text: '取消',
          role: 'cancel'
        }
      ]
    }).present();
  }

  deletePicture(i) {// 删除照片
    if (!this.allowDelete) {
      return;
    }
    this.alertCtrl.create({
      title: '确认删除？',
      buttons: [{ text: '取消' },
      {
        text: '确定',
        handler: () => {
          const delArr = this.fileObjList.splice(i, 1);
          const delId = delArr[0].id;
          if (delId) {
            this.globalData.showLoading = false;
            this.fileService.deleteById(delId);
          }
        }
      }
      ]
    }).present();
  }

  viewerPicture(index) { // 照片预览
    const picturePaths = [];
    for (const fileObj of this.fileObjList) {
      picturePaths.push(fileObj.base64);
    }
    this.modalCtrl.create('PreviewPicturePage', { 'initialSlide': index, 'picturePaths': picturePaths }).present();
  }

  private getPictureSuccess(img) {
    const fileObj = { 'base64': img };
    this.fileObjList.push(fileObj);
    this.fileObjListChange.emit(this.fileObjList);
  }

}
