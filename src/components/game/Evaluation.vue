<template>
  <v-container grid-list-xl text-xs-center>
    <!-- ***********modal******** -->
    <v-layout v-if="!game_finished" row wrap>
        <v-flex xs4>
          <v-card>
            <v-card-media height="310px" @click.stop="flipCard()">
              <div class="flipper" v-bind:class="{'flip': selected_id == question.id && fliped}" :key="question.id">
              <!--<div class="flipper" :key="question.id">-->
                <div v-if="game.collection.evaluation_type == 1" class="front">
                  <img class="front image" :src="question.url_image">
                </div>
                <div v-else class="front" style="height: 98%">
                  <p class="response-text title">{{question.description}}</p>
                </div>

                <div v-if="game.collection.evaluation_type == 1" class="back">
                  <p class="response-text title">{{question.description}}</p>
                </div>
                <div v-else class="back">
                  <img class="front image" :src="question.url_image">
                </div>
              </div>
            </v-card-media>

            <v-card-title secondary-title class="title-overriden">
              <div>
                <h4 v-if="game.collection.evaluation_type == 1" class="headline mb-0">Clique sur le texte qui correspond à l'image</h4>
                <h4 v-else class="headline mb-0">Clique sur l'image qui correspond au texte</h4>
              </div>
            </v-card-title>

          </v-card>
        </v-flex>

        <v-flex xs4>
          <h2 class="display-1 grey--text">Question {{index + 1}} / {{game.collection.cartes.length}}</h2>
          <v-icon v-if="answered_correct" flat icon color="green lighten-1">fas fa-check</v-icon>
          <v-icon v-if="answered_false" flat icon color="red lighten-1">fas fa-times</v-icon>
        </v-flex>

        <v-flex xs4>
          <div class="score">
            <p>Temps restant: {{max_temps}}s</p>
            <p v-if="!answered_correct">Tentatives restants: {{allowed}}</p>
            <p>Score obtenu: {{score}}</p>
          </div>
          <v-btn class="right" color="success" @click="next_question()" v-bind:disabled="!allow_switch_next">{{this.game.collection.cartes.length == index + 1?'Afficher mon résultat':'Question suivante'}}</v-btn>
        </v-flex>

        <v-flex xs12>
          <div class="container container-space-between">
            <div v-for="(reponse_possible, index) in reponses_p" :key="reponse_possible.id">

              <v-btn v-if="game.collection.evaluation_type == 1" depressed color="primary" @click.stop="submit(index)" v-bind:disabled="reponse_possible.disabled_as_false_answer ||
                (answered && !reponse_possible.hightlighted_as_correct_answer)">{{reponse_possible.description}}</v-btn>

              <v-card v-else>
                <img :src="reponse_possible.url_image" width="80px" @click.stop="submit(index)" v-bind:class="{'disabled_image': reponse_possible.disabled_as_false_answer ||
                (answered && !reponse_possible.hightlighted_as_correct_answer)}" />
              </v-card>

              <p class="icons">
                <v-icon v-if="reponse_possible.hightlighted_as_correct_answer" flat icon color="green lighten-1">fas fa-check</v-icon>
                <v-icon v-if="reponse_possible.disabled_as_false_answer" flat icon color="red lighten-1">fas fa-times</v-icon>
              </p>

            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-layout v-else>
        <v-flex xs4 offset-xs4>
          <h3 class="headline">L'évalutaion est terminée</h3>
          <p class="subheading">Les résultats seront affichés dans un instant</p>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
      reponse: null,
      reponses:[],
      reponses_p: [],
      question: {},
      allowed: 0,
      score: 0,
      message: '',
      max_temps: 0,
      dialog: false,
      random: 0,
      fliped: false,
      diferent: [],
      allow_switch_next: false,
      answered: false,
      answered_correct: false,
      answered_false: false,
      game_finished: false
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
    this.question = this.game.collection.cartes[this.index]
    this.allowed = this.game.collection.nb_attempts_allowed

    this.reponses.push({
      nb_attempts: 0,
      is_correct: 0,
      response_time: 0,
      carte: {
        id: this.question.id
      },
      game: {
        id: this.game.id
      }
    })

    this.reponse_possibles();

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
    is_correct(index){
      if (this.reponse.id === this.question.id) {
        this.reponses_p[index].hightlighted_as_correct_answer = true

        for(let i in this.reponses_p) {
          if(this.reponses_p[i].id == this.question.id) {
            this.reponses_p[i].hightlighted_as_correct_answer = true
          }else{
            this.reponses_p[i].disabled_as_false_answer = true
          }
        }

        this.answered = true
        this.answered_correct = true
        this.reponses[this.index].is_correct = 1
        this.score++
        this.allow_switch_next = true

      } else {
        this.reponses_p[index].disabled_as_false_answer = true
        this.oportunity_next()
      }
    },

    is_finished(){

      this.reponses[this.index].nb_attempts = this.game.collection.nb_attempts_allowed-this.allowed

      this.reponses_p = []
      if (this.game.collection.cartes.length==this.index+1) {
        clearInterval(this.time)
        this.game_finished = true
        this.$store.dispatch('sendScore', this.reponses).then(res => {
          setTimeout(() => {
            this.$router.push({name: 'score'})
          }, 3000)
        }, err => {
          console.log(err)
        })
      } else {

        //On passe à la question suivant et initialise les valeurs
        this.allow_switch_next = false
        this.answered = false
        this.answered_correct = false
        this.answered_false = false
        this.index++
        this.reponse_possibles();
        this.max_temps=this.game.collection.max_response_time
        this.allowed=this.game.collection.nb_attempts_allowed
        this.question=this.game.collection.cartes[this.index]

        this.reponses.push({
          nb_attempts: 0,
          is_correct: 0,
          response_time: 0,
          carte: {
            id: this.question.id
          },
          game: {
            id: this.game.id
          }
        })
      }
    },

    oportunity_next(){

      if(this.allowed == 0){

        if (this.game.collection.display_correct_answer==1) {
          //this.flipCard()
          for(let i in this.reponses_p) {
            if(this.reponses_p[i].id == this.question.id) {
              this.reponses_p[i].hightlighted_as_correct_answer = true
            }else{
              this.reponses_p[i].disabled_as_false_answer = true
            }
          }
        }
        this.allow_switch_next = true
        this.answered_false = true
        this.answered = true

      }
    },

    submit(index){
      if(this.reponses_p[index].disabled_as_false_answer == true || 
        this.reponses_p[index].hightlighted_as_correct_answer ||
        this.answered == true ||
        this.allowed == 0){
        return
      }
      this.reponse = this.reponses_p[index]
      this.reponses[this.index].response_time = this.game.collection.max_response_time - this.max_temps
      this.allowed --;
      this.is_correct(index)
    },

    getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },

    next_question() {
      if(this.allow_switch_next == true) {
        this.is_finished()
      }
    },

    shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
    },

    //Méthod pour selectioner les possible reponse à l'hasard et le desordener
    reponse_possibles(){

      let temp_cards = this.game.collection.cartes.slice()

      for (var i = 1; i < this.game.collection.nb_possible_answers; i++) {
        this.random = this.getRandomInt(temp_cards.length)
        if(temp_cards[this.random].id == this.game.collection.cartes[this.index].id){
          i --;
          continue
        }
        this.reponses_p.push(Object.assign(temp_cards[this.random], {disabled_as_false_answer: false, hightlighted_as_correct_answer: false}))
        temp_cards.splice(this.random, 1)
      }
      this.reponses_p.push(Object.assign(this.game.collection.cartes[this.index], {disabled_as_false_answer: false, hightlighted_as_correct_answer: false}))
      this.reponses_p = this.shuffle(this.reponses_p)

    },

    flipCard() {
      if((this.game.collection.display_correct_answer && this.answered) || this.answered_correct){
        if (this.game.collection.display_correct_answer == 0)
          return
        if(this.selected_id != this.question.id) {
          this.fliped = true
          this.selected_id = this.question.id
        }else{
          this.fliped = !this.fliped
        }
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

.title-overriden{
  padding: 5px;
}

.container-space-between {
  padding-left: 0;
  padding-right: 0;
  justify-content: space-between;
}
.disabled_image{
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}


</style>
