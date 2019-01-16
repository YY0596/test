import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, ToastController, ActionSheetController, Platform } from 'ionic-angular';
import { URLSearchParams, RequestMethod, Http, RequestOptions, Response, Headers, Jsonp } from '@angular/http'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';
import { OrderComm } from '../../providers/order-comm';
import { StorageService } from '../../providers/localstorage';
import { HttpService } from '../../providers/http-service';
import { NativeService } from '../../providers/NativeService';
import { AppConfig } from '../../app/config';
// import { FileUploader } from 'ng2-file-upload';
@IonicPage()
@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html'
})
export class UploadImagePage {
  city: any;
  constructor(public navCtrl: NavController,
    private file: File,
    private camera: Camera,
    private transfer: FileTransfer,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private actionsheetCtrl: ActionSheetController,
    private platform: Platform,
    private http: Http,
    private comm: OrderComm,
    private local: StorageService,
    private httpService: HttpService,
    private nativeService: NativeService,
    private urlConfig: AppConfig
  ) {
  }
  private toast;
  private loading;
  imageData = [];
  imageBase64Data;
  hiddenOtherImg = true;
  ionViewWillEnter() {
    this.imageData = [
      'assets/imgs/1.png',
      'assets/imgs/2.png',
      'assets/imgs/3.png',
      'assets/imgs/4.png',
      'assets/imgs/5.png',
      'assets/imgs/6.png',
      'assets/imgs/7.png',
      'assets/imgs/8.png',
      'assets/imgs/9.png',
      'assets/imgs/10.png'
    ];
    this.imageBase64Data = [
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false },
      { base64: '', save: false }
    ];
  }

  takePhoto(value) {
    let actionSheet = this.actionsheetCtrl.create({
      title: '上传图片',
      buttons: [
        {
          text: '拍照',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'ios-camera-outline' : null,
          handler: () => {
            this.getPictures(value, 1);
          }
        },
        {
          text: '选择图片',
          icon: !this.platform.is('ios') ? 'ios-image-outline' : null,
          handler: () => {
            this.getPictures(value, 2);
          }
        }
      ]
    });
    actionSheet.present();
  }

  getPictures(value, key) {
    if (key === 1) {//拍照
      this.getPictureByCamera().then(imageBase64 => {
        this.cachingImgData(value, imageBase64);
      });
    } else {
      this.getPictureByPhotoLibrary().then(imageBase64 => {
        this.cachingImgData(value, imageBase64);
      });
    }
  }

  cachingImgData(value, imageBase64) {
    if (imageBase64) {
      this.imageData[value] = 'data:image/jpeg;base64,' + imageBase64;
      this.imageBase64Data[value].base64 = imageBase64;
      this.imageBase64Data[value].save = true;
    }
  }

  isHiddenOtherImg() {
    this.hiddenOtherImg = !this.hiddenOtherImg;
  }

  /**
   * 通过拍照获取照片
   * @param options
   * @return {Promise<T>}
   */
  getPictureByCamera = (options = {}) => {
    return new Promise((resolve) => {
      this.getPicture(Object.assign({
        sourceType: this.camera.PictureSourceType.CAMERA
      }, options)).then(imageBase64 => {
        resolve(imageBase64);
      }).catch(err => {
        if (err == 20) {
          this.nativeService.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        String(err).indexOf('cancel') != -1 ? this.nativeService.showToast('取消拍照', 1500) : this.nativeService.showToast('获取照片失败');
      });
    });
  };

  /**
   * 通过图库获取照片
   * @param options
   * @return {Promise<T>}
   */
  getPictureByPhotoLibrary = (options = {}) => {
    return new Promise((resolve) => {
      this.getPicture(Object.assign({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
      }, options)).then(imageBase64 => {
        resolve(imageBase64);
      }).catch(err => {
        if (err == 20) {
          this.nativeService.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        String(err).indexOf('cancel') != -1 ? this.nativeService.showToast('取消选择图片', 1500) : this.nativeService.showToast('获取照片失败');
      });
    });
  };

  /**
    * 使用cordova-plugin-camera获取照片的base64
    * @param options
    * @return {Promise<T>}
    */
  getPicture = (options) => {
    return new Promise((resolve, reject) => {
      this.camera.getPicture(Object.assign({
        // sourceType: this.camera.PictureSourceType.CAMERA,//图片来源,CAMERA:拍照,PHOTOLIBRARY:相册
        destinationType: this.camera.DestinationType.DATA_URL,//返回值格式,DATA_URL:base64,FILE_URI:图片路径
        quality: 80,//保存的图像质量，范围为0 - 100
        allowEdit: false,//选择图片前是否允许编辑
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 800,//缩放图像的宽度（像素）
        targetHeight: 800,//缩放图像的高度（像素）
        saveToPhotoAlbum: false,//是否保存到相册
        correctOrientation: true//设置摄像机拍摄的图像是否为正确的方向
      }, options)).then((imageData) => {
        resolve(imageData);
      }, (err) => {
        if (err == 20) {
          this.nativeService.alert('没有权限,请在设置中开启权限');
          return;
        }
        if (String(err).indexOf('cancel') != -1) {
          return;
        }
        console.log(err);
        err == 20 ? this.nativeService.showToast('没有权限,请在设置中开启权限') : reject(err);
      });
    });
  };

  // 上传图片
  uploadImg() {
    this.comm.showConfirm("CCB建融家园公租房", "确定上传图片？", () => {
      this.confrimUpload().then((flag) => {

      })
    }, null);

  }

  async confrimUpload() {
    try {
      let flag = false;
      let timestamp = this.local.read("timestamp");
      let count = 0;
      let errorMessage = null;
      this.nativeService.showLoading('上传中，请稍候。。。');

      for (let i = 0; i < this.imageBase64Data.length; i++) {
        if (this.imageBase64Data[i].save) {
          // const url = this.urlConfig.getDebugUrl()+'http://128.192.186.137/xcgzfww/zfbzweb/uploadFile.action?wwsqbh=' + timestamp + '&bpCategoryCode=web233050&fileName=' + count + '.jpeg';
          const data = new URLSearchParams();
          data.append('appImgBase64', this.imageBase64Data[i].base64);
          count = i + 1;
          let url = 'uploadFile.action?wwsqbh=' + timestamp + '&bpCategoryCode=web233050&fileName=' + count + '.jpeg'
          await this.httpService.httpPost(7, url, data).then(response => {
            if (!response.id) {
              flag = false;
              this.nativeService.alert('上传失败');
            } else {
              flag = true;
            }
          }, err => {
            flag = false;
            this.nativeService.alert('上传失败');
          });
        }
        if (!flag) {
          this.nativeService.hideLoading();
          break;
        }
      }
      if (flag) {
        this.nativeService.hideLoading();
        this.navCtrl.setRoot("HomePage").then(() => {
          this.comm.showToast("上传成功！");
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
