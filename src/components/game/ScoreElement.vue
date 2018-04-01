
<template>
<tr>
    <td>
      {{unScore.carte.id}}
      </td>
  <td> 
      {{unScore.nb_attempts}} 
 </td>
                    
<td>{{unScore.response_time}} s</td>
                
<td v-if="unScore.is_correct = 1"><i class="material-icons">thumb_up</i> Juste</td>
<td v-else> <i class="material-icons">thumb_down</i> Faux</td>
    
    </tr>

</template>

<script>
import store from '@/store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
export default {
  name: "score-element",
  props : ['unScore'],
  data() {
    return {
      cartes: {}
    };
  },
 
  created() {
      this.cartes=store.state.game.collection.cartes;
      console.log(this.cartes)
      
  },
  methods: {
   
}
}
</script>

<style>
</style>