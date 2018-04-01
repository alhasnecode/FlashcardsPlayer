<template>
     <v-container grid-list-md text-xs-center>
        <v-layout row wrap v-if="collections != undefined">
          <v-flex xs12 sm12 md6 lg3 xl3 v-for="collection in collections" :key="collection.id" class="containerPartie">
            <v-layout>
              <v-flex xs12>
                <v-card>
                  <v-card-title primary-title>
                    <div>
                      <h3 class="headline mb-0">{{collection.libelle}}</h3>
                    </div>
                  </v-card-title>

                  <v-card-media height="300px">
                    <img :src="collection.image" :alt="collection.libelle">
                  </v-card-media>

                  <v-card-actions>
                    <v-btn flat large color="secondary" @click.stop="setCollection(collection)" id="collection">Jouer</v-btn>
                  </v-card-actions>

                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
          <h1 v-if="collections.length == 0">Aucune collection disponible. Reviens plus tard</h1>
        </v-layout>
        <v-dialog v-model="modal" max-width="500px">
            <v-card>
                <v-card-title>
                    <h3 v-if="game.collection != null">Apprentisage de la collection : {{game.collection.libelle}}</h3><br>
                </v-card-title>
                <v-card-title v-show="alertCreation">
                    <v-alert color="error" icon="warning" value="true" dismissible v-model="alertCreation">
                        Vous devez saisir un pseudo avant de commencer l'apprentisage
                    </v-alert>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent>
                        <v-text-field label="Saisir ici votre pseudo avant de commencer" v-model="game.pseudo" required></v-text-field>
                        <!--<v-select :items="choix" label="Nombre de photos" item-value="text" v-model="nbImages" required></v-select>-->
                        <v-btn @click.stop="createGame">Commencer</v-btn>
                        <v-btn @click.stop="clear">Annuler</v-btn>
                    </form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
	name: 'Create',
	data () {
		return {
            modal: false,
            erreur: '',
            alertCreation: false,
            game: {
                collection: null,
                pseudo: ''
            }
		}
	},

    created(){
        this.$store.dispatch('loadCollections').then(res => {}, err => {
            console.log(err)
        })
    },

	methods:{
        clear () {
            this.modal = false
            this.game.pseudo = ''
            this.game.collection = null
        },

        setCollection(collection) {
            this.game.collection = collection
            this.modal = true
        },

        createGame(){
            if(this.game.collection !== null && this.game.pseudo !== ''){

                this.$store.dispatch('createGame', this.game).then((res) => {
                    this.$router.push({name: 'play_game'})
                }).catch((err) => {
                    console.log('Failed to create the game session')
                })

            }else{
                this.modal = false
                this.alertCreation = true
            }
            
        }
    },
    computed:{
        ...mapGetters({collections: 'getCollections'})
    }
}
</script>


<style scoped>
    #serie{
        width: 100%;
    }
    .vue2leaflet-map{
      position:relative;
    }
    .containerPartie{
        margin-left : 50px;
    }
</style>
