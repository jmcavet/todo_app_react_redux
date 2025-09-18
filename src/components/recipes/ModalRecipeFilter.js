import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, Checkbox, FormGroup
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check';

import RecipeTagChips from './RecipeTagChips'
import { filterRecipeTags } from '../../store/actions/recipeActions'

const ModalRecipeFilter = ({
    setModalFilterOpen, modalFilterOpen,
    recipeTagReducer,
    filterRecipeTags
}) => {
    const [allChecked, setAllChecked] = useState(false)

    useEffect(() => {
        // Whenever user clicks on a recipe chip, update the 'All' checkbox depending on results:
        // If all are 'active', set to checked
        // If at least 1 is not active, set to unchecked
        if (recipeTagReducer.filtered) {
            const allAreTrue = Object.values(recipeTagReducer.filtered).every(value => value === 'active')

            if (allAreTrue) setAllChecked(true)
            else setAllChecked(false)
        }
    }, [recipeTagReducer.filtered])

    const handleClose = () => setModalFilterOpen(false)
    const handleApply = () => setModalFilterOpen(false)

    const handleChangeAll = () => {
        setAllChecked(!allChecked)

        Object.keys(recipeTagReducer.filtered).map(key => {
            filterRecipeTags({
                recipeTagkey: [key],
                status: allChecked ? 'inactive' : 'active'
            })
        })
    }

    return (
        <Dialog open={modalFilterOpen} onClose={handleClose} fullWidth>
            <DialogTitle style={{ display: 'flex', justifyContent: 'space-around' }}>
                <p>Recipe Filter</p>
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
            </DialogTitle>
            <DialogContent>
                <Box ><RecipeTagChips /></Box>
            </DialogContent>
            <DialogActions>
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
    )
}

const mapStateToProps = (state) => {
    return {
        recipeTagReducer: state.recipeTagReducer,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        filterRecipeTags: (payload) => dispatch(filterRecipeTags(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalRecipeFilter)
