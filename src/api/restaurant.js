import request from '../utils/request'

export const getRestaurants = () => {
  return request({
    url: '/restaurants',
    method: 'get'
  })
}

export const getRestaurantById = (id) => {
  return request({
    url: `/restaurants/${id}`,
    method: 'get'
  })
}