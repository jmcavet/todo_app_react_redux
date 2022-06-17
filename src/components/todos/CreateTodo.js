import React, { useState } from 'react'
import { connect } from 'react-redux'
import { createTodo } from '../../store/actions/todoActions'

const CreateTodo = (props) => {
    const { createTodo } = props;
    const [state, setState] = useState({ description: '' });

    const handleChange = (e) => {
        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createTodo(state)
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Create new Todo</h5>
                <div className="input-field">
                    <label htmlFor="description">Description</label>
                    <input type="text" id="description" onChange={handleChange} />
                </div>
                <div className="input-field">
                    <button className="btn lighten-1 z-depth-0">Create</button>
                </div>
            </form>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createTodo: (todo) => dispatch(createTodo(todo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTodo)