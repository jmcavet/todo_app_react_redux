import React from 'react'
import { connect } from 'react-redux'
import { createCategory } from '../../store/actions/categoryActions'
import { selectCategory } from '../../store/actions/categoryActions'

import DialogInputCategory from './DialogInputCategory';

const CreateCategory = (props) => {
    const { createCategory } = props;

    return (
        <DialogInputCategory createCategory={createCategory} selectCategory={selectCategory} />
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createCategory: (category) => dispatch(createCategory(category))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCategory)