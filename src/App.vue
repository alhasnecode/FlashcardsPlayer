<template>
  <div id="app">

    <v-app light>
      <navbar></navbar>
      <v-container mt-5 id="main">
        <router-view ></router-view>
      </v-container>
      <footer></footer>
    </v-app>

  </div>
</template>

<script>
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export default {
  name: 'App',
    components: { Navbar, Footer }
  }
</script>

<style>
  
</style>
