<template>
  <div v-if="!isLoading" class="mt-10">
    <div class="top-border" />
    <v-card flat tile class="lighten-1 text-center">
      <v-card-text>
        <v-btn v-for="icon in links" :key="icon.name" class="mx-4" icon>
          <v-icon
            :color="icon.color"
            @click="handleClickLink(icon.url)"
            size="24px"
          >
            {{ icon.name }}
          </v-icon>
        </v-btn>
      </v-card-text>
      <div class="d-flex justify-center pt-3">
        <v-card-text
          class="pt-0 signature"
          style="width: 45%; line-height: 1.2"
        >
          "{{ $t("Believe in yourself, don't compare to anyone else!") }}"
        </v-card-text>
      </div>
      <div class="d-flex justify-center pb-3">
        <strong style="font-size: 12px;">CodersX Founder</strong>
      </div>
      <v-divider />

      <v-card-text>
        © {{ new Date().getFullYear() }} —
        <strong style="color: red">CodersX Forum</strong>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      links: [
        {
          name: 'mdi-facebook',
          url: 'https://www.facebook.com/codersx/',
          color: 'blue',
        },
        {
          name: 'mdi-instagram',
          url: 'https://www.instagram.com/codersxcommunity/',
          color: '#833AB4',
        },
        {
          name: 'mdi-youtube',
          url: 'https://www.youtube.com/channel/UCwczk9A3ITHTZT6W_9nalqg',
          color: 'red',
        },
        {
          name: 'mdi-newspaper',
          url: 'https://coders-x.com/',
          color: 'green',
        },

        {
          name: 'mdi-school',
          url: 'https://school.coders-x.com/',
          color: 'blue',
        },
      ],
    };
  },
  methods: {
    handleClickLink(url) {
      return window.open(url, '_blank');
    },
  },
  computed: {
    ...mapState('utils', ['isLoading', 'isLoadingAPI']),
  },
};
</script>

<style scoped>
.top-border {
  height: 3px;
  background: red;
}

@import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
.signature {
  font-family: 'Indie Flower', cursive;
  font-size: 28px;
}
</style>
