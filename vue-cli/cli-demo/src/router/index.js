import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/components/Home.vue'
import Search from '@/components/Search.vue'

export const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:"/",
            redirect:{
                path:"/home"
            }
        },
        {
            path:"/home",
            component:Home,
        },
        {
            path:"/search",
            component:Search,
        },
    ]
})