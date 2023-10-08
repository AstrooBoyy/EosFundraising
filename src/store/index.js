import rootReducer from "./reducer";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer, applyMiddleware(thunk))
    // import.meta.env.VITE_APP_ENVIRONMENT === 'development'
    //     ? createStore(rootReducer,  composeEnhancers(applyMiddleware(thunk)))
    //     : createStore(rootReducer, applyMiddleware(thunk));

export default store;
