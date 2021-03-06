export const bookDescription = {
  methods: {
    isAddComma(index, dataLength) {
      return index + 1 < dataLength ? ', ' : '';
    },
    isStar(index) {
      const bookStars = this.post ? this.post.book.stars : this.book.stars;
      if (index <= bookStars) return '#FDD835';
      else return '';
    },
  },
  data() {
    return {
      minSlice: 2,
      maxSlice: 2,
      finishStatus: ['finished', 'hoàn thành', 'đã hoàn thành'],
    };
  },
  computed: {
    calBookStatusColor() {
      const bookStatus = this.post ? this.post.book.status : this.book.status;
      if (!this.finishStatus.includes(bookStatus.toLowerCase()))
        return { color: 'red' };
      else return { color: 'green' };
    },
    calBookYearColor() {
      const oldYearCss = {
        border: '1px solid #D50000 !important',
        backgroundColor: '#EF9A9A !important',
      };
      const thisYearCss = {
        border: '1px solid #90d2a3 !important',
        backgroundColor: '#C5E1A5 !important',
      };

      if (this.post.book.year < new Date().getYear() + 1900) {
        return oldYearCss;
      } else {
        return thisYearCss;
      }
    },
    slicedAuthors() {
      const bookAuthors = this.post ? this.post.authors : this.authors;
      return bookAuthors.slice(0, this.minSlice);
    },
    slicedGenres() {
      const bookGenres = this.post ? this.post.book.genres : this.book.genres;
      return bookGenres.slice(0, this.maxSlice);
    },
    slicedSuggestedBy() {
      const bookSuggestedBy = this.post
        ? this.post.book.suggestedBy
        : this.book.suggestedBy;
      return bookSuggestedBy.slice(0, this.minSlice);
    },
  },
};
