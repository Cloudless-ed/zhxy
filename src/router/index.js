import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginUu from '../views/uu/LoginUu.vue'
import IndexUu from '../views/uu/IndexUu.vue'
import LoginEm from '../views/em/LoginEm.vue'
import IndexEm from '../views/em/IndexEm.vue'
import LoginEr from '../views/er/LoginEr.vue'
import IndexEr from '../views/er/IndexEr.vue'
import authority from './authority.js'
import student from './student.js'
import educational from './educational.js'
import library from './library.js'

Vue.use(VueRouter)

const routes = [
    // uu
    {
        path: '/loginUu',
        component: LoginUu
    },
    {
        path: '/indexUu',
        component: IndexUu,
        redirect: '/party',
        children: [
            ...authority
        ]
    },
    // em
    {
        path: '/loginEm',
        component: LoginEm
    },
    {
        path: '/indexEm',
        component: IndexEm,
        redirect: '/career',
        children: [
            ...student,
            ...educational
        ]
    },
    //er
    {
        path: '/loginEr',
        component: LoginEr
    },
    {
        path: '/indexEr',
        component: IndexEr,
        redirect: '/exercise',
        children: [
            ...library
        ]
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router