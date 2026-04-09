import request from '../utils/request'

export const getDishesByRestaurantId = (restaurantId) => {
  return request({
    url: `/dishes/restaurant/${restaurantId}`,
    method: 'get'
  })
}

export const getDishById = (id) => {
  return request({
    url: `/dishes/${id}`,
    method: 'get'
  })
}