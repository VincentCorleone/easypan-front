import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      children: [
        {
          path: '/dashboard/files',
          name: "file",
          component: () => import('../views/Files.vue'),
        },
        {
          path: '/dashboard/share',
          name: "share",
          component: () => import('../views/Share.vue'),
        },
        {
          path: '/dashboard/del',
          name: "del",
          component: () => import('../views/Del.vue'),
        }
      ]
    },
  ]
})

export default router
