// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import Vuetify from 'vuetify'
import ('../node_modules/vuetify/dist/vuetify.min.css')	
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
