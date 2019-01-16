import { Geolocation } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
declare var AMap;
@Injectable()
export class MapService {
    mymap: any = null;
    currentPos: any = null;
    cloudDataLayer: any = null;
    constructor() { }
    //获取当前位置
    getGeolocationByAMap(map): Observable<any> {
        return new Observable((sub: any) => {

            var geolocation;
            map.plugin('AMap.Geolocation', function () {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    // zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    buttonPosition: 'LB',
                    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true
                });
                map.addControl(geolocation);
                geolocation.getCurrentPosition();

                AMap.event.addListener(geolocation, 'complete', (data) => {

                    sub.next([data.position.lng, data.position.lat]);
                    sub.complete();
                });
                AMap.event.addListener(geolocation, 'error', (error) => {

                    sub.error(error);
                });
            });
        });
    }
    /***
      * get the current location using Geolocation cordova plugin
      * @param maximumAge
      * @returns {Promise<Coordinates>}
      */
    public getCurrentPosition(maximumAge: number = 10000): Promise<Coordinates> {
        const options = {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge
        };
        return Geolocation.getCurrentPosition(options).then((resp) => {
            return resp.coords;
        });
    }
    // //获取地址编码
    // getCoordToPalce(pos: any, map: any): Observable<any> {
    //     return new Observable((sub: any) => {
    //         // var lnglatXY = [116.396574, 39.992706]; //已知点坐标
    //         var lnglatXY = pos; //已知点坐标
    //         function regeocoder() {  //逆地理编码
    //             var geocoder = new AMap.Geocoder({
    //                 radius: 1000,
    //                 extensions: "all"
    //             });
    //             geocoder.getAddress(lnglatXY, function (status, result) {
    //                 if (status === 'complete' && result.info === 'OK') {
    //                     geocoder_CallBack(result);
    //                 }
    //             });
    //             var marker = new AMap.Marker({  //加点
    //                 map: map,
    //                 position: lnglatXY
    //             });
    //         }
    //         function geocoder_CallBack(data) {
    //             var address = data.regeocode.formattedAddress; //返回地址描述
    //             sub.next(address);
    //             sub.complete();
    //         }
    //     });
    // }
    //获取导航数据
    //map:地图对象
    //currentPos:当前位置
    //targetPosition：目标位置
    //val:出行方式
    getNav(targetPosition: any, val: any): Observable<any> {
        return new Observable((sub: any) => {
            var map = this.mymap;
            var position = targetPosition;
            var selectPos = this.currentPos;
            if (val == "0") {
                map.plugin(['AMap.Driving'], function () {
                    var driving = new AMap.Driving({
                        policy: AMap.DrivingPolicy.LEAST_TIME,
                        map: map
                    });
                    driving.search(new AMap.LngLat(position[0], position[1]), new AMap.LngLat(selectPos[0], selectPos[1]));
                    AMap.event.addListener(driving, 'complete', function (e) {
                        if (e.info === 'OK') {
                            sub.next(e.routes);
                            sub.complete();
                        }
                    });
                    AMap.event.addListener(driving, 'error', (error) => {

                        sub.error(error);
                    });
                });
            }
            else if (val == "1") {
                map.plugin(['AMap.Walking'], function () {
                    var Walking = new AMap.Walking();
                    Walking.search(new AMap.LngLat(position[0], position[1]), new AMap.LngLat(selectPos[0], selectPos[1]));
                    AMap.event.addListener(Walking, 'complete', function (e) {
                        if (e.info === 'ok') {
                            sub.next(e.routes);
                            sub.complete();
                        }
                    });
                    AMap.event.addListener(Walking, 'error', (error) => {

                        sub.error(error);
                    });
                });
            }
            else if (val == "2") {
                map.plugin(['AMap.Transfer'], function () {
                    var Transfer = new AMap.Transfer({
                        policy: AMap.TransferPolicy.LEAST_TIME
                    });
                    Transfer.setCity('武汉');
                    Transfer.search(new AMap.LngLat(position[0], position[1]), new AMap.LngLat(selectPos[0], selectPos[1]));
                    AMap.event.addListener(Transfer, 'complete', function (e) {
                        if (e.info === 'OK') {
                            sub.next(e.plans);
                            sub.complete();
                        }
                        else if (e.info === 'NO_DATA') {
                            sub.next([]);
                            sub.complete();
                        }
                    });
                    AMap.event.addListener(Transfer, 'error', (error) => {

                        sub.error(error);
                    });
                });
            }
        })
    };
    // //叠加云数据图层
    // addCloudLayer(): Observable<any> {
    //     return new Observable((sub: any) => {
    //         var map = this.mymap;

    //         //加载云图层插件
    //         this.mymap.plugin('AMap.CloudDataLayer', function () {
    //             var layerOptions = {
    //                 query: { keywords: '' },
    //                 clickable: true
    //             };
    //             this.cloudDataLayer = new AMap.CloudDataLayer('5857ac04afdf520ea83757da', layerOptions); //实例化云图层类
    //             this.cloudDataLayer.setMap(map); //叠加云图层到地图
    //             sub.next(this.cloudDataLayer);
    //             sub.complete();
    //         });
    //     })
    // }
    //叠加云数据图层
    bindCloudLayer(): Observable<any> {
        return new Observable((sub: any) => {
            var map = this.mymap;
            var cloudDataLayer = this.cloudDataLayer;
            //加载云图层插件
            this.mymap.plugin('AMap.CloudDataLayer', function () {
                var layerOptions = {
                    query: { keywords: '' },
                    clickable: true
                };
                cloudDataLayer = new AMap.CloudDataLayer('5857ac04afdf520ea83757da', layerOptions); //实例化云图层类
                cloudDataLayer.setMap(map); //叠加云图层到地图
                sub.next(cloudDataLayer);
                AMap.event.addListener(cloudDataLayer, 'click', function (result) {
                    var clouddata = result.data;

                    //实例化信息窗体
                    var title;
                    if (clouddata._name) {
                        title = '<span style="font-size:11px;color:#F00;">' + clouddata._name + '</span>';
                    }
                    var content = [];
                    if (clouddata._image.length > 0) {
                        content.push('<img  src=' + clouddata._image[0]._preurl + '>');
                    }
                    else { content.push("<img  src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>"); }
                    if (clouddata._address) {
                        content.push("地址：" + clouddata._address);
                    }
                    var infoWindow = new AMap.InfoWindow({
                        content: createInfoWindow(title, content.join("<br/>"), clouddata),
                        size: new AMap.Size(0, 0),
                        autoMove: true,
                        closeWhenClickMap: true,
                        offset: new AMap.Pixel(0, -25)
                    });
                    //构建自定义信息窗体
                    function createInfoWindow(title, content, result) {
                        var info = document.createElement("div");
                        info.className = "info";

                        //可以通过下面的方式修改自定义窗体的宽高
                        //info.style.width = "400px";

                        // 定义顶部标题
                        var top = document.createElement("div");
                        var titleD = document.createElement("div");
                        //var closeX = document.createElement("img");


                        top.className = "info-top";
                        titleD.innerHTML = title;
                        // closeX.src = "http://webapi.amap.com/images/close2.gif";
                        // closeX.onclick = closeInfoWindow;

                        top.appendChild(titleD);
                        // top.appendChild(closeX);
                        info.appendChild(top);

                        var buttons = document.createElement("div");
                        buttons.className = "buttons";
                        var showDetail = document.createElement("img");
                        showDetail.src = "assets/images/details.png";
                        showDetail.onclick = gotoDetail;
                        buttons.appendChild(showDetail);

                        var gotoMap = document.createElement("img");
                        gotoMap.src = "assets/images/navgation.png";
                        gotoMap.onclick = function () {
                            window.open('http://uri.amap.com/marker?position=' + result._location.G + ',' + result._location.K + '&name=' + result._name + '&src=mypage&coordinate=gaode' + result._name, '_blank', 'location=no,closebuttoncaption=返回');
                            //window.open('http://ditu.amap.com/regeo?lng=120.780955&lat=30.729776&name=&adcode=', '_blank', 'location=no,closebuttoncaption=返回');

                        };
                        buttons.appendChild(gotoMap);

                        // 定义中部内容
                        var middle = document.createElement("div");
                        middle.className = "info-middle";
                        middle.style.backgroundColor = 'white';
                        middle.innerHTML = content;
                        // middle.appendChild(buttons);
                        info.appendChild(middle);

                        // 定义底部内容
                        var bottom = document.createElement("div");
                        bottom.className = "info-bottom";
                        bottom.style.position = 'relative';
                        bottom.style.top = '0px';
                        bottom.style.margin = '0 auto';
                        // var sharp = document.createElement("img");
                        // sharp.src = "http://webapi.amap.com/images/sharp.png";
                        bottom.appendChild(buttons);
                        info.appendChild(bottom);
                        return info;
                    }
                    infoWindow.open(map, clouddata._location);
                    //触发查看详情
                    function gotoDetail() {
                        sub.next(result);

                        // sub.complete();

                    }
                    // //触发高德导航
                    // function gotoMapNav() {
                    //     window.open('http://uri.amap.com/marker?position=' + result._location.G + ',' + result._location.K + '&name=' + result._name + '&src=mypage&coordinate=gaode' + result._name, '_blank', 'location=no,closebuttoncaption=返回');
                    //     //window.open('http://ditu.amap.com/regeo?lng=120.780955&lat=30.729776&name=&adcode=', '_blank', 'location=no,closebuttoncaption=返回');

                    // }
                });
            });
        })
    }

    //云图数据检索（周边搜索）
    searchCloudData(): Observable<any> {
        return new Observable((sub: any) => {
            var position = this.currentPos;
            var map = this.mymap;
            var center = new AMap.LngLat(position[0], position[1]);
            var searchOptions = {
                keywords: '',
                // pageIndex: 1,
                // pageSize: 10
            };
            //构造云数据检索类，您如果想修改结果展现效果，请参考页面：http://lbs.amap.com/fn/css-style/
            //加载CloudDataSearch服务插件
            AMap.service(["AMap.CloudDataSearch"], function () {
                var search = new AMap.CloudDataSearch('5857ac04afdf520ea83757da', searchOptions);
                //周边检索
                search.searchNearBy(center, 1500, nearBy_CallBack);
                // var cloudDataSearchRender = new AMap.CloudDataSearchRender();
                function nearBy_CallBack(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // cloudDataSearchRender.autoRender({
                        //     cloudDataSearchInstance: search,
                        //     methodName: "searchNearBy",
                        //     methodArgumments: [center, 1500, nearBy_CallBack],
                        //     data: result,
                        //     map: map,
                        //     panel: "panel"
                        // });


                        var cluster, markers = [];
                        for (var i = 0; i < result.datas.length; i++) {
                            var markerPosition = [result.datas[i]._location.G, result.datas[i]._location.K];
                            var marker = new AMap.Marker({
                                position: markerPosition,
                                icon: "assets/images/house.png",
                                offset: { x: -8, y: -34 }
                            });
                            marker.setExtData(result.datas[i]);
                            marker.on('click', markerClick);
                            markers.push(marker);
                        }
                        addCluster(1);


                    }
                    // 添加点聚合
                    function addCluster(tag) {
                        if (cluster) {
                            cluster.setMap(null);
                        }
                        var sts = [{
                            url: "assets/images/street.png",
                            size: new AMap.Size(32, 32),
                            offset: new AMap.Pixel(-16, -30)
                        }, {
                            url: "assets/images/ residentialQuarters.png",
                            size: new AMap.Size(32, 32),
                            offset: new AMap.Pixel(-16, -30)
                        }, {
                            url: "assets/images/house.png",
                            size: new AMap.Size(48, 48),
                            offset: new AMap.Pixel(-24, -45),
                            textColor: '#CC0066'
                        }];
                        map.plugin(["AMap.MarkerClusterer"], function () {
                            cluster = new AMap.MarkerClusterer(map, markers, {
                                styles: sts
                            });
                        });

                    };
                    function markerClick(e) {
                        var clouddata = e.target.getExtData();
                        //实例化信息窗体
                        var title;
                        if (clouddata._name) {
                            title = '<span style="font-size:11px;color:#F00;">' + clouddata._name + '</span>';
                        }
                        var content = [];
                        if (clouddata._image.length > 0) {
                            content.push('<img  src=' + clouddata._image[0]._preurl + '>');
                        }
                        else { content.push("<img  src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>"); }
                        if (clouddata._address) {
                            content.push("地址：" + clouddata._address);
                        }
                        var infoWindow = new AMap.InfoWindow({
                            content: createInfoWindow(title, content.join("<br/>"), clouddata),
                            size: new AMap.Size(0, 0),
                            autoMove: true,
                            closeWhenClickMap: true,
                            offset: new AMap.Pixel(0, -25)
                        });
                        //构建自定义信息窗体
                        function createInfoWindow(title, content, result) {
                            var info = document.createElement("div");
                            info.className = "info";

                            //可以通过下面的方式修改自定义窗体的宽高
                            //info.style.width = "400px";

                            // 定义顶部标题
                            var top = document.createElement("div");
                            var titleD = document.createElement("div");
                            //var closeX = document.createElement("img");


                            top.className = "info-top";
                            titleD.innerHTML = title;
                            // closeX.src = "http://webapi.amap.com/images/close2.gif";
                            // closeX.onclick = closeInfoWindow;

                            top.appendChild(titleD);
                            // top.appendChild(closeX);
                            info.appendChild(top);

                            var buttons = document.createElement("div");
                            buttons.className = "buttons";
                            var showDetail = document.createElement("img");
                            showDetail.src = "assets/images/details.png";
                            showDetail.onclick = gotoDetail;
                            buttons.appendChild(showDetail);

                            var gotoMap = document.createElement("img");
                            gotoMap.src = "assets/images/navgation.png";
                            gotoMap.onclick = function () {
                                window.open('http://uri.amap.com/marker?position=' + result._location.G + ',' + result._location.K + '&name=' + result._name + '&src=mypage&coordinate=gaode' + result._name, '_blank', 'location=no,closebuttoncaption=返回');
                                //window.open('http://ditu.amap.com/regeo?lng=120.780955&lat=30.729776&name=&adcode=', '_blank', 'location=no,closebuttoncaption=返回');

                            };
                            buttons.appendChild(gotoMap);

                            // 定义中部内容
                            var middle = document.createElement("div");
                            middle.className = "info-middle";
                            middle.style.backgroundColor = 'white';
                            middle.innerHTML = content;
                            // middle.appendChild(buttons);
                            info.appendChild(middle);

                            // 定义底部内容
                            var bottom = document.createElement("div");
                            bottom.className = "info-bottom";
                            bottom.style.position = 'relative';
                            bottom.style.top = '0px';
                            bottom.style.margin = '0 auto';
                            // var sharp = document.createElement("img");
                            // sharp.src = "http://webapi.amap.com/images/sharp.png";
                            bottom.appendChild(buttons);
                            info.appendChild(bottom);
                            return info;
                        }
                        infoWindow.open(map, clouddata._location);
                        //触发查看详情
                        function gotoDetail() {
                            sub.next(clouddata);
                            // sub.complete();
                        }
                        // //触发高德导航
                        // function gotoMapNav() {
                        //     window.open('http://uri.amap.com/marker?position=' + clouddata._location.G + ',' + clouddata._location.K + '&name=' + clouddata._name + '&src=mypage&coordinate=gaode' + clouddata._name, '_blank', 'location=no,closebuttoncaption=返回');
                        //     //window.open('http://ditu.amap.com/regeo?lng=120.780955&lat=30.729776&name=&adcode=', '_blank', 'location=no,closebuttoncaption=返回');

                        // }
                    }
                }
            });

        })
    }
}