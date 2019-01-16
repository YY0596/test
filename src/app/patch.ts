/************************************************************
 * 补丁文件，修正Ionic组件BUG
 * 请在程序入口(main.ts)程序启动前(bootstrapModule)调用此补丁
 * ---main.ts
 *  import { Patch } from './patch';
 *  Patch.FixBags();
 *  platformBrowserDynamic().bootstrapModule(AppModule);
 ************************************************************/

import { Content } from 'ionic-angular';

export class Patch {
    /**
     * 修正ion-content被强制弹出再激活时计算Header偏移不正确的问题
     */
    private static _patchContentResize() {
        let oldFun = Content.prototype.resize;
        Content.prototype.resize = function () {
            let root = this._elementRef.nativeElement.parentElement;
            let display = window.getComputedStyle(root).display;
            display != 'none' && oldFun.apply(this);
        }
    }

    /**
     * 修正Ionic控件Bag
     */
    static FixBags() {
        Patch._patchContentResize();
    }
}


