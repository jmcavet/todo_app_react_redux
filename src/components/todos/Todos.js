import React from 'react'
import { Link } from 'react-router-dom'
import Todo from './Todo';

const Todos = ({ todos }) => {
    console.log("List of todos: ", todos);
    return (
        <div className="project-list section">
            {todos && todos.map(todo => {
                return (
                    <Link to={'/todo/' + todo.id} key={todo.id}>
                        <Todo todo={todo} />
                    </Link>
                )
            })}
        </div>
    );
}

export default Todos;