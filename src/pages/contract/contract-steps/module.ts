import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ContractViewer } from './contract-viewer';
import { ContractIdentity } from './contract-identity';
import { ContractPhoto } from './contract-photo';
import { ContractSign } from './contract-sign';
import { ContractComplete } from './contract-complete';

@NgModule({
    declarations: [
        ContractViewer,
        ContractIdentity,
        ContractPhoto,
        ContractSign,
        ContractComplete
    ],
    imports: [
        IonicModule
    ],
    exports: [
        ContractViewer,
        ContractIdentity,
        ContractPhoto,
        ContractSign,
        ContractComplete
    ]
})
export class ContractStepsModule { }