const initState = {
    id: null,
    label: null,
    categoryId: null,
    error: null,
    createdMessage: null,
    updatedMessage: null,
}

const todoReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_TODO':
            return state;
        case 'CREATE_TODO_ERROR':
            return state;
        case 'TODO_SELECTED':
            return {
                ...state,
                id: action.payload.id,
                label: action.payload.label,
                categoryId: action.payload.categoryId,
                updatedMessage: null,
                createdMessage: null,
                error: null
            }
        case 'TODO_UPDATED_LABEL_FAILED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload
            }
        default:
            return state;
    }
}

export default todoReducer