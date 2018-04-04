<template>
  <v-container grid-list-md text-xs-center>
    <!--<h1>Vous avez fini votre partie : avec {{score.final_score}} points !</h1></br>

    <v-expansion-panel focusable>
    <v-expansion-panel-content>

      <div slot="header"><h2>Détails du score</h2></div>
      <v-card>
        <v-card-text class="grey lighten-3">-->

        <!-- Tableau des scores du joueur -->
        <!--<v-layout row wrap>
          <v-flex xs12 xl6 offset-xl3>
            <table class="table is-striped">
              <thead>
                <tr>
                  <th>Photos</th>
                  <th>Distance (m)</th>
                  <th>Temps (s)</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, index) in score.rows_result">
                  <td>{{index + 1}}</td>
                  <td>{{s.distance}}</td>
                  <td>{{s.nb_seconds}}</td>
                  <td>{{s.score}}</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Score total</td>
                  <td>{{score.final_score}}</td>
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>


        </v-card-text>
      </v-card>
    </v-expansion-panel-content>

    <v-expansion-panel-content>
      <div slot="header"><h2>Meilleurs scores des parties à {{partie.nb_photos}} images</h2></div>
      <v-card>
        <v-card-text class="grey lighten-3">
        <v-layout row wrap>
           <v-flex xs12 sm12 md12 lg12 xl12>
            <table class="table is-striped">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Pseudo</th>
                  <th>Nombre de points</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(scored, index) in scoresDetails.slice(0,10)" :key="scored.id">
                  <td>{{index+1}}</td>
                  <td>{{scored.player_username}}</td>
                  <td>{{scored.score}}</td>
                </tr>
              </tbody>
            </table>
          </v-flex>
        </v-layout>

        </v-card-text>
      </v-card>

    </v-expansion-panel-content>
  </v-expansion-panel>
    <router-link to="/" flat color="dark grey"  class="btn">Nouvelle partie</router-link>-->

    <v-layout>
      
      <v-flex xs4 offset-xs4>
        
        <h3 class="headline">{{pseudo}}, voici le résulat de ton évaluation : </h3>
      </v-flex>

    </v-layout>
          <table class="table">
        <tr> 
          <td>
            Carte 
            </td>
          <td>
            Nombres de tentatives
          </td>
          <td>Temps
          </td>
          <td>
            Réponse
            </td>
        </tr>
      <score-element v-for="unScore in scores" :unScore="unScore"/>
      <tr>
        <td><td>
        <td> <b> Score Final : </b></td>
        <td><b>{{score}} / {{scores.length}}</b></td>
      </tr>
      

      </table>
      

      <router-link :to="{ path: '*'}" append><v-btn class="right" color="success" >Retour à l'accueil</v-btn>
      </router-link>

  </v-container>

</template>

<script>
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ScoreElement from "./ScoreElement.vue"
import{mapGetters} from 'vuex'
import store from '@/store'
import Vue from 'vue'

export default {
  name: 'Score',
  components: {ScoreElement},
  data () {
    return {
      scores: [],
      pseudo:'' ,
      score: null  
    }
  },
  methods: {

  },
  created(){
    this.scores = store.state.game.responses ;
    this.pseudo = store.state.game.pseudo;
    this.score = store.state.game.score;
  

       
  },

  computed: {
    ...mapGetters({game: 'getGame'})
  }
}
</script>


<style scoped>

.btn {
  margin-top : 50px;
  padding :0 15px;
}
#lateral {
  height: 400px;
}

#lateral .speed-dial, #lateral .btn--floating {
    position: absolute;
}
h3{
  text-align:center;
  margin-top: 2em;
}
</style>
