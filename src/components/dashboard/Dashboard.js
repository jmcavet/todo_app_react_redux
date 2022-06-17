import React, { Component } from 'react'
import Notifications from './Notifications'
import ProjectList from '../projects/ProjectList'
import Toolbar from "@material-ui/core/Toolbar";
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Navigate } from 'react-router-dom'
import FilterAccordion from './FilterAccordion';
import CreateTodo from '../todos/CreateTodo';
import Todos from '../todos/Todos';

class Dashboard extends Component {
    render() {
        const { projects, todos, auth } = this.props
        if (!auth.uid) return <Navigate to="/signin" />

        return (
            <div className="dashboard container">
                <Toolbar />
                {/* <div className="row">
                    <div className="col s12 m6">
                        <CreateTodo />
                        <Todos todos={todos} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <FilterAccordion />
                    </div>
                </div> */}
                <div className="row">
                    <FilterAccordion />
                    <CreateTodo />
                    <Todos todos={todos} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    // Our original return was an object with 'projects: state.project.projects':
    // Our rootReducer combines both 'authReducer' and 'projectReducer' in an object.
    // The 'projectReducer' is represented by the property 'project' in this object.
    // Therefore 'state.project' below represents our projectReducer. The initial state of
    // this reducer has the property 'projects', representing all projects available.
    // Hence we have 'state.project.projects' below representing all available projects
    console.log("MY STATE: ", state);
    return {
        projects: state.firestore.ordered.projects,
        todos: state.firestore.ordered.todos,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'projects', orderBy: ['createdAt', 'desc'] },
        { collection: 'todos', orderBy: ['createdAt', 'desc'] }
    ])
)(Dashboard)