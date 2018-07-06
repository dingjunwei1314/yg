/*
  request 发送前 进行日志记录的相关处理
*/
import Parse from 'parse';
import {ENV} from '../config/app'

Parse.initialize('e8b9ed3e57a3c04c56b4ec7bd82d3b47')
Parse.serverURL = 'https://col-api.mydadao.com/parse'

const ActionEvent = Parse.Object.extend('ActionEvent')


const sendLog = async (url, params = {}, log = {action: 'no message', comment: 'no message'}) => {
  const sendlog = Object.assign({}, params, log)
  let event = new ActionEvent()
  const res = await event.save({
    operate_user_id: localStorage.user_id ? localStorage.user_id : '',
    time: (new Date()).toString(),
    ip: window.returnCitySN['cip'],
    model: window.navigator.userAgent,
    env: ENV,
    api: url,
    event: sendlog
  })
  // console.log(res)
  return res
}

export default sendLog
