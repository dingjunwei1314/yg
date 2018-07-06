/*
  这里对于 axios 进行了重新封装 统一处理数据
  params1 请求相关参数
  params2 log相关信息
*/
import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import {getToken, removeToken, getAppId} from '@/utils/appCookie'
import {PREFIX, isOpenCollection} from '@/config/app'
import sendLog from '@/utils/sendLog'
import qs from 'qs'
import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: PREFIX, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {

  if (config.type !== 'payload') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    config.data = qs.stringify(config.data, {arrayFormat: 'brackets'})
  }

  config.headers['x-incar-app-id'] = getAppId() // 让每个请求携带自定义token 请根据实际情况自行修改
  config.headers['x-incar-token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  if (isOpenCollection) {
    config.headers['x-operate-id'] = config.logId;
  }
  config.headers['x-incar-request-uri'] = config.url;
  config.headers['x-incar-request-moudle'] = 'oms';

  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器

service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.status==20 && store.state.user.message) {
      store.dispatch('changeMessage',false) 
      Message({
          type: 'error',
          message: res.message
      });
      router.push({path:'/login'})
      return Promise.reject('error')
    }else if(res.status==20){
      return Promise.reject('error')
    }else if(response.data.code == 406){
      router.push({path:'/login'})
      return Promise.reject('error')
    }else{
      return response.data
    }
    
    
  },
  error => {
    console.log('catch Error >>> ', error, '\nError url >>>', error.config.url)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

// export default service
const request = async (args, _event) => {
  if (isOpenCollection) {
    let res = await sendLog(args.url, args.data, _event)
    args['logId'] = res.id
  }
  return service(args);
} 

export default request
