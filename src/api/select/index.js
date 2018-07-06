import request from '@/utils/request'

function getEnery () {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取车辆类型`
    }
    return request({
        url: '/work/order/energy-type',
        method: 'post',
        data: {}
    }, _event)
}


function getAllCityList() {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取所有城市`
    }
    return request({
        url: '/city/city/all',
        method: 'post',
        data: {}
    }, _event)
}

function getCityList(role_id) {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取所有城市`
    }
    return request({
        url: '/city/city/all',
        method: 'post',
        data: {role_id}
    }, _event)
}

function getAllAccount() {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取系统所有成员`
    }
    return request({
        url: '/access/account/all',
        method: 'post',
        data: {}
    }, _event)
}

function getAllWorkOrderType() {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取系统所有工单类型`
    }
    return request({
        url: '/ground/staff/order-type-all',
        method: 'post',
        data: {}
    }, _event)
}

function getGroundCompanyList(req) {
    const _event = {
        action: 'pull',
        comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取系统所有地服供应商`
    }
    return request({
        url: '/ground/staff/ground-service-all',
        method: 'post',
        data: req
    }, _event)
}

function getWorkDistributeType() {
  const _event = {
    action: 'pull',
    comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取系统全部派单方式`
  }
  return request({
    url: '/work/order/work-distribute-type',
    method: 'post',
    data: {}
  }, _event)
}



function getStaffList(req) {
  const _event = {
    action: 'pull',
    comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取系统所有地服人员`
  }
  return request({
    url: '/ground/staff/ground-user-all',
    method: 'post',
    data: {}
  }, _event)
}   

function getDriverLevel(req) {
    const _event = {
      action: 'pull',
      comment: `用户 ${JSON.parse(localStorage._MyDaDao_user_data).role_name} 获取准驾车型`
    }
    return request({
      url: '/ground/staff/driver-level',
      method: 'post',
      data: {}
    }, _event)
  }


export {getEnery,getCityList,getAllAccount,getAllWorkOrderType,getGroundCompanyList,getWorkDistributeType,getStaffList,getDriverLevel,getAllCityList}
export  default {getEnery,getCityList,getAllAccount,getAllWorkOrderType,getGroundCompanyList,getWorkDistributeType,getStaffList,getDriverLevel,getAllCityList}
