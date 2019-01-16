import { Injectable } from '@angular/core';
declare var BMap;

@Injectable()
export class CompOverlay extends BMap.Overlay {
    initialize() { }
    draw() { }
    addOverLayer(map, div, _point, data, change1, change2) {
        div.style.position = "absolute";
        div.style.zIndex = BMap
            .Overlay
            .getZIndex(_point.lat);
        div.style.backgroundColor = "#007aff";
        div.style.border = "1px solid #007aff";
        div.style.borderRadius = "5px";
        div.style.color = "white";
        div.style.height = "24px";
        div.style.padding = "3px";
        div.style.lineHeight = "16px";
        div.style.whiteSpace = "nowrap";
        div.style.fontSize = "14px";
        var span = document.createElement("span");
        div.appendChild(span);
        span.appendChild(document.createTextNode(data.name));//显示项目名称
        // var arrow = this._arrow = document.createElement("div");
        // arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
        // arrow.style.position = "absolute";
        // arrow.style.width = "11px";
        // arrow.style.height = "10px";
        // arrow.style.top = "22px";
        // arrow.style.left = "10px";
        // arrow.style.overflow = "hidden";
        // div.appendChild(arrow);
        var id = data.id;
        div.addEventListener("touchstart", function () {
            var contentdiv = document.createElement("div");
            var content = '<div style="margin:0;line-height:20px;">项目名称：' + data.name + '<br/>项目地址：' + data.xqdz + '<br/>所属区县：' + data.qxdm + '</div>';
            contentdiv.innerHTML = content;
            this.style.backgroundColor = "#6BADCA";
            var btnProj = document.createElement("div");
            if (data.count > 0) {
                btnProj.innerHTML = '<a id="btnProj" class="link">项目房源：' + data.count + '套</a>';
  
                btnProj.addEventListener("click", function () {
                    change1.emit(id);
                });
            } else {
            btnProj.innerHTML = '<span class="link">项目房源：0套</span>';
            }       
            contentdiv.appendChild(btnProj);
            var opts = {
                width: 220, // 信息窗口宽度
                // height: 115, // 信息窗口高度
                title: "<h5 style='line-height:1px'>项目信息</h5>", // 信息窗口标题
                enableMessage: true,//设置允许信息窗发送短息
                // enableAutoPan: false
            };
            if (id == "9") {
                var btn3D = document.createElement("div");
                btn3D.innerHTML = '<a id="btn3D" class="link">3D全景</a>';
                var name = data.name;
                btn3D.addEventListener("click", function () {
                    change2.emit(name);
                });
                contentdiv.appendChild(btn3D);
            }
            
            var point = new BMap.Point(_point.lng, _point.lat);
            var infoWindow = new BMap.InfoWindow(contentdiv, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point); //开启信息窗口
        })
        div.addEventListener("touchend",function(){
            div.style.backgroundColor = "#007aff";
        })
        var pixel = map.pointToOverlayPixel(_point);
        div.style.left = pixel.x + "px";
        div.style.top = pixel.y + "px";
        return this;
    }
}
//绘制重心点图标
export class CenterOfGravityOverlay extends BMap.Overlay {
    initialize() { }
    draw() { }
    addOverLayer(map, div, _point, data,change) {
        div.style.position = "absolute";
        div.style.zIndex = BMap
            .Overlay
            .getZIndex(_point.lat);
        div.style.width = "70px";
        div.style.height = "70px";
        div.style.backgroundColor = "#007aff";
        div.style.opacity = "0.9";
        div.style.borderRadius = "50%";
        div.style.textAlign = "center";
        var div1 = document.createElement("div");
        div1.style.color = "white";
        div1.style.marginTop = "20px";
        div1.appendChild(document.createTextNode(data.name));
        div.appendChild(div1);

        var div2 = document.createElement("div");
        div2.style.color = "white";
        div2.appendChild(document.createTextNode("项目" + data.projectNum + "个"));
        div.appendChild(div2);
        var self=this;
        div.addEventListener("touchstart", function () {

            // map.setZoom(13);
            // map.panTo(_point);
            // map.centerAndZoom(_point, 14);
            // div.style.backgroundColor = "red";
            // let layers : any = map.getOverlays(); for (let i = 0; i < layers.length; i++)
            // {     if (layers[i].constructor.name == "CenterOfGravityOverlay") { //
            // layers[i].hide();         map.removeOverlay(layers[i]);     } }
            // let divtemp : any = document.getElementById("regionlayer");
            // var childs = divtemp.childNodes;
            // for (var j = childs.length - 1; j >= 0; j--) {
            //     divtemp.removeChild(childs[j]);
            // }
            change.emit(data);
       
        })
        var pixel = map.pointToOverlayPixel(_point);//定位到屏幕坐标
        div.style.left = (pixel.x - 35) + "px";
        div.style.top = (pixel.y - 35) + "px";
        return this;
    }
 
}