import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import { Box, Chip } from '@mui/material'
import EditSharpIcon from '@mui/icons-material/EditSharp'

import { reverseColor, rgbCode } from '../../helper/color'
import { selectCategory, setCategoryId } from '../../store/actions/categoryActions'
import MySnackBar from '../layout/MySnackBar'

const Categories = ({
    categories, setOpenDialog,
    categorySelected, tagSelected,
    selectCategory, setCategoryId
}) => {
    const [dialogMessage, setDialogMessage] = useState({ text: '', severity: '' })
    const [actionOccured, setActionOccured] = useState(false)
    const [openWarningDialog, setOpenWarningDialog] = useState(actionOccured)

    useEffect(() => {
        setDialogMessage(prevState => ({
            ...prevState,
            text: categorySelected.createdMessage,
            severity: 'success'
        }))
        setActionOccured(categorySelected.createdMessage === null ? false : true)
    }, [categorySelected.createdMessage])

    useEffect(() => {
        setDialogMessage(prevState => ({
            ...prevState,
            text: categorySelected.updatedMessage,
            severity: 'success'
        }))
        setActionOccured(categorySelected.updatedMessage === null ? false : true)
    }, [categorySelected.updatedMessage])

    useEffect(() => {
        setDialogMessage(prevState => ({
            ...prevState,
            text: categorySelected.error,
            severity: 'warning'
        }))
        setActionOccured(categorySelected.error === null ? false : true)
    }, [categorySelected.error])

    useEffect(() => {
        setOpenWarningDialog(actionOccured)
    }, [actionOccured])

    useEffect(() => {
        setDialogMessage(prevState => ({
            ...prevState,
            text: tagSelected.error,
            severity: 'warning'
        }))
        setActionOccured(tagSelected.error === null ? false : true)
    }, [tagSelected.error])

    const handleChipClick = (e, categoryKey) => {
        // Set the id property of the 'categorySelected' state object
        setCategoryId(categoryKey)

        const categoryClicked = categories.filter((category) => category.id === categoryKey)[0]

        selectCategory({
            id: categoryKey,
            label: categoryClicked.label,
            color: categoryClicked.color,
        })
    }

    const handleChipEdit = (e, categoryKey) => {
        // Set the id property of the 'categorySelected' state object
        setCategoryId(categoryKey)

        const categoryClicked = categories.filter((category) => category.id === categoryKey)[0]

        selectCategory({
            id: categoryKey,
            label: categoryClicked.label,
            color: categoryClicked.color,
        })

        setOpenDialog(true)
    }

    return (
        <div>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                columnGap: '.7rem',
                rowGap: '1rem',
                marginBottom: '1rem'
            }}>
                {categories?.map((category, index) => {
                    const categoryColorDb = category.color
                    const chipBackgroundColor = categoryColorDb ? rgbCode(categoryColorDb) : 'white'
                    const chipTextColor = reverseColor(categoryColorDb)

                    const chipStyle = {
                        chip: {
                            background: categorySelected && categorySelected.id === category.id ? chipBackgroundColor : 'white',
                            color: categorySelected && categorySelected.id === category.id ? chipTextColor : 'black',
                            fontSize: '1rem',
                            border: `.2rem ${chipBackgroundColor} solid`,
                        },
                        deleteIcon: {
                            color: categorySelected && categorySelected.id === category.id ? chipTextColor : 'black'
                        }
                    }

                    let key = category.id

                    return (
                        <Chip
                            label={category.label}
                            style={chipStyle.chip}
                            onClick={e => handleChipClick(e, key)}
                            onDelete={e => handleChipEdit(e, key)}
                            deleteIcon={<EditSharpIcon style={chipStyle.deleteIcon} />}
                            key={key}
                        />
                    )
                })}
            </Box>

            <MySnackBar
                open={openWarningDialog}
                setOpen={setOpenWarningDialog}
                severity={dialogMessage.severity}
                message={dialogMessage.text}
            />
        </div >
    );
}

const mapStateToProps = (state) => {
    return {
        categorySelected: state.categorySelected,
        tagSelected: state.tagSelected,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectCategory: (payload) => dispatch(selectCategory(payload)),
        setCategoryId: (payload) => dispatch(setCategoryId(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)