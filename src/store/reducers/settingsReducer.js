const initState = {
    pageTitle: null,
}

const settingsReducer = (state = initState, action) => {
    switch (action.type) {
        case 'APPTITLE_DEFINED':
            return {
                ...state,
                pageTitle: action.payload.pageTitle
            }
        default:
            return state
    }
}

export default settingsReducer