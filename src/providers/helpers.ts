import { StorageService } from '../providers/localstorage';

export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function toQueryPair(key, value) {
  if (typeof value == 'undefined') {
    return key;
  }
  return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}

//object to　Array
export function toQueryString(obj) {
  var ret = [];
  for (var key in obj) {
    key = encodeURIComponent(key);
    var values = obj[key];
    if (values && values.constructor == Array) {//数组
      var queryValues = [];
      for (var i = 0, len = values.length, value; i < len; i++) {
        value = values[i];
        queryValues.push(toQueryPair(key, value));
      }
      ret = ret.concat(queryValues);
    } else { //字符串
      ret.push(toQueryPair(key, values));
    }
  }
  return '?' + ret.join('&');
}

export function toBodyString(obj) {
  var ret = [];
  for (var key in obj) {
    key = encodeURIComponent(key);
    var values = obj[key];
    if (values && values.constructor == Array) {//数组
      var queryValues = [];
      for (var i = 0, len = values.length, value; i < len; i++) {
        value = values[i];
        queryValues.push(toQueryPair(key, value));
      }
      ret = ret.concat(queryValues);
    } else { //字符串
      ret.push(toQueryPair(key, values));
    }
  }
  return ret.join('&');
}

//判断数组中是否存在值
//value:String
//array:string[]
export function contains(value: string, array: string[]) {
  for (let val of array) {
    if (val == value) {
      return true;
    }
  }
  return false;
}


//从临时存储中获取历史记录
export function getHistoryRec(value: string) {
  let localstorage = new StorageService;
  var val = <string>localstorage.read(value);
  let result: string[] = [];
  if (val != null) {
    for (var _i = 0; _i < val.length; _i++) {
      result.push(val[_i]);
    }
  }
  return result;
}

//获取当前时间,格式为YYYY-MM-DDThh:mm
export function getNowFormatedDate(): string {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var yearStr = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();

  var monthStr = month.toString();
  var dayStr = day.toString();
  var hourStr = hour.toString();
  var minuteStr = minute.toString();

  if (month >= 1 && month <= 9) {
    // bug:Type 'string' is not assignable to type 'number'.
    monthStr = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    dayStr = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hourStr = "0" + hour;
  }
  if (minute >= 0 && minute <= 9) {
    minuteStr = "0" + minute;
  }

  return yearStr + seperator1 + monthStr + seperator1 + dayStr
    + "T" + hourStr + seperator2 + minuteStr;
}
//获取当前时间,格式为YYYY-MM-DDThh:mm:ss
export function getNowFormatedTime(): string {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var yearStr = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
var second=date.getSeconds();

  var monthStr = month.toString();
  var dayStr = day.toString();
  var hourStr = hour.toString();
  var minuteStr = minute.toString();
var secondStr = second.toString();
  if (month >= 1 && month <= 9) {
    // bug:Type 'string' is not assignable to type 'number'.
    monthStr = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    dayStr = "0" + day;
  }
  if (hour >= 0 && hour <= 9) {
    hourStr = "0" + hour;
  }
  if (minute >= 0 && minute <= 9) {
    minuteStr = "0" + minute;
  }
if (second >= 0 && second <= 9) {
    secondStr = "0" + second;
  }
  return yearStr + seperator1 + monthStr + seperator1 + dayStr
    + "T" + hourStr + seperator2 + minuteStr+seperator2+secondStr;
}
//获取当前时间,格式为YYYY-MM-DD
export function getYYYYMMDDByDate(): string {
  var date = new Date();
  var yearStr = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var monthStr = month.toString();
  var dayStr = day.toString();

  if (month >= 1 && month <= 9) {
    monthStr = "0" + month;
  }
  if (day >= 0 && day <= 9) {
    dayStr = "0" + day;
  }

  return yearStr + monthStr + dayStr;
}

//获取当前时间,格式为YYYY-MM
export function getYYYYMMByDate(date: Date): string {
  var yearStr = date.getFullYear().toString();
  var month = date.getMonth() + 1;
  var monthStr = month.toString();

  if (month >= 1 && month <= 9) {
    monthStr = "0" + month;
  }

  return yearStr + monthStr;
}

//获取当前时间的一个月前时间,格式为YYYY-MM
export function getYYYYMMMonthAgoByDate(date: Date): string {
  var year = date.getFullYear();
  var month = date.getMonth() + 1; //当前月
  var monthAgo = month - 1;

  // 当前月是1月份,1个月前就是上一年的12月
  if(monthAgo == 0) {
    year -= 1;
    monthAgo = 12;
  }

  var yearStr = year.toString();
  var monthStr = monthAgo.toString();
  if (monthAgo >= 1 && monthAgo <= 9) {
    monthStr = "0" + monthAgo;
  }
  return yearStr + monthStr;
}

//获取当前时间的一个月前时间,格式为YYYY-MM
export function getYYYYMM2MonthAgoByDate(date: Date): string {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var twoMonthAgo = month - 2;
  // 当前月是2月份,两个月前就是上一年的12月
  if(twoMonthAgo == 0) {
    year -= 1;
    twoMonthAgo = 12;
  }
  // 当前月是1月份,两个月前就是上一年的11月
  if(twoMonthAgo == -1) {
    year -= 1;
    twoMonthAgo = 11;
  }

  var yearStr = year.toString();
  var monthStr = twoMonthAgo.toString();
  if (twoMonthAgo >= 1 && twoMonthAgo <= 9) {
    monthStr = "0" + twoMonthAgo;
  }
  return yearStr + monthStr;
}

//比较两个时间先后,date1>date2,则返回true;否则返回false
export function compareDateWith(date1: Date, date2: Date): boolean {
  // if (date1.getTime() > date2.getTime()) return true;
  // else return false;
  return date1.getTime() > date2.getTime();
}
//比较日前大小
// export function compareDate(checkStartDate, checkEndDate) {
//     var arys1= new Array();
//     var arys2= new Array();
// if(checkStartDate != null && checkEndDate != null) {
//     arys1=checkStartDate.split('T');
//       var sdate=new Date(arys1[0],arys1[1]-1,arys1[2]);
//     arys2=checkEndDate.split('T');
//     var edate=new Date(arys2[0],arys2[1]-1,arys2[2]);
// if(sdate > edate) {
//     alert("日期开始时间大于结束时间");
//     return false;
// }  else {
//     alert("通过");
//     var s=sdate.getUTCDay()
//     var e=edate.getUTCDay();
//     return true;
//     }
//     }      
// }
//调用该方法(主方法)日期相减
export function dateDiff(date1, date2){
    var type1 = typeof date1, type2 = typeof date2; 
    if(type1 == 'string') 
    date1 = stringToTime(date1);
    else if(date1.getTime) 
    date1 = date1.getTime(); 
    if(type2 == 'string') 
    date2 = stringToTime(date2); 
    else if(date2.getTime) 
    date2 = date2.getTime(); 
    return (date1 - date2) / 86400000;//结果是天
}

//字符串转成Time(dateDiff)所需方法 
export function stringToTime(string){
    var f = string.split('T', 2);
    var d = (f[0] ? f[0] : '').split('-', 3); 
    var t = (f[1] ? f[1] : '').split(':', 3); 
    return (new Date(
    parseInt(d[0], 10) || null,
    (parseInt(d[1], 10) || 1)-1,
    parseInt(d[2], 10) || null,
    parseInt(t[0], 10) || null,
    parseInt(t[1], 10) || null,
    parseInt(t[2], 10) || null
    )).getTime();

}
//比较10位的时间戳与当前时间比较,时间戳时间<当前时间,则过期,返回true;否则返回false
export function isExpired(deadline: string): boolean {
  let timestamp: number = parseInt(deadline);
  var deadlineDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
  let nowDate = new Date();
  //bug: 这里同一个文件的函数调用不能用this
  return compareDateWith(nowDate, deadlineDate);
}