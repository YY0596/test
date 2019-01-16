import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { DHCPage } from '../../components';
import { ContractViewer, ContractIdentity, ContractPhoto, ContractSign, ContractComplete } from './contract-steps';

/**
 * 合同页面
 */
@IonicPage()
@Component({
  selector: 'page-contract',
  templateUrl: 'contract.html',
})
export class ContractPage extends DHCPage {
  /**
   * 合同步骤
   */
  wizardSteps: Array<any> = [
    { title: '合同预览', content: ContractViewer },
    { title: '确认身份', content: ContractIdentity },
    { title: '照片认证', content: ContractPhoto },
    { title: '用户签字', content: ContractSign },
    { title: '完成签约', content: ContractComplete }
  ];
}
