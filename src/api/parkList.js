import request from '@/utils/request'

function getComData (info) {
  const _event = {
    action: 'pull',
    comment: `获取地服公司列表`
  }
  return request({
    url: '/ground/staff/ground-service-all',
    method: 'post',
    data: {
      
    }
  }, _event)
}

export {getComData}