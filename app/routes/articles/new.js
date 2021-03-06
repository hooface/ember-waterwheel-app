import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { inject: {service} } = Ember;

/**
 * A route for creating a new Article.
 */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  session: service(),

  model(params) {
    let record = this.store.createRecord('article', params);

    // Initialize field defaults
    record.set('body', {
      summary: '',
      value: '',
      format: 'basic_html'
    });

    record.set('status', 1);
    const currentUser = this.get('session').get('currentUser');
    record.set('uid', this.get('store').peekRecord('user', currentUser.uuid));

    return record;
  },

  setupController(controller /*, model*/) {
    this._super(...arguments);

    // Side-load all tags so we can autocomplete based on them
    controller.set('tags', this.store.findAll('tag'));

    // @todo - un-hardcode these
    controller.set('text_formats', [
      {value: 'basic_html', label: 'Basic HTML'},
      {value: 'plain_text', label: 'Plain Text'},
      {value: 'invalid!', label: 'Invalid!'}
    ]);
  },

  actions: {
    willTransition() {
      // Roll the model back to match its previous state if the user navigates away
      this._super(...arguments);
      const record = this.controller.get('model');
      record.rollbackAttributes();
    },

    save() {
      let record = this.controller.get('model');
      record.save()
        .then(() => this.transitionTo('articles'));
    },

    cancel() {
      window.history.back();
    }
  }
});
