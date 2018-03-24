angular.module('dog-system')
  .service('httpRequestInterceptor', ['$q', '$cookies',
    function ($q, $cookies) {
      return {
        request: function (config) {
          if (config.url.indexOf('https://viacep.com') == - 1) {
            config.headers['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');
          }
          return config;
        },

        responseError: function (rejection) {
          if (rejection.status === 401) {
          }

          return $q.reject(rejection);
        }
      };
    }]);