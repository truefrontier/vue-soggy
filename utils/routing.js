import routesJSON from '@/router/routes.json';
import store from '@/store';
import SoggyBus from './bus';

export const soggyRoutes = (args = []) => {
  let beforeEnters = {};
  let paths = {};
  let components = {};
  let extendRoutes = [];
  if (Array.isArray(args)) {
    extendRoutes = args;
  } else {
    beforeEnters = args.beforeEnters || {};
    paths = args.paths || {};
    components = args.components || {};
  }
  extendRoutes.forEach((route) => {
    if (route.hasOwnProperty('beforeEnter')) beforeEnters[route.name] = route.beforeEnter;
    if (route.hasOwnProperty('component')) components[route.name] = route.component;
    if (route.hasOwnProperty('path')) paths[route.name] = route.path;
  });

  return routesJSON.map((route) => {
    if (beforeEnters.hasOwnProperty(route.name)) route.beforeEnter = beforeEnters[route.name];
    if (paths.hasOwnProperty(route.name)) {
      route.path = paths[route.name];
    }
    if (components.hasOwnProperty(route.name)) {
      // Manually set component
      route.component = components[route.name];
    } else {
      // Dynamically set component
      let parts = route.name.split('.');
      // Remove the first part (i.e. 'app' from 'app.home')
      parts.shift();
      // Capitalize first letter of component
      let component = parts.pop();
      parts.push(component.charAt(0).toUpperCase() + component.slice(1));
      route.component = () => import(`@/views/${parts.join('/')}.vue`);
    }
    return route;
  });
};

export const soggyRouter = (router) => {
  router.beforeEach((to, from, next) => {
    store.dispatch('soggy/getData', { path: to.path });
    next();
  });

  SoggyBus.$on('redirect', (to) => {
    router.push(to);
  });

  return router;
};
