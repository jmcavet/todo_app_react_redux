export const definePageTitle = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'APPTITLE_DEFINED', payload })
    }
}

