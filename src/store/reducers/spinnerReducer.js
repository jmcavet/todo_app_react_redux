const initState = {
    loading: false,
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
        default:
            return state;
    }
}

export default spinnerReducer