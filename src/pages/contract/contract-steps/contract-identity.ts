import { Component } from '@angular/core';
import { OrderComm } from '../../../providers/order-comm';
import { DHCWizardStep } from '../../../components';
import { HttpService } from '../../../providers/http-service';
import { StorageService } from '../../../providers/localstorage';

/**
 * 确认身份
 */
@Component({ selector: 'contract-identity', templateUrl: 'contract-identity.html' })
export class ContractIdentity {

    /**
     * 用户名
     */
    userName: string = '';

    /**
     * 用户身份证号
     */
    userId: string = '';
    ccbparam: any;
    userInfo: any;
    constructor(public step: DHCWizardStep, public orderComm: OrderComm,
        public httpService: HttpService, private local: StorageService) {
        this
            .step
            .registHandler('stepInit', () => {
                this.stepInit();
            });
        this
            .step
            .registHandler('stepCheck', (oldStep, newStep, resolve) => {
                this.stepCheck(oldStep, newStep, resolve);
            });
    }

    /**
     * 仅在步骤第一次可见时回调，用来延迟初始化
     */
    stepInit() {
        this.getEncrypt();
    }

    /**
     * 步骤跳转前回调，用来异步数据校验
     * @param {number} oldStep 跳转前步骤索引
     * @param {number} newStep 跳转后步骤索引
     * @param {Function} resolve 跳转函数，调用此函数步骤跳转，不调用则跳转取消
     */
    stepCheck(oldStep, newStep, resolve) {
        if (this.userName.trim() == '') {
            this
                .orderComm
                .showSmallToast('请输入用户名');
            return;
        }
        if (this.userId.trim() == '') {
            this
                .orderComm
                .showSmallToast('请输入身份证号');
            return;
        } else {
            let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!reg.test(this.userId)) {
                this
                    .orderComm
                    .showSmallToast('身份证号码不符合规范');
                return;
            } else {
                this.getEncrypt();
                
            }
        }
        //校验通过跳转
        resolve();
    }
    //加密CCBparam
    getEncrypt() {
        this.userInfo = this.local.read("userInfo");
        let ele = 'jsonStrParam={"Serv_Tp":"ZF","Usr_ID":"ZF00100011002","Cst_Nm":"崔金达","Crdt_TpCd":"1010","Crdt_No":"120102197009010537","Rsrv_TpCd":"1"}';
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpPost(3, "zfbz/zfbz/wwgs/getEncParam.action", ele)
                .then(res => {
                    if (res.code == "0") {
                        this.ccbparam = res.data;
                        this.local.write("idCCbParam", this.ccbparam);
                        this.identity();
                    }
                    resolve();
                })
                .catch(error => {
                    reject();
                });
        });
    }
    //身份证信息校验
    identity() {
        let ele = "TXCODE=EC2000&Chnl_TpCd=H3&ccbParam=" + this
            .local
            .read("idCCbParam");
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpPost(4, "LHECISM/LanHaiDedicatedService?", ele)
                .then(res => {
                   resolve();
                })
                .catch(error => {
                    reject();
                });
        });
    }
}