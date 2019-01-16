import { CompOverlay, CenterOfGravityOverlay } from './CompOverlay';

import { Injectable, EventEmitter } from '@angular/core';

import { HttpService } from './http-service';
import { OrderComm } from './order-comm';
declare var BMap;
declare var BMapLib;
@Injectable()
export class BMapService {
    httpService: any;
    comm: any;
    compOverlay: any;
    centerOfGravityOverlay: any;
    layerTemp: any;
    zoomlevel: any = 0;
    change4 = new EventEmitter();
    map: any;
    constructor(httpService: HttpService, comm: OrderComm, compOverlay: CompOverlay, centerOfGravityOverlay: CenterOfGravityOverlay) {
        this.httpService = httpService;
        this.comm = comm;
        this.compOverlay = compOverlay;
        this.centerOfGravityOverlay = centerOfGravityOverlay;
        var self = this;
        this
            .change4
            .subscribe(data => {
                // alert("emited");
                self.filterZone(data,self.map);
            });
    }
    addMarkers(map, change1, change2) {
        this.map = map;
        var coords = [];
        let result: any;
        var bs = map.getBounds(); //获取可视区域
        var bssw = bs.getSouthWest(); //可视区域左下角
        var bsne = bs.getNorthEast(); //可视区域右上角
        var ele = "POLYGON((" + bssw.lng + " " + bsne.lat + "," + bsne.lng + " " + bsne.lat + "," + bsne.lng + " " + bssw.lat + "," + bssw.lng + " " + bssw.lat + "," + bssw.lng + " " + bsne.lat + "))";
        var markerClusterer: any;
        var markLayer = document.getElementById("markLayer");
        if (markLayer != null) {
            // var childs = markLayer.childNodes;
            // for (var j = childs.length - 1; j >= 0; j--) {
            //     markLayer.removeChild(childs[j]);
            // }
            // map
            //     .clearOverlays();
            markLayer.innerHTML = "";

        } else {
            markLayer = document.createElement("div");
            markLayer.id = "markLayer";
            map
                .getPanes()
                .markerPane
                .appendChild(markLayer);


        }
        if (map.getZoom() >= 14) {
            markLayer.hidden = false;
        } else {
            markLayer.hidden = true;
        }
        this
            .getCoordsResult(coords, ele)
            .then(res => {
                result = res;


                for (let i = 0; i < result.data.length; i++) {
                    var ptShape = result.data[i].shape;//取出shape
                    var pt = new BMap.Point(this.strSlice(ptShape)[1], this.strSlice(ptShape)[2]);//解析shape
                    var overlayer = document.createElement("div");

                    // if (map.getZoom() > 13) {
                    markLayer.appendChild(overlayer);
                    // }
                    map.addOverlay(this.compOverlay.addOverLayer(map, overlayer, pt, result.data[i], change1, change2));
                }

                // map
                //     .addEventListener("touchstart", function (e) {
                //         if (markLayer.hidden == false) {
                //             markLayer.hidden = true;
                //         } else {
                //             markLayer.hidden = false;
                //         }
                //     });
            })

    }
    //获取项目坐标点
    getCoordsResult(list, ele) {
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(2, "findXmByPoint.action?wkt=" + ele)
                .then(res => {
                    if (res.code == 0) {
                        resolve(res);
                    } else {
                        reject();
                    }
                })
                .catch(error => {
                    this
                        .comm
                        .showAlert("请检查网络连接！");
                    reject();
                });
        });
    }
    //提取点坐标
    strSlice(str) {
        let stringToslice: string = str;
        var s = stringToslice.split(" ");
        s[1] = s[1].split("(")[1];
        s[2] = s[2].split(")")[0];
        return s;
    }
    //获取省市区边界
    addRegions(map) {
        let tempzoomlevel = map.getZoom();
        var regionlayer = document.getElementById("regionlayer");
        if (regionlayer != null) {
            // var childs = regionlayer.childNodes;
            // for (var j = childs.length - 1; j >= 0; j--) {
            //     regionlayer.removeChild(childs[j]);
            // }
            regionlayer.innerHTML = "";
            // map
            //     .clearOverlays();
            if (map.getZoom() <= 14) {
                regionlayer.hidden = false;
            } else {
                regionlayer.hidden = true;
            }
            // this.zoomlevel=tempzoomlevel;

        } else {
            regionlayer = document.createElement("div");
            regionlayer.id = "regionlayer";
            map
                .getPanes()
                .markerPane
                .appendChild(regionlayer);//添加div到地图上
        }
        this
            .getRegionsCoordsResult()
            .then(res => {
                let result: any = res;
                for (let i = 0; i < result.data.length; i++) {
                    var ptShape = result.data[i].shape;
                    if (ptShape == undefined)
                        continue;
                    let array: any = this.strRegionSlice(ptShape);
                    let ptArray: Array<any> = [];
                    for (let j = 0; j < array.length; j++) {
                        var pt = new BMap.Point(array[j].x, array[j].y);
                        ptArray.push(pt);
                    }
                    //获取重心点坐标
                    let CenterOfGravityPoint: any = this.getCenterOfGravityPoint(array);
                    var CenterOfGravitypt = new BMap.Point(CenterOfGravityPoint.x, CenterOfGravityPoint.y);
                    var gravitylayer = document.createElement("div");

                    regionlayer.appendChild(gravitylayer);
                    //添加区县边界
                    var polygon = new BMap.Polygon(ptArray, {
                        fillOpacity: 0.1,
                        // fillColor:"red",
                        strokeColor: "white",
                        strokeWeight: 5,
                        strokeOpacity: 0.5
                    }); //创建多边形
                    map.addOverlay(polygon); //增加多边形
                    if (map.getZoom() < 14 && result.data[i].projectNum > 0) {
                        map.addOverlay(this.centerOfGravityOverlay.addOverLayer(map, gravitylayer, CenterOfGravitypt, result.data[i], this.change4));//地图上添加中心点圆
                    }

                }

            })

    }
    //提取面坐标
    strRegionSlice(str) {
        let stringToslice: string = str;
        let province: Array<{
            x: string,
            y: string
        }> = [];
        var s = stringToslice.split("(");
        s = s[2].split(")");
        s = s[0].split(",");
        province.push({
            x: s[0]
                .split(" ")[0]
                .trim(),
            y: s[0]
                .split(" ")[1]
                .trim()
        });
        for (let i = 1; i < s.length; i++) {
            province.push({
                x: s[i]
                    .split(" ")[1]
                    .trim(),
                y: s[i]
                    .split(" ")[2]
                    .trim()
            });
        }
        return province;
    }
    /**
 * 获取不规则多边形重心点--参数为x，y
 */
    getCenterOfGravityPoint(listPoint) {
        let area = 0.0;
        let Gx = 0.0,
            Gy = 0.0;
        for (let i = 1; i <= listPoint.length; i++) {
            let iLat = parseFloat(listPoint[i % listPoint.length].y);
            let iLng = parseFloat(listPoint[i % listPoint.length].x);
            let nextLat = parseFloat(listPoint[i - 1].y);
            let nextLng = parseFloat(listPoint[i - 1].x);
            let temp = (iLat * nextLng - iLng * nextLat) / 2.0;
            area += temp;
            Gy += temp * (iLat + nextLat) / 3.0;
            Gx += temp * (iLng + nextLng) / 3.0;
        }
        Gx = Gx / area;
        Gy = Gy / area;
        return { x: Gx, y: Gy };
    }
    /**
 * 获取多个点的中心点--参数为lat，lng经纬度
 */
getCenterOfPoints(listPoint) {
    let Gx = 0.0,
        Gy = 0.0;
    for (let i = 0; i < listPoint.length; i++) {
        let iLat = parseFloat(listPoint[i].lat);
        let iLng = parseFloat(listPoint[i].lng);
        Gx+=iLng;
        Gy+=iLat;
    }
    var pt = new BMap.Point(Gx/listPoint.length, Gy/listPoint.length);
    return pt;
}
    //获取区县坐标点
    getRegionsCoordsResult() {
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(2, "findXmForPage.action?regionId=-1")
                .then(res => {
                    if (res.code == 0) {
                        resolve(res);
                    } else {
                        reject();
                    }
                })
                .catch(error => {
                    this
                        .comm
                        .showAlert("请检查网络连接！");
                    reject();
                });
        });
    }
    //根据区域筛选
    filterZone(zone,map) {
        let ele = "regionId=" + zone.id + "&limit=10000&pageNo=1";
        // this.ProjResult = [];
        let url = "findXmForPage.action?";

        this
            .gettProjList(url, ele)
            .then(res => {
                let result: any = res;
                let ptArray: Array<any> = [];
                for (let j = 0; j < result.data.length; j++) {
                    var ptShape = result.data[j].shape;
                    var pt = new BMap.Point(this.strSlice(ptShape)[1], this.strSlice(ptShape)[2]);
                    ptArray.push(pt);
                }
                //获取中心点坐标
                let CenterOfGravityPoint: any = this.getCenterOfPoints(ptArray);
                map.centerAndZoom(CenterOfGravityPoint, 14);
            });
    }

    //获取项目列表
    gettProjList(url, ele) {
        return new Promise((resolve, reject) => {
            this
                .httpService
                .httpGet(2, url + ele)
                .then(res => {
                    if (res.code == 0) {
                        if (res.count > 0) {
                            //   this.ProjResult = res.data;
                            resolve(res);
                        }
                        else {
                            this
                                .comm
                                .showAlert("查询不到结果！");
                            reject();
                        }
                    } else {
                        this
                            .comm
                            .showAlert("查询项目信息无结果！");
                        reject();
                    }
                })
                .catch(error => {
                    this
                        .comm
                        .showAlert("请检查网络连接！");
                    reject();
                });
        });
    }
}