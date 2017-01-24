const config = ($stateProvider) => {
  $stateProvider
    .state('blog', {
      url: '/',
      template: '<blog></blog>'
    });
};

config.$inject = ['$stateProvider'];

export default config;
