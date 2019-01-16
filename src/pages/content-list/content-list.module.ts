import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentListPage } from './content-list';
import {PipesModule} from '../../pipes/PipesModule';

@NgModule({
  declarations: [
    ContentListPage,
  ],
  imports: [
    IonicPageModule.forChild(ContentListPage),
    PipesModule
  ],
})
export class ContentListPageModule {}
