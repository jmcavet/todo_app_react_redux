import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'

import authReducer from './authReducer'
import todoReducer from './todoReducer'
import tagReducer from './tagReducer'
import categoryReducer from './categoryReducer'
import filterReducer from './filterReducer'
import spinnerReducer from './spinnerReducer'
import drawerReducer from './drawerReducer'
import favoriteReducer from './favoriteReducer'
import settingsReducer from './settingsReducer'
import recipeTagReducer from './recipeTagReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    todo: todoReducer,
    categorySelected: categoryReducer,
    favorite: favoriteReducer,
    tagSelected: tagReducer,
    filter: filterReducer,
    spinner: spinnerReducer,
    drawer: drawerReducer,
    settings: settingsReducer,
    recipeTagReducer: recipeTagReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer