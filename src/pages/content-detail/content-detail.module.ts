import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContentDetailPage } from './content-detail';
import { HtmlPipe } from '../../pipes/HtmlPipe';

@NgModule({
  declarations: [
    ContentDetailPage,
    HtmlPipe,
  ],
  imports: [
    IonicPageModule.forChild(ContentDetailPage),
  ],
  exports: [
    ContentDetailPage
  ]
})
export class ContentDetailPageModule { }
