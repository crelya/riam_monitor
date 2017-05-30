import React, {Component} from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/configure_store'
import RIAMMonitorApp from './containers/riam_monitor_app';

const store = configureStore()
// store.subscribe(() => console.log(store.getState()))

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RIAMMonitorApp />
      </Provider>
    );
  }
}
