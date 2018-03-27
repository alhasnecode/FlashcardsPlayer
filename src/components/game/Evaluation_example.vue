<template>
  <section>
    <v-container grid-list-md text-xs-center>
      <!-- ***********modal******** -->
    <v-alert  type="error" :value="alert" transition="scale-transition">This is a success alert.</v-alert>
    <v-layout row justify-center>

    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">{{message}}</v-card-title>
        <v-card-text>{{score}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="dialog = false">D'accord</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  <!-- parte modal -->
      <v-layout row wrap class="header">
        <v-flex xs12>
          <!-- <h1 class="display-1">Tapez la réponse correct</h1> -->
          <div style="margin-top: 40px;">
            <!-- <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular> -->
            <div class="score">
              <p>Temps : {{max_temps}}</p>
              <p>Score : {{score}}</p>
            </div>
            <v-layout row wrap>
                <v-layout>
                  <v-flex xs12 sm12 md6 lg3 xl3>
                    <v-card>

                      <v-card-media height="300px">
                          <div class="flipper" v-bind:class="{'flip': selected_id == question.id && fliped}" :key="question.id">
                            <div class="front">
                              <img class="front image" :src="question.url_image">
                            </div>
                            <div class="back">
                              <p class="response-text title">{{question.description}}</p>
                            </div>
                          </div>
                      </v-card-media>
                    </v-card>
                  </v-flex>

                </v-layout>
            </v-layout>
          </div>
          <v-text-field v-model="reponse" @keyup.enter="submit" name="input-2" label="Reponse" class="input-group--focused fixed"></v-text-field>
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

  name: 'Evaluation',
  data () {
    return {
      selected_id: null,
      fliped: false,
      reponse: '',
      index: 0,
      question: {},
      photos: [],
      score: 0,
      dialog: false,
      message: '',
      max_temps: 0,
      afficher_response: 0,
      alert: false,
      allowed: 0
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

    this.question=this.game.collection.cartes[this.index]
    this.afficher_response=this.game.collection.display_correct_answer
    this.allowed=this.game.collection.nb_attempts_allowed

    if(this.game.collection.max_response_time>0){

      this.max_temps=this.game.collection.max_response_time

      this.time = setInterval(() => {
        if (this.max_temps>0) {
          this.max_temps=this.max_temps-1
        }else{
          clearInterval(this.time)
          this.message='Evaluation terminée pour le temps\n'+'Score:'+this.score
          this.dialog=true
          store.dispatch('sendScore')
        }
      }, 1000)

    }

  },

  methods:{
    submit (){

        if (this.reponse === this.question.description) {

          this.flipCard()

          this.index=this.index+1
          this.score=this.score+1
          this.max_temps=this.game.collection.max_response_time
          this.reponse=''
          this.alert=false

          this.interval = setInterval(() => {
            if (this.game.collection.cartes.length<this.index+1) {
              this.message='Evaluation terminée\n'+'Score:'+this.score
              this.dialog=true
              clearInterval(this.interval)
              
              store.dispatch('sendScore')
            } else {
              this.question=this.game.collection.cartes[this.index]
              clearInterval(this.interval)
            }
          }, 1000)

        } else {
          this.alert=true
          if (this.afficher_response==1) {
            this.flipCard()
          }else if (this.allowed>0) {
            this.allowed=this.allowed-1
          }else{
            this.index=this.index+1
            this.question=this.game.collection.cartes[this.index]
            this.allowed=this.game.collection.nb_attempts_allowed
          }
        }
    },

    flipCard() {
      if(this.selected_id != this.question.id) {
        this.fliped = true
        this.selected_id = this.question.id
      }else{
        this.fliped = !this.fliped
      }
    }
  },

  computed: {
    ...mapGetters({game: 'getGame'})
  }
}
</script>


<style scoped>
.score>p{
    /* justify-content: flex-end; */
    text-align: right;
    font-weight: 600;
    font-size: 24px;
}
section{
  margin : 20px;
}
.containerPartie{
  margin-left : 50px;
}
.fixed{
  position:fixed;
  z-index: 100;
  background-color: white;
  bottom: 0;
}

section{
margin : 20px;
}
.containerPartie{
margin-left : 50px;
}

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
