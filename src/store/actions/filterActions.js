export const filterCategories = (payload) => {
    // payload: {'<categoryKey1>': 'true', '<categoryKey2>': 'false', ...}
    return (dispatch) => {
        dispatch({ type: 'CATEGORY_FILTERED', payload })
    }
}

export const filterCategoriesTest = (payload) => {
    // payload: {'<categoryKey1>': 'true', '<categoryKey2>': 'false', ...}
    return (dispatch) => {
        dispatch({ type: 'CATEGORY_FILTERED_NEW', payload })
    }
}

export const groupCategories = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'CATEGORIES_GROUPED', payload })
    }
}

export const groupTags = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'TAGS_GROUPED', payload })
    }
}
