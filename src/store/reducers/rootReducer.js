import authReducer from './authReducer'
import projectReducer from './projectReducer'
import todoReducer from './todoReducer'
import tagReducer from './tagReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import categoryReducer from './categoryReducer'
import spinnerReducer from './spinnerReducer'

const rootReducer = combineReducers({
    auth: authReducer,
    project: projectReducer,
    todo: todoReducer,
    tag: tagReducer,
    categorySelected: categoryReducer,
    tagSelected: tagReducer,
    spinner: spinnerReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
})

export default rootReducer