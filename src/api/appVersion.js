import request from '@/utils/request'
//获取版本管理详情
export function getAppVersionDetail(params) {
  return request({
    url: '/AppVersion/getAppVersionDetail',
    method: 'get',
    params: params
  })
}
//获取版本管理列表
export function getAppVersionList(params) {
  return request({
    url: '/AppVersion/getAppVersionList',
    method: 'get',
    params: params
  })
}
//删除版本管理
export function setAppVersionDelete(data) {
  return request({
    url: '/AppVersion/setAppVersionDelete',
    method: 'post',
    data: data
  })
}
//编辑添加版本管理
export function setAppVersionEdit(data) {
  return request({
    url: '/AppVersion/setAppVersionEdit',
    method: 'post',
    data: data
  })
}
//禁用启用版本管理
export function setAppVersionVerify(data) {
  return request({
    url: '/AppVersion/setAppVersionVerify',
    method: 'post',
    data: data
  })
}
