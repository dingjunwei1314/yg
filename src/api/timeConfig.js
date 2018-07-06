import request from '@/utils/request'

function timeConfig (config) {
  const _event = {
    action: 'push',
    comment: `修改时间配置`
  }
  return request({
    url: '/work/abnormal/config/edit',
    method: 'post',
    data: config
  }, _event)
};

function getTimeConfig (id) {
  const _event = {
    action: 'pull',
    comment: `获取时间配置`
  }
  return request({
    url: '/work/abnormal/config/view',
    method: 'post',
    data: {id}
  }, _event)
};


export {timeConfig,getTimeConfig}