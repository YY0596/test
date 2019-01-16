import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonQuestionPage } from './common-question';
import { PipesModule } from '../../pipes/PipesModule';



@NgModule({
  declarations: [
    CommonQuestionPage,
    
  ],
  imports: [
    IonicPageModule.forChild(CommonQuestionPage), PipesModule
  ],
  exports: [CommonQuestionPage, ]
})
export class CommonQuestionPageModule { }
