<template>
  <div class="mt-12">
    <v-row id="post">
      <v-col
        cols="12"
        sm="12"
        md="1"
        lg="1"
        xl="1"
        class="pr-0 wrapper-icon d-sm-none d-md-flex"
      >
        <post-reactions
          v-if="!isLoading"
          @hanldeClickCommentBtn="hanldeClickCommentBtn"
          @likedPost="handleLikedPost"
          @unlikedPost="handleUnlikedPost"
          @savedPost="handleSavedPost"
          @unsavedPost="handleUnsavedPost"
          :postId="post._id"
          :likes="post.likes"
          :saves="post.savedBy"
          :flowers="0"
          :isUserLiked="isUserLiked"
          :isUserSaved="isUserSaved"
          :postUrl="podcastLink"
        />
      </v-col>
      <v-col cols="12" sm="12" md="7" lg="7" xl="7" class="ml-12">
        <a
          id="trigger-scroll-comments"
          style="display: none"
          href="#"
          v-scroll-to="'#comments'"
        >
          Scroll to #comment
        </a>
        <v-skeleton-loader />
        <v-boilerplate class="mx-auto mt-6" v-if="isLoading" type="image" />
        <v-boilerplate
          max-width="200"
          class="mx-auto mt-6"
          v-if="isLoading"
          style="margin: 20px !important; display: inline-block; width: 200px"
          type="list-item-avatar-two-line"
        />
        <v-boilerplate
          v-if="isLoading"
          style="display: inline-block; width: 600px"
          height="500"
          max-wdith="200"
          class="mx-auto mt-6"
          type="article"
        />
        <v-card v-else id="podcast" class="mx-auto pa-0 pa-8">
          <v-row>
            <v-col cols="3" sm="3" md="4" lg="3" xl="3">
              <v-container class="d-flex pb-7 pt-0 pr-0 pl-4">
                <v-img
                  :class="coverClasses"
                  class="cover"
                  :src="post.cover.secureURL"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  min-height="160px"
                  max-height="160px"
                  min-width="160px"
                  max-width="160px"
                  style="cursor: pointer"
                  @click="togglePlayPause"
                >
                  <div
                    class="align-self-center d-flex justify-center wrapper-play-pause-icon"
                  >
                    <v-icon v-if="!isPlaying" class="play-pause-icon" size="50">
                      {{ togglePlayPauseIcon }}
                    </v-icon>
                  </div>
                </v-img>
                <av-circle
                  ref="player"
                  @click="togglePlayPause"
                  :canv-width="210"
                  :canv-height="150"
                  :class="playerClasses"
                  :cors-anonym="corsAnonym"
                  :outline-width="1"
                  :bar-width="1"
                  :bar-length="30"
                  :progress-width="5"
                  :outline-meter-space="5"
                  :playtime="true"
                  :radius="60"
                  playtime-font="18px Monaco"
                  :audio-src="post.media.secureURL"
                />
                <span
                  style="font-size: 13px; color: grey"
                  :class="totalLengthClasses"
                >
                  {{ totalLength }}
                </span>

                <v-icon
                  @click="togglePlayPause"
                  v-if="isPlaying"
                  :class="pauseIconClasses"
                  size="28"
                  color="#0000FF"
                >
                  mdi-pause-circle-outline
                </v-icon>
                <div :class="volumeClasses" v-if="isPlaying">
                  <v-icon @click="toggleMutedVolume" class="volume-icon">
                    {{ volumeIcon }}
                  </v-icon>
                  <v-slider
                    color="#0000FF"
                    class="volume-bar"
                    v-model="currentVolume"
                    max="100"
                    min="1"
                    track-color="grey"
                    style="cursor: pointer"
                  />
                </div>
              </v-container>
            </v-col>

            <v-col cols="9" sm="9" md="7" lg="9" xl="9">
              <v-card-text class="podcast-description pl-0 pt-0">
                <v-card-title class="ml-5 headline pt-0">
                  {{ post.topic }}
                </v-card-title>
                <v-card-subtitle class="pt-1 ml-8 pl-1 pb-0">
                  <span
                    style="font-size: 13px"
                    v-for="(artist, i) in artists"
                    :key="artist._id"
                  >
                    <a style="text-decoration: none; color: #000">
                      {{ artist }}
                    </a>
                    <span style="font-size: 12px" class="mx-1 font-italic">
                      {{ isAddFt(i, artists.length) }}
                    </span>
                  </span>
                </v-card-subtitle>

                <div class="pr-3 pt-5">
                  <v-card-actions class="d-flex ml-5 pt-0">
                    <tag
                      :tagName="tag.tagName"
                      v-for="(tag, i) in post.tags"
                      :key="i"
                      postType="podcast"
                    />
                  </v-card-actions>
                  <v-spacer />
                </div>
              </v-card-text>
            </v-col>
          </v-row>

          <v-divider />
          <v-container>
            <v-row>
              <v-col
                class="pr-0 user-profile"
                cols="3"
                sm="4"
                md="4"
                lg="3"
                xl="3"
              >
                <user-social-links
                  :socialLinks="socialLinks"
                  :author="post.user"
                  :isAuthor="isAuthor"
                  @handleFollow="handleFollow"
                  @handleUnFollow="handleUnFollow"
                  :isFollowing="isFollowing"
                />
              </v-col>

              <v-col class="lyric" cols="9" sm="8" md="8" lg="9" xl="9">
                <div :class="lyricClasses">
                  <p
                    class="markdown-content"
                    v-html="$options.filters.markdown(post.description)"
                  />
                </div>
                <span
                  v-if="!isShowMore && post.description.length > 100"
                  @click="toggleShowLyrics"
                  style="font-size: 13px; color: grey; cursor: pointer"
                  class="font-italic mb-0 show-more mt-10"
                >
                  Show more
                </span>
                <span
                  v-if="isShowMore"
                  @click="toggleShowLyrics"
                  style="font-size: 13px; color: grey; cursor: pointer"
                  class="font-italic mb-0 show-more"
                >
                  Show less
                </span>
                <div class="ml-9 mt-5 d-flex justify-end">
                  <edit-delete-btns
                    v-if="isAuthor"
                    @handleDeletePost="handleDeletePost"
                    :postId="post._id"
                    :postType="post.type"
                  />
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <div class="mt-5" id="comments">
          <v-divider />
          <h1 class="mb-3 mt-8">{{ $t('Comments') }}</h1>

          <v-boilerplate style="width: 100%" v-if="isLoading" type="image" />
          <write-comment v-if="!isLoading" :postId="post._id" type="comment" />

          <div v-if="!isLoading && post.comments.length">
            <transition-group name="list">
              <comment
                transition="slide-y-transition"
                v-for="comment in post.comments"
                :key="comment._id"
                :comment="comment"
                :author="post.user"
                :postId="post._id"
                :user="user"
                @handleDeleteComment="handleDeleteComment"
              />
            </transition-group>
          </div>
          <div class="loadmore-comment-wrapper" v-if="!isLoading">
            <div
              class="d-flex justify-center mb-3"
              v-if="commentMetadata.page < commentMetadata.totalPage"
            >
              <span
                @click="handleLoadmoreComments"
                class="font-italic load-more"
              >
                ... Load more comments ...
              </span>
            </div>
            <v-text-field color="primary" v-if="isLoadmore" loading disabled />
          </div>
        </div>
      </v-col>

      <v-col
        cols="12"
        sm="12"
        md="3"
        lg="3"
        xl="3"
        class="wrapper-author-follow d-sm-none d-md-flex flex-column"
      >
        <v-boilerplate
          class="author-follow"
          style="width: 100%; padding: 5px 10px; background: #fff; margin-top: 30px !important"
          v-if="isLoading"
          type="list-item-avatar-three-line, list-item-three-line"
        />
        <author-follow-card
          v-if="!isLoading"
          class="author-follow mt-10 ml-2"
          :author="post.user"
          @handleFollow="handleFollow"
          @handleUnFollow="handleUnFollow"
          :isFollowing="isFollowing"
          :isAuthor="isAuthor"
        />

        <div
          v-if="!isLoading"
          class="d-flex flex-column justify-center align-center mt-2"
        >
          <v-hover
            v-slot:default="{ hover }"
            style="transition: 0.3s"
            v-for="(podcast, i) in otherPostsOfAuthor"
            :key="podcast._id"
          >
            <v-card
              :elevation="hover ? 10 : 3"
              :class="{ 'on-hover': hover }"
              id="audio-card"
            >
              <v-img
                src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="100px"
                style="cursor: pointer"
                @click="hanldePlayAnotherpodcast(podcast._id)"
              >
                <v-card-title
                  class="title white--text d-flex flex-column align-start pb-0 pt-2"
                >
                  <p class="mt-0 mb-0 font-italic subheading text-left">
                    {{ podcast.topic }}
                  </p>
                  <p class="caption font-weight-medium font-italic text-left">
                    {{ podcast.authors[0].name }}
                  </p>
                </v-card-title>

                <div
                  class="align-self-center d-flex justify-center mb-2 wrapper-icon"
                >
                  <v-icon
                    @click="hanldePlayAnotherpodcast(podcast._id)"
                    class="play-icon"
                    style="color: #fff"
                    size="50"
                  >
                    mdi-music-circle-outline
                  </v-icon>
                </div>
              </v-img>

              <v-card-actions
                style="padding: 25px 25px 0 15px; height: 30px"
                class="pb-1"
              >
                <v-card-text
                  class="font-italic font-weight-light pt-0"
                  style="font-size: 13px; height: 30px; margin-top: 16px !important"
                >
                  <span class="mt-2">{{ podcast.createdAt | date }}</span>
                </v-card-text>
                <v-spacer />
                <v-container class="pt-4 pl-6 pr-0 d-flex justify-end">
                  <like-btn
                    @handleLikePost="onClickLikePost"
                    @handleUnlikePost="onClickUnlikePost"
                    :isUserLiked="isUserLikedAnotherPost(i)"
                    :likes="podcast.likes.length"
                    :postId="podcast._id"
                  />
                </v-container>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { crudPost } from '@/mixins/crudPost';
import { ROUTES } from '@/mixins/routes';

export default {
  mixins: [crudPost],
  data() {
    return {
      totalLengthClasses: ['total-length', 'font-italic', 'mb-0'],
      pauseIconClasses: ['pause-icon'],
      volumeClasses: ['volume'],
      playerClasses: ['player'],
      coverClasses: ['cover'],
      corsAnonym: Boolean(true),
      lyricClasses: ['lyric-wrapper'],
      isShowMore: false,
      isPlaying: false,
      togglePlayPauseIcon: 'mdi-play-circle-outline',
      volumeIcon: 'mdi-volume-high',
      currentVolume: 100,
      maxVolume: 1.0,
      minVolume: 0.0,
      podcastLink: ROUTES.PODCAST(this._id),
    };
  },
  methods: {
    slicedTags(tags) {
      return tags.slice(0, this.maxTags);
    },
    hanldePlayAnotherpodcast(podcastId) {
      this.$router.push({ path: ROUTES.PODCAST(podcastId) });
    },
    toggleShowLyrics() {
      if (this.isShowMore) {
        this.lyricClasses.pop();
      } else {
        this.lyricClasses.push('show-lyric-wrapper');
      }
      this.isShowMore = !this.isShowMore;
    },
    togglePlayPause() {
      if (this.togglePlayPauseIcon === 'mdi-play-circle-outline') {
        this.togglePlayPauseIcon = 'mdi-pause-circle-outline';
        this.playerClasses.push('show-player');
        this.coverClasses.push('hide-cover');
        this.pauseIconClasses.push('show-opacity');
        this.volumeClasses.push('show-opacity');
        this.totalLengthClasses.push('show-opacity');
        this.isPlaying = true;
        return this.$refs.player.audio.play();
      } else {
        this.isPlaying = false;
        this.togglePlayPauseIcon = 'mdi-play-circle-outline';
        this.playerClasses.pop();
        this.coverClasses.pop();
        this.pauseIconClasses.pop();
        this.volumeClasses.pop();
        this.totalLengthClasses.pop();
        return this.$refs.player.audio.pause();
      }
    },
    isAddFt(index, dataLength) {
      return index + 1 < dataLength ? 'ft' : '';
    },
    toggleMutedVolume() {
      if (this.volumeIcon === 'mdi-volume-high') {
        this.volumeIcon = 'mdi-volume-off';
        this.currentVolume = 0;
        return (this.$refs.player.audio.volume = this.minVolume);
      } else {
        this.volumeIcon = 'mdi-volume-high';
        this.currentVolume = 50;
        return (this.$refs.player.audio.volume = this.maxVolume / 2);
      }
    },
    calProgressBar() {
      const player = this.$refs.player.audio;
      const currentTime = player.currentTime;

      this.totalLength = this.calculateTotalValue(player.duration);

      // calculate current value time
      this.currentTime = this.calculateCurrentValue(currentTime);

      this.progressBar.value = player.currentTime / player.duration;

      if (player.currentTime === player.duration) {
        this.togglePlayPauseIcon = 'mdi-play-circle-outline';
      }
    },
    calculateTotalValue(length) {
      const minutes = Math.floor(length / 60);
      const seconds_int = length - minutes * 60;
      const seconds_str = seconds_int.toString();
      const seconds = seconds_str.substr(0, 2);
      const time = `${minutes}:${seconds}`;

      return time;
    },
    calculateCurrentValue(currentTime) {
      const current_minute = parseInt(currentTime / 60) % 60;
      const current_seconds_long = currentTime % 60;
      const current_seconds = current_seconds_long.toFixed();
      const current_time = `${
        current_minute < 10 ? `0${current_minute}` : current_minute
      }:${current_seconds < 10 ? `0${current_seconds}` : current_seconds}`;

      return current_time;
    },
    handleLikedPost({ user }) {
      this.post.likes.push({ username: user.username, _id: user._id });
    },
    handleUnlikedPost({ user }) {
      this.post.likes = this.post.likes.filter(_user => _user._id !== user._id);
    },
    handleSavedPost({ user }) {
      this.post.savedBy.push({ username: user.username, _id: user._id });
    },
    handleUnsavedPost({ user }) {
      this.post.savedBy = this.post.savedBy.filter(
        _user => _user._id !== user._id,
      );
    },
  },
  watch: {
    currentVolume(newValue) {
      if (newValue === 1) this.volumeIcon = 'mdi-volume-off';
      if (newValue !== 1) this.volumeIcon = 'mdi-volume-high';
      return (this.$refs.player.audio.volume = newValue / 100);
    },
  },
  computed: {
    totalLength() {
      const duration = this.post.media.media.duration / 60;
      const splitRes = duration.toString().split('.');
      const minutes = Number(splitRes[0]);
      let seconds = Math.round(Number(splitRes[1]) * 0.6).toFixed(0);
      seconds = seconds.toString().split('.');
      seconds = seconds[0].slice(0, 2);
      return `${minutes}:${seconds}`;
    },
    artists() {
      let artists = this.post.authors.filter(
        person => person.type === 'artist',
      );
      artists = artists.map(person => person.name);
      return artists;
    },
    composers() {
      let composers = this.post.authors.filter(
        person => person.type === 'composer',
      );
      composers = composers.map(person => person.name);
      return composers;
    },
  },
  components: {},
};
</script>

<style lang="scss">
.player {
  opacity: 0;
  position: absolute;
  top: -500px;
}

.hide-cover {
  opacity: 1;
  top: -500px;
  transition: opacity 1.8s ease-in;
}
.show-player {
  opacity: 1;
  top: 26px;
  left: 21px;
  transition: opacity 1s ease-in;
}

.lyric-wrapper {
  height: 40px;
  padding-bottom: 95px;
  overflow: hidden;
}

.show-lyric-wrapper {
  height: auto;
  padding-bottom: 0;
}

.total-length {
  position: absolute;
  top: 170px;
  left: 197px;
  height: 25px;
  cursor: pointer;
  opacity: 0;
}

.pause-icon {
  position: absolute;
  top: 160px;
  left: -146px;
  height: 25px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 1.8s ease-in;
}

.volume {
  display: flex;
  width: 20%;
  position: absolute;
  top: 44%;
  left: 9%;
  width: 15%;
  display: flex;
  opacity: 0;
  transition: opacity 1.8s ease-in;

  .volume-icon {
    cursor: pointer;
    transition: opacity 1.8s ease-in;
  }
  .volume-bar {
    width: 163px;
    height: 20px;
    margin-bottom: 14px;
    color: #000;
    transition: opacity 1.8s ease-in;
  }
}

.v-slider__track-container {
  cursor: pointer;
}

.v-slider__thumb {
  cursor: pointer;
}

.show-opacity {
  opacity: 1;
  transition: opacity 1.8s ease-in;
}

// .v-application--is-ltr .v-list-item__action:first-child,
// .v-application--is-ltr .v-list-item__icon:first-child {
//   margin-right: 0 !important;
// }

.cover {
  position: relative;
  opacity: 1;
  border-radius: 50%;
  cursor: pointer;

  .wrapper-play-pause-icon {
    position: absolute;
    top: 36%;
    left: 36%;

    .play-pause-icon {
      color: #fff;
    }
  }

  canvas {
    position: absolute;
    top: 36%;
    left: 36%;
  }
}

#podcast {
  margin-top: 24px;
  padding: 16px 15px 8px 15px !important;
}

// .aplayer {
//   -webkit-box-shadow: none;
//   box-shadow: none;
//   margin: 0;

//   .aplayer-icon {
//     width: 18px;
//     height: 18px;
//   }

//   .aplayer-pic {
//     height: 250px !important;
//     width: 280px !important;

//     .aplayer-play {
//       width: 56px;
//       height: 56px;
//       border: 2px solid #fff;
//       bottom: 44%;
//       right: 44%;
//       margin: 0 -15px -15px 0;
//     }

//     .aplayer-play svg {
//       position: absolute;
//       top: 5px;
//       left: 4px;
//       height: 46px;
//       width: 55px;
//     }
//   }

//   .aplayer-info {
//     margin-left: 290px !important;

//     .aplayer-controller {
//       .aplayer-bar-wrap {
//         .aplayer-bar {
//           .aplayer-played {
//             height: 2px;
//           }
//         }
//       }
//     }

//     .aplayer-music {
//       margin-bottom: 35px;
//       height: 40px;

//       .aplayer-title {
//         font-size: 1.65rem !important;
//       }

//       .aplayer-author {
//         font-size: 1.05rem !important;
//       }
//     }
//   }
// }

// .aplayer
//   .aplayer-info
//   .aplayer-controller
//   .aplayer-time
//   .aplayer-icon.aplayer-icon-loop {
//   display: none !important;
// }

// .aplayer
//   .aplayer-info
//   .aplayer-controller
//   .aplayer-volume-wrap
//   .aplayer-volume-bar-wrap
//   .aplayer-volume-bar {
//   bottom: 4px !important;
//   right: 12px !important;
// }

audio {
  display: none;
}

#audio-card {
  height: 155px;
  width: 270px;
  margin-top: 30px;
  position: relative;

  .wrapper-icon {
    position: absolute;
    top: 70%;
    left: 6%;

    .play-icon {
      font-size: 21px !important;
    }
  }
}

.markdown-content >>> img {
  width: 100% !important;
}

::v-deep pre code:before {
  content: '' !important;
}

.markdown-content {
  line-height: 1.6;
}

::v-deep code:before {
  content: '' !important;
}

::v-deep code:after {
  content: '' !important;
}

::v-deep code {
  font-size: 13px !important;
  box-shadow: none;
  background-color: rgb(228, 224, 224, 0.8);
}

::v-deep pre code {
  display: block;
  overflow-x: auto;
  padding: 1em;
  color: #abb2bf;
  background: #282c34;
  margin: 15px 0px;
}
</style>
