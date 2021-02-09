import Vue from 'vue'
import VueRouter from 'vue-router'
// Components
// import Index from '@/pages/Index.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    hashbang: false,
    /*
    routes: [
        {
            path: '',
            name: 'Index',
            component: Index
        }
    ]*/
})