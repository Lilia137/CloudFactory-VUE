import Vue from 'vue'
import VueRouter from 'vue-router'
import Manager from '@/components/Manager'
import ManagerWelcome from '../components/ManagerWelcome'
import ManagerFactory from '../components/ManagerFactory'
import ManagerDevice from '../components/ManagerDevice'
import ManagerAllOrder from '../components/ManagerAllOrder'
import ManagerChooseOrder from '../components/ManagerChooseOrder'
import ManagerChoosedOrder from '../components/ManagerChoosedOrder'
import ManagerAssignOrder from '../components/ManagerAssignOrder'
import ManagerProduceOrder from '../components/ManagerProduceOrder'
import ManagerDeliveredOrder from '../components/ManagerDeliveredOrder'
import ManagerDeliverOrder from '../components/ManagerDeliverOrder'
import ManagerFinishOrder from '../components/ManagerFinishOrder'
import Login from '../components/Login'
import Register from '../components/Register'
import BidInfo from '../views/BidInfo'
import GetGoods from '../views/GetGoods'
import OrderManage from '../views/OrderManage'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/manager',
      component: Manager,
      redirect: '/managerWelcome',
      children: [
        { path: '/managerWelcome', component: ManagerWelcome },
        { path: '/managerFactory', component: ManagerFactory },
        { path: '/managerDevice', component: ManagerDevice },
        { path: '/managerAllOrder', component: ManagerAllOrder },
        { path: '/managerChooseOrder', component: ManagerChooseOrder },
        { path: '/managerChoosedOrder', component: ManagerChoosedOrder },
        { path: '/managerAssignOrder', component: ManagerAssignOrder },
        { path: '/managerProduceOrder', component: ManagerProduceOrder },
        { path: '/managerDeliverOrder', component: ManagerDeliverOrder },
        { path: '/managerDeliveredOrder', component: ManagerDeliveredOrder },
        { path: '/managerFinishOrder', component: ManagerFinishOrder }
      ]
    },
    { path: '/orderManage', component: OrderManage },
    { path: '/BidInfo', component: BidInfo },
    { path: '/GetGoods', component: GetGoods }
  ]
})
