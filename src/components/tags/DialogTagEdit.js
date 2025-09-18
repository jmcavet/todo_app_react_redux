import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

import { updateTagAction } from '../../store/actions/tagActions'

const DialogTagEdit = ({
    openTagDialog, setOpenTagDialog,
    tagSelected,
    updateTagAction
}) => {
    const [stateTag, setStateTag] = useState({})

    useEffect(() => {
        setStateTag(prevState => ({
            ...prevState,
            id: tagSelected.id,
            oldLabel: tagSelected.label,
            label: tagSelected.label
        }))
    }, [tagSelected])

    const handleClose = () => {
        // Close dialog window
        setOpenTagDialog(false)

        // If use enters new label but cancel/close dialog:
        // reset the label to the original one
        setStateTag(prevState => ({
            ...prevState,
            label: tagSelected.label,
        }))
    };

    const handleTagChange = (e) => {
        setStateTag(prevState => ({
            ...prevState,
            label: e.target.value,
        }))
    }

    const handleUpdate = (e) => {
        updateTagAction(stateTag)

        // Close dialog window
        setOpenTagDialog(false)
    }

    return (
        <div>
            <Dialog open={openTagDialog} onClose={handleClose}>
                <DialogTitle>Modify Tag</DialogTitle>
                <DialogContent style={{ paddingBottom: '0rem' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="label"
                        label="Tag"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={stateTag.label}
                        onChange={handleTagChange}
                    />
                    {tagSelected.error ? <p>{tagSelected.error}</p> : null}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        style={{ background: '#02951A' }}
                        endIcon={<CheckIcon fontSize='large' />}
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        tagSelected: state.tagSelected
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTagAction: (tag) => dispatch(updateTagAction(tag)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DialogTagEdit)