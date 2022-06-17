import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { createProject } from '../../store/actions/projectActions'
import { Navigate, useNavigate } from 'react-router-dom'
import Toolbar from "@material-ui/core/Toolbar";

const CreateProject = (props) => {
    const { auth, createProject } = props;
    const [state, setState] = useState({ title: '', content: '' });
    const navigate = useNavigate()

    const handleChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createProject(state)

        navigate('/')
    }

    if (!auth.uid) return <Navigate to="/signin" />

    return (
        <div className="container">
            <Toolbar />
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Create new project</h5>
                <div className="input-field">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <label htmlFor="content">Project Content</label>
                    <textarea id="content" className="materialize-textarea" onChange={handleChange}></textarea>
                </div>
                <div className="input-field">
                    <button className="btn lighten-1 z-depth-0">Create</button>
                </div>
            </form>
        </div>
    );
}

/*
export class CreateProject extends Component {
    state = {
        title: '',
        content: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.createProject(this.state)
        console.log("THIS.PROPS: ", this.props)
        const navigate = useNavigate()
        navigate('/')
        // this.props.history.push('/')
    }

    render() {
        const { auth } = this.props

        if (!auth.uid) return <Navigate to="/signin" />

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create new project</h5>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Project Content</label>
                        <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    </div>
                    <div className="input-field">
                        <button className="btn lighten-1 z-depth-0">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}
*/

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createProject: (project) => dispatch(createProject(project))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateProject)