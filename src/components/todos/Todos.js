import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import Todo from './Todo'

const Todos = ({
    todos, setOpenTodoDialog,
    auth, tags, stateFilter
}) => {
    const authId = auth.uid

    const categoriesFiltered = stateFilter.categories
    const categoriesAreGrouped = stateFilter.categoriesAreGrouped
    const tagsAreGrouped = stateFilter.tagsAreGrouped

    const categoryIdsFiltered = Object.keys(categoriesFiltered)

    const [myTags, setMyTags] = useState(null)

    useEffect(() => {
        if (authId && tags) {
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)
            setMyTags(tagsFiltered)
        }
    }, [authId, tags])

    let todosFiltered = []

    if (categoriesAreGrouped && !tagsAreGrouped) {
        todos.sort((a, b) => (a.categoryId > b.categoryId) ? 1 : -1)
        todosFiltered = todos
    } else if (categoriesAreGrouped && tagsAreGrouped) {
        todos.sort((a, b) => (a.categoryId > b.categoryId) ? 1 : -1)

        categoryIdsFiltered.map(categoryIdFiltered => {
            const todosFilteredSingleCategory = todos.filter(todo =>
                todo.categoryId === categoryIdFiltered)
            todosFilteredSingleCategory.sort((a, b) => (a.tagId > b.tagId) ? 1 : -1)
            todosFiltered = todosFiltered.concat(todosFilteredSingleCategory)
            todosFiltered.reverse()
        })
    } else if (!categoriesAreGrouped && tagsAreGrouped) {
        todos.sort((a, b) => (a.tagId > b.tagId) ? 1 : -1)
        todosFiltered = todos
    } else {
        todos.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1)
        todosFiltered = todos
    }

    return (
        <div className="project-list section">
            {todosFiltered?.map(todo => {
                const todoTagId = todo.tagId
                const tag = myTags?.filter(tag => tag.id === todoTagId)[0]
                if (tag) {
                    const categoryId = tag.categoryId

                    return (
                        categoriesFiltered && categoryId in categoriesFiltered && categoriesFiltered[categoryId]
                            ? <Todo todo={todo} setOpenTodoDialog={setOpenTodoDialog} key={todo.id} />
                            : null
                    )
                }
            })}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
        stateFilter: state.filter,
    }
}

export default connect(mapStateToProps, null)(Todos)