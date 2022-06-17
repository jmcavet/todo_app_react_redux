
export const activateSpinner = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'LOADING_ACTIVATED', payload: true })
    }
}

export const desactivateSpinner = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'LOADING_DESACTIVATED', payload: false })
    }
}