import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractPage } from './contract';
import { DHCModule } from '../../components/module';
import { ContractStepsModule } from './contract-steps/module';
import { ContractViewer, ContractIdentity, ContractPhoto, ContractSign, ContractComplete } from './contract-steps';

@NgModule({
  declarations: [
    ContractPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractPage),
    DHCModule,
    ContractStepsModule  //导入组件模块
  ],
  //如果wizard控件使用动态绑定，不要忘了在entryComponents中注册绑定控件
  entryComponents: [
    ContractViewer,
    ContractIdentity,
    ContractPhoto,
    ContractSign,
    ContractComplete
  ],
  exports: [
    ContractPage
  ]
})
export class ContractPageModule { }
