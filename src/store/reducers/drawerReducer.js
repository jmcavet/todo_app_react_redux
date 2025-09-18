const initState = {
    open: false
}

const drawerReducer = (state = initState, action) => {
    switch (action.type) {
        case 'DRAWER_SELECTED':
            return {
                ...state,
                open: action.payload
            }
        default:
            return state
    }
}

export default drawerReducer