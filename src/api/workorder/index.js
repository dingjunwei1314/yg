import request from '@/utils/request'

function getWorkStatus() {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取工单状态`
    }
    return request({
        url: '/work/order/work-status',
        method: 'post',
        data: {}
    }, _event)
}

function getWorkOrderList(url,req) {
  const _event = {
    action: 'pull',
    comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取工单列表`
  }
  return request({
    url: url,
    method: 'post',
    data: req
  }, _event)
}





export  { getWorkStatus ,getWorkOrderList}

export default {getWorkStatus , getWorkOrderList}

