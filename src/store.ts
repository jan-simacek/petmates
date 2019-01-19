import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer, initialState } from './reducers';

const middleware = [thunk];

const devtools = process.env.NODE_ENV === 'test'
  ? (x: any) => x /* eslint-disable no-underscore-dangle */
  : (window as any).__REDUX_DEVTOOLS_EXTENSION__
      && (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    devtools
  )
);

export default store;