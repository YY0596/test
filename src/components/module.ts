import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DHCPage } from '../components/page/dhc-page';
import { DHCWizard } from '../components/wizard/dhc-wizard';
import { DHCWizardStep } from '../components/wizard/dhc-wizard-step';

@NgModule({
    declarations: [
        DHCPage,
        DHCWizard,
        DHCWizardStep
    ],
    imports: [
        IonicModule
    ],
    exports: [
        DHCPage,
        DHCWizard,
        DHCWizardStep
    ]
})
export class DHCModule { }