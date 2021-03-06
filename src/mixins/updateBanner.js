import { mapActions } from 'vuex';

export const updateBanner = {
  methods: {
    ...mapActions('user', ['signOut']),
    cropUploadSuccess(res) {
      this.oldCover = this.post.cover;
      this.newCover = res.data;
      this.isUploadBanner = false;
    },
    cropUploadFail(status) {
      if (status === 401) {
        this.signOut();
        this.$router.push({ path: '/signin' });
      }
      this.$notify({
        type: 'error',
        title: this.$t('Update banner failed'),
      });
    },
  },
};
