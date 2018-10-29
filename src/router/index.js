import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '../views/GoodList.vue'
const Cart =()=>import('../views/cart')
const Address=()=>import('../views/Address.vue')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    },
    {
      path:'/address',
      name:Address,
      component:Address
    }
  ]
})
