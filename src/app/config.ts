// 本地环境
const LOCAL_URL = 'http://localhost:8101/'
let is_local = 0

// 开发环境
const DEV_URL = 'https://www.bdcdj.com/'
let is_dev = 0

// 生产环境 const PRO_URLWECHAT = 'http://192.168.1.103:8091/zfbz/wwgs/'//微信 const
// PRO_URLPLATFORM = 'http://192.168.1.187:8090/wwfb/'//平台   1 const
// PRO_URLWEBSERVICE = 'http://192.168.1.100:8081/zfbz/wwgs/' //.NET WEBSERVICES
// const PRO_WEBSITEPAGES = 'http://www.hsfdcjyzx.com:8502/' //app网页地址

const PRO_URLWECHAT = '/wwfb/' //0ion
// const PRO_URLPLATFORM = 'http://128.192.182.115:9003/wwfb/'//平台   1 const
// PRO_URLPLATFORM = 'http://192.168.1.187:8090/wwfb/' //平台   1
const PRO_URLPLATFORM = '/wwfb/'
const PRO_URLWEBSERVICE = '/zfbz/wwgs/' //.NET WEBSERVICES
const PRO_PREPAREAPPLY = '/zfbzweb/'
const PRO_WEBSITEPAGES = 'http://192.168.1.139:9080/' //app网页地址
// const PRO_CCBWEB = "http://128.196.218.5:8101/"
const PRO_CCBWEB = "http://bankservice.home.ccb.com/"
//登录加密使用的接口
const PRO_CCBLOGIN = "http://128.192.186.137/lhgzfww/zfbz/wwgs/"  //测试地址
// const PRO_CCBLOGIN = "http://lanhai.gongzu.ccbhome.cn/lhgzfww/zfbz/wwgs/"
// const PRO_CCBLOGIN="http://128.196.212.12/lhgzfww/zfbz/wwgs/"
const PRO_CCBUPDATE = "http://lanhai.gongzu.ccbhome.cn/lhgzfww/sjbbgl/"
// const PRO_CCBUPDATE="http://128.192.186.137/lhgzfww/sjbbgl/"
let is_pro = 1

//模块配置
let modules: Array<any> = [
	// {
	// 	id: 'businessApplication',
	// 	name: '业务申请',
	// 	uri: 'BuniPage',
	// 	action: 'checkLogin',
	// 	image1: 'assets/firstpage/buniApply.png'
	// },
	{
		id: 'businessApplication',
		name: '保障资格申请',
		uri: 'FormApplyInfoPage',
		action: 'checkLogin',
		image1: 'assets/firstpage/buniApply.png'
	},
	{
		id: 'house',
		name: '房源信息',
		uri: 'ProjectInformationPage',
		action: '',
		image: 'assets/firstpage/fyxxtp.png',
		image1: 'assets/firstpage/fyxxtp.png',
		image2: 'assets/firstpage/fyxxtpShadow.png'
	}, {
		id: 'queryProgress',
		name: '保障进度查询',
		uri: 'ProgressQueryPage',
		action: '',
		image: 'assets/firstpage/bzjdcxtp.png',
		image1: 'assets/firstpage/bzjdcxtp.png',
		image2: 'assets/firstpage/bzjdcxtpShadow.png'
	}, {
		id: 'dzht',
		name: '电子合同',
		uri: 'ContractPage',
		action: '',
		image: 'assets/firstpage/dzhttp.png',
		image1: 'assets/firstpage/dzhttp.png',
		image2: 'assets/firstpage/dzhttpShadow.png'
	},
	{
		id: 'notice',
		name: '公示公告',
		uri: 'PublicAnnouncementPage',
		action: '',
		image: 'assets/firstpage/gsggtp.png',
		image1: 'assets/firstpage/gsggtp.png',
		image2: 'assets/firstpage/gsggtpShadow.png'
	},
	{
		id: 'appcheckNotice',
		name: '审核结果公示',
		uri: 'PublicAnouncementqhdPage',
		action: '',
		image: 'assets/firstpage/gsggtp.png',
		image1: 'assets/firstpage/gsggtp.png',
		image2: 'assets/firstpage/gsggtpShadow.png'
	},
	{
		id: 'faq',
		name: '常见问题',
		uri: 'ContentListPage',
		action: 'faq',
		image: 'assets/firstpage/cjwttp.png',
		image1: 'assets/firstpage/cjwttp.png',
		image2: 'assets/firstpage/cjwttpShadow.png'
	}, {
		id: 'policy',
		name: '政策法规',
		uri: 'ContentListPage',
		action: 'policy',
		image: 'assets/firstpage/zcfgtp.png',
		image1: 'assets/firstpage/zcfgtp.png',
		image2: 'assets/firstpage/zcfgtpShadow.png'
	}
	, {
		id: 'serviceInfo',
		name: '服务信息',
		uri: 'ContentListPage',
		action: 'room',
		image: 'assets/firstpage/fydhgs.png',
		image1: 'assets/firstpage/fydhgs.png',
		image2: 'assets/firstpage/fydhgsShadow.png'
	}, {
		id: 'applyGuarantee',
		name: '预申请信息',
		uri: 'PrepareApplyPage',
		action: 'apply',
		image: 'assets/firstpage/prepareaplly.png',
		image1: 'assets/firstpage/prepareaplly.png',
		image2: 'assets/firstpage/prepareapllyShadow.png'
	}
	// ,{
	//     id: 'joyLife',
	//     name: '悦享生活',
	//     uri: '',
	//     action: '',
	//     image: 'assets/firstpage/joylife.png',
	//     image1: 'assets/firstpage/joylife.png',
	//     image2: 'assets/firstpage/joylifeShadow.png'
	// }
];
//景德镇特殊模块配置
let modules_jdz: Array<any> = [
	{
		id: 'house',
		name: '房源信息',
		uri: 'ProjectInformationPage',
		action: '',
		image: 'assets/firstpage/fyxxtp.png',
		image1: 'assets/firstpage/fyxxtp.png',
		image2: 'assets/firstpage/fyxxtpShadow.png'
	}, {
		id: 'queryProgress',
		name: '保障进度查询',
		uri: 'ProgressQueryPage',
		action: '',
		image: 'assets/firstpage/bzjdcxtp.png',
		image1: 'assets/firstpage/bzjdcxtp.png',
		image2: 'assets/firstpage/bzjdcxtpShadow.png'
	}, {
		id: 'dzht',
		name: '电子合同',
		uri: 'ContractPage',
		action: '',
		image: 'assets/firstpage/dzhttp.png',
		image1: 'assets/firstpage/dzhttp.png',
		image2: 'assets/firstpage/dzhttpShadow.png'
	},
	{
		id: 'notice',
		name: '公示公告',
		uri: 'PublicAnnouncementPage',
		action: '',
		image: 'assets/firstpage/gsggtp.png',
		image1: 'assets/firstpage/gsggtp.png',
		image2: 'assets/firstpage/gsggtpShadow.png'
	},
	{
		id: 'appcheckNotice',
		name: '审核结果公示',
		uri: 'PublicAnouncementqhdPage',
		action: '',
		image: 'assets/firstpage/gsggtp.png',
		image1: 'assets/firstpage/gsggtp.png',
		image2: 'assets/firstpage/gsggtpShadow.png'
	},
	{
		id: 'faq',
		name: '常见问题',
		uri: 'ContentListPage',
		action: 'faq',
		image: 'assets/firstpage/cjwttp.png',
		image1: 'assets/firstpage/cjwttp.png',
		image2: 'assets/firstpage/cjwttpShadow.png'
	}, {
		id: 'policy',
		name: '政策法规',
		uri: 'ContentListPage',
		action: 'policy',
		image: 'assets/firstpage/zcfgtp.png',
		image1: 'assets/firstpage/zcfgtp.png',
		image2: 'assets/firstpage/zcfgtpShadow.png'
	}
	, {
		id: 'serviceInfo',
		name: '服务信息',
		uri: 'ContentListPage',
		action: 'room',
		image: 'assets/firstpage/fydhgs.png',
		image1: 'assets/firstpage/fydhgs.png',
		image2: 'assets/firstpage/fydhgsShadow.png'
	}, {
		id: 'applyGuarantee',
		name: '预申请信息',
		uri: 'PrepareApplyPage',
		action: 'apply',
		image: 'assets/firstpage/prepareaplly.png',
		image1: 'assets/firstpage/prepareaplly.png',
		image2: 'assets/firstpage/prepareapllyShadow.png'
	}, {
		id: 'joyLife',
		name: '悦享生活',
		uri: '',
		action: '',
		image: 'assets/firstpage/joylife.png',
		image1: 'assets/firstpage/joylife.png',
		image2: 'assets/firstpage/joylifeShadow.png'
	}
];

//业务申请模块
let bizModules: Array<any> = [
	{
		id: '10002',
		name: '住房保障资格申请',
		uri: 'ApplyStylePage',
		action: '/xtgzfww/soar/gzfwwxx/pages/zgsq/check.jsp?chooseType=qualificationApply',
		image: 'assets/buniApply/qualificationApply.png',
	},
	{
		id: '10005',
		name: '住房保障资格年审',
		uri: 'ReviewStylePage',
		action: '',
		image: 'assets/buniApply/annualReview.png',
	},
	{
		id: '10006',
		name: '住房保障资格变更',
		uri: 'ChangeStylePage',
		action: '',
		image: 'assets/buniApply/qualificationChange.png',
	},
	{
		id: '10009',
		name: '配租意向登记',
		uri: 'RentApplyInfoPage',
		action: '',
		image: 'assets/buniApply/rentApply.png',
	},
	{
		id: '10010',
		name: '配售意向登记',
		uri: 'PlacementStylePage',
		action: '',
		image: 'assets/buniApply/saleApply.png'
	},
	{
		id: '10012',
		name: '房屋维修',
		uri: 'HouseRepairPage',
		action: '',
		image: 'assets/buniApply/repairApply.png',
	},
	{
		id: 'repairSatisfaction',
		name: '维修满意度调查',
		uri: 'RepairEvaluatePage',
		action: '',
		image: 'assets/buniApply/repairSatisfaction.png',
	},
	{
		id: 'exchangeApply',
		name: '房屋调换申请',
		uri: 'ExchangeApplyPage',
		action: '',
		image: 'assets/buniApply/exchangeApply.png',
	},
	{
		id: 'quitApply',
		name: '退出保障申请',
		uri: 'QuitApplyPage',
		action: '',
		image: 'assets/buniApply/quitApply.png',
	}

];

//服务接口地址
let serviceActions = {
	cmsList: 'getWzzbListByPage.action',
	/*栏目列表服务接口*/
	cmsContent: 'getWzxxById.action',
	/*栏目内容服务接口*/
	downloadList: 'getWzfjListByPage.action',
	/*下载列表服务接口*/
	downloadContent: 'downLoad.action',
	/*下载服务地址*/
	notice: 'getJjgsListByPage.action',
	/*公示公告服务接口*/
	imageNews: 'getImgByLmid.action',
	/*图片新闻服务接口*/
	districtList: 'findCq.action',
	/*区县列表查询服务接口*/
	projectAutoComplete: 'findXmForFast.action',
	/*项目名自动完成服务接口*/
	projectPOI: 'findXmForPage.action',
	/*项目POI查询服务接口*/
	projectLayer: 'findXmByPoint.action',
	/*项目图层查询服务接口*/
	houseList: 'findfyxxForPage.action'/*房屋查询服务接口*/
}

//内容栏目配置
let cmsTypes = {
	workflow: {
		id: 45,
		name: '办事指南'
	},
	/*办事指南*/
	policy: {
		id: 44,
		name: '政策法规'
	},
	/*政策法规*/
	download: {
		id: 42,
		name: '资料下载'
	},
	/*资料下载*/
	faq: {
		id: 43,
		name: '常见问题'
	},
	/*常见问题*/
	room: {
		id: 48,
		name: '服务信息'
	},
	room1: {
		id: 48,
		name: '信用披露'
	},
	/*房屋调换公示*/
	imageNews: {
		id: 46,
		name: '图片新闻'
	}/*图片新闻*/
}

//提示信息配置
let promptInfo = {
	Empty: {
		title: '没有查询到结果',
		subTitle: '',
		image: 'assets/info/empty.png'
	},
	Success: {
		title: '操作成功',
		subTitle: '',
		image: 'assets/info/success.png'
	},
	Error: {
		title: '应用程序发生错误',
		subTitle: '',
		image: 'assets/info/error.png'
	},
	NoNetwork: {
		title: '无法连接到服务器',
		subTitle: '请确认网络连接是否正常',
		image: 'assets/info/network.png'
	}
}

// 导出以供程序访问 LOCAL_URL | DEV_URL | PRO_URL
export const API_URL_WECHAT = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_URLWECHAT)
// 导出以供数据服务访问 LOCAL_URL | DEV_URL | PRO_URL
export const API_URL_PLATFORM = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_URLPLATFORM)
export const API_URL_WEBSERVER = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_URLWEBSERVICE)
export const API_URL_WEBSITEPAGES = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_WEBSITEPAGES)
export const API_URL_CCBWEB = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_CCBWEB)
export const API_URL_CCBLOGIN = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_CCBLOGIN)
export const API_URL_CCBUPDATE = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_CCBUPDATE)
export const API_URL_CCBPREPAREAPPLY = (is_local && LOCAL_URL) || (is_dev && DEV_URL) || (is_pro && PRO_PREPAREAPPLY)
export const APPID = 'wx3f04159131459458'

//导出模块配置default
export const MODULE_CONFIG_DEFAULT = modules
//景德镇特殊功能模块配置
export const MODULE_CONFIG_JDZ = modules_jdz
//导出服务接口
export const SERVICE_ACTIONS = serviceActions

// ZFBZ 住房保障 type=8
export const API_URL_ZFBZ = '/zfbzweb/';
// WWXZ 外网须知 type=9
export const API_URL_XZ = '/wwxz/';
// WWNS 外网年审 type=10
export const API_URL_NS = '/wwns/';
// wwhfsq 外网换房申请 type=11
export const API_URL_HF = '/wwhfsq/';
// WwTsjb 外网投诉举报 type=12
export const API_URL_TSJB = '/WwTsjb/';
// wwzytz 外网退出保障申请 
export const API_URL_TCSQ = '/wwzytz/';
// fwwx 房屋维修
export const API_URL_FWWX = '/fwwx/';

export const TEST_URL = "http://128.192.186.130/xtgzfww/";  //测试环境

//导出业务申请模块配置
export const BIZ_MODULES = bizModules;

//导出内容栏目配置
export const CMS_TYPES = cmsTypes

//导入提示信息配置
export const PROMPT_INFO = promptInfo

//专属服务 测试环境
// export const specialServices = "http://128.196.218.5:8101/LHECISM";
export const specialServices = "http://bankservice.ccbhome.cn/LHECISM";

//选择城市唯一地址
// export const cityServices = "http://128.196.212.12/lhgzfww";//测试
// export const cityServices = "http://128.192.186.137/lhgzfww";//测试
export const cityServices = "http://lanhai.gongzu.ccbhome.cn/lhgzfww";
//测试环境地址
// export const VtServices = "http://128.196.212.12:8101/lhgzfww";
// 专属服务 生产环境 export const specialServices =
// "http://bankservice.home.ccb.com/LHECISM";
export class AppConfig {
	// public  url = "http://128.196.212.12/lhgzfww";//测试
	// public url = "http://128.192.186.137/lhgzfww"; 
	public url = "http://lanhai.gongzu.ccbhome.cn/lhgzfww";
	public setDebugUrl(urlstring) {
		this.url = urlstring;
	}
	//测试环境URL
	public getDebugUrl() {
		return this.url;
	}
}




/*----------------------------------------测试后台Api地址已弃用----------------------------------------*/
export const APP_SERVE_URL = 'http://localhost/api/';

/*----------------------------------------文件服务器地址----------------------------------------*/
export const FILE_SERVE_URL = 'http://172.16.19.86/kit_file_server/';//文件服务:测试环境

/*----------------------------------------app版本升级服务地址----------------------------------------*/
export const APP_VERSION_SERVE_URL = 'http://172.16.19.86:8111/api/';//app版本升级服务;测试环境,查询app最新版本号,更新日志等信息.

export const IS_DEBUG = true;//是否开发(调试)模式


export const DEFAULT_AVATAR = './assets/img/avatar.png';//用户默认头像
export const PAGE_SIZE = 5;//默认分页大小
export const IMAGE_SIZE = 1024;//拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 94;//图像压缩质量，范围为0 - 100
export const REQUEST_TIMEOUT = 20000;//请求超时时间,单位为毫秒


export const ENABLE_FUNDEBUG = false;//是否启用fundebug日志监控
export const FUNDEBUG_API_KEY = '3701a358f79b7daa39592255bde6c3c8772efad642883e42dbb65f3f8ffbae11';//去https://fundebug.com/申请key

export const APK_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/ionic2_tabs.apk';//android apk下载完整地址,用于android本地升级
export const APP_DOWNLOAD = 'http://omzo595hi.bkt.clouddn.com/download.html';//app网页下载地址,用于ios升级或android本地升级失败

//code push 部署key
export const CODE_PUSH_DEPLOYMENT_KEY = {
	'android': {
		'Production': 'i0LgJRugiIfjVYTgmXs9go45Xc7g26690215-d954-4697-a879-90e0c4612b59',
		'Staging': 'WY29_Zyq_hg0eB3TSTGaKRSKPE6k26690215-d954-4697-a879-90e0c4612b59'
	},
	'ios': {
		'Production': 'kn3VJ28z0hB_zQYnW-KnblldnBzN26690215-d954-4697-a879-90e0c4612b59',
		'Staging': 'SRoxClVMoed8SgwIRxeVCPWx26Fk26690215-d954-4697-a879-90e0c4612b59'
	}
};

export const CITYCODEALL: Array<any> = [{
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "340000"
		}
	}, {
		"name": {
			"value": "安庆市"
		},
		"value": {
			"value": "340800"
		}
	}, {
		"name": {
			"value": "蚌埠市"
		},
		"value": {
			"value": "340300"
		}
	}, {
		"name": {
			"value": "巢湖市"
		},
		"value": {
			"value": "341400"
		}
	}, {
		"name": {
			"value": "池州市"
		},
		"value": {
			"value": "341700"
		}
	}, {
		"name": {
			"value": "滁州市"
		},
		"value": {
			"value": "341100"
		}
	}, {
		"name": {
			"value": "阜阳市"
		},
		"value": {
			"value": "341200"
		}
	}, {
		"name": {
			"value": "合肥市"
		},
		"value": {
			"value": "340100"
		}
	}, {
		"name": {
			"value": "淮北市"
		},
		"value": {
			"value": "340600"
		}
	}, {
		"name": {
			"value": "淮南市"
		},
		"value": {
			"value": "340400"
		}
	}, {
		"name": {
			"value": "黄山市"
		},
		"value": {
			"value": "341000"
		}
	}, {
		"name": {
			"value": "六安市"
		},
		"value": {
			"value": "341500"
		}
	}, {
		"name": {
			"value": "马鞍山市"
		},
		"value": {
			"value": "340500"
		}
	}, {
		"name": {
			"value": "宿州市"
		},
		"value": {
			"value": "341300"
		}
	}, {
		"name": {
			"value": "铜陵市"
		},
		"value": {
			"value": "340700"
		}
	}, {
		"name": {
			"value": "芜湖市"
		},
		"value": {
			"value": "340200"
		}
	}, {
		"name": {
			"value": "宣城市"
		},
		"value": {
			"value": "341800"
		}
	}, {
		"name": {
			"value": "亳州市"
		},
		"value": {
			"value": "341600"
		}
	}],
	"name": {
		"value": "安徽省"
	},
	"value": {
		"value": "340000"
	}
}, {
	"item": [{
		"name": {
			"value": "北京市"
		},
		"value": {
			"value": "110000"
		}
	}],
	"name": {
		"value": "北京市"
	},
	"value": {
		"value": "110000"
	}
}, {
	"item": [{
		"name": {
			"value": "重庆市"
		},
		"value": {
			"value": "500000"
		}
	}],
	"name": {
		"value": "重庆市"
	},
	"value": {
		"value": "500000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "350000"
		}
	}, {
		"name": {
			"value": "福州市"
		},
		"value": {
			"value": "350100"
		}
	}, {
		"name": {
			"value": "龙岩市"
		},
		"value": {
			"value": "350800"
		}
	}, {
		"name": {
			"value": "南平市"
		},
		"value": {
			"value": "350700"
		}
	}, {
		"name": {
			"value": "宁德市"
		},
		"value": {
			"value": "350900"
		}
	}, {
		"name": {
			"value": "莆田市"
		},
		"value": {
			"value": "350300"
		}
	}, {
		"name": {
			"value": "泉州市"
		},
		"value": {
			"value": "350500"
		}
	}, {
		"name": {
			"value": "三明市"
		},
		"value": {
			"value": "350400"
		}
	}, {
		"name": {
			"value": "厦门市"
		},
		"value": {
			"value": "350200"
		}
	}, {
		"name": {
			"value": "漳州市"
		},
		"value": {
			"value": "350600"
		}
	}],
	"name": {
		"value": "福建省"
	},
	"value": {
		"value": "350000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "620000"
		}
	}, {
		"name": {
			"value": "白银市"
		},
		"value": {
			"value": "620400"
		}
	}, {
		"name": {
			"value": "定西市"
		},
		"value": {
			"value": "621100"
		}
	}, {
		"name": {
			"value": "甘南藏族"
		},
		"value": {
			"value": "623000"
		}
	}, {
		"name": {
			"value": "嘉峪关市"
		},
		"value": {
			"value": "620200"
		}
	}, {
		"name": {
			"value": "金昌市"
		},
		"value": {
			"value": "620300"
		}
	}, {
		"name": {
			"value": "酒泉市"
		},
		"value": {
			"value": "620900"
		}
	}, {
		"name": {
			"value": "兰州市"
		},
		"value": {
			"value": "620100"
		}
	}, {
		"name": {
			"value": "临夏回族"
		},
		"value": {
			"value": "622900"
		}
	}, {
		"name": {
			"value": "陇南地区"
		},
		"value": {
			"value": "622600"
		}
	}, {
		"name": {
			"value": "陇南市"
		},
		"value": {
			"value": "621200"
		}
	}, {
		"name": {
			"value": "平凉市"
		},
		"value": {
			"value": "620800"
		}
	}, {
		"name": {
			"value": "庆阳市"
		},
		"value": {
			"value": "621000"
		}
	}, {
		"name": {
			"value": "天水市"
		},
		"value": {
			"value": "620500"
		}
	}, {
		"name": {
			"value": "武威市"
		},
		"value": {
			"value": "620600"
		}
	}, {
		"name": {
			"value": "张掖市"
		},
		"value": {
			"value": "620700"
		}
	}],
	"name": {
		"value": "甘肃省"
	},
	"value": {
		"value": "620000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "440000"
		}
	}, {
		"name": {
			"value": "潮州市"
		},
		"value": {
			"value": "445100"
		}
	}, {
		"name": {
			"value": "东莞市"
		},
		"value": {
			"value": "441900"
		}
	}, {
		"name": {
			"value": "佛山市"
		},
		"value": {
			"value": "440600"
		}
	}, {
		"name": {
			"value": "广州市"
		},
		"value": {
			"value": "440100"
		}
	}, {
		"name": {
			"value": "河源市"
		},
		"value": {
			"value": "441600"
		}
	}, {
		"name": {
			"value": "惠州市"
		},
		"value": {
			"value": "441300"
		}
	}, {
		"name": {
			"value": "江门市"
		},
		"value": {
			"value": "440700"
		}
	}, {
		"name": {
			"value": "揭阳市"
		},
		"value": {
			"value": "445200"
		}
	}, {
		"name": {
			"value": "茂名市"
		},
		"value": {
			"value": "440900"
		}
	}, {
		"name": {
			"value": "梅州市"
		},
		"value": {
			"value": "441400"
		}
	}, {
		"name": {
			"value": "清远市"
		},
		"value": {
			"value": "441800"
		}
	}, {
		"name": {
			"value": "汕头市"
		},
		"value": {
			"value": "440500"
		}
	}, {
		"name": {
			"value": "汕尾市"
		},
		"value": {
			"value": "441500"
		}
	}, {
		"name": {
			"value": "韶关市"
		},
		"value": {
			"value": "440200"
		}
	}, {
		"name": {
			"value": "深圳市"
		},
		"value": {
			"value": "440300"
		}
	}, {
		"name": {
			"value": "阳江市"
		},
		"value": {
			"value": "441700"
		}
	}, {
		"name": {
			"value": "云浮市"
		},
		"value": {
			"value": "445300"
		}
	}, {
		"name": {
			"value": "湛江市"
		},
		"value": {
			"value": "440800"
		}
	}, {
		"name": {
			"value": "肇庆市"
		},
		"value": {
			"value": "441200"
		}
	}, {
		"name": {
			"value": "中山市"
		},
		"value": {
			"value": "442000"
		}
	}, {
		"name": {
			"value": "珠海市"
		},
		"value": {
			"value": "440400"
		}
	}],
	"name": {
		"value": "广东省"
	},
	"value": {
		"value": "440000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "450000"
		}
	}, {
		"name": {
			"value": "百色市"
		},
		"value": {
			"value": "451000"
		}
	}, {
		"name": {
			"value": "北海市"
		},
		"value": {
			"value": "450500"
		}
	}, {
		"name": {
			"value": "崇左市"
		},
		"value": {
			"value": "451400"
		}
	}, {
		"name": {
			"value": "防城港市"
		},
		"value": {
			"value": "450600"
		}
	}, {
		"name": {
			"value": "桂林市"
		},
		"value": {
			"value": "450300"
		}
	}, {
		"name": {
			"value": "贵港市"
		},
		"value": {
			"value": "450800"
		}
	}, {
		"name": {
			"value": "河池市"
		},
		"value": {
			"value": "451200"
		}
	}, {
		"name": {
			"value": "贺州市"
		},
		"value": {
			"value": "451100"
		}
	}, {
		"name": {
			"value": "来宾市"
		},
		"value": {
			"value": "451300"
		}
	}, {
		"name": {
			"value": "柳州市"
		},
		"value": {
			"value": "450200"
		}
	}, {
		"name": {
			"value": "南宁市"
		},
		"value": {
			"value": "450100"
		}
	}, {
		"name": {
			"value": "钦州市"
		},
		"value": {
			"value": "450700"
		}
	}, {
		"name": {
			"value": "梧州市"
		},
		"value": {
			"value": "450400"
		}
	}, {
		"name": {
			"value": "玉林市"
		},
		"value": {
			"value": "450900"
		}
	}],
	"name": {
		"value": "广西区"
	},
	"value": {
		"value": "450000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "520000"
		}
	}, {
		"name": {
			"value": "安顺"
		},
		"value": {
			"value": "520400"
		}
	}, {
		"name": {
			"value": "毕节"
		},
		"value": {
			"value": "522400"
		}
	}, {
		"name": {
			"value": "贵阳"
		},
		"value": {
			"value": "520100"
		}
	}, {
		"name": {
			"value": "六盘水"
		},
		"value": {
			"value": "520200"
		}
	}, {
		"name": {
			"value": "黔东南"
		},
		"value": {
			"value": "522600"
		}
	}, {
		"name": {
			"value": "黔南"
		},
		"value": {
			"value": "522700"
		}
	}, {
		"name": {
			"value": "黔西南"
		},
		"value": {
			"value": "522300"
		}
	}, {
		"name": {
			"value": "铜仁"
		},
		"value": {
			"value": "522200"
		}
	}, {
		"name": {
			"value": "遵义"
		},
		"value": {
			"value": "520300"
		}
	}],
	"name": {
		"value": "贵州省"
	},
	"value": {
		"value": "520000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "460000"
		}
	}, {
		"name": {
			"value": "白沙黎族"
		},
		"value": {
			"value": "469030"
		}
	}, {
		"name": {
			"value": "保亭黎族"
		},
		"value": {
			"value": "469035"
		}
	}, {
		"name": {
			"value": "昌江黎族"
		},
		"value": {
			"value": "469031"
		}
	}, {
		"name": {
			"value": "澄迈县"
		},
		"value": {
			"value": "469027"
		}
	}, {
		"name": {
			"value": "定安县"
		},
		"value": {
			"value": "469025"
		}
	}, {
		"name": {
			"value": "东方市"
		},
		"value": {
			"value": "469007"
		}
	}, {
		"name": {
			"value": "海口市"
		},
		"value": {
			"value": "460100"
		}
	}, {
		"name": {
			"value": "乐东黎族"
		},
		"value": {
			"value": "469033"
		}
	}, {
		"name": {
			"value": "临高县"
		},
		"value": {
			"value": "469028"
		}
	}, {
		"name": {
			"value": "陵水黎族"
		},
		"value": {
			"value": "469034"
		}
	}, {
		"name": {
			"value": "南沙群岛"
		},
		"value": {
			"value": "469038"
		}
	}, {
		"name": {
			"value": "琼海市"
		},
		"value": {
			"value": "469002"
		}
	}, {
		"name": {
			"value": "琼中黎族"
		},
		"value": {
			"value": "469036"
		}
	}, {
		"name": {
			"value": "三亚市"
		},
		"value": {
			"value": "460200"
		}
	}, {
		"name": {
			"value": "屯昌县"
		},
		"value": {
			"value": "469026"
		}
	}, {
		"name": {
			"value": "万宁市"
		},
		"value": {
			"value": "469006"
		}
	}, {
		"name": {
			"value": "文昌市"
		},
		"value": {
			"value": "469005"
		}
	}, {
		"name": {
			"value": "五指山市"
		},
		"value": {
			"value": "469001"
		}
	}, {
		"name": {
			"value": "西沙群岛"
		},
		"value": {
			"value": "469037"
		}
	}, {
		"name": {
			"value": "中沙群岛"
		},
		"value": {
			"value": "469039"
		}
	}, {
		"name": {
			"value": "儋州市"
		},
		"value": {
			"value": "469003"
		}
	}],
	"name": {
		"value": "海南省"
	},
	"value": {
		"value": "460000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "130000"
		}
	}, {
		"name": {
			"value": "保定市"
		},
		"value": {
			"value": "130600"
		}
	}, {
		"name": {
			"value": "沧州市"
		},
		"value": {
			"value": "130900"
		}
	}, {
		"name": {
			"value": "承德市"
		},
		"value": {
			"value": "130800"
		}
	}, {
		"name": {
			"value": "邯郸市"
		},
		"value": {
			"value": "130400"
		}
	}, {
		"name": {
			"value": "衡水市"
		},
		"value": {
			"value": "131100"
		}
	}, {
		"name": {
			"value": "廊坊市"
		},
		"value": {
			"value": "131000"
		}
	}, {
		"name": {
			"value": "秦皇岛市"
		},
		"value": {
			"value": "130300"
		}
	}, {
		"name": {
			"value": "石家庄市"
		},
		"value": {
			"value": "130100"
		}
	}, {
		"name": {
			"value": "唐山市"
		},
		"value": {
			"value": "130200"
		}
	}, {
		"name": {
			"value": "邢台市"
		},
		"value": {
			"value": "130500"
		}
	}, {
		"name": {
			"value": "张家口市"
		},
		"value": {
			"value": "130700"
		}
	}],
	"name": {
		"value": "河北省"
	},
	"value": {
		"value": "130000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "410000"
		}
	}, {
		"name": {
			"value": "安阳市"
		},
		"value": {
			"value": "410500"
		}
	}, {
		"name": {
			"value": "鹤壁市"
		},
		"value": {
			"value": "410600"
		}
	}, {
		"name": {
			"value": "焦作市"
		},
		"value": {
			"value": "410800"
		}
	}, {
		"name": {
			"value": "开封市"
		},
		"value": {
			"value": "410200"
		}
	}, {
		"name": {
			"value": "洛阳市"
		},
		"value": {
			"value": "410300"
		}
	}, {
		"name": {
			"value": "南阳市"
		},
		"value": {
			"value": "411300"
		}
	}, {
		"name": {
			"value": "平顶山市"
		},
		"value": {
			"value": "410400"
		}
	}, {
		"name": {
			"value": "三门峡市"
		},
		"value": {
			"value": "411200"
		}
	}, {
		"name": {
			"value": "商丘市"
		},
		"value": {
			"value": "411400"
		}
	}, {
		"name": {
			"value": "新乡市"
		},
		"value": {
			"value": "410700"
		}
	}, {
		"name": {
			"value": "信阳市"
		},
		"value": {
			"value": "411500"
		}
	}, {
		"name": {
			"value": "许昌市"
		},
		"value": {
			"value": "411000"
		}
	}, {
		"name": {
			"value": "郑州市"
		},
		"value": {
			"value": "410100"
		}
	}, {
		"name": {
			"value": "周口市"
		},
		"value": {
			"value": "411600"
		}
	}, {
		"name": {
			"value": "驻马店市"
		},
		"value": {
			"value": "411700"
		}
	}, {
		"name": {
			"value": "漯河市"
		},
		"value": {
			"value": "411100"
		}
	}, {
		"name": {
			"value": "濮阳市"
		},
		"value": {
			"value": "410900"
		}
	}, {
		"name": {
			"value": "济源市"
		},
		"value": {
			"value": "410881"
		}
	}],
	"name": {
		"value": "河南省"
	},
	"value": {
		"value": "410000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "230000"
		}
	}, {
		"name": {
			"value": "大庆市"
		},
		"value": {
			"value": "230600"
		}
	}, {
		"name": {
			"value": "大兴安岭"
		},
		"value": {
			"value": "232700"
		}
	}, {
		"name": {
			"value": "哈尔滨市"
		},
		"value": {
			"value": "230100"
		}
	}, {
		"name": {
			"value": "鹤岗市"
		},
		"value": {
			"value": "230400"
		}
	}, {
		"name": {
			"value": "黑河市"
		},
		"value": {
			"value": "231100"
		}
	}, {
		"name": {
			"value": "鸡西市"
		},
		"value": {
			"value": "230300"
		}
	}, {
		"name": {
			"value": "佳木斯市"
		},
		"value": {
			"value": "230800"
		}
	}, {
		"name": {
			"value": "牡丹江市"
		},
		"value": {
			"value": "231000"
		}
	}, {
		"name": {
			"value": "七台河市"
		},
		"value": {
			"value": "230900"
		}
	}, {
		"name": {
			"value": "齐齐哈尔"
		},
		"value": {
			"value": "230200"
		}
	}, {
		"name": {
			"value": "双鸭山市"
		},
		"value": {
			"value": "230500"
		}
	}, {
		"name": {
			"value": "绥化市"
		},
		"value": {
			"value": "231200"
		}
	}, {
		"name": {
			"value": "伊春市"
		},
		"value": {
			"value": "230700"
		}
	}],
	"name": {
		"value": "黑龙江"
	},
	"value": {
		"value": "230000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "420000"
		}
	}, {
		"name": {
			"value": "鄂州市"
		},
		"value": {
			"value": "420700"
		}
	}, {
		"name": {
			"value": "恩施州"
		},
		"value": {
			"value": "422800"
		}
	}, {
		"name": {
			"value": "黄冈市"
		},
		"value": {
			"value": "421100"
		}
	}, {
		"name": {
			"value": "黄石市"
		},
		"value": {
			"value": "420200"
		}
	}, {
		"name": {
			"value": "荆门市"
		},
		"value": {
			"value": "420800"
		}
	}, {
		"name": {
			"value": "荆州市"
		},
		"value": {
			"value": "421000"
		}
	}, {
		"name": {
			"value": "潜江市"
		},
		"value": {
			"value": "429005"
		}
	}, {
		"name": {
			"value": "神农架林区"
		},
		"value": {
			"value": "429021"
		}
	}, {
		"name": {
			"value": "十堰市"
		},
		"value": {
			"value": "420300"
		}
	}, {
		"name": {
			"value": "随州市"
		},
		"value": {
			"value": "421300"
		}
	}, {
		"name": {
			"value": "天门市"
		},
		"value": {
			"value": "429006"
		}
	}, {
		"name": {
			"value": "武汉市"
		},
		"value": {
			"value": "420100"
		}
	}, {
		"name": {
			"value": "仙桃市"
		},
		"value": {
			"value": "429004"
		}
	}, {
		"name": {
			"value": "咸宁市"
		},
		"value": {
			"value": "421200"
		}
	}, {
		"name": {
			"value": "襄阳市"
		},
		"value": {
			"value": "420600"
		}
	}, {
		"name": {
			"value": "孝感市"
		},
		"value": {
			"value": "420900"
		}
	}, {
		"name": {
			"value": "宜昌市"
		},
		"value": {
			"value": "420500"
		}
	}],
	"name": {
		"value": "湖北省"
	},
	"value": {
		"value": "420000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "430000"
		}
	}, {
		"name": {
			"value": "常德市"
		},
		"value": {
			"value": "430700"
		}
	}, {
		"name": {
			"value": "长沙市"
		},
		"value": {
			"value": "430100"
		}
	}, {
		"name": {
			"value": "郴州市"
		},
		"value": {
			"value": "431000"
		}
	}, {
		"name": {
			"value": "衡阳市"
		},
		"value": {
			"value": "430400"
		}
	}, {
		"name": {
			"value": "怀化市"
		},
		"value": {
			"value": "431200"
		}
	}, {
		"name": {
			"value": "娄底市"
		},
		"value": {
			"value": "431300"
		}
	}, {
		"name": {
			"value": "邵阳市"
		},
		"value": {
			"value": "430500"
		}
	}, {
		"name": {
			"value": "湘潭市"
		},
		"value": {
			"value": "430300"
		}
	}, {
		"name": {
			"value": "湘西"
		},
		"value": {
			"value": "433100"
		}
	}, {
		"name": {
			"value": "益阳市"
		},
		"value": {
			"value": "430900"
		}
	}, {
		"name": {
			"value": "永州市"
		},
		"value": {
			"value": "431100"
		}
	}, {
		"name": {
			"value": "岳阳市"
		},
		"value": {
			"value": "430600"
		}
	}, {
		"name": {
			"value": "张家界市"
		},
		"value": {
			"value": "430800"
		}
	}, {
		"name": {
			"value": "株洲市"
		},
		"value": {
			"value": "430200"
		}
	}],
	"name": {
		"value": "湖南省"
	},
	"value": {
		"value": "430000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "220000"
		}
	}, {
		"name": {
			"value": "白城市"
		},
		"value": {
			"value": "220800"
		}
	}, {
		"name": {
			"value": "白山市"
		},
		"value": {
			"value": "220600"
		}
	}, {
		"name": {
			"value": "长春市"
		},
		"value": {
			"value": "220100"
		}
	}, {
		"name": {
			"value": "吉林市"
		},
		"value": {
			"value": "220200"
		}
	}, {
		"name": {
			"value": "辽源市"
		},
		"value": {
			"value": "220400"
		}
	}, {
		"name": {
			"value": "四平市"
		},
		"value": {
			"value": "220300"
		}
	}, {
		"name": {
			"value": "松原市"
		},
		"value": {
			"value": "220700"
		}
	}, {
		"name": {
			"value": "通化市"
		},
		"value": {
			"value": "220500"
		}
	}, {
		"name": {
			"value": "延边朝鲜"
		},
		"value": {
			"value": "222400"
		}
	}],
	"name": {
		"value": "吉林省"
	},
	"value": {
		"value": "220000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "320000"
		}
	}, {
		"name": {
			"value": "常州市"
		},
		"value": {
			"value": "320400"
		}
	}, {
		"name": {
			"value": "淮安市"
		},
		"value": {
			"value": "320800"
		}
	}, {
		"name": {
			"value": "连云港市"
		},
		"value": {
			"value": "320700"
		}
	}, {
		"name": {
			"value": "南京市"
		},
		"value": {
			"value": "320100"
		}
	}, {
		"name": {
			"value": "南通市"
		},
		"value": {
			"value": "320600"
		}
	}, {
		"name": {
			"value": "苏州市"
		},
		"value": {
			"value": "320500"
		}
	}, {
		"name": {
			"value": "宿迁市"
		},
		"value": {
			"value": "321300"
		}
	}, {
		"name": {
			"value": "泰州市"
		},
		"value": {
			"value": "321200"
		}
	}, {
		"name": {
			"value": "无锡市"
		},
		"value": {
			"value": "320200"
		}
	}, {
		"name": {
			"value": "徐州市"
		},
		"value": {
			"value": "320300"
		}
	}, {
		"name": {
			"value": "盐城市"
		},
		"value": {
			"value": "320900"
		}
	}, {
		"name": {
			"value": "扬州市"
		},
		"value": {
			"value": "321000"
		}
	}, {
		"name": {
			"value": "镇江市"
		},
		"value": {
			"value": "321100"
		}
	}],
	"name": {
		"value": "江苏省"
	},
	"value": {
		"value": "320000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "360000"
		}
	}, {
		"name": {
			"value": "抚州市"
		},
		"value": {
			"value": "361000"
		}
	}, {
		"name": {
			"value": "赣州市"
		},
		"value": {
			"value": "360700"
		}
	}, {
		"name": {
			"value": "吉安市"
		},
		"value": {
			"value": "360800"
		}
	}, {
		"name": {
			"value": "景德镇市"
		},
		"value": {
			"value": "360200"
		}
	}, {
		"name": {
			"value": "九江市"
		},
		"value": {
			"value": "360400"
		}
	}, {
		"name": {
			"value": "南昌市"
		},
		"value": {
			"value": "360100"
		}
	}, {
		"name": {
			"value": "萍乡市"
		},
		"value": {
			"value": "360300"
		}
	}, {
		"name": {
			"value": "上饶市"
		},
		"value": {
			"value": "361100"
		}
	}, {
		"name": {
			"value": "新余市"
		},
		"value": {
			"value": "360500"
		}
	}, {
		"name": {
			"value": "宜春市"
		},
		"value": {
			"value": "360900"
		}
	}, {
		"name": {
			"value": "鹰潭市"
		},
		"value": {
			"value": "360600"
		}
	}],
	"name": {
		"value": "江西省"
	},
	"value": {
		"value": "360000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "210000"
		}
	}, {
		"name": {
			"value": "鞍山市"
		},
		"value": {
			"value": "210300"
		}
	}, {
		"name": {
			"value": "本溪市"
		},
		"value": {
			"value": "210500"
		}
	}, {
		"name": {
			"value": "朝阳市"
		},
		"value": {
			"value": "211300"
		}
	}, {
		"name": {
			"value": "丹东市"
		},
		"value": {
			"value": "210600"
		}
	}, {
		"name": {
			"value": "抚顺市"
		},
		"value": {
			"value": "210400"
		}
	}, {
		"name": {
			"value": "阜新市"
		},
		"value": {
			"value": "210900"
		}
	}, {
		"name": {
			"value": "葫芦岛市"
		},
		"value": {
			"value": "211400"
		}
	}, {
		"name": {
			"value": "锦州市"
		},
		"value": {
			"value": "210700"
		}
	}, {
		"name": {
			"value": "辽阳市"
		},
		"value": {
			"value": "211000"
		}
	}, {
		"name": {
			"value": "盘锦市"
		},
		"value": {
			"value": "211100"
		}
	}, {
		"name": {
			"value": "沈阳市"
		},
		"value": {
			"value": "210100"
		}
	}, {
		"name": {
			"value": "铁岭市"
		},
		"value": {
			"value": "211200"
		}
	}, {
		"name": {
			"value": "营口市"
		},
		"value": {
			"value": "210800"
		}
	}, {
		"name": {
			"value": "大连市"
		},
		"value": {
			"value": "210200"
		}
	}],
	"name": {
		"value": "辽宁省"
	},
	"value": {
		"value": "210000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "150000"
		}
	}, {
		"name": {
			"value": "阿拉善盟"
		},
		"value": {
			"value": "152900"
		}
	}, {
		"name": {
			"value": "巴彦淖尔"
		},
		"value": {
			"value": "150800"
		}
	}, {
		"name": {
			"value": "包头市"
		},
		"value": {
			"value": "150200"
		}
	}, {
		"name": {
			"value": "赤峰市"
		},
		"value": {
			"value": "150400"
		}
	}, {
		"name": {
			"value": "鄂尔多斯"
		},
		"value": {
			"value": "150600"
		}
	}, {
		"name": {
			"value": "呼和浩特"
		},
		"value": {
			"value": "150100"
		}
	}, {
		"name": {
			"value": "呼伦贝尔"
		},
		"value": {
			"value": "150700"
		}
	}, {
		"name": {
			"value": "通辽市"
		},
		"value": {
			"value": "150500"
		}
	}, {
		"name": {
			"value": "乌海市"
		},
		"value": {
			"value": "150300"
		}
	}, {
		"name": {
			"value": "乌兰察布"
		},
		"value": {
			"value": "150900"
		}
	}, {
		"name": {
			"value": "锡林郭勒"
		},
		"value": {
			"value": "152500"
		}
	}, {
		"name": {
			"value": "兴安盟"
		},
		"value": {
			"value": "152200"
		}
	}],
	"name": {
		"value": "内蒙古"
	},
	"value": {
		"value": "150000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "640000"
		}
	}, {
		"name": {
			"value": "固原市"
		},
		"value": {
			"value": "640400"
		}
	}, {
		"name": {
			"value": "石嘴山市"
		},
		"value": {
			"value": "640200"
		}
	}, {
		"name": {
			"value": "吴忠市"
		},
		"value": {
			"value": "640300"
		}
	}, {
		"name": {
			"value": "银川市"
		},
		"value": {
			"value": "640100"
		}
	}, {
		"name": {
			"value": "中卫市"
		},
		"value": {
			"value": "640500"
		}
	}],
	"name": {
		"value": "宁夏区"
	},
	"value": {
		"value": "640000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "630000"
		}
	}, {
		"name": {
			"value": "果洛藏族"
		},
		"value": {
			"value": "632600"
		}
	}, {
		"name": {
			"value": "海北藏族"
		},
		"value": {
			"value": "632200"
		}
	}, {
		"name": {
			"value": "海东地区"
		},
		"value": {
			"value": "632100"
		}
	}, {
		"name": {
			"value": "海南藏族"
		},
		"value": {
			"value": "632500"
		}
	}, {
		"name": {
			"value": "海西蒙古"
		},
		"value": {
			"value": "632800"
		}
	}, {
		"name": {
			"value": "黄南藏族"
		},
		"value": {
			"value": "632300"
		}
	}, {
		"name": {
			"value": "西宁市"
		},
		"value": {
			"value": "630100"
		}
	}, {
		"name": {
			"value": "玉树藏族"
		},
		"value": {
			"value": "632700"
		}
	}],
	"name": {
		"value": "青海省"
	},
	"value": {
		"value": "630000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "370000"
		}
	}, {
		"name": {
			"value": "滨州市"
		},
		"value": {
			"value": "371600"
		}
	}, {
		"name": {
			"value": "德州市"
		},
		"value": {
			"value": "371400"
		}
	}, {
		"name": {
			"value": "东营市"
		},
		"value": {
			"value": "370500"
		}
	}, {
		"name": {
			"value": "菏泽市"
		},
		"value": {
			"value": "371700"
		}
	}, {
		"name": {
			"value": "济南市"
		},
		"value": {
			"value": "370100"
		}
	}, {
		"name": {
			"value": "济宁市"
		},
		"value": {
			"value": "370800"
		}
	}, {
		"name": {
			"value": "莱芜市"
		},
		"value": {
			"value": "371200"
		}
	}, {
		"name": {
			"value": "聊城市"
		},
		"value": {
			"value": "371500"
		}
	}, {
		"name": {
			"value": "临沂市"
		},
		"value": {
			"value": "371300"
		}
	}, {
		"name": {
			"value": "日照市"
		},
		"value": {
			"value": "371100"
		}
	}, {
		"name": {
			"value": "泰安市"
		},
		"value": {
			"value": "370900"
		}
	}, {
		"name": {
			"value": "威海市"
		},
		"value": {
			"value": "371000"
		}
	}, {
		"name": {
			"value": "潍坊市"
		},
		"value": {
			"value": "370700"
		}
	}, {
		"name": {
			"value": "烟台市"
		},
		"value": {
			"value": "370600"
		}
	}, {
		"name": {
			"value": "枣庄市"
		},
		"value": {
			"value": "370400"
		}
	}, {
		"name": {
			"value": "淄博市"
		},
		"value": {
			"value": "370300"
		}
	}, {
		"name": {
			"value": "青岛市"
		},
		"value": {
			"value": "370200"
		}
	}],
	"name": {
		"value": "山东省"
	},
	"value": {
		"value": "370000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "610000"
		}
	}, {
		"name": {
			"value": "安康市"
		},
		"value": {
			"value": "610900"
		}
	}, {
		"name": {
			"value": "宝鸡市"
		},
		"value": {
			"value": "610300"
		}
	}, {
		"name": {
			"value": "汉中市"
		},
		"value": {
			"value": "610700"
		}
	}, {
		"name": {
			"value": "商洛市"
		},
		"value": {
			"value": "611000"
		}
	}, {
		"name": {
			"value": "铜川市"
		},
		"value": {
			"value": "610200"
		}
	}, {
		"name": {
			"value": "渭南市"
		},
		"value": {
			"value": "610500"
		}
	}, {
		"name": {
			"value": "西安市"
		},
		"value": {
			"value": "610100"
		}
	}, {
		"name": {
			"value": "咸阳市"
		},
		"value": {
			"value": "610400"
		}
	}, {
		"name": {
			"value": "延安市"
		},
		"value": {
			"value": "610600"
		}
	}, {
		"name": {
			"value": "榆林市"
		},
		"value": {
			"value": "610800"
		}
	}],
	"name": {
		"value": "陕西省"
	},
	"value": {
		"value": "610000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "140000"
		}
	}, {
		"name": {
			"value": "长治市"
		},
		"value": {
			"value": "140400"
		}
	}, {
		"name": {
			"value": "大同市"
		},
		"value": {
			"value": "140200"
		}
	}, {
		"name": {
			"value": "晋城市"
		},
		"value": {
			"value": "140500"
		}
	}, {
		"name": {
			"value": "晋中市"
		},
		"value": {
			"value": "140700"
		}
	}, {
		"name": {
			"value": "临汾市"
		},
		"value": {
			"value": "141000"
		}
	}, {
		"name": {
			"value": "吕梁市"
		},
		"value": {
			"value": "141100"
		}
	}, {
		"name": {
			"value": "朔州市"
		},
		"value": {
			"value": "140600"
		}
	}, {
		"name": {
			"value": "太原市"
		},
		"value": {
			"value": "140100"
		}
	}, {
		"name": {
			"value": "忻州市"
		},
		"value": {
			"value": "140900"
		}
	}, {
		"name": {
			"value": "阳泉市"
		},
		"value": {
			"value": "140300"
		}
	}, {
		"name": {
			"value": "运城市"
		},
		"value": {
			"value": "140800"
		}
	}],
	"name": {
		"value": "山西省"
	},
	"value": {
		"value": "140000"
	}
}, {
	"item": [{
		"name": {
			"value": "上海市"
		},
		"value": {
			"value": "310000"
		}
	}],
	"name": {
		"value": "上海市"
	},
	"value": {
		"value": "310000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "510000"
		}
	}, {
		"name": {
			"value": "阿坝"
		},
		"value": {
			"value": "513200"
		}
	}, {
		"name": {
			"value": "巴中市"
		},
		"value": {
			"value": "511900"
		}
	}, {
		"name": {
			"value": "成都市"
		},
		"value": {
			"value": "510100"
		}
	}, {
		"name": {
			"value": "达州市"
		},
		"value": {
			"value": "511700"
		}
	}, {
		"name": {
			"value": "德阳市"
		},
		"value": {
			"value": "510600"
		}
	}, {
		"name": {
			"value": "甘孜"
		},
		"value": {
			"value": "513300"
		}
	}, {
		"name": {
			"value": "广安市"
		},
		"value": {
			"value": "511600"
		}
	}, {
		"name": {
			"value": "广元市"
		},
		"value": {
			"value": "510800"
		}
	}, {
		"name": {
			"value": "乐山市"
		},
		"value": {
			"value": "511100"
		}
	}, {
		"name": {
			"value": "凉山市"
		},
		"value": {
			"value": "513400"
		}
	}, {
		"name": {
			"value": "眉山市"
		},
		"value": {
			"value": "511400"
		}
	}, {
		"name": {
			"value": "绵阳市"
		},
		"value": {
			"value": "510700"
		}
	}, {
		"name": {
			"value": "南充市"
		},
		"value": {
			"value": "511300"
		}
	}, {
		"name": {
			"value": "内江市"
		},
		"value": {
			"value": "511000"
		}
	}, {
		"name": {
			"value": "攀枝花市"
		},
		"value": {
			"value": "510400"
		}
	}, {
		"name": {
			"value": "遂宁市"
		},
		"value": {
			"value": "510900"
		}
	}, {
		"name": {
			"value": "雅安市"
		},
		"value": {
			"value": "511800"
		}
	}, {
		"name": {
			"value": "宜宾市"
		},
		"value": {
			"value": "511500"
		}
	}, {
		"name": {
			"value": "资阳市"
		},
		"value": {
			"value": "512000"
		}
	}, {
		"name": {
			"value": "自贡市"
		},
		"value": {
			"value": "510300"
		}
	}, {
		"name": {
			"value": "泸州市"
		},
		"value": {
			"value": "510500"
		}
	}],
	"name": {
		"value": "四川省"
	},
	"value": {
		"value": "510000"
	}
}, {
	"item": [{
		"name": {
			"value": "天津市"
		},
		"value": {
			"value": "120000"
		}
	}],
	"name": {
		"value": "天津市"
	},
	"value": {
		"value": "120000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "650000"
		}
	}, {
		"name": {
			"value": "阿克苏"
		},
		"value": {
			"value": "652900"
		}
	}, {
		"name": {
			"value": "阿拉尔"
		},
		"value": {
			"value": "659002"
		}
	}, {
		"name": {
			"value": "阿勒泰"
		},
		"value": {
			"value": "654300"
		}
	}, {
		"name": {
			"value": "巴音郭楞"
		},
		"value": {
			"value": "652800"
		}
	}, {
		"name": {
			"value": "博尔塔拉"
		},
		"value": {
			"value": "652700"
		}
	}, {
		"name": {
			"value": "昌吉回族"
		},
		"value": {
			"value": "652300"
		}
	}, {
		"name": {
			"value": "哈密"
		},
		"value": {
			"value": "652200"
		}
	}, {
		"name": {
			"value": "和田"
		},
		"value": {
			"value": "653200"
		}
	}, {
		"name": {
			"value": "喀什"
		},
		"value": {
			"value": "653100"
		}
	}, {
		"name": {
			"value": "克拉玛依"
		},
		"value": {
			"value": "650200"
		}
	}, {
		"name": {
			"value": "克孜勒苏"
		},
		"value": {
			"value": "653000"
		}
	}, {
		"name": {
			"value": "石河子"
		},
		"value": {
			"value": "659001"
		}
	}, {
		"name": {
			"value": "塔城"
		},
		"value": {
			"value": "654200"
		}
	}, {
		"name": {
			"value": "图木舒克"
		},
		"value": {
			"value": "659003"
		}
	}, {
		"name": {
			"value": "吐鲁番"
		},
		"value": {
			"value": "652100"
		}
	}, {
		"name": {
			"value": "乌鲁木齐"
		},
		"value": {
			"value": "650100"
		}
	}, {
		"name": {
			"value": "五家渠"
		},
		"value": {
			"value": "659004"
		}
	}, {
		"name": {
			"value": "伊犁"
		},
		"value": {
			"value": "654000"
		}
	}],
	"name": {
		"value": "新疆区"
	},
	"value": {
		"value": "650000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "540000"
		}
	}, {
		"name": {
			"value": "阿里"
		},
		"value": {
			"value": "542500"
		}
	}, {
		"name": {
			"value": "昌都"
		},
		"value": {
			"value": "542100"
		}
	}, {
		"name": {
			"value": "拉萨"
		},
		"value": {
			"value": "540100"
		}
	}, {
		"name": {
			"value": "林芝地区"
		},
		"value": {
			"value": "542600"
		}
	}, {
		"name": {
			"value": "那曲"
		},
		"value": {
			"value": "542400"
		}
	}, {
		"name": {
			"value": "日喀则"
		},
		"value": {
			"value": "542300"
		}
	}, {
		"name": {
			"value": "山南"
		},
		"value": {
			"value": "542200"
		}
	}],
	"name": {
		"value": "西藏区"
	},
	"value": {
		"value": "540000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "530000"
		}
	}, {
		"name": {
			"value": "保山市"
		},
		"value": {
			"value": "530500"
		}
	}, {
		"name": {
			"value": "楚雄州"
		},
		"value": {
			"value": "532300"
		}
	}, {
		"name": {
			"value": "大理州"
		},
		"value": {
			"value": "532900"
		}
	}, {
		"name": {
			"value": "德宏州"
		},
		"value": {
			"value": "533100"
		}
	}, {
		"name": {
			"value": "迪庆藏族"
		},
		"value": {
			"value": "533400"
		}
	}, {
		"name": {
			"value": "红河州"
		},
		"value": {
			"value": "532500"
		}
	}, {
		"name": {
			"value": "昆明市"
		},
		"value": {
			"value": "530100"
		}
	}, {
		"name": {
			"value": "丽江市"
		},
		"value": {
			"value": "530700"
		}
	}, {
		"name": {
			"value": "临沧市"
		},
		"value": {
			"value": "530900"
		}
	}, {
		"name": {
			"value": "怒江州"
		},
		"value": {
			"value": "533300"
		}
	}, {
		"name": {
			"value": "曲靖市"
		},
		"value": {
			"value": "530300"
		}
	}, {
		"name": {
			"value": "思茅市"
		},
		"value": {
			"value": "530800"
		}
	}, {
		"name": {
			"value": "文山州"
		},
		"value": {
			"value": "532600"
		}
	}, {
		"name": {
			"value": "西双版纳"
		},
		"value": {
			"value": "532800"
		}
	}, {
		"name": {
			"value": "玉溪市"
		},
		"value": {
			"value": "530400"
		}
	}, {
		"name": {
			"value": "昭通市"
		},
		"value": {
			"value": "530600"
		}
	}],
	"name": {
		"value": "云南省"
	},
	"value": {
		"value": "530000"
	}
}, {
	"item": [{
		"name": {
			"value": "全省通用"
		},
		"value": {
			"value": "330000"
		}
	}, {
		"name": {
			"value": "杭州市"
		},
		"value": {
			"value": "330100"
		}
	}, {
		"name": {
			"value": "宁波市"
		},
		"value": {
			"value": "330200"
		}
	}, {
		"name": {
			"value": "湖州市"
		},
		"value": {
			"value": "330500"
		}
	}, {
		"name": {
			"value": "嘉兴市"
		},
		"value": {
			"value": "330400"
		}
	}, {
		"name": {
			"value": "金华市"
		},
		"value": {
			"value": "330700"
		}
	}, {
		"name": {
			"value": "丽水市"
		},
		"value": {
			"value": "331100"
		}
	}, {
		"name": {
			"value": "绍兴市"
		},
		"value": {
			"value": "330600"
		}
	}, {
		"name": {
			"value": "台州市"
		},
		"value": {
			"value": "331000"
		}
	}, {
		"name": {
			"value": "温州市"
		},
		"value": {
			"value": "330300"
		}
	}, {
		"name": {
			"value": "舟山市"
		},
		"value": {
			"value": "330900"
		}
	}, {
		"name": {
			"value": "衢州市"
		},
		"value": {
			"value": "330800"
		}
	}],
	"name": {
		"value": "浙江省"
	},
	"value": {
		"value": "330000"
	}
}];
