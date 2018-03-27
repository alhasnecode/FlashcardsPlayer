import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'
import ls from '@/services/ls'
import persistedstate from 'vuex-persistedstate'


Vue.use(Vuex);

const initialState = {
    game: null,
    score: null,
    collections: []
};

export default new Vuex.Store({
    plugins: [persistedstate()],
    state: {
        game: null,
        score: null,
        collections: []
    },
    mutations: {
        setGame (state, g) {
            state.game = g
        },

        setFinished(state, value) {
            state.game.is_finished = value
        },

        setScore(state, value) {
            state.game.score = value
        },

        setCollections(state, arr) {
            state.collections = arr
        }
    },
    getters: {
        getGame: (state) => {
            return state.game
        },

        getScore: (state) => {
            return state.game.score
        },

        getCollections: (state) => {
            return state.collections
        },

        isFinished: (state) => {
            return state.game.is_finished
        }
    },
    actions: {

        createGame({ commit }, game) {
            let request_body = {
                collection: {
                    id: game.collection.id
                },
                pseudo: game.pseudo
            }
            return api.post('games', request_body).then((res) => {
                commit('setGame', res.data)
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.reject(err)
            })
        },

        getGame({commit}, game_id) {
            return api.get(`games/${game_id}`).then(res => {
                if(res.data.is_finished == true){
                    return Promise.reject('Cette partie est déjà terminée')
                }
                commit('setGame', res.data)
                return Promise.resolve(res)
            }).catch(err => {
                return Promise.reject(err)
            })
        },

        editScore({ commit }, value) {
            commit('setScore', value)
        },

        loadCollections({commit}) {
            return api.get('collections').then(res => {
                commit('setCollections', res.data)
                return Promise.resolve(res)
            }).catch((err) => {
                return Promise.reject(err)
            })
        },

        sendScore({commit}, game, game_id) {
            // if(game != null){
                return api.patch(`games/${game_id}/score`, {game: game}).then(res => {
                    return Promise.resolve('Bien enregistré')
                }).catch(e => {
                    return Promise.reject(e)
                })
            // }
            return Promise.reject('Aucune partie en cours')
        }


    }
})
