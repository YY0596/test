import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { PropertyInfo } from './form-property-info';
import { Utils } from '../../../../../providers/Utils';
import { StorageService } from '../../../../../providers/localstorage';

@Component({
    selector: 'page-add-property-info',
    templateUrl: 'add-property-info.html',
})
export class AddPropertyInfoPage {
    propertyInfo: PropertyInfo = new PropertyInfo();
    homeMembers: any;
    isReadOnly: boolean;//新增时姓名可改变，编辑时姓名不可改变
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private storage: StorageService) {
    }

    ionViewDidLoad() {
        this.isReadOnly = false; //新增时姓名可以选择
        let info = this.navParams.get('item');
        if (info) { // 传过来参数表示是编辑状态
            status = 'edit';
            this.storage.write("origin-param", info);
            this.isReadOnly = true; //编辑时姓名不可改变
            this.propertyInfo = info;
        } else {
            status = 'add';
        }
        this.homeMembers = this.storage.read('qualificationApply-jtryList'); //获取家庭成员信息

    }
    save() {
        if (!this.propertyInfo.jtzc_xm_text) {
            return;
        }
        if (!this.propertyInfo.jtzc_scpgj_text) {
            this.propertyInfo.jtzc_scpgj_text = '0';
        }
        if (!this.propertyInfo.jtzc_yhck_text) {
            this.propertyInfo.jtzc_yhck_text = '0';
        }
        if (!this.propertyInfo.jtzc_jdcsl_text) {
            this.propertyInfo.jtzc_jdcsl_text = '0';
        }
        if (!this.propertyInfo.jtzc_tzzcjz_text) {
            this.propertyInfo.jtzc_tzzcjz_text = '0';
        }
        if (!this.propertyInfo.jtzc_qt_text) {
            this.propertyInfo.jtzc_qt_text = '0';
        }
        this.propertyInfo.jtzc_scpgj = this.propertyInfo.jtzc_scpgj_text;
        this.propertyInfo.jtzc_yhck = this.propertyInfo.jtzc_yhck_text;
        this.propertyInfo.jtzc_jdcsl = this.propertyInfo.jtzc_jdcsl_text;
        this.propertyInfo.jtzc_tzzcjz = this.propertyInfo.jtzc_tzzcjz_text;
        this.propertyInfo.jtzc_qt = this.propertyInfo.jtzc_qt_text;
        if (!this.propertyInfo.jtzc_gszc) {
            this.propertyInfo.jtzc_gszc = this.propertyInfo.jtzc_gszc_text = '';
        }
        if (status == 'add') {
            this.propertyInfo.jtzc_id = Utils.getRandom(13);
        }
        // 获取jtryid对应的姓名
        // let member = this.homeMembers.filter((x) => {
        //     return (x.jtry_id == this.propertyInfo.jtzc_xm);
        // });
        // this.propertyInfo.jtzc_xm_text = member[0].jtry_xm;
        this.propertyInfo.jtzc_xm = this.propertyInfo.jtzc_xm_text;
        this.viewCtrl.dismiss(this.propertyInfo);
    }

    // 工商注册值的改变
    changeRegister() {
        if (this.propertyInfo.jtzc_gszc == '0') {
            this.propertyInfo.jtzc_gszc_text = '无'
        } else {//1
            this.propertyInfo.jtzc_gszc_text = '有'
        }
    }

    cancel() {
        if (status == 'add') {
            this.viewCtrl.dismiss(null);
        } else {
            this.viewCtrl.dismiss(this.storage.read("origin-param"));
        }
    }
}