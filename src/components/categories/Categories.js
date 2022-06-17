import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { selectCategory, setCategoryId } from '../../store/actions/categoryActions'

import Box from '@mui/material/Box';
import InputTag from '../tags/InputTag';

import Tag from '../tags/Tag';
import Chip from '@mui/material/Chip';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { reverseColor, rgbCode } from '../../helper/color';
import MySnackBar from '../layout/MySnackBar';

const Categories = (props) => {
    const { categories, tags, setOpenDialog, setOpenTagDialog, selectCategory,
        setCategoryId, categorySelected, tagSelected } = props

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
                justifyContent: 'space-evenly',
                columnGap: '1rem',
                rowGap: '2rem'
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

            <Box sx={{ width: "100%", borderBottom: 1, bgcolor: 'background.paper', borderColor: 'divider' }}>
                <InputTag categoryId={categorySelected.id} />
                {tags?.map((tag, index) => {
                    return (
                        tag.categoryId === categorySelected.id
                            ? <Tag key={tag.id} tag={tag} setOpenTagDialog={setOpenTagDialog} />
                            : ''
                    )
                })}
            </Box>
        </div >
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        categories: state.firestore.ordered.categories,
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