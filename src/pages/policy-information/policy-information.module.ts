import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PolicyInformationPage} from './policy-information';
import {PipesModule} from '../../pipes/PipesModule';


@NgModule({
  declarations: [
    PolicyInformationPage, 
  ],
  imports: [
    IonicPageModule.forChild(PolicyInformationPage),
    PipesModule
  ],
  exports: [PolicyInformationPage, ]
})
export class PolicyInformationPageModule {}