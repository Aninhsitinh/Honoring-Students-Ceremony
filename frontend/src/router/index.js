import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Public routes
  {
    path: '/',
    component: () => import('../layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/public/HomePage.vue'),
        meta: { title: 'Vinh Danh Sinh Viên Xuất Sắc' },
      },
      {
        path: 'tin-tuc',
        name: 'Posts',
        component: () => import('../views/public/PostListPage.vue'),
        meta: { title: 'Tin Tức & Sự Kiện' },
      },
      {
        path: 'tin-tuc/:slug',
        name: 'PostDetail',
        component: () => import('../views/public/PostDetailPage.vue'),
        meta: { title: 'Chi Tiết Bài Viết' },
      },
    ],
  },

  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginPage.vue'),
    meta: { title: 'Đăng Nhập Quản Trị' },
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/admin/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'students',
        name: 'ManageStudents',
        component: () => import('../views/admin/ManageStudents.vue'),
        meta: { title: 'Quản Lý Sinh Viên' },
      },
      {
        path: 'top-scores',
        name: 'ManageTopScores',
        component: () => import('../views/admin/ManageTopScores.vue'),
        meta: { title: 'Quản Lý Điểm Cao' },
      },
      {
        path: 'posts',
        name: 'ManagePosts',
        component: () => import('../views/admin/ManagePosts.vue'),
        meta: { title: 'Quản Lý Bài Viết' },
      },
      {
        path: 'semesters',
        name: 'ManageSemesters',
        component: () => import('../views/admin/ManageSemesters.vue'),
        meta: { title: 'Quản Lý Kỳ Học' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// Navigation guard for auth
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title
    ? `${to.meta.title} | Honoring Students`
    : 'Honoring Students'

  // Check auth for admin routes
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      next({ name: 'AdminLogin' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
