import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux'

import { Grid, Box, TextField, Button, List, IconButton, InputAdornment } from '@mui/material'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { createRecipe, updateRecipe } from '../../store/actions/recipeActions'
import MyListItem from './MyListItem'
import CheckboxesTags from './CheckboxesTags'

const style = {
    container: {
        marginTop: '1rem',
        backgroundColor: 'white'
    },
    recipeTitleBox: {
        marginTop: '.5rem',
    },
    recipeStepsBox: {
        marginTop: '0rem',
    },
    dragdop: {
        display: 'flex',
        flexDirection: 'column'
    },
    recipeIngredientsBox: {
        marginTop: '0rem',
    },
    recipeTagsBox: {
        marginTop: '0rem',
    },
    recipeAddTagBox: {
        marginTop: '0rem',
    },
    recipeSourceBox: {
        marginTop: '0rem',
    },
    recipeAddBtnBox: {
        display: 'flex',
        marginTop: '0rem',
        justifyContent: 'end',
    }
}

const RecipeForm = ({
    openRecipeForm, recipeTitle = '', recipeSteps = '', recipeIngredients = '', recipeTags = '', recipeSource = '', btnType, recipeId,
    auth, stateRecipeTags,
    createRecipe, updateRecipe
}) => {
    const [state, setState] = useState({})
    const [title, setTitle] = useState(recipeTitle ? recipeTitle : '')
    const [steps, setSteps] = useState(recipeSteps ? recipeSteps : [])
    const [step, setStep] = useState('')
    const [isTitleEmpty, setIsTitleEmpty] = useState(true)

    const [ingredients, setIngredients] = useState(recipeIngredients ? recipeIngredients : [])
    const [ingredient, setIngredient] = useState('')
    const navigate = useNavigate()

    const authId = auth.uid

    // If this component is used in the RecipeView, you want to initially set the state to
    // the properties that are already displayed on the UI
    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            "title": recipeTitle,
            "steps": recipeSteps,
            "ingredients": recipeIngredients,
            "tags": recipeTags,
            "source": recipeSource
        }))
    }, [])


    // 'recipeTags' is an array of recipe tags' ids, e.g. ['HzSAxbcJzXMpLIQqRScu', 'J8WndLlgxLpAaqbaTt3o']
    // 'stateRecipeTags' is an array of recipe tags objects. Example of the first element of this array:
    //      {id: ..., name: tag6, authorId: ..., etc.}


    // Get only documents belonging to the user, then filter data
    const thisRecipeTags = recipeTags ?
        stateRecipeTags?.filter(myRecipeTag => {
            return myRecipeTag.authorId === authId && recipeTags.includes(myRecipeTag.id)
        }) :
        []

    const [tags, setTags] = useState(thisRecipeTags)
    const [source, setSource] = useState(recipeSource ? recipeSource : '')

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            "steps": steps,
        }))
    }, [steps])

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            "ingredients": ingredients,
        }))
    }, [ingredients])

    useEffect(() => {
        setState(prevState => ({
            ...prevState,
            "tags": tags,
        }))
    }, [tags])

    const handleChangeTitle = (e) => {
        const titleChange = e.target.value
        if (!titleChange) setIsTitleEmpty(true)
        else setIsTitleEmpty(false)

        setTitle(titleChange)

        setState(prevState => ({
            ...prevState,
            [e.target.id]: titleChange,
        }))
    }

    const handleChangeStep = (e) => setStep(e.target.value)
    const handleChangeIngredient = (e) => setIngredient(e.target.value)

    const handleAddStep = () => {
        setSteps(prevArray => [...prevArray, step])

        // Clear Textfield
        setStep('')
    }

    const handleAddIngredient = () => {
        setIngredients(prevArray => [...prevArray, ingredient])

        // Clear Textfield
        setIngredient('')
    }

    const handleChangeSource = (e) => {
        setSource(e.target.value)

        setState(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const handleClickAddRecipe = () => {
        const stateTags = state.tags?.map(tag => tag.id)
        state.tags = stateTags
        createRecipe(state)

        // Clear all text fields
        setTitle('')
        setStep('')
        setIngredient('')
        setSource('')
        setSteps([])
        setIngredients([])
        setTags([])
    }

    const handleClickUpdateRecipe = () => {
        // Pass the recipe ID so that it can update it later
        state.myId = recipeId

        const stateTags = state.tags?.map(tag => tag.id)
        state.tags = stateTags
        updateRecipe(state)

        // Redirect to the recipes page
        navigate("/recipes")
    }

    const btn = {
        name: btnType === 'add' ? 'Add Recipe' : 'Update Recipe',
        icon: btnType === 'add' ? <AddCircleOutlineIcon /> : <CheckCircleOutlineIcon />,
        onClickMethod: btnType === 'add' ? handleClickAddRecipe : handleClickUpdateRecipe
    }

    // Function to update list on drop
    const handleDrop = (listType, droppedItem) => {
        // Ignore drop outside the droppable container
        if (!droppedItem.destination) return

        let updatedList = null
        if (listType === "steps") updatedList = [...steps]
        if (listType === "ingredients") updatedList = [...ingredients]

        // Remove the dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
        // Add the dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem)
        // Update the State
        if (listType === "steps") setSteps(updatedList)
        if (listType === "ingredients") setIngredients(updatedList)
    }

    if (!openRecipeForm) return null

    return (
        <div className="row">
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} style={style.container}>
                <Grid item xs={12} sm={12} md={12}>
                    <Box component="form" noValidate autoComplete="off" style={style.recipeTitleBox}>
                        <TextField
                            id="title"
                            label="Title"
                            variant="outlined"
                            value={title}
                            autoComplete='off'
                            fullWidth
                            onChange={handleChangeTitle}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Box style={style.recipeIngredientsBox}>
                        <TextField
                            id="ingredients"
                            label="Ingredients"
                            value={ingredient}
                            autoComplete='off'
                            fullWidth
                            onChange={handleChangeIngredient}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") handleAddIngredient()
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            color="primary"
                                            onClick={handleAddIngredient}
                                        >
                                            <AddCircleOutlineIcon fontSize='medium' />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <List dense={true}>
                            <DragDropContext onDragEnd={e => handleDrop("ingredients", e)}>
                                <Droppable droppableId="list-container-ingredients">
                                    {(provided) => (
                                        <div
                                            style={style.dragdrop}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {ingredients?.map((ingredient, index) => (
                                                <Draggable key={ingredient} draggableId={ingredient} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                        >
                                                            <MyListItem
                                                                variable={ingredient}
                                                                variables={ingredients}
                                                                setVariables={setIngredients}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    <Box style={style.recipeTagsBox}>
                        <CheckboxesTags tags={tags} setTags={setTags} />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Box style={style.recipeStepsBox}>
                        <TextField
                            id="steps"
                            label="Steps"
                            value={step}
                            autoComplete='off'
                            fullWidth
                            onChange={handleChangeStep}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") handleAddStep()
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            color="primary"
                                            onClick={handleAddStep}
                                        >
                                            <AddCircleOutlineIcon fontSize='medium' />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <List dense={true}>
                            <DragDropContext onDragEnd={e => handleDrop("steps", e)}>
                                <Droppable droppableId="list-container">
                                    {(provided) => (
                                        <div
                                            style={style.dragdrop}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {steps?.map((step, index) => (
                                                <Draggable key={step} draggableId={step} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.dragHandleProps}
                                                            {...provided.draggableProps}
                                                        >
                                                            <MyListItem
                                                                variable={step}
                                                                variables={steps}
                                                                setVariables={setSteps}
                                                                index={index}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                    <Box style={style.recipeSourceBox}>
                        <TextField
                            id="source"
                            label="Source (Blog, Youtube, etc.)"
                            value={source}
                            autoComplete='off'
                            fullWidth
                            onChange={handleChangeSource}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={12} md={12}>
                    <Box style={style.recipeAddBtnBox}>
                        <Button
                            variant="contained"
                            endIcon={btn.icon}
                            onClick={btn.onClickMethod}
                            disabled={isTitleEmpty}
                        >
                            {btn.name}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        stateRecipeTags: state.firestore.ordered.recipeTags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createRecipe: (recipe) => dispatch(createRecipe(recipe)),
        updateRecipe: (recipe) => dispatch(updateRecipe(recipe)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecipeForm)