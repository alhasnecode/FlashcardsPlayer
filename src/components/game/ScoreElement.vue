
<template>
<tr>
    <td>
      
       <img class="front image" :src="unScore.carte.url_image" width="120" height="80">
       <br>
       <b>{{unScore.carte.description}}</b>

      </td>
  <td> 
      {{unScore.nb_attempts}} 
 </td>
                    
<td>{{unScore.response_time}} s</td>
                
<td v-if="unScore.is_correct == 1"><i class="material-icons">thumb_up</i> Juste</td>
<!-- <td v-else> <i class="material-icons">thumb_down</i> Faux</td> -->
<td v-if="unScore.is_correct == 0"><i class="material-icons">thumb_down</i> Faux</td>
    
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

    };
  },
 
  created() {

  console.log("score2 : ")
  console.log(this.unScore.carte)      
  },
  methods: {
   
}
}
</script>

<style>
</style>