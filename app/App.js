import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import tourzan from './reducers';
import SceneContainer from './containers/SceneContainer';

const store = createStore(tourzan);

class App extends Component {

  render() {

    return (
      <Provider store={store}>
        <SceneContainer />
      </Provider>
    );
  }
}

export default App;
