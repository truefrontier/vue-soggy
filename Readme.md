# vue-soggy

## ⚠️ Renamed to [vue-soppy](https://github.com/truefrontier/vue-soppy)
I don't know about you, but I'd rather be soppy than all soggy... 😜

## What and Why?
Check out [this article on Medium](https://medium.com/@kevinkirchner/a-ready-to-try-concept-in-response-to-second-guessing-the-modern-web-6946ec4d0598) to get a better understanding why vue-soggy exists.

## How to setup

__NOTE:__ This setup assumes you're using a [vue-cli](https://cli.vuejs.org/) project with [vue-router](https://router.vuejs.org/) and [vuex](https://vuex.vuejs.org/).

```
$ vue create my-project && cd my-project/
$ npm install vue-soggy
```

---

__src/main.js__
```
import SoggyLoadbar from 'vue-soggy/components/SoggyLoadbar';
import SoggyLink from 'vue-soggy/components/SoggyLink';
Vue.component('soggy-loadbar', SoggyLoadbar);
Vue.component('soggy-link', SoggyLink);
```

- Use `<soggy-link>` to take advantage of extra functionality like preloading data on link hover. Use it like `<router-link>` and check out [the component file](https://github.com/truefrontier/vue-soggy/blob/master/components/SoggyLink.vue) for more details.
- `<soggy-loadbar>` is a tailwindcss-styled component showing the load progress of the soggy page requests.

---

__public/index.html__ (optional)
```
<script>
  window.SoggyState = <% if (NODE_ENV === 'production') { %>@json(array_merge($data, []))<% } else { %>{}<% } %>;
</script>
```

You can replace `@json(array_merge($data, []))` with whatever your framework can inject data with if you're not using [laravel-soggy](https://github.com/truefrontier/laravel-soggy)

---

__src/store/index.js__
```
import Vue from 'vue';
import Vuex from 'vuex';
import soggy from 'vue-soggy/store/modules/soggy';
import { soggyState, soggyActions, soggyMutations  } from 'vue-soggy/utils/storing';

Vue.use(Vuex);

const initialState = {
  // Add any defaults for properties you plan on passing into your app
};

export default new Vuex.Store({
  state: Object.assign(soggyState, initialState, window.SoggyState || {}),

  actions: Object.assign(soggyActions, {
    // Your custom actions
  }),

  mutations: Object.assign(soggyMutations, {
    // Your custom mutations
  }),

  modules: {
    soggy,
  },
});
```

---

__src/router/routes.json__ - Ideally, this file is auto-generated by some external script or command (check out [laravel-soggy](https://github.com/truefrontier/laravel-soggy) for the Laravel setup for vue-soggy)
```
[
  {
    name: 'app.welcome',
    path: '/',
  }
]
```

__NOTE:__ The `component` piece to your routes is dynamically generated from the `name` in [/utils/routing.js](https://github.com/truefrontier/vue-soggy/blob/master/utils/routing.js#L5). For example: the component for `app.welcome` will be `() => import('@/views/Welcome.vue')`; or for nested routes like `app.user.settings` will used the component `() => import('@/views/user/Settings.vue')`. 

---

__src/router/index.js__
```
import Vue from 'vue';
import VueRouter from 'vue-router';
import { soggyRoutes, soggyRouter } from 'vue-soggy/utils/routing';
import SoggyBus from 'vue-soggy/utils/bus';

const routes = [
  // Override (or add more) routes found in @/router/routes.json
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: soggyRoutes(routes),
});

// For when any requests return a 401 Unauthorized status
// SoggyBus.$on('unauthorized', () => {
//   router.replace({ name: 'app.login' });
// });

export default soggyRouter(router);
```


