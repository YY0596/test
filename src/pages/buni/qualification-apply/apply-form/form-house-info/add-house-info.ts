import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { HouseInfo } from './form-house-info';
import { OrderComm } from '../../../../../providers/order-comm';
import { Utils } from '../../../../../providers/Utils';
import { StorageService } from '../../../../../providers/localstorage';

@Component({
    selector: 'page-add-house-info',
    templateUrl: 'add-house-info.html',
})
export class AddHouseInfoPage {
    houseInfo: HouseInfo = new HouseInfo();
    houseTypes: Array<any> = []; // 房屋类型
    selectedHouseType: any; //选择的住房类型
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private comm: OrderComm,
        private storage: StorageService) {
    }

    ionViewDidLoad() {
        this.houseTypes = this.navParams.get('houseTypes');
        let info = this.navParams.get('item');

        if (info) { // 传过来参数表示是编辑状态
            status = 'edit';
            // 这里缓存主要因为遇到一个问题，返回不做任何处理，页面上修改的数据也会传回给 ReviewHouseInfoPage
            // 所以缓存未修改前的数据，点击取消时传入未修改的数据以 保证数据正确
            this.storage.write("origin-param", info);
            this.houseInfo = info;
        } else {
            status = 'add';
        }
    }

    // 改变家庭住房情况
    changeHouseType(data) {
        let value = this.houseTypes.filter((x) => { return x.key == data });
        this.houseInfo.jtzf_jtzflx_text = value[0].value;
    }

    save() {
        if (!this.houseInfo.jtzf_jtzflx) {
            this.comm.showSmallToast('请选择家庭住房情况!');
            return;
        }
        if (!this.houseInfo.jtzf_fwzl) {
            this.comm.showSmallToast('请输入房屋坐落!');
            return;
        }
        if (!this.houseInfo.jtzf_jzmj) {
            this.comm.showSmallToast('请输入住房面积!');
            return;
        }
        // 产权人和转让时间没填默认为空字符串
        if (!this.houseInfo.jtzf_cqr) {
            this.houseInfo.jtzf_cqr = '';
        }
        if (!this.houseInfo.jtzf_zysj) {
            this.houseInfo.jtzf_zysj = '';
        }
        if (status == 'add') {
            this.houseInfo.jtzf_id = Utils.getRandom(12);
        }
        this.houseInfo.jtzf_jzmj_text = this.houseInfo.jtzf_jzmj;
        this.houseInfo.jtzf_zysj_text = this.houseInfo.jtzf_zysj;

        this.viewCtrl.dismiss(this.houseInfo);
    }

    cancel() {
        if (status == 'add') {
            this.viewCtrl.dismiss(null);
        } else {
            this.viewCtrl.dismiss(this.storage.read("origin-param"));
        }
    }
}