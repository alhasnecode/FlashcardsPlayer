<template>
  <section>
    <v-container grid-list-md text-xs-center v-if="game != undefined">
      <v-layout row wrap class="header">
        <v-flex xs12>
          <h1 class="display-1 left">Apprentissage</h1>
          <v-btn class="right" color="success" @click="startEval()" v-bind:disabled="!allow_start">Démarrer l'évaluation maintenant</v-btn>
        </v-flex>
        <v-flex xs12>
          <p v-if="learning_countdown.max_learning_time_required" class="subheading right">Temps restant avant l'évaluation:
            <span>{{learning_countdown.hours}}</span>:
            <span>{{learning_countdown.minutes}}</span>:
            <span>{{learning_countdown.seconds}}</span>
          </p>
        </v-flex>
      </v-layout>

      <v-layout row wrap justify-center>
            <v-flex xs7 sm5 md3 lg2 xl2 v-for="carte in collection.cartes" :key="carte.id" class="cartePartie">
              <v-card>
                <v-card-media height="200px" @click.stop="flipCard(carte)" id="collection">
                    <div class="flipper" v-bind:class="{'flip': selected_id == carte.id && fliped}">
                      <div class="front">
                        <img class="front" :src="carte.url_image">
                      </div>
                      <div class="back">
                        <p class="response-text title">{{carte.description}}</p>
                        <a @click="speech(carte.description)"><i class="material-icons">volume_up</i></a>
                      </div>
                    </div>
                </v-card-media>
              </v-card>
            </v-flex>
      </v-layout>

    </v-container>
  </section>
</template>

<script>

import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from '@/store'
import Artyom from 'artyom.js';
export default {

  name: 'PlayGame',
  data () {
    return {
      selected_id: null,
      fliped: false,
      learning_countdown: {
        seconds: '00',
        minutes: '00',
        hours: '00',
        min_learning_time_required: false,
        max_learning_time_required: false,
        max_learning_time: 0,
        min_learning_time: 0
      },
      interval: null,
      allow_start: false
    }
  },

  beforeRouteEnter(to, from, next) {
    if(store.getters.getGame == null){
      next({name: 'create_game'})
    }else if(store.getters.getGame.is_finished == true){
      next({name: 'score'})
    }else{
      console.log('OK')
      next()
    }
  },

  created() {


    console.log('created')
    console.log(this.collection)
    this.learning_countdown.max_learning_time_required = this.game.collection.max_learning_time_required
    this.learning_countdown.min_learning_time_required = this.game.collection.min_learning_time_required


    if(this.learning_countdown.max_learning_time_required){
      this.max_learning_time = new Date().getTime() + (this.game.collection.max_learning_time * 1000)
    }

    if(this.learning_countdown.min_learning_time_required){
      this.min_learning_time = new Date().getTime() + (this.game.collection.min_learning_time * 1000)
    }else{
      this.allow_start = true
    }


    this.interval = setInterval(() => {



      if(this.learning_countdown.min_learning_time_required){

        let min_distance = this.min_learning_time - new Date().getTime()

        if(min_distance < 0) {
          this.allow_start = true
          if(!this.learning_countdown.max_learning_time_required){
            clearInterval(this.interval)
          }
        }

      }

      if(this.learning_countdown.max_learning_time_required){

        let max_distance = this.max_learning_time - new Date().getTime()

        if(max_distance > 0) {

          this.learning_countdown.hours = Math.floor(max_distance / (1000 * 60 * 60))
          if(this.learning_countdown.hours < 10){
            this.learning_countdown.hours = '0'+this.learning_countdown.hours
          }

          this.learning_countdown.minutes = Math.floor(max_distance % (1000 * 60 * 60) / (1000 * 60))
          if(this.learning_countdown.minutes < 10){
            this.learning_countdown.minutes = '0'+this.learning_countdown.minutes
          }

          this.learning_countdown.seconds = Math.floor(max_distance % (1000 * 60) / 1000)
          if(this.learning_countdown.seconds < 10){
            this.learning_countdown.seconds = '0'+this.learning_countdown.seconds
          }

        }else{

          clearInterval(this.interval)
          this.$router.push({name: 'game_evaluation'})

        }
      }
    }, 1000)
  },

  methods:{

    speech(nom) {
      const Jarvis = new Artyom();

      Jarvis.say(nom, {
            lang:"fr-FR"
        });
    },

      flipCard(carte) {
        if(this.selected_id != carte.id) {
          this.fliped = true
          this.selected_id = carte.id
        }else{
          this.fliped = !this.fliped
        }
      },

      startEval() {
        if(this.allow_start) {
          this.$router.push({name: 'game_evaluation'})
        }
      }

  },

  computed: {
    ...mapGetters({game: 'getGame', collection: 'getSelectedCollection'})
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



/*.flip-container, .front, .back {
  width: 320px;
  height: 480px;
}*/

/* flip speed goes here */
.flipper {
  transition: 0.6s;
  transform-style: preserve-3d;
  height: 100%;
  width: 100%;
  position: relative;
  padding: 5px;

}

/* hide back of pane during swap */
.front, .back {
  backface-visibility: hidden;
  background-color: #FAFAFA;
  position: absolute;
  top: 1%;
  left: 1%;
}

/* front pane, placed above back */
.front {
  z-index: 2;
  /* for firefox 31 */
  transform: rotateY(0deg);
  width: 98%;
  height: auto;
}

/* back, initially hidden pane */
.back {
  transform: rotateY(180deg);
  width: 98%;
  height: 98%;
}

.flipper.flip{
  transform: rotateY(180deg);
}

.response-text{
  text-align: center;
  position: absolute;
  top: 50%;
  width: 100%;
}

.big-title{
  margin-bottom: 30px;
}

.header{
  margin-bottom: 50px;
}
</style>
