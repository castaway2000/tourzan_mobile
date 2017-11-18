// import root from './reducers/rootReducer';
import map from './reducers/map';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// This connects the reducer to the store
export default function configureStore() {
  let store = createStore(
    map,
    applyMiddleware(thunk)
  )

  return store
}
