import { mapActions, mapState } from 'vuex';

import { ROUTES } from '@/mixins/routes';

export const toggleLike = {
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('post', ['likePost', 'unlikePost']),
    async onClickLikePost() {
      const response = await this.likePost(this._id);
      if (!response) {
        return this.$router.push({ path: ROUTES.LOGIN });
      }
      if (response.status === 200) {
        this.$emit('likedPost', { postId: this._id, user: this.user });
      }
      if (response.status === 409) {
        this.$notify({
          type: 'error',
          title: response.data.message,
        });
      }

      if (response.status === 401) {
        this.$router.push({ path: ROUTES.LOGIN });
      }
    },
    async onClickUnlikePost() {
      const response = await this.unlikePost(this._id);
      if (!response) {
        return this.$router.push({ path: ROUTES.LOGIN });
      }
      if (response.status === 200) {
        this.$emit('unlikedPost', { postId: this._id, user: this.user });
      }
      if (response.status === 409) {
        this.$notify({
          type: 'error',
          title: response.data.message,
        });
      }
    },
    isUserLiked() {
      const isUserLiked = this.likes.find(user => user._id === this.user._id);
      return Boolean(isUserLiked);
    },
  },
};