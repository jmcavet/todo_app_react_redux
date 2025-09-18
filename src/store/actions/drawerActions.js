export const openCloseDrawer = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'DRAWER_SELECTED', payload })
    }
}