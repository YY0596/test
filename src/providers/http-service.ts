import { Injectable } from '@angular/core';
import { RequestOptionsArgs, Http, Response, Headers, RequestOptions, Jsonp } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


import { REQUEST_TIMEOUT, IS_DEBUG, APP_SERVE_URL, AppConfig, API_URL_WECHAT, API_URL_PLATFORM, API_URL_WEBSERVER, API_URL_WEBSITEPAGES, API_URL_CCBWEB, API_URL_CCBLOGIN, API_URL_CCBUPDATE, API_URL_CCBPREPAREAPPLY, API_URL_ZFBZ, API_URL_XZ, API_URL_NS, API_URL_HF, API_URL_TSJB, API_URL_TCSQ, API_URL_FWWX, TEST_URL } from '../app/config';

import { StorageService } from './localstorage';
import {
    URLSearchParams,
    RequestMethod
} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable, TimeoutError } from "rxjs";
import { Utils } from "./Utils";
import { GlobalData } from "./GlobalData";
import { NativeService } from "./NativeService";

import { Logger } from "./Logger";
/*
  Generated class for the HttpRequest provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpService {
    myInfoLocal: any;
    //ipAdress: any = "http://128.196.212.12/lhgzfww";
    ipAdress: any = this
        .appConfig
        .getDebugUrl();
    constructor(
        private http: Http,
        public jsonp: Jsonp,
        private local: StorageService,
        private globalData: GlobalData,
        public logger: Logger,
        private nativeService: NativeService,
        public appConfig: AppConfig) {

    }

    public svrUrl(type: number, svrName: string): string {
        if (this.local.read("ip") != null) {
            this.ipAdress = this.local.read("ip");

        }
        if (type == 0) {
            return this.ipAdress + `${API_URL_WECHAT}${svrName}`;
        }
        else if (type == 1) {
            return this.ipAdress + `${API_URL_PLATFORM}${svrName}`;
        } else if (type == 2) {
            return TEST_URL + `${API_URL_WEBSERVER}${svrName}`;
        }
        else if (type == 3) {
            return `${API_URL_WEBSITEPAGES}${svrName}`;
        } else if (type == 4) {
            return `${API_URL_CCBWEB}${svrName}`;
        } else if (type == 5) {
            return `${API_URL_CCBLOGIN}${svrName}`;
        } else if (type == 6) {
            return this.ipAdress + `${API_URL_CCBUPDATE}${svrName}`;
        } else if (type == 7) {
            return this.ipAdress + `${API_URL_CCBPREPAREAPPLY}${svrName}`;
        } else if (type == 8) {  // 住房保障(中间路径)
            return TEST_URL + `${API_URL_ZFBZ}${svrName}`;
        } else if (type == 9) { //  外网须知 wwxz
            return this.ipAdress + `${API_URL_XZ}${svrName}`;
        } else if (type == 10) { // 外网年审 wwns
            return this.ipAdress + `${API_URL_NS}${svrName}`;
        } else if (type == 11) { // 外网换房申请 wwhfsq
            return this.ipAdress + `${API_URL_HF}${svrName}`;
        } else if (type == 12) { // 投诉举报 WwTsjb
            return this.ipAdress + `${API_URL_TSJB}${svrName}`;
        } else if (type == 13) { // 外网退出保障申请 wwzytz
            return this.ipAdress + `${API_URL_TCSQ}${svrName}`;
        } else if (type == 14) { // 房屋维修 fwwx
            return this.ipAdress + `${API_URL_FWWX}${svrName}`;
        }
    }

    public httpPostFormNoAuth(type: number, svrName: string, body: any) {
        var headers = new Headers();
        headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.svrUrl(type, svrName), body, options).toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            });
    }
    // public httpGetNoAuth(svrName: string, options: any = {}) {
    //     let headers = new Headers();
    //     headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    //     let opts = new RequestOptions({headers: headers});
    //     return this.http.get(this.svrUrl(svrName) + formEncode(options), opts)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(err => {
    //           this.handleError(err);
    //         });
    // }

    // public httpGetWithAuth(svrName: string, options: any = {}) {
    //     var val = <string>this.local.read('login_token');
    //             let headers = new Headers();
    //             headers.set('Content-Type', 'application/x-www-form-urlencoded');
    //             headers.set('Authorization', val);
    //             let opts = new RequestOptions({headers: headers});
    //             return this.http.get(this.svrUrl(svrName) + formEncode(options), opts)
    //                 .toPromise()
    //                 .then(res => res.json())
    //                 .catch(err => {
    //                   this.handleError(err);
    //                 });

    // }

    // public httpPostJsonNoAuth(svrName: string, body: any) {
    //     var headers = new Headers();
    //     headers.set('Content-Type', 'application/json');
    //     let options = new RequestOptions({ headers: headers });
    //     return this.http.post(this.svrUrl(svrName), body, options).toPromise()
    //         .then(res => res.json())
    //         .catch(err => {
    //             this.handleError(err);
    //         });
    // }
    // public httpPostJsonWithAuth(svrName: string, body?: any) {
    //    var val = <string>this.local.read('login_token');
    //             var headers = new Headers();
    //             headers.append('Content-Type', 'application/json');
    //             headers.append('Authorization', val);
    //             let options = new RequestOptions({ headers: headers });
    //             return this.http.post(this.svrUrl(svrName), body, options).toPromise()
    //                 .then(res => res.json())
    //                 .catch(err => {
    //                     this.handleError(err);
    //                 });

    // }
    public httpPostFormWithAuth(type: number, svrName: string, body?: any) {
        var val = <string>this.local.read('login_token');
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Authorization', val);
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.svrUrl(type, svrName), body, options).toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            });
    }



    public httpPost(type: number, svrName: string, body: any) {
        //设置请求方式并请求接口
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.svrUrl(type, svrName), body, options).toPromise().then(res => res.json()).catch(err => {
            this.handleError(err);
        });
    }
    public httpGet(type: number, svrName: string) {
        //设置请求方式并请求接口
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.svrUrl(type, svrName), options).toPromise().then(res => res.json()).catch(err => {
            this.handleError(err);
        });
    }

    public httpPostWithUrl(url: string, body: any) {
        //设置请求方式并请求接口
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
        var options = new RequestOptions({ headers: headers });
        return this
            .http
            .post(url, body, options)
            .toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            });
    }

    public httpGetWithUrl(url: string, ele: string) {
        //设置请求方式并请求接口
        var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' });
        var options = new RequestOptions({ headers: headers });
        return this
            .http
            .get(url + ele, options)
            .toPromise()
            .then(res => res.json())
            .catch(err => {
                this.handleError(err);
            });
    }

    /**
     * 不拦截异常的HttpGet请求
     * @param type 服务类型
     * @param svrName 服务名
     */
    public httpGetNoCatch(type: number, svrName: string): Promise<any> {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this.http.get(this.svrUrl(type, svrName), options)
            .toPromise()
            .then(res => res.json());
    }

    /**
         * 不拦截异常的HttpGet请求
         * @param type 服务类型
         * @param svrName 服务名
         */
    public httpGetNoCatchJsonp(svrName: string): Promise<any> {
        // // 定义服务器地址
        // let wikiUrl = 'http://localhost:3000/users';
        // 定义参数
        var params = new URLSearchParams();
        params.set('callback', 'JSONP_CALLBACK');
        // 使用jsonp模块获取express后台返回的jsonp数据
        return this.jsonp
            .get(svrName, { search: params })
            .map(res => res.json())
            .toPromise();
    }
    /**
     * 不拦截异常的HttpPost请求
     * @param type 服务类型
     * @param svrName 服务名
     * @param body POST数据
     */
    public httpPostNoCatch(type: number, svrName: string, body: any): Promise<any> {
        var headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        });
        var options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.svrUrl(type, svrName), body, options)
            .toPromise()
            .then(res => res.json());
    }

    private handleError(error: Response) {

        // return Observable.throw('Server Error');
    }
    public request(url: string, options: RequestOptionsArgs): Observable<Response> {
        url = Utils.formatUrl(url.startsWith('http')
            ? url
            : APP_SERVE_URL + url);
        this.optionsAddToken(options);
        return Observable.create(observer => {
            this
                .nativeService
                .showLoading();
            IS_DEBUG;
            this
                .http
                .request(url, options)
                .timeout(REQUEST_TIMEOUT)
                .subscribe(res => {
                    this
                        .nativeService
                        .hideLoading();
                    IS_DEBUG;
                    if (res['_body'] == '') {
                        res['_body'] = null;
                    }
                    observer.next(res);
                }, err => {
                    this.requestFailed(url, options, err); //处理请求失败
                    observer.error(err);
                });
        });
    }

    public get(url: string, paramMap: any = null): Observable<Response> {
        return this.request(url, new RequestOptions({
            method: RequestMethod.Get,
            search: HttpService.buildURLSearchParams(paramMap)
        }));
    }

    public post(url: string, body: any = {}): Observable<Response> {
        return this.request(url, new RequestOptions({
            method: RequestMethod.Post,
            body: body,
            headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
        }));
    }

    public postFormData(url: string, paramMap: any = null): Observable<Response> {
        return this.request(url, new RequestOptions({
            method: RequestMethod.Post,
            search: HttpService
                .buildURLSearchParams(paramMap)
                .toString(),
            headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })
        }));
    }

    public put(url: string, body: any = {}): Observable<Response> {
        return this.request(url, new RequestOptions({ method: RequestMethod.Put, body: body }));
    }

    public delete(url: string, paramMap: any = null): Observable<Response> {
        return this.request(url, new RequestOptions({
            method: RequestMethod.Delete,
            search: HttpService
                .buildURLSearchParams(paramMap)
                .toString()
        }));
    }

    public patch(url: string, body: any = {}): Observable<Response> {
        return this.request(url, new RequestOptions({ method: RequestMethod.Patch, body: body }));
    }

    /**
       * 将对象转为查询参数
       * @param paramMap
       * @returns {URLSearchParams}
       */
    private static buildURLSearchParams(paramMap): URLSearchParams {
        let params = new URLSearchParams();
        if (!paramMap) {
            return params;
        }
        for (let key in paramMap) {
            let val = paramMap[key];
            if (val instanceof Date) {
                val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
            }
            params.set(key, val);
        }
        return params;
    }

    /**
       * 处理请求失败事件
       * @param url
       * @param options
       * @param err
       */
    private requestFailed(url: string, options: RequestOptionsArgs, err: Response): void {
        this
            .nativeService
            .hideLoading();
        IS_DEBUG;
        if (err instanceof TimeoutError) {
            this
                .nativeService
                .alert('请求超时,请稍后再试!');
            return;
        }
        //err数据类型不确定,判断消息体是否有message字段,如果有说明是后台返回的json数据
        let index = JSON
            .stringify(err['_body'])
            .indexOf('message');
        if (index != -1) {
            this
                .nativeService
                .alert(err.json().message || '请求发生异常');
            return;
        }
        if (!this.nativeService.isConnecting()) {
            this
                .nativeService
                .alert('请连接网络');
            return;
        }
        let status = err.status;
        let msg = '请求发生异常';
        if (status === 0) {
            msg = '请求失败，请求响应出错';
        } else if (status === 404) {
            msg = '请求失败，未找到请求地址';
        } else if (status === 500) {
            msg = '请求失败，服务器出错，请稍后再试';
        }
        this
            .nativeService
            .alert(msg);
        this
            .logger
            .httpLog(err, msg, {
                url: url,
                status: status
            });
    }

    private optionsAddToken(options: RequestOptionsArgs): void {
        let token = this.globalData.token;
        if (options.headers) {
            options
                .headers
                .append('Authorization', 'Bearer ' + token);
        } else {
            options.headers = new Headers({
                'Authorization': 'Bearer ' + token
            });
        }
    }
}
