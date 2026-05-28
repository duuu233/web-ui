import request from '@/utils/request'

import { getToken } from '@/utils/auth'

export function policy(data) {
  return request({
    url: `/Common/setFileUpload`,
    method: 'post',
    data
  })
}
