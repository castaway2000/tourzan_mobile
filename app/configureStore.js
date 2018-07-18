// import root from './reducers/rootReducer';
import reducers from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// This connects the reducer to the store
export default function configureStore() {
  let store = createStore(
    reducers,
    applyMiddleware(thunk)
  );

  return store
}
