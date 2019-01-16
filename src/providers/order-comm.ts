import {LoadingController, ToastController, AlertController} from 'ionic-angular';
import {Injectable} from '@angular/core';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class OrderComm {
    private loading;
    private toast;
    constructor(private loadingCtr : LoadingController, private alertCtrl : AlertController, private toastCtrl : ToastController) {}
    showLoading(msg) {
        if (this.loading) 
            return;
        this.loading = this
            .loadingCtr
            .create({content: msg});
        this
            .loading
            .present();
    }
    showLoadingEx(content, duration) {
        let loading = this
            .loadingCtr
            .create({spinner: 'hide', content: content, duration: duration});
        loading.present();
    }
    closeLoading() {
        this.loading && this
            .loading
            .dismiss();
        this.loading = null;
    }
    //提示框
    showAlert(msg) {
        let alert = this
            .alertCtrl
            .create({title: "CCB建融家园公租房", subTitle: msg, buttons: ["确认"]});
        alert.present();
    }
    showToast = (message : string = 'CCB建融家园公租房', duration : number = 2500, style : string = 'toast-full') => {
        this.toast = this
            .toastCtrl
            .create({
                cssClass: style,
                message: message,
                duration: duration,
                position: 'top',
                showCloseButton: true,
                closeButtonText: '关闭'
            });
        this
            .toast
            .present();
    };
    showToastEx = (message : string = 'CCB建融家园公租房', closeButton : boolean = false, duration : number = 2500, position : string = 'top', style : string = 'toast-full') => {
        this.toast = this
            .toastCtrl
            .create({
                cssClass: style,
                message: message,
                duration: duration,
                position: position,
                showCloseButton: closeButton,
                closeButtonText: '关闭'
            });
        this
            .toast
            .present();
    };
    showSmallToast = (message: string = 'CCB建融家园公租房') => {
        this.showToastEx(message, false, 1000, 'down', 'toast-small');
    };
    showConfirm = (title : string, content : string, ensureCb, cancelCb = null) => {
        let confirm = this
            .alertCtrl
            .create({
                title: title,
                message: content,
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                            cancelCb && cancelCb();
                        }
                    }, {
                        text: '确定',
                        handler: () => {
                            ensureCb && ensureCb();
                        }
                    }
                ]
            });
        confirm.present();
    }

    successConfirm = (title : string, content : string, ensureCb, cancelCb = null) => {
        let confirm = this
            .alertCtrl
            .create({
                title: title,
                message: content,
                buttons: [
                    {
                        text: '确定',
                        handler: () => {
                            ensureCb && ensureCb();
                        }
                    }
                ]
            });
        confirm.present();
    }
}