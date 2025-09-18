const initState = {
    id: null,
    label: null,
    categoryId: null,
    error: null,
    createdMessage: null,
    updatedMessage: null,
}

const tagReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_TAG':
            console.log('created tag: ', action.tag);
            return state;
        case 'CREATE_TAG_ERROR':
            console.log('create tag error: ', action.err);
            return state;
        case 'TAG_SELECTED':
            return {
                ...state,
                id: action.payload.id,
                label: action.payload.label,
                categoryId: action.payload.categoryId,
                updatedMessage: null,
                createdMessage: null,
                error: null
            }
        case 'TAG_UPDATED_LABEL_FAILED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload
            }
        case 'TAG_IDED':
            return {
                ...state,
                id: action.payload
            }
        default:
            return state;
    }
}

export default tagReducer