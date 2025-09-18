import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import {
    Box, Button, Checkbox, FormGroup, Dialog, DialogActions, DialogContent,
    DialogTitle, FormControlLabel
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'

import CategoryChipFilter from '../categories/CategoryChipFilter'
import { filterCategories, groupCategories, groupTags } from '../../store/actions/filterActions'

const ModalFilter = ({
    setModalFilterOpen, modalFilterOpen,
    auth, todos, tags, categories, stateFilter,
    filterCategories, groupCategories, groupTags
}) => {
    const authId = auth.uid
    const [allChecked, setAllChecked] = useState(true)
    const [categoryChecked, setCategoryChecked] = useState(false)
    const [tagChecked, setTagChecked] = useState(false)

    // Initialize todos, categories, and tags belonging to the user
    const [myTodos, setMyTodos] = useState(null)
    const [myTags, setMyTags] = useState(null)
    const [myCategories, setMyCategories] = useState(null)

    useEffect(() => {
        // Whenever user clicks on Category Chips, update the 'All' checkbox depending on results:
        // If all are 'active', set to checked
        // If at least 1 is not active, set to unchecked
        if (stateFilter.categories) {
            const allAreTrue = Object.values(stateFilter.categories).every(
                value => value === true
            )
            if (allAreTrue) setAllChecked(true)
            else setAllChecked(false)
        }
    }, [stateFilter.categories])

    useEffect(() => {
        if (authId && todos && categories && tags) {
            // Get only documents belonging to the user
            const todosFiltered = todos.filter(todo => todo.authorId === authId)
            const categoriesFiltered = categories.filter(category => category.authorId === authId)
            const tagsFiltered = tags.filter(tag => tag.authorId === authId)

            setMyTodos(todosFiltered)
            setMyCategories(categoriesFiltered)
            setMyTags(tagsFiltered)
        }
    }, [authId, todos, categories, tags, stateFilter.categories])

    const getTodosCategories = () => {
        const uniqueTagIds = [...new Set(myTodos?.map(todo => todo.tagId))]
        const todosTags = myTags?.filter(tag => uniqueTagIds.includes(tag.id))
        const todosCategoryIds = todosTags?.map(todosTag => todosTag.categoryId)
        const uniqueCategoryIds = [...new Set(todosCategoryIds)]
        const todosCategories = myCategories?.filter(category => uniqueCategoryIds.includes(category.id))

        return todosCategories
    }

    const todosCategories = getTodosCategories()

    const handleClose = () => setModalFilterOpen(false)
    const handleApply = () => setModalFilterOpen(false)

    const handleChangeAll = () => {
        setAllChecked(!allChecked)
        const updatedValues = {}
        Object.keys(stateFilter.categories).map(key => {
            return updatedValues[key] = !allChecked
        })
        filterCategories(updatedValues)
    }

    const handleChangeGroupByCategory = () => {
        groupCategories(!categoryChecked)
        setCategoryChecked(!categoryChecked)
    }

    const handleChangeGroupByTag = () => {
        groupTags(!tagChecked)
        setTagChecked(!tagChecked)
    }

    if (todosCategories && todosCategories.length > 0) {

        return (
            <div>
                <Dialog open={modalFilterOpen} onClose={handleClose}>
                    <DialogTitle>Filter mode</DialogTitle>
                    <DialogContent>
                        <Box display="flex" justifyContent="right">
                            <FormGroup>
                                <FormControlLabel
                                    label="All"
                                    control={
                                        <Checkbox
                                            checked={allChecked}
                                            onChange={handleChangeAll}
                                        />
                                    }
                                />
                            </FormGroup>
                        </Box>

                        <Box display="flex" justifyContent="center" style={{ marginTop: '.5rem' }}>
                            <Box sx={{
                                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly',
                                columnGap: '.8rem', rowGap: '1.2rem'
                            }}>
                                {todosCategories?.map((category, index) => {
                                    let isSelected = false
                                    if (stateFilter.categories) {
                                        if (category.id in stateFilter.categories) {
                                            isSelected = stateFilter.categories[category.id]
                                        }
                                    }
                                    return (
                                        <CategoryChipFilter
                                            category={category}
                                            isSelected={isSelected}
                                            key={category.id} />
                                    )
                                })}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                            <FormGroup style={{ display: 'flex', flexDirection: 'row' }}>
                                <FormControlLabel
                                    label="Group by category"
                                    control={
                                        <Checkbox
                                            checked={stateFilter.categoriesAreGrouped}
                                            onChange={handleChangeGroupByCategory}
                                        />
                                    }
                                />
                                <FormControlLabel
                                    label="Group by tag"
                                    control={
                                        <Checkbox
                                            checked={stateFilter.tagsAreGrouped}
                                            onChange={handleChangeGroupByTag}
                                        />
                                    }
                                />
                            </FormGroup>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            style={{ background: '#02951A' }}
                            endIcon={<CheckIcon fontSize='large' />}
                            onClick={handleApply}
                        >
                            Apply
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        todos: state.firestore.ordered.todos,
        tags: state.firestore.ordered.tags,
        categories: state.firestore.ordered.categories,
        stateFilter: state.filter,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterCategories: (payload) => dispatch(filterCategories(payload)),
        groupCategories: (payload) => dispatch(groupCategories(payload)),
        groupTags: (payload) => dispatch(groupTags(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalFilter)
