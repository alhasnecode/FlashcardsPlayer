import Vue from 'vue'
import Router from 'vue-router'
import Create from '@/components/game/Create'
import Play from '@/components/game/Play'
import Evaluation from '@/components/game/Evaluation'
import Score from '@/components/game/Score'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '',
            component: Create
        },
        {
            path: '/create_game',
            component: Create,
            name: 'create_game'
        },
        {
            path: '/play_game',
            component: Play,
            name: 'play_game'
        },
        {
            path: '/eval',
            component: Evaluation,
            name: 'game_evaluation'
        },
        {
            path: '/score',
            name: 'score',
            component: Score
        },
        {
            path: '*',
            component: Create
        }
    ]
})

export default router

// router.beforeEach((to, from, next) => {
//     if (to.) {
//         // You can use store variable here to access globalError or commit mutation 
//         next("/Login")
//     } else {
//         next()
//     }
// })

