import { createRouter, createWebHistory } from 'vue-router'
import { i18n } from '../i18n'

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
        meta: { title: 'nav.home' },
      },
      {
        path: 'news-and-events',
        name: 'Posts',
        component: () => import('../views/public/PostListPage.vue'),
        meta: { title: 'post.news_events' },
      },
      {
        path: 'news-and-events/:slug',
        name: 'PostDetail',
        component: () => import('../views/public/PostDetailPage.vue'),
        meta: { title: 'post.detail' },
      },
    ],
  },

  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/LoginPage.vue'),
    meta: { title: 'admin.login' },
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
        meta: { title: 'admin.dashboard' },
      },
      {
        path: 'students',
        name: 'ManageStudents',
        component: () => import('../views/admin/ManageStudents.vue'),
        meta: { title: 'admin.manage_students' },
      },
      {
        path: 'top-scores',
        name: 'ManageTopScores',
        component: () => import('../views/admin/ManageTopScores.vue'),
        meta: { title: 'admin.manage_scores' },
      },
      {
        path: 'posts',
        name: 'ManagePosts',
        component: () => import('../views/admin/ManagePosts.vue'),
        meta: { title: 'admin.manage_posts' },
      },
      {
        path: 'semesters',
        name: 'ManageSemesters',
        component: () => import('../views/admin/ManageSemesters.vue'),
        meta: { title: 'admin.manage_semesters' },
      },
      {
        path: 'subjects',
        name: 'ManageSubjects',
        component: () => import('../views/admin/ManageSubjects.vue'),
        meta: { title: 'admin.manage_subjects' },
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
  document.title = to.meta.title
    ? `${i18n.global.t(to.meta.title)} | Greenwich Honoring Students`
    : 'Greenwich Honoring Students'

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
