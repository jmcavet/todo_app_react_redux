import React from 'react'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Navigate } from 'react-router-dom'
import Toolbar from "@material-ui/core/Toolbar";

const ProjectDetails = (props) => {
    const { id } = useParams();
    const { projects, auth } = props;
    console.log("Auth: ", auth)
    if (!auth.uid) return <Navigate to="/signin" />

    if (projects) {
        const { title, content, authorFirstName, authorLastName, createdAt } = projects[id];
        return (
            <div className="container section project-details">
                <Toolbar />
                <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{title}</span>
                        <p>{content}</p>
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by {authorFirstName} {authorLastName}</div>
                        <div>{moment(createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="container center text-warning">
                <p>Loading project...</p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        projects: state.firestore.data.projects,
        auth: state.firebase.auth
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'projects' }
    ])
)(ProjectDetails);