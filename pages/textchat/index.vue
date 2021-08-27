<template>
  <div>
    {{ userName }}
    <input v-model="userName" type="text">
    <input v-model="roomName" type="text">
    <Skyway :userName="userName" :roomName="roomName"/>
  </div>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'; 
import Skyway from '../../components/Skyway.vue'

export default Vue.extend({
  components: {
    Skyway
  },
  data() {
    return {
      userName: '' as string | (string | null)[],
      roomName: '' as string | (string | null)[]
    }
  },
  mounted() {
    this.userName = this.$route.query.name
    this.roomName = this.$route.query.room
  },
})
</script>