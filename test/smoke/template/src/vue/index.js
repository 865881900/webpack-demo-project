import Vue from 'vue';
import './index.css';

new Vue({
  el: '#app',
  data: {
    message: 'hello vUE',
  },
  render(h) {
    return h('div', {
      class: 'vue-class',
    }, '你好21');
  },
});
