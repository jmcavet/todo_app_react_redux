import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import MealItem from './MealItem'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import { createMeal, updateMeal } from '../../store/actions/mealActions'

const MealDialog = (
    {
        open, setOpen, mealDate, mealType, mealText, mealId, dialogType,
        createMeal, updateMeal
    }
) => {
    const [state, setState] = useState({})
    const [myMeals, setMyMeals] = useState([])
    const [myMealText, setMyMealText] = useState(mealText)

    useEffect(() => {
        setMyMealText(mealText)
    }, [mealText])

    const handleClose = () => setOpen(false)

    const handleChangeMeal = (e) => {
        setMyMealText(e.target.value)

        if (mealId) {
            setState(prevState => ({
                ...prevState,
                label: e.target.value,
                mealType,
                mealDate: mealDate,
                id: mealId
            }))
        } else {
            setState(prevState => ({
                ...prevState,
                label: e.target.value,
                mealType,
                mealDate: mealDate,
            }))
        }
    }

    const handleAddOrUpdateMeal = (e) => {
        e.preventDefault()

        if (dialogType === 'apply') createMeal(state)
        else updateMeal(state)

        setMyMeals([...myMeals, myMealText])
        setOpen(false)
        setMyMealText('')
    }

    return (
        <Dialog open={open} onClose={handleClose} onKeyUp={(e) => {
            if (e.key === 'Enter') handleAddOrUpdateMeal(e)
        }}>
            <DialogTitle>Add a new meal</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense" id="label" label="Meal" type="text"
                    fullWidth variant="standard"
                    autoComplete='off'
                    value={myMealText}
                    onChange={handleChangeMeal}
                />
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    endIcon={
                        dialogType === 'apply' ?
                            <CheckIcon fontSize='large' /> :
                            <EditIcon fontSize='large' />
                    }
                    onClick={handleAddOrUpdateMeal}
                >
                    {dialogType === 'apply' ? 'Apply' : 'Update'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        meals: state.firestore.ordered.meals,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createMeal: (meal) => dispatch(createMeal(meal)),
        updateMeal: (meal) => dispatch(updateMeal(meal))
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'meals', orderBy: ['createdAt', 'asc'] },
    ])
)(MealDialog)