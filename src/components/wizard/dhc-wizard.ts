import { Component, Renderer2, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Content, ViewController } from 'ionic-angular';
import { DHCWizardStep } from '../wizard/dhc-wizard-step';

/**
 * 步骤向导控件
 * 
 * 步骤控件支持2种方式加载子控件
 * 1、直接在模板中加载，如下：
 * <dhc-wizard>
 *   <dhc-wizard-step [title]="合同预览">
 *       //模板中加载子组件
 *      <button ion-button></button>
 *   </dhc-wizard-step>
 *   <dhc-wizard-step [title]="身份确认">
 *      <button ion-button></button>
 *   </dhc-wizard-step>
 * </dhc-wizard>
 * 
 * 2、通过绑定方式动态加载，如下：
 * <dhc-wizard>
 *   <dhc-wizard-step *ngFor="let step of wizardSteps" [title]="step.title" [content]="step.content">
 *   </dhc-wizard-step>
 * </dhc-wizard>
 * 数据部分：
 * import { ContractViewer, ContractIdentity, ContractPhoto, ContractSign, ContractComplete } from './contract-steps';
 * .....组件定义略
 * wizardSteps: Array<any> = [
 *   { title: '合同预览', content: ContractViewer },
 *   { title: '确认身份', content: ContractIdentity },
 *   { title: '照片认证', content: ContractPhoto },
 *   { title: '用户签字', content: ContractSign },
 *   { title: '完成签约', content: ContractComplete }
 * ];
 * dhc-wizard-step的content属性绑定需要动态加载的组件类型
 * 注意：如果使用绑定方式，除了在页面的module文件中在imports中声明，还要在
 * entryComponents中声明，否则动态创建组件会报错，如下：
 * imports: [
 *    ContractStepsModule  //导入组件模块
 * ],
 * entryComponents: [  //注册绑定控件
 *  ContractViewer, 
 *  ContractIdentity,
 *  ContractPhoto,
 *  ContractSign,
 *  ContractComplete
 * ]
 * 
 * 关于Wizard控件的使用示例，参考电子合同模块(contract.html/contract.ts)
 * 
 */
@Component({
    selector: 'dhc-wizard',
    templateUrl: 'dhc-wizard.html'
})
export class DHCWizard {
    /**
     * 步骤列表
     */
    steps: Array<DHCWizardStep> = [];

    /**
     * 是否能转到上一步
     */
    prevEnabled: boolean = false;

    /**
     * 是否能转到下一步
     */
    nextEnabled: boolean = false;

    /**
     * 是否能跳转到完成步骤
     */
    completedEnabled: boolean = false;

    /**
     * 是否完成
     */
    isCompleted: boolean = false;

    /**
     * 步骤控件背景颜色
     */
    @Input()
    bgColor: string = '#ffffff';

    /**
     * 是否自动设置高度，如果设置为false，控件将填充整个页面高度
     */
    @Input()
    autoHeight: boolean = false;

    /**
     * 是否延迟加载步骤，如果启用延迟加载，在数据绑定的场景下，仅当步骤第一次可见时才会加载模块
     */
    @Input()
    lazyLoad: boolean = true;

    _currentStep: number = 1;

    /**
     * 获取当前步骤
     */
    @Input()
    set currentStep(step: number) {
        this.gotoStep(step);
    }

    /**
     * 设置当前步骤
     */
    get currentStep(): number {
        return this._currentStep;
    }

    /**
     * 获取总的步骤数
     */
    get totalStep(): number {
        return this.steps.length;
    }

    /**
     * 向导完成显示文本
     */
    @Input()
    completedText: string = "向导完成";

    /**
     * 向导上一步显示文本
     */
    @Input()
    previousText: string = "上一步";

    /**
     * 向导下一步显示文本
     */
    @Input()
    nextText: string = "下一步";

    _showStepInButton: boolean = true;

    /**
     * 设置是否在向导按钮中显示步骤名称
     */
    @Input()
    set showStepInButton(shown: boolean) {
        this._showStepInButton = shown;
    }

    /**
     * 获取是否在向导按钮中显示步骤名称
     */
    get showStepInButton(): boolean {
        return this._showStepInButton;
    }

    /**
     * 步骤改变事件
     */
    @Output()
    stepChanged: EventEmitter<any> = new EventEmitter<any>();

    /**
     * 步骤完成事件
     */
    @Output()
    stepCompleted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * 步骤控件选项卡容器
     */
    @ViewChild('tab')
    tabRef: ElementRef;

    /**
     * 步骤内容容器
     */
    @ViewChild('step')
    stepRef: ElementRef;

    /**
     * 步骤控件工具栏容器
     */
    @ViewChild('footer')
    footerRef: ElementRef;

    constructor(
        private content: Content,
        private element: ElementRef,
        private render: Renderer2,
        private viewCtrl: ViewController
    ) {
        this.viewCtrl.readReady.subscribe(() => {
            this.setHeight();
            this.updateWizard();
            this.gotoStep(1);
            this.viewCtrl.readReady.unsubscribe();
        });
    }

    /**
     * 设置控件高度
     */
    setHeight() {
        //自动高度不处理
        if (this.autoHeight) return;

        //设置控件高度，填充页面高度
        let cHeight = this.content.contentHeight;
        this.render.setStyle(this.element.nativeElement, 'height', cHeight + 'px');

        //设置控件内容高度，填充页面剩余高度
        let tHeight = this.tabRef.nativeElement.clientHeight;
        let fHeight = this.footerRef.nativeElement.clientHeight;
        let sHeight = cHeight - tHeight - fHeight;
        this.render.setStyle(this.stepRef.nativeElement, 'height', sHeight + 'px');
    }

    /**
     * 更新wizard控件状态
     */
    updateWizard() {
        //按钮状态
        this.isCompleted = this.currentStep == this.totalStep;
        this.prevEnabled = !this.isCompleted && this.currentStep > 1;
        this.nextEnabled = this.currentStep < this.totalStep;
        this.completedEnabled = this.currentStep == (this.totalStep - 1);
        if (this.showStepInButton) {
            this.prevEnabled && (this.previousText = `上一步(${this.steps[this.currentStep - 2].title})`);
            this.nextEnabled && (this.nextText = `下一步(${this.steps[this.currentStep].title})`);
        }
        //页面状态
        this.steps.forEach((item, idx) => {
            item.completed = (this.currentStep > idx);
            item.actived = (this.currentStep == idx + 1);
        });
        this.isCompleted && this.stepCompleted.emit();
    }

    /**
     * 增加步骤组件
     * @param step 步骤组件 
     */
    addStep(step: DHCWizardStep) {
        this.steps.push(step);
    }

    /**
     * 上一步
     */
    gotoPrevious() {
        this.currentStep--;
    }

    /**
     * 下一步
     */
    gotoNext() {
        this.currentStep++;
    }

    /**
     * 完成
     */
    gotoComplete() {
        this.currentStep = this.totalStep;
    }

    /**
     * 跳转到指定步骤
     * @param step 步骤索引 
     */
    gotoStep(step: number) {
        //回退步骤直接跳转
        let oldStep = this._currentStep;
        let newStep = Math.min(Math.max(1, step), this.totalStep);
        if (oldStep >= newStep) {
            this._gotoInnerStep(oldStep, newStep);
            return;
        }

        //前进步骤，跳转前步骤检查
        let stepRef = this.steps[oldStep - 1];
        new Promise((resolve, reject) => {
            stepRef.onStepCheck(oldStep, newStep, resolve);
        }).then(() => {
            this._gotoInnerStep(oldStep, newStep);
        });
    }

    /**
     * 跳转到指定步骤(内部调用)
     * @param oldStep 跳转前步骤 
     * @param newStep 跳转后步骤
     */
    _gotoInnerStep(oldStep, newStep) {
        this._currentStep = newStep;
        this.updateWizard();
        this.stepChanged.emit({ oldStep: oldStep, newStep: newStep });

        //初始化步骤
        let stepRef = this.steps[newStep - 1];
        !stepRef.inited && stepRef.onStepInit();
    }

    /**
     * 回退步骤
     */
    backStep(step: number) {
        if (step < this.currentStep && !this.isCompleted) {
            this.gotoStep(step);
        }
    }
}