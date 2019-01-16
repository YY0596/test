import { Component, Input, Output, ViewChild, ViewContainerRef, ComponentFactoryResolver, AfterViewInit, OnDestroy, ComponentRef } from '@angular/core';
import { DHCWizard } from '../wizard/dhc-wizard';

/**
 * Wizard步骤
 */
@Component({
    selector: 'dhc-wizard-step',
    template: `<div class='step-page' [class.actived]='actived'>
                  <ng-content name='child'></ng-content>
                  <ng-template #viewport></ng-template>
               <div>`
})
export class DHCWizardStep implements AfterViewInit, OnDestroy {
    /**
     * 步骤标题
     */
    @Input()
    title: string = '';

    /**
     * 设置Wizard的内容，用于绑定的场景
     */
    @Input()
    content: any = null;

    /**
     * 视图是否初始化
     */
    inited: boolean = false;

    /**
     * 步骤是否激活
     */
    actived: boolean = false;

    /**
     * 步骤是否完成
     */
    completed: boolean = false;

    /**
     * 动态创建组件容器
     */
    @ViewChild("viewport", { read: ViewContainerRef })
    viewPort: ViewContainerRef;

    /**
     * 动态创建组件实例
     */
    viewRef: ComponentRef<any> = null;

    /**
     * 事件处理器
     */
    handlers: any = {};

    constructor(private parent: DHCWizard, public cfr: ComponentFactoryResolver) {
        //添加组件到父控件中
        this.parent.addStep(this);
    }

    /**
     * 视图加载完成,动态创建组件
     */
    ngAfterViewInit() {
        !this.parent.lazyLoad && this.createComponent();
    }

    /**
     * 创建内容组件
     */
    createComponent() {
        if (!this.content) return;
        let componentFactory = this.cfr.resolveComponentFactory(this.content);
        if (componentFactory) {
            this.viewRef = this.viewPort.createComponent(componentFactory);
        }
    }

    /**
     * 视图销毁时，销毁动态创建组件
     */
    ngOnDestroy() {
        this.viewRef && this.viewRef.destroy();
    }

    /**
     * 视图初始化
     */
    onStepInit() {
        this.parent.lazyLoad && this.createComponent();
        let initHandler = this.handlers['stepInit'];
        initHandler && initHandler();
        this.inited = true;
    }

    /**
     * 跳转检查
     * @param oldStep 跳转前步骤 
     * @param newStep 跳转后步骤
     * @param resolve 跳转函数,调用此函数，步骤会跳转，否则步骤取消跳转
     */
    onStepCheck(oldStep, newStep, resolve) {
        let checkHandler = this.handlers['stepCheck'];
        checkHandler ? checkHandler(oldStep, newStep, resolve) : resolve();
    }

    /**
     * 注册步骤事件处理函数
     * @param event 事件名 
     * @param handle 处理函数
     */
    registHandler(event, handle) {
        this.handlers[event] = handle;
    }
}