<template>
  <v-container grid-list-xl text-xs-center>
    <v-alert  type="error" :value="alert" transition="scale-transition">This is a success alert.</v-alert>
    <!-- ***********modal******** -->
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
    <v-layout row wrap>
      <v-flex xs12>
        <div class="score">
          <p>Temps : {{max_temps}}</p>
          <p>Score : {{score}}</p>
        </div>
      </v-flex>
      <!-- <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular> -->
        <v-flex xs6>
          <v-card>
            <v-card-media height="310px">
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
        <v-flex xs6>
          <div class="container" v-for="response_p in reponses_p" :key="response_p ">
            <v-btn depressed color="primary" @click.stop="reponse=response_p , submit()">{{response_p}}</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
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
      index: 0,
      reponse: '',
      reponses:[],
      reponses_p: [],
      question: {},
      allowed: 0,
      score: 0,
      message: '',
      max_temps: 0,
      dialog: false,
      alert: false,
      random: 0,
      fliped: false,
      diferent: []
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
    let data=[]

    this.question=this.game.collection.cartes[this.index]
    this.allowed=this.game.collection.nb_attempts_allowed

    data[this.index]={"nb_attempts":0, "is_correct":0, "response_time":0, "carte_id": this.index, "game_id": this.game.id}
    this.reponses.push(data[this.index])

    this.reponse_posibles();

    if(this.game.collection.max_response_time>0){

      this.max_temps=this.game.collection.max_response_time

      this.time = setInterval(() => {

        if (this.max_temps>0) {
          this.max_temps--
        }else{
          this.is_finished()
        }
      }, 1000)

    }
  },

  methods:{
    is_correct(){
      if (this.reponse === this.question.description) {
        this.reponses[this.index].is_correct = 1
        this.score++
        this.alert=false
        this.flipCard()

        this.is_finished()

      } else {
        this.alert=true
        this.show_response()
        this.oportunity_next()
      }
    },

    is_finished(){
      let data = []
      if (this.game.collection.cartes.length==this.index+1) {
        this.message='Evaluation terminée\n'+'Score:'+this.score
        this.dialog=true
        clearInterval(this.time)
        this.game.responses=this.reponses
        store.dispatch('sendScore', this.game, this.game.id)
      } else {
        this.reponses[this.index].nb_attempts = this.game.collection.nb_attempts_allowed-this.allowed

        //On passe à la question suivant et initialise les valeurs
        this.max_temps=this.game.collection.max_response_time
        this.allowed=this.game.collection.nb_attempts_allowed
        this.reponses_p.length=0;
        this.index++
        this.reponse_posibles();
        this.question=this.game.collection.cartes[this.index]

        data[this.index]={"nb_attempts":0, "is_correct":0, "response_time":0, "carte_id": this.index, "game_id": this.game.id}
        this.reponses.push(data[this.index])
      }
    },

    show_response(){
      if (this.game.collection.display_correct_answer==1) {
        this.flipCard()
      }
    },

    oportunity_next(){
      if (this.allowed>1) {
        this.allowed--
      }else{
        this.is_finished()
      }
    },

    submit(){
      this.reponses[this.index].response_time=this.max_temps
      this.is_correct()
    },

    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },

//     is_diferent(){
//       var arr = []; // Arreglo para llenar
//       var cantidadNumeros = 5; // Cantidad de números en el arreglo
//       var hasta = 10; // Máximo valor de los números en el arreglo
//
//       function llenarAleatorios(a){
//           var v = Math.floor(Math.random() * hasta);
//           if(!a.some(function(e){return e == v})){
//               /**
//                * Si no se encuentra el valor aleatorio en el arreglo
//                * se pushea el valor.
//                */
//               a.push(v);
//             }
//           }
// /**
//  * Bucle para llenar el arreglo con la cantidad que necesites
//  */
//         while(arr.length < cantidadNumeros && cantidadNumeros < hasta){
//             llenarAleatorios(arr);
//         }
//     },

    //Méthod pour selectioner les possible reponse à l'hasard et le desordener
    reponse_posibles(){

      let temp_cards = this.game.collection.cartes;

      for (var i = 1; i < this.game.collection.nb_possible_answers; i++) {
        this.random = this.getRandomInt(temp_cards.length)
        this.reponses_p.push(temp_cards[this.random].description)
        temp_cards.splice(this.random, 1)
      }

      this.reponses_p.push(this.game.collection.cartes[this.index].description)
      this.reponses_p = this.reponses_p.sort(function() {return Math.random() - 0.5});
      console.log(this.reponses_p);
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
.container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
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
