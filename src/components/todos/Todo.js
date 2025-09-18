import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'

import { Grid, Paper, Chip, IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import { selectTodoAction, deleteTodoAction } from '../../store/actions/todoActions'
import { reverseColor, rgbCode } from '../../helper/color'

const Todo = ({
    todo, setOpenTodoDialog,
    auth, todos, tags, categories,
    selectTodoAction, deleteTodoAction
}) => {
    const authId = auth.uid
    const [myTag, setMyTag] = useState(null)
    const [myCategory, setMyCategory] = useState(null)

    useEffect(() => {
        const tagFiltered = tags ? tags.filter(tag => {
            return (
                tag.authorId === authId &&
                tag.id === todo.tagId
            )
        })[0] : null

        setMyTag(tagFiltered)

        if (myTag) {
            const categoryFiltered = categories ? categories.filter(category => {
                return (
                    category.authorId === authId &&
                    category.id === myTag.categoryId
                )
            })[0] : { color: (255, 0, 0) }

            setMyCategory(categoryFiltered)
        }
    }, [authId, tags, categories, todo.tagId, myTag])

    const todoText = useRef()

    const deleteTodo = () => {
        todoText.current.style.setProperty('text-decoration', 'line-through')
        todoText.current.style.setProperty('font-size', '1rem')
        deleteTodoAction(todo.id)
    }
    const handleEditTodoClick = (e, todoKey) => {
        const todoClicked = todos.filter((todo) => todo.id === todoKey)[0]

        selectTodoAction({
            id: todoKey,
            label: todoClicked.label,
            color: todoClicked.color,
        })

        setOpenTodoDialog(true)
    }

    if (!myTag || !myCategory) return <div>Loading...</div>

    const myStyle = {
        paper: {
            background: `${rgbCode(myCategory?.color)}`,
            color: `${reverseColor(myCategory?.color)}`,
            margin: "auto", paddingLeft: 10, paddingRight: 10,
            display: "flex", alignItems: "center",
            marginTop: 10,
        },
        chip: {
            background: 'white',
            color: `${rgbCode(myCategory?.color)}`,
            fontSize: '.8rem',
            border: `.1rem ${reverseColor(myCategory?.color)} solid`,
            marginLeft: "auto"
        },
        span: {
            fontSize: "1.4rem",
            marginLeft: '1rem'
        },
        iconBtn: {
            marginLeft: '0rem',
            color: reverseColor(myCategory?.color)
        }
    }

    return (
        <Grid xs={12} item>
            <Paper
                elevation={4}
                style={myStyle.paper}
            >
                <span style={myStyle.span} ref={todoText}>{todo.label}</span>
                <Chip
                    label={myTag?.label}
                    style={myStyle.chip}
                />
                <IconButton
                    style={myStyle.iconBtn}
                    aria-label="Edit"
                    onClick={e => handleEditTodoClick(e, todo.id)}
                >
                    <EditIcon fontSize="medium" />
                </IconButton>
                <IconButton
                    style={myStyle.iconBtn}
                    aria-label="Delete"
                    onClick={deleteTodo}
                >
                    <DeleteIcon fontSize="medium" />
                </IconButton>
            </Paper>
        </Grid >
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        todos: state.firestore.ordered.todos,
        tags: state.firestore.ordered.tags,
        categories: state.firestore.ordered.categories,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectTodoAction: (payload) => dispatch(selectTodoAction(payload)),
        deleteTodoAction: (todoId) => dispatch(deleteTodoAction(todoId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Todo)