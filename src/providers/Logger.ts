/**
 * Created by yanxiaojun617@163.com on 07-25.
 */
import {Injectable} from '@angular/core';
import {GlobalData} from "./GlobalData";
import * as fundebug from "fundebug-javascript";

/**
 * Utils类存放和业务无关的公共方法
 * @description
 */
@Injectable()
export class Logger {
  constructor(private globalData: GlobalData) {
  }

  log(err: any, action: string, other = null): void {

    other;

    fundebug.notifyError(err,
      {
        metaData: {
          action: action,//操作名称
          other: other,//其他数据信息
          user: {id: this.globalData.userId, name: this.globalData.username}
        }
      });
  }

  httpLog(err: any, msg: string, other = {}): void {

    fundebug.notifyHttpError(err,
      {
        metaData: {
          action: msg,//操作名称
          other: other,//其他数据信息
          user: {id: this.globalData.userId, name: this.globalData.username}
        }
      });
  }

}
