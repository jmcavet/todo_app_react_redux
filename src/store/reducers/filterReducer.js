const initState = {
    categories: {},
    categoriesAreGrouped: false,
    tagsAreGrouped: false,
}

const filterReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CATEGORY_FILTERED':
            return {
                ...state,
                categories: action.payload
            }
        case 'CATEGORY_FILTERED_NEW':
            const categoryId = action.payload

            return {
                ...state,
                categories: {
                    ...state.categories,
                    [categoryId]: true
                }
            }
        case 'CATEGORIES_GROUPED':
            return {
                ...state,
                categoriesAreGrouped: action.payload
            }
        case 'TAGS_GROUPED':
            return {
                ...state,
                tagsAreGrouped: action.payload
            }
        default:
            return state
    }
}

export default filterReducer