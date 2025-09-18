const initState = {
    favorites: [],
}

const favoriteReducer = (state = initState, action) => {
    switch (action.type) {
        case 'FAVORITE_CHECKED':
            return {
                ...state,
                favorites: [...state.favorites, action.payload]
            }
        case 'FAVORITE_UNCHECKED':
            return {
                ...state,
                favorites: state.favorites.filter(favorite => favorite.id !== action.payload.id)
            }
        // case 'FAVORITE_DELETED':
        //     return {
        //         ...state,
        //         favorites: state.favorites.filter(favorite => favorite.id !== action.payload.id)
        //     }
        default:
            return state
    }
}

export default favoriteReducer