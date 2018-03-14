<template>
  <section>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap class="header">
        <v-flex xs12>
          <h1 class="display-1">L'évaluation va commencer dans un instant</h1>
          <div style="margin-top: 40px;">
            <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script>

import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '@/store'

export default {

  name: 'PlayGame',
  data () {
    return {
      
    }
  },

  beforeRouteEnter(to, from, next) {
    if(store.getters.getGame == null){
      next({name: 'create_game'})
    }else if(store.getters.getGame.is_finished == true){
      next({name: 'score'})
    }else{
      next()
    }
  },

  created() {
    
  },

  methods:{

  },

  computed: {
    ...mapGetters({game: 'getGame'})
  }
}
</script>


<style scoped>
section{
  margin : 20px;
}
.containerPartie{
  margin-left : 50px;
}

</style>
