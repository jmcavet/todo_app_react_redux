const initState = {
    id: null,
    label: 'Initial value',
    color: { r: '100', g: '150', b: '200', a: '0.8' },
    error: null,
    createdMessage: null,
    updatedMessage: null,
}

const categoryReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CATEGORY_CREATED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: action.payload,
                error: null
            }
        case 'CATEGORY_CREATED_FAILED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload
            }
        case 'CATEGORY_UPDATED':
            console.log("action.payload: ", action.payload)
            return {
                ...state,
                color: action.payload.color,
                label: action.payload.label,
                updatedMessage: action.payload.updatedMessage,
                createdMessage: null,
                error: null,
            }
        case 'CATEGORY_UPDATED_LABEL_FAILED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload
            }
        case 'CATEGORY_UPDATED_FAILED':
            return {
                ...state,
                updatedMessage: null,
                createdMessage: null,
                error: action.payload
            }
        case 'CATEGORY_SELECTED':
            return {
                ...state,
                id: action.payload.id,
                label: action.payload.label,
                color: action.payload.color,
                updatedMessage: null,
                createdMessage: null,
                error: null
            }
        case 'CATEGORY_IDED':
            return {
                ...state,
                id: action.payload
            }
        default:
            return state
    }
}

export default categoryReducer