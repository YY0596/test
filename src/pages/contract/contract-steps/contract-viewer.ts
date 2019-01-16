import { Component } from '@angular/core';
import { DHCWizardStep } from '../../../components';
import { OrderComm } from '../../../providers/order-comm';
import { HttpService } from '../../../providers/http-service';
import { StorageService } from '../../../providers/localstorage';


/**
 * 合同预览
 */
@Component({
    selector: 'contract-viewer',
    templateUrl: 'contract-viewer.html'
})
export class ContractViewer {
    userInfo: any;
    contractState:any;
    contractOverdue:any;
    contractContent:string;
    constructor(public step: DHCWizardStep, public orderComm: OrderComm, private httpService: HttpService, private local: StorageService) {
        this.step.registHandler('stepInit', () => {
            this.stepInit();
        });
        this.step.registHandler('stepCheck', (oldStep, newStep, resolve) => {
            this.stepCheck(oldStep, newStep, resolve);
        });
    }
    /**
     * 仅在步骤第一次可见时回调，用来延迟初始化   34142419881124813X
     */
    stepInit() {
        this.checkContractstate();
        this.checkContractOverdue();
    }
    //检查是否有合同
    checkContractstate(){
        this.userInfo = this.local.read("userInfo");
        let ele = "idStr="+"34142419881124813X";
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(3,"zfbz/gzfht/appCheckhtWw.action?" + ele)
                .then(res => {
                    //判断合同状态，sucess为有合同，跳到下一步
                    this.contractState=res.data; 
                })
                .catch(error => {
                    reject();
                });
        });
    }
    //检查合同是否生效
    checkContractOverdue(){
        let ele = "idStr="+"34142419881124813X";
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(3,"zfbz/gzfht/appCheckhtDis.action?" + ele)
                .then(res => {
                    //判断合同是否生效
                    this.contractOverdue=res.data;
                    if (this.contractOverdue == "success") {
                        this.getContract();
                    } else {
                        
                    }
                })
                .catch(error => {
                    reject();
                });
        });
    }
    //获取合同
    getContract(){
        let ele = "idStr="+"34142419881124813X";
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(3,"zfbz/gzfht/appPrintHtmbWwJson.action?" + ele)
                .then(res => {
                    this.contractContent=res.data[1];

                    this.contractContent.replace("","");
                    document.getElementById("content").innerHTML=this.contractContent;  
                })
                .catch(error => {
                    reject();
                });
        });
    }
    /**
     * 步骤跳转前回调，用来异步数据校验
     * @param {number} oldStep 跳转前步骤索引
     * @param {number} newStep 跳转后步骤索引
     * @param {Function} resolve 跳转函数，调用此函数步骤跳转，不调用则跳转取消
     */
    stepCheck(oldStep, newStep, resolve) {
        if (this.contractState == "success") {
            resolve();
        } else {
           this.orderComm.showAlert("暂无合同！");
        }
        //校验通过跳转F
        
    }

}