import dashboard from './reducers/dashboard';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// This connects the reducer to the store
export default function configureStore() {
  let store = createStore(
    dashboard,
    applyMiddleware(thunk)
  )

  return store
}
