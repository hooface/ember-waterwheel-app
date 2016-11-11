import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('articles', function() {
    this.route('new');
  });
  this.route('article', { path: '/article/:uuid'});
});

export default Router;