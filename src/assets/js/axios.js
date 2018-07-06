import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import router from '../../router'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
import store from "../../store"
import { getToken, removeToken, getAppId } from '@/utils/appCookie'
import {PREFIX, SUB_PREFIX, isOpenCollection, NEW_PREFIX, OMS_VERSION} from '@/config/app'
import { VERSION } from 'parse';

Vue.use(ElementUI, {size: 'small'})
// Vue.use(ElementUI)

//axios,请求全局拦截器。post全局方法改变为formdata

function transformRequest (data) {
    return qs.stringify(data, { arrayFormat: 'brackets' })
}

// 创建axios实例
const service = axios.create({
    baseURL: PREFIX, // api的base_url
    timeout: 15000 // 请求超时时间
})

service.interceptors.request.use(function (config) {
    //axios,请求全局拦截器。post全局方法改变为formdata    
    if (config.type!='payload') {
        config.headers['Content-Type']='application/x-www-form-urlencoded;charset=utf-8'
        config.data=transformRequest(config.data)
    }



    if (config.serveType === 1) {
        config.headers['Content-Type']='application/json;charset=utf-8'
        config.baseURL = NEW_PREFIX
        config.headers['x-app-id'] = getAppId()  
        if (getToken()) {
            config.headers['x-token'] = getToken()
        }
        config.headers['x-module'] = config.module  
        config.headers['x-version'] = OMS_VERSION
        if (isOpenCollection) {
            if(config.method == 'get'){
                config.headers['x-operate-id'] = config.config.logId
             }else {
                config.headers['x-operate-id'] = config.logId
             }
        }  
        config.headers['x-timestamps'] = new Date().valueOf()
        if (config.args) {
            config.data = config.args
        }
    } else {
        config.headers['x-incar-app-id'] = getAppId()
        if (getToken()) {
            config.headers['x-incar-token'] = getToken()
        }
        config.headers['x-incar-request-uri'] = config.url
        config.headers['x-incar-request-moudle'] = 'oms'
        if (isOpenCollection) {
            if(config.method == 'get'){
                config.headers['x-operate-id'] = config.config.logId
             }else {
                config.headers['x-operate-id'] = config.logId
             }
        }
    }

    
    
    

    if (config.platformType && config.platformType == 1) {
        config.baseURL = PREFIX
        config.headers['x-incar-request-moudle'] = 'oms'
    } else if (config.platformType && config.platformType == 2) {
        config.baseURL = SUB_PREFIX
        config.headers['x-incar-request-moudle'] = 'buss'
    }
    return config
}, function (err) {
  return Promise.reject(err)
})

//axios,相应全局拦截器，处理数据接口没有权限
service.interceptors.response.use(function (response) {
  // token 已过期，重定向到登录页面
  //TODO 操作log记录
  if (response.data.status==20 && store.state.user.message) {
    store.dispatch('changeMessage',false)
    ElementUI.Message({
        type: 'error',
        message: response.data.message
    })
    router.push({path:'/login'})
    return Promise.reject('error')
  }else if(response.data.status==20){
    return Promise.reject('error')
  }else if(response.data.code == 406){
    router.push({path:'/login'})
    return Promise.reject('error')
  }else{
    return response
  }
}, function (error) {
  console.log(error)
})

export default service
