import { Component, EventEmitter, ViewChild } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';

import { BMapService } from '../../providers/bMapService';
import { StorageService } from '../../providers/localstorage';
import { Jsonp } from '@angular/http';
import { OrderComm } from '../../providers/order-comm';
/**
 * Generated class for the ProjectInformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var BMap;

@IonicPage()
@Component({ selector: 'page-project-information', providers: [BMapService], templateUrl: 'project-information.html' })
export class ProjectInformationPage {
  @ViewChild(Navbar) navBar: Navbar;
  change1 = new EventEmitter();
  change2 = new EventEmitter();
  change3 = new EventEmitter();
  isMarker: boolean = false;
  map: any;
  city: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public jsonp: Jsonp, private bmapService: BMapService, private local: StorageService, public comm: OrderComm) {
    this.bmapService = bmapService;
    let self = this;
    this
      .change1
      .subscribe(data => {
        // alert("emited");
        navCtrl.push("ProjHouseListPage", { id: data });
      });
    this
      .change2
      .subscribe(data => {
        // alert("emited");
        if (data == "建工园") {
          navCtrl
            .push("BrowserPage", {
              browser: {
                title: "3D看房",
                url: "http://lanhai.gongzu.home.ccb.com/lhgzfww/soar/gzfwwxx/static/vr/kyy/index.html"
              }
            });
        }
        else {
          self.comm
            .showAlert("该项目还不能3D看房！");
        }
      });
      this
      .change3
      .subscribe(data => {
        // alert("emited");
      if (data == undefined)
        return;
      let point = new BMap.Point(this.strSlice(data.item)[1], this.strSlice(data.item)[2]); //(116.06827, 22.549284);
      this
        .map
        .centerAndZoom(point, 16); //设置中心和地图显示级别
      var mk = new BMap.Marker(point);
      this
        .map
        .addOverlay(mk);
      this
        .bmapService
        .addMarkers(this.map, this.change1, this.change1);
      });

  }
  ionViewDidLoad() {
    this.navBar.backButtonClick = this.backButtonClick;
  }
  backButtonClick = (e: UIEvent) => {
    // do something
    // this.navCtrl.pop();
    this.navCtrl.setRoot("HomePage");
  }
  ionViewWillEnter() {
    // let map = this.map = new BMap.Map(this.mapElement.nativeElement, {
    // enableMapClick: true });
    if (this.map != undefined) {
      this.bmapService.addMarkers(this.map, this.change1, this.change2);
      return;
    }
    this.map = new BMap.Map("container"); // 创建地图实例

    let point = new BMap.Point(113.400675, 22.88816); //(116.06827, 22.549284);
    this
      .map
      .centerAndZoom(point, 11); //设置中心和地图显示级别

    this.city = this
      .local
      .read("city");
    let xpoint = this.local.read("xpoint");
    let ypoint = this.local.read("ypoint");
    if (this.city == "蓝海") {
      this
        .map
        .setCurrentCity("广州");
    } else {
      this
        .map
        .setCurrentCity(this.city);
      // this
      //   .getCityCoord(this.city)
      //   .then(res => {
      //     let result : any = res;
      //     let point = new BMap.Point(result.lng, result.lat); //(116.06827, 22.549284);
      //     this
      //       .map
      //       .centerAndZoom(point, 11); //设置中心和地图显示级别
      //   });
      let point = new BMap.Point(xpoint, ypoint); //(116.06827, 22.549284);
      this
        .map
        .centerAndZoom(point, 11); //设置中心和地图显示级别
    }
    this
      .bmapService
      .addMarkers(this.map, this.change1, this.change2);//添加房源
    this
      .bmapService
      .addRegions(this.map);//添加区县
    this
      .map
      .addControl(new BMap.ScaleControl());//添加比例尺控件
    this
      .map
      .setDefaultCursor("crosshair");

    this
      .map
      .enableScrollWheelZoom(); //启动滚轮放大缩小，默认禁用
    this
      .map
      .enableContinuousZoom(); //连续缩放效果，默认禁用

    //地图放大缩小控件
    let sizeMap = new BMap.Size(10, 10); //显示位置
    this
      .map
      .addControl(new BMap.NavigationControl({
        anchor: BMap.BMAP_ANCHOR_BOTTOM_RIGHT, //显示方向
        offset: sizeMap
      }));

    // //3D效果矢量图控件 let size3D = new BMap.Size(10, 10); this   .map   .addControl(new
    // BMap.MapTypeControl({anchor: BMap.BMAP_ANCHOR_TOP_RIGHT, offset: size3D}));
    // //添加地图类型控件 this.map.addControl(new BMap.MapTypeControl({   mapTypes:
    // ["BMAP_NORMAL_MAP", "BMAP_HYBRID_MAP"] })); 城市列表控件
    let sizeCity = new BMap.Size(10, 10);
    this
      .map
      .addControl(new BMap.CityListControl({ anchor: BMap.BMAP_ANCHOR_TOP_LEFT, offset: sizeCity }));

    //添加自定义的控件展示地图中
    function showAttractionControl() {
      //定义显示位置
      this.defaultAnchor = BMap.BMAP_ANCHOR_TOP_RIGHT;
      this.defaultOffset = new BMap.Size(10, 50);
    }

    //初始化控件
    showAttractionControl.prototype = new BMap.Control();
    let showAttraction = new showAttractionControl();
    this
      .map
      .addControl(showAttraction); //添加控件

    var btnLocation = document.getElementById("btLocation");
    btnLocation.addEventListener("click", function () {
      navigator
        .geolocation
        .getCurrentPosition(onSuccess, onError);
    });
    self = this;
    //定位数据获取成功响应
    function onSuccess(position) {
      var mk = new BMap.Marker(new BMap.Point(position.coords.longitude, position.coords.latitude));
      self
        .map
        .addOverlay(mk);
      self
        .map
        .centerAndZoom(new BMap.Point(position.coords.longitude, position.coords.latitude), 14);
    };

    //定位数据获取失败响应
    function onError(error) {
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == "0") {
          var mk = new BMap.Marker(r.point);
          self
            .map
            .addOverlay(mk);
          self
            .map
            .centerAndZoom(r.point, 14);
          // alert('您的位置：' + r.point.lng + ',' + r.point.lat);
        } else {
          alert("定位失败");
        }
      }, { enableHighAccuracy: true })
    }

    var myIcon = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
      offset: new BMap.Size(10, 25), // 指定定位位置
      imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
    });

    var self = this;
    this
      .map
      .addEventListener("moveend", function (e) {

        self
          .bmapService
          .addMarkers(self.map, self.change1, self.change2);
      });
    this
      .map
      .addEventListener("zoomend", function (e) {
        self
          .bmapService
          .addMarkers(self.map, self.change1, self.change2);
        self
          .bmapService
          .addRegions(self.map);
      });

  }

  gotoLastPage() {
    this
      .navCtrl
      .pop();
  }

  //根据ip定位
  getCityCoord(city) {
    var self = this;
    let ele = city + "&output=json&ak=7fcUb2aGL0Ih3G6V6A24td8i&callback=JSONP_CALLBACK";
    var params = new URLSearchParams();
    return new Promise((resolve, reject) => {
      this
        .jsonp
        .get("http://api.map.baidu.com/geocoder/v2/?address=" + ele, { search: params })
        .map(res => {
          if (res.status == 200) {
            let result: any = res;
            resolve(result._body.result.location);
          } else {
            self
              .comm
              .showAlert("没有查到相关城市！");
          }
        })
        .subscribe((response) => { }, (error) => {
          console.error(error);
        });
    });
  }
  //打开项目选择modal
  gotoProjectSelectModalPage() {
    // let modal = this
    //   .modal
    //   .create("ProjectSelectModalPage", { data: "" });
    // modal.onDidDismiss(data => {
    //   if (data == undefined)
    //     return;
    //   let point = new BMap.Point(this.strSlice(data.item)[1], this.strSlice(data.item)[2]); //(116.06827, 22.549284);
    //   this
    //     .map
    //     .centerAndZoom(point, 16); //设置中心和地图显示级别
    //   var mk = new BMap.Marker(point);
    //   this
    //     .map
    //     .addOverlay(mk);
    //   this
    //     .bmapService
    //     .addMarkers(this.map, this.change1, this.change1);
    // });
    // modal.present();
    this.navCtrl.push("ProjectSelectModalPage",{change:this.change3});
  }
  //提取点坐标
  strSlice(str) {
    let stringToslice: string = str;
    var s = stringToslice.split(" ");
    s[1] = s[1].split("(")[1];
    s[2] = s[2].split(")")[0];
    return s;
  }

  
}
