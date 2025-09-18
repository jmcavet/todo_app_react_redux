const initState = {
    name: '',
    error: null,
    createdMessage: null,
    updatedMessage: null,
    filtered: {},
}

const recipeTagReducer = (state = initState, action) => {
    switch (action.type) {
        case 'RECIPE_TAG_CREATED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: action.payload,
                error: null,
            }
        case 'RECIPE_TAG_ALREADY_CREATED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload,
            }
        case 'RECIPE_TAGS_FILTERED':
            return {
                ...state,
                filtered: {
                    ...state.filtered,
                    [action.payload.recipeTagkey]: action.payload.status
                }
            }
        default:
            return state
    }
}

export default recipeTagReducer