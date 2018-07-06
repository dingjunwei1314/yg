import request from '@/utils/request'
import { getUserId } from '@/utils/appCookie'

export function getInfo () {
  const _event = {
    action: 'pull',
    comment: `用户 ${getUserId()} 获取用户权限`
  }
  return request({
    url: '/perm/role-perm',
    method: 'post',
    data: {
      'user_id': getUserId()
    }
  }, _event)
}

