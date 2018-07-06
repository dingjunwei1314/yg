import Parse from 'parse'
import axioss from './axios'
import {ENV, isOpenCollection} from '../../config/app'


Parse.initialize("e8b9ed3e57a3c04c56b4ec7bd82d3b47");
Parse.serverURL = 'https://col-api.mydadao.com/parse';

var ActionEvent = Parse.Object.extend("ActionEvent");

export default {
    //get请求
    get (url,req,log={action:'no message',comment:'no message'}) {
        var sendlog=Object.assign({},req?req.params:{},log);
        return new Promise((resolve,reject) => {
            if (isOpenCollection) {
                var event = new ActionEvent();
                event.save({
                    operate_user_id: localStorage.user_id?localStorage.user_id:'',
                    time: (new Date()).toString(),
                    ip: returnCitySN['cip'],
                    model: navigator.userAgent,
                    env: ENV,
                    api: url,
                    event: sendlog
                }).then(({id})=>{
                    let config={};
                    config['logId']=id;
                    axioss.get(url,{params:req?req.params:{},config}).then(res => {
                        resolve(res)
                    })
                }).catch();
            } else {
                axioss.get(url,{params:req?req.params:{},log}).then(res => {
                    resolve(res)
                })
            }
        })
    },
    //post请求
    post (url,param ={},log={action:'no message',comment:'no message'},config={}) {
        var sendlog=Object.assign({},param,log);
        return new Promise((resolve,reject) => {
            if (isOpenCollection) {
                var event = new ActionEvent();
                event.save({
                    operate_user_id: localStorage.user_id?localStorage.user_id:'',
                    time: (new Date()).toString(),
                    ip: returnCitySN['cip'],
                    model: navigator.userAgent,
                    env: ENV,
                    api: url,
                    event: sendlog
                }).then(({id})=>{
                    config['logId']=id;
                    axioss.post(url,param,config).then(res => {
                        resolve(res)
                    })
                }).catch()
            } else {
                axioss.post(url,param,config).then(res => {
                    resolve(res)
                })
            }
        })
    }
}
