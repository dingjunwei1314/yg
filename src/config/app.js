// 项目公用配置项文件
// 全局常量
const win = window
const loc = win.location
const port = loc.port
const host = loc.host
const OMS_VERSION = '2.4'
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'


// 初始变量
let APP_IS_LOCAL = false
let isOpenCollection = false
let PREFIX = 'https://oms-api.mydadao.com'
let SUB_PREFIX = 'https://buss-api.mydadao.com'
let NEW_PREFIX = 'https://gateway-inner.mydadao.com'
let DOWN_URL = 'https://oms-api.mydadao.com'
let picUrl = 'http://online-incar.bj.bcebos.com/'

const SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV
if (SUFFIX) { // 开发或测试
    PREFIX = 'https://oms-api' + '-' + SUFFIX + '.mydadao.com'
    SUB_PREFIX = 'https://buss-api' + '-' + SUFFIX + '.mydadao.com'
    NEW_PREFIX = 'https://gateway-inner'+ '-' + SUFFIX +'.mydadao.com'
    DOWN_URL = 'https://oms-api' + '-' + SUFFIX + '.mydadao.com'
    picUrl = 'http://testincar.bj.bcebos.com/'
        // IS_SEND_LOG = false
}
let APP_TOKEN_KEY = 'x-incar-token'
let USER_ID_KEY = 'userid'
let APP_ID_KEY = 'x-incar-app-id'
// top level hostname
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for env
// let ENV = 'dev'
let ENV = 'pro'
// let ENV = 'test'·
if (port) {
  APP_IS_LOCAL = true
}

export { APP_IS_LOCAL, TOP_LEVEL_HOST, PREFIX, APP_TOKEN_KEY, APP_ID_KEY, USER_ID_KEY ,DOWN_URL, picUrl, ENV, SUB_PREFIX, isOpenCollection, NEW_PREFIX, OMS_VERSION }

