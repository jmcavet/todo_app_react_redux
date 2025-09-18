const initState = {
    loading: false,
    linear: false,
}

const spinnerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOADING_ACTIVATED':
            return {
                ...state,
                loading: action.payload,
            }
        case 'LOADING_DESACTIVATED':
            return {
                ...state,
                loading: action.payload,
            }
        case 'LINEAR_PROGRESS_ACTIVATED':
            return {
                ...state,
                linear: action.payload,
            }
        case 'LINEAR_PROGRESS_DESACTIVATED':
            return {
                ...state,
                linear: action.payload,
            }
        default:
            return state;
    }
}

export default spinnerReducer