import {PreviewPicturePage} from '../../../shared/preview-picture/preview-picture';
import {NativeService} from '../../../providers/NativeService';
import {GlobalData} from '../../../providers/GlobalData';
import {FileService} from '../../../providers/FileService';
import {ActionSheetController} from 'ionic-angular';
import {Component} from '@angular/core';
import {FileObj} from '../../../model/FileObj';
declare var AlloyCrop;
/**
 * 照片认证
 */
@Component({selector: 'contract-photo', templateUrl: 'contract-photo.html'})
export class ContractPhoto {
isChange : boolean = false; //头像是否改变标识
avatarPath : string="assets/contract/use-photo.png"
    constructor(private actionSheetCtrl : ActionSheetController, private fileService : FileService, private globalData : GlobalData, private nativeService : NativeService) {}
    addPicture() { //新增照片
        let that = this;
        that
            .actionSheetCtrl
            .create({
                buttons: [
                    {
                        text: '从相册选择',
                        handler: () => {
                            let options = {
                                targetWidth: 400,
                                targetHeight: 400,
                                quality: 100
                            };
                            this
                                .nativeService
                                .getPictureByPhotoLibrary(options)
                                .subscribe(imageBase64 => {
                                    this.getPictureSuccess(imageBase64);
                                });
                        }
                    }, {
                        text: '拍照',
                        handler: () => {
                            that
                                .nativeService
                                .getPictureByCamera({
                                    destinationType: 1 //期望返回的图片格式,1图片路径
                                })
                                .subscribe(img => {
                                    that.getPictureSuccess(img);
                                });
                        }
                    }, {
                        text: '取消',
                        role: 'cancel'
                    }
                ]
            })
            .present();
    }

    


private getPictureSuccess(imageBase64) {
    new AlloyCrop({ //api:https://github.com/AlloyTeam/AlloyCrop
        image_src: imageBase64,
        circle: true, // optional parameters , the default value is false
        width: 256, // crop width
        height: 256, // crop height
        output: 1,
        ok: (base64) => {
            this.isChange = true;
            this.avatarPath = base64;
        },
        cancel: () => {},
        ok_text: "确定", // optional parameters , the default value is ok
        cancel_text: "取消" // optional parameters , the default value is cancel
    });

}

saveAvatar() {
    if (this.isChange) {
        let fileObj = <FileObj>{'base64' : this.avatarPath}; this.fileService.uploadByBase64(fileObj).subscribe(fileObj => {// 上传头像图片到文件服务器
            let avatarId = fileObj.id,
                avatarPath = fileObj.origPath;
        });
    }
 }
}