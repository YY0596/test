import { Directive, ViewChild, Renderer2, Injector } from '@angular/core';
import { Content, ViewController } from 'ionic-angular';
import { PROMPT_INFO } from '../../app/config';
import { HttpService } from '../../providers/http-service';
import { OrderComm } from '../../providers/order-comm';

/**
 * 页面基类，提供通用错误拦截和异常处理功能
 * 后续增加网络检测、用户信息等通用功能
 */
@Directive({
    selector: 'dhc-page',
})
export class DHCPage {
    /**
     * 默认信息模板
     */
    static infoTemplate: string =
    `<div class='info-template'>
        <img class='template-icon' />
        <h4 class='template-title'></h4>
        <h5 class='template-sub-title'></h5>
    <div>`;

    /**
     * 默认请求设置
     */
    static defReqOpts = {
        cache: false,  //是否在请求时增加时间戳，默认是增加
        code: 0, //状态码，默认0表示正确，其他表示错误
        codeField: 'code', //状态码字段，默认为code 
        countField: 'count', //记录数字段，默认值为count
        showLoading: true, //是否显示加载条 ，默认值为true
        showEmpty: true, //是否显示空结果信息,默认值为true
        showExp: true, //是否在页面显示错误信息，默认显示
        throwExp: false  //是否抛出异常到下一个接收器，默认为false
    }

    //渲染器
    protected render: Renderer2;
    //视图控制器
    protected viewCtrl: ViewController;
    //服务帮助类
    protected httpService: HttpService;
    //对话框帮助类
    protected orderComm: OrderComm;
    //控件是否处于激活状态
    protected isActived: boolean = true;
    //控件是否载入完成
    protected isLoaded: boolean = false;
    //viewCtrl subscriber
    private _viewEnterSub: any;
    private _viewLeaveSub: any;
    private _viewUnloadSub: any;

    /**
     * 构造页面基类
     * @param injector 依赖注入容器
     */
    constructor(private injector: Injector) {
        //获取注入对象
        this.render = injector.get(Renderer2);
        this.viewCtrl = injector.get(ViewController);
        this.httpService = injector.get(HttpService);
        this.orderComm = injector.get(OrderComm);

        this._viewEnterSub = this.viewCtrl.didEnter.subscribe(() => {
            this._createInfoElements();
            this.isActived = true;
        });
        this._viewLeaveSub = this.viewCtrl.willLeave.subscribe(() => {
            this.orderComm.closeLoading();
            this.isActived = false;
        });
        this._viewUnloadSub = this.viewCtrl.willUnload.subscribe(() => {
            this.dispose();
        });
    }

    /**
     * 内容组件
     */
    @ViewChild(Content)
    content: Content;

    /**
     * 提示信息元素容器
     */
    infoElement: HTMLElement;

    /**
     * 创建提示信息元素
     */
    _createInfoElements() {
        if (this.isLoaded) return;

        this.infoElement = this.render.createElement('div');
        this.render.setProperty(this.infoElement, "innerHTML", DHCPage.infoTemplate);
        this.render.appendChild(this.content._elementRef.nativeElement, this.infoElement);
        this.render.addClass(this.infoElement, 'page-info');
        this.render.setStyle(this.infoElement, 'margin-top', this.content.getContentDimensions().contentTop + 'px');

        this.isLoaded = true;
    }

    /**
     * 显示数据空信息
     * @param title 主标题 
     * @param subTitle 副标题
     */
    showEmptyContent(title: string = PROMPT_INFO.Empty.title, subTitle: string = PROMPT_INFO.Empty.subTitle) {
        this.showCustomContent(PROMPT_INFO.Empty.image, title, subTitle);
    }

    /**
     * 显示成功提示信息
     * @param title 主标题 
     * @param subTitle 副标题
     */
    showSuccessContent(title: string = PROMPT_INFO.Success.title, subTitle: string = PROMPT_INFO.Success.subTitle) {
        this.showCustomContent(PROMPT_INFO.Success.image, title, subTitle);
    }

    /**
     * 显示错误提示信息
     * @param title 主标题 
     * @param subTitle 主标题
     */
    showErrorContent(title: string = PROMPT_INFO.Error.title, subTitle: string = PROMPT_INFO.Error.subTitle) {
        this.showCustomContent(PROMPT_INFO.Error.image, title, subTitle);
    }

    /**
     * 显示无网络提示信息
     * @param title 主标题
     * @param subTitle 主标题
     */
    showNoNetworkContent(title: string = PROMPT_INFO.NoNetwork.title, subTitle: string = PROMPT_INFO.NoNetwork.subTitle) {
        this.showCustomContent(PROMPT_INFO.NoNetwork.image, title, subTitle);
    }

    /**
     * 显示自定义信息
     * @param {string} image 图片路径
     * @param {string} title 主标题 
     * @param {string} subTitle 副标题
     */
    showCustomContent(image: string, title: string, subTitle: string) {
        //创建提示信息元素
        this._createInfoElements();
        //信息图标
        let iconRef = this.infoElement.querySelector('.template-icon');
        this.render.setAttribute(iconRef, 'src', image);
        //主标题
        let titleRef = this.infoElement.querySelector('.template-title');
        this.render.setProperty(titleRef, 'innerText', title);
        //副标题
        let subTitleRef = this.infoElement.querySelector('.template-sub-title');
        this.render.setProperty(subTitleRef, 'innerText', subTitle);
        //显示自定义信息
        this.render.setStyle(this.infoElement, 'display', 'block');
        this.content.setScrollElementStyle('display', 'none');
    }

    /**
     * 显示自定义信息
     * @param html html文档 
     */
    showCustomHtmlContent(html: string) {
        //创建提示信息元素
        this._createInfoElements();
        //移除已有DOM节点
        let childNodes = this.infoElement.childNodes;
        for (var i = childNodes.length - 1; i >= 0; i--) {
            this.infoElement.removeChild(childNodes.item(i));
        }
        //显示自定义信息
        this.render.setProperty(this.infoElement, "innerHTML", html);
        this.render.setStyle(this.infoElement, 'display', 'block');
        this.content.setScrollElementStyle('display', 'none');
    }

    /**
     * 关闭Info信息
     */
    closeInfoContent() {
        this.render.setStyle(this.infoElement, 'display', 'none');
        this.content.setScrollElementStyle('display', 'block');
    }

    /**
     * 发送GET请求，显示加载进度并拦截常见异常信息
     * @param {string} type  服务类型
     * @param {string} svrName 服务名 
     * @param {object} params 查询字符串参数列表
     * @param {boolean} reqOpts.cache 是否在请求时增加时间戳
     * @param {number} reqOpts.code 状态码，默认0表示正确，其他表示错误
     * @param {string} reqOpts.codeField 状态码字段，默认为code 
     * @param {string} reqOpts.countField 记录数字段，默认值为count
     * @param {boolean} reqOpts.showLoading 是否显示加载条 ，默认值为true
     * @param {boolean} reqOpts.showEmpty 是否空数据信息 ，默认值为true
     * @param {boolean} reqOpts.showEmpty 是否显示异常信息，默认为true
     * @param {boolean} reqOpts.throwExp 是否抛出异常到下一调用过程，默认为false
     */
    httpGet(type: number, svrName: string, params?: any, reqOpts?: any): Promise<any> {
        //合并参数
        var opts = Object.assign({}, DHCPage.defReqOpts, reqOpts || {});
        //显示进度
        opts.showLoading && this.orderComm.showLoading('正在加载数据');
        //执行GET请求
        let requestHandle = (resolve, reject) => {
            let requestUri = svrName + this._getQueryString(params, opts);
            this.httpService.httpGetNoCatch(type, requestUri).then((res) => {
                return this.hookHttpResponse(res, opts, resolve);
            }).catch((error) => {
                this.hookHttpError(error, opts, reject);
            });
        }
        return new Promise(requestHandle);
    }

    /**
     * 获取查询字符串参数
     * @param {object} params 查询字符串参数列表
     * @param {object} reqOpts 请求参数设置
     */
    _getQueryString(params, reqOpts) {
        params = params || {};
        var segments = '';
        for (var key in params) {
            segments += key;
            segments += '=';
            segments += params[key];
            segments += '&';
        }
        if (!reqOpts.cache) {
            segments += ('_=' + (new Date()).valueOf());
            segments += '&';
        }
        if (segments != '') {
            segments = segments.substr(0, segments.length - 1);
            segments = '?' + segments;
        }
        return segments;
    }

    /**
     * 使用静默模式发送GET请求,
     * 静默模式下不会显示加载进度条，
     * 页面不会显示结果为空以及任何异常信息
     * 如果发生异常，下一调用过程会收到异常信息
     * @param {string} type 服务类型
     * @param {string} svrName 服务名
     * @param {object} params 查询字符串参数列表
     * @param {object} reqOpts 设置选项
     */
    httpQuietGet(type: number, svrName: string, params?: any, reqOpts?: any): Promise<any> {
        var opts = Object.assign({}, reqOpts || {}, {
            showLoading: false,
            showEmpty: false,
            showExp: false,
            throwExp: true
        });
        return this.httpGet(type, svrName, params, opts);
    }

    /**
     * 发送Post请求，拦截常见异常处理
     * @param {string} type  服务类型
     * @param {string} svrName 服务名 
     * @param {object} body post数据   
     * @param {boolean} reqOpts.loading 是否显示加载条 ，默认值为true
     * @param {number} reqOpts.code 状态码，默认0表示正确，其他表示错误
     * @param {string} reqOpts.codeField 状态码字段，默认为code 
     * @param {string} reqOpts.countField 记录数字段，默认值为count
     * @param {boolean} reqOpts.throwExp 是否抛出异常，默认为false
     */
    httpPost(type: number, svrName: string, body: any, reqOpts?: any): Promise<any> {
        //合并参数
        var opts = Object.assign(DHCPage.defReqOpts, reqOpts || {});
        //显示进度
        opts.showLoading && this.orderComm.showLoading('正在加载数据');
        //执行请求
        let requestHandle = (resolve, reject) => {
            this.httpService.httpPostNoCatch(type, svrName, body).then((res) => {
                return this.hookHttpResponse(res, opts, resolve);
            }).catch((error) => {
                this.hookHttpError(error, opts, reject);
            });
        }
        return new Promise(requestHandle);
    }

    /**
     * 使用静默模式发送POST请求
     * 静默模式下不会显示加载进度条，
     * 页面不会显示结果为空以及任何异常信息
     * 如果发生异常，下一调用过程会收到异常信息
     * @param {string} type 服务类型
     * @param {string} svrName 服务名
     * @param {object} body post数据   
     * @param {object} reqOpts 设置选项
     */
    httpQuietPost(type: number, svrName: string, body: any, reqOpts?: any): Promise<any> {
        var opts = Object.assign({
            showLoading: false,
            showEmpty: false,
            showExp: false,
            throwExp: true
        }, reqOpts || {});
        return this.httpPost(type, svrName, body, opts);
    }

    /**
     * 拦截Http请求结果
     * @param {object} res 返回结果
     * @param {object} opts 请求设置参数
     * @param {Function} resolve 成功回调函数
     */
    hookHttpResponse(res, opts, resolve): Promise<any> {
        //非激活状态丢弃
        if (!this.isActived) return;

        //关闭Loading
        this.orderComm.closeLoading();

        //判断结果是否成功取回以及空数据处理
        let code = res[opts.codeField];
        let count = res[opts.countField];
        let showEmpty = opts.showEmpty && count == 0;
        if (code == opts.code) {
            showEmpty && this.showEmptyContent();
            resolve(res);
            return Promise.resolve(res);
        }
        else {
            return Promise.reject({ status: 500, body: res });
        }
    }

    /**
     * 拦截Http请求异常
     * @param {object} error 错误参数
     * @param {object} opts 请求设置参数
     * @param {Function} resolve 失败回调函数
     */
    hookHttpError(error, opts, reject) {
        //非激活状态丢弃
        if (!this.isActived) return;

        //关闭Loading
        this.orderComm.closeLoading();

        //处理各种异常
        let status = error.status;
        let title = '获取数据失败';
        let subTitle = '';
        if (status == 0) {
            subTitle = '服务访问超时或访问被拒绝';
        }
        else if (status == 404) {
            subTitle = "服务访问地址不存在";
        }
        else if (status == 500) {
            subTitle = '数据服务发生内部异常';
        }
        opts.showExp && this.showErrorContent(title, subTitle);

        //抛出异常
        opts.throwExp && reject(error);
    }

    /**
     * 释放资源
     */
    dispose() {
        this._viewEnterSub.unsubscribe();
        this._viewLeaveSub.unsubscribe();
        this._viewUnloadSub.unsubscribe();
        this.infoElement.remove();
        this.infoElement = null;
        this.isActived = false;
    }
}
