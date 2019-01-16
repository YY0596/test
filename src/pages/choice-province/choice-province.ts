import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ViewController, Content } from 'ionic-angular';
import { AppConfig, cityServices } from '../../app/config';
import { OrderComm } from '../../providers/order-comm';
import { Jsonp } from '@angular/http';
import { HttpService } from '../../providers/http-service';
import { StorageService } from '../../providers/localstorage';


/**
 * Generated class for the ChoiceProvincePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;
@IonicPage()
@Component({
  selector: 'page-choice-province',
  templateUrl: 'choice-province.html',
})
export class ChoiceProvincePage {
  change: any;
  back: boolean = true;
  positionCity: any = "";
  provinceCode: string;
  appVistUrl: any;
  province: Array<{
    provinceCode: string,
    provinceName: string,
  }> = [];
  citys: Array<{
    cityNo: string,
    provinceCode: string,
    provinceName: string,
    cityName: string,
    appVistUrl: string,
    xpoint: string,
    ypoint: string
  }> = [];
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams,
    private local: StorageService, private platform: Platform, private httpService: HttpService,
    public jsonp: Jsonp, private comm: OrderComm, private alertCtrl: AlertController,
    private appConfig: AppConfig) {
    this.change = this.navParams.get("change");
  }
  ionViewDidLoad() {
    this.getGeolocation().then(res => { this.positionCity = res; });
    this.getProvince(this.province);
  }
  //获取省份列表
  getProvince(list) {
    this.comm.showLoading("获取省份中,请稍后...");
    let ele = "";
    let url = cityServices + "/citycode/getProvinceList.action";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGetWithUrl(url, ele)
        .then(res => {
          if (res.code == 1) {
            this.comm.closeLoading();
            for (var i = 0; i < res.data.length; i++) {
              var tmp = res.data[i].provinceName
              if (tmp == "天津" || tmp == "北京" || tmp == "上海" || tmp == "重庆")
                list.push({ provinceCode: res.data[i].provinceCode, provinceName: tmp });
              else
                list.push({ provinceCode: res.data[i].provinceCode, provinceName: tmp + "省" });
            }
            resolve(res.data.length);
          } else {
            this.comm.closeLoading();
            this
              .comm
              .showAlert("省份无结果！");
          }
        })
        .catch(error => {
          this.comm.closeLoading();
          this
            .comm
            .showAlert("请检查服务器连接！");
          reject();
        });
    });
  }
  //获取城市
  getCitys(list, ele) {
    this.comm.showLoading("获取城市中,请稍后...");
    let url = cityServices + "/citycode/getCityListByProvinceCode.action?";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGetWithUrl(url, ele)
        .then(res => {
          if (res.code == 1) {
            this.comm.closeLoading();
            for (var i = 0; i < res.data.length; i++) {
              list.push({
                cityNo: res.data[i].cityNo, provinceCode: res.data[i].provinceCode,
                provinceName: res.data[i].provinceName, cityName: res.data[i].cityName,
                appVistUrl: res.data[i].appVistUrl, xpoint: res.data[i].xpoint, ypoint: res.data[i].ypoint
              });
            }
            resolve(res.data.length);
          } else {
            this.comm.closeLoading();
            this
              .comm
              .showAlert("城市无结果！");
          }
        })
        .catch(error => {
          this.comm.closeLoading();
          this
            .comm
            .showAlert("请检查服务器连接！");
          reject();
        });
    });
  }
  //根据定位选择城市
  getPositionCityForAddress() {
    if (this.positionCity == undefined || this.positionCity == "") {
      this.comm.showAlert("没有找到定位城市！");
      return;
    }
    let ele = "cityCode.provinceCode=" + "&cityCode.cityName=" + this.positionCity.replace("市", " ") + "&cityCode.cityNo=";
    let url = cityServices + "/citycode/getCityListByProvinceCode.action?";
    return new Promise((resolve, reject) => {
      this
        .httpService
        .httpGetWithUrl(url, ele)
        .then(res => {
          if (res.code == 1) {
            if (res.data.length > 0) {
              this
                .local
                .write("city", res.data[0].cityName);
              this
                .local
                .write("ip", res.data[0].appVistUrl);
              this
                .local
                .write("xpoint", res.data[0].xpoint);
              this
                .local
                .write("ypoint", res.data[0].ypoint);
              this
                .viewCtrl
                .dismiss();

            } else {
              this.comm
                .showConfirm("CCB建融家园公租房", "您定位的城市尚未有CCB建融家园项目,将自动为您切换到蓝海", () => {
                  this
                    .viewCtrl
                    .dismiss();
                  this
                    .local
                    .write("city", "蓝海");
                  this
                    .local
                    .write("xpoint", "113.400675");
                  this
                    .local
                    .write("ypoint", "22.88816");
                  this
                    .local
                    .write("ip", "http://lanhai.gongzu.home.ccb.com/lhgzfww");
                }, null);
            }
            resolve(res.data.length);
          } else {
            this
              .comm
              .showAlert("城市无结果！");
          }
        })
        .catch(error => {

          this
            .comm
            .showAlert("请检查服务器连接！");
          reject();
        });
    });
  }
  //查询城市
  getItems(ev:any) {
      let val = ev.target.value;
      if (val == undefined || val == "") {
        document.getElementById("choiceTitle").innerText = "选择省份";
        this.citys = [];
        val = " ";
        let ele = val;
        setTimeout(this.getProvince(this.province), 1000);
        //this.getProvince(this.province);
      } else {
        this.province = [];
        document.getElementById("choiceTitle").innerText = "选择城市";
        if (/^[a-zA-Z]/.test(val)) {
          this.citys = [];
          let ele = "cityCode.provinceCode=" + "&cityCode.cityName=" + "&cityCode.cityNo=" + val;
          setTimeout(this.getCitys(this.citys, ele), 1000);
          // this.getCitys(this.citys, ele);
        } else {
          this.citys = [];
          let ele = "cityCode.provinceCode=" + "&cityCode.cityName=" + val + "&cityCode.cityNo=";
          setTimeout(this.getCitys(this.citys, ele), 1000);
          // this.getCitys(this.citys, ele);
        }
      }
  }
  //关闭当前modal
  closeModal() {
    if (this.back) {
      this
        .viewCtrl
        .dismiss();
    } else {
      this.citys = [];
      document.getElementById("choiceTitle").innerText = "选择省份";
      this.getProvince(this.province);
      this.back = true;
    }
  }
  //跳转到选择省份
  choiceProvince(item) {
    this.provinceCode = item.provinceCode;
    //this.navCtrl.push("ChoiceCityPage", { param: item.provinceCode,changeEmit:this.change});
    this.province = [];
    this.citys = [];
    document.getElementById("choiceTitle").innerText = "选择城市";
    let ele = "cityCode.provinceCode=" + this.provinceCode + "&cityCode.cityName=" + "&cityCode.cityNo=";
    this.getCitys(this.citys, ele);
    this.back = false;
  }
  //选择城市
  choicecity(item) {
    this
      .local
      .write("city", item.cityName);
    this
      .local
      .write("ip", item.appVistUrl);
    this
      .local
      .write("xpoint", item.xpoint);
    this
      .local
      .write("ypoint", item.ypoint);
    let data = {
      "city": item.cityName,
      "ip": item.appVistUrl
    }
    this
      .viewCtrl
      .dismiss(data);
  }
  //定位
  getGeolocation() {
    //   navigator
    //     .geolocation
    //     .getCurrentPosition(onSuccess, onError);
    //   //定位数据获取成功响应
    //   let self = this;
    //   function onSuccess(position) {
    //     let ele = "&output=json&pois=1&ak=7fcUb2aGL0Ih3G6V6A24td8i&callback=JSONP_CALLBACK";
    //     // 定义参数
    //     var params = new URLSearchParams();
    //     self
    //       .jsonp
    //       .get("http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + position.coords.latitude + "," + position.coords.longitude + ele, { search: params })
    //       //.get("http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + "23.125756672418122" + "," + "113.3664275010177" + ele, { search: params })
    //       .map(res => {
    //         if (res.status == 200) {
    //           let result: any = res;
    //           self.positionCity = result
    //             ._body
    //             .result
    //             .addressComponent
    //             .city;
    //         } else {
    //           self
    //             .comm
    //             .showAlert("没有查到相关城市！");
    //         }
    //       })
    //       .subscribe((response) => {
    //         // self.positionCity = "蓝海";
    //       }, (error) => {
    //         self.positionCity = "蓝海";
    //       });
    //   };

    //   //定位数据获取失败响应
    //   function onError(error) {
    //     // alert("定位失败");
    //     self.positionCity = "蓝海";
    //   };
    return new Promise((resolve, reject) => {
      let self = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == "0") {
          var mk = new BMap.Marker(r.point);
          //alert('您的位置：'+r.point.lng+','+r.point.lat);  
          var myGeo = new BMap.Geocoder();
          // alert('您的位置：'+r.point.lng+','+r.point.lat);  
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat),
            function (rs) {
              var addComp = rs.addressComponents;
              // alert(addComp.province + addComp.city  
              //         + addComp.district + addComp.street  
              //         + addComp.streetNumber);  
              resolve(addComp.city);

            });

        } else {
          // alert('failed' + this.getStatus()); 
          reject();
        }
      });
    });

  }
}
