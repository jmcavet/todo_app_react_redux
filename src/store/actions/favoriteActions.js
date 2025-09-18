export const createFavorite = (favorite) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const favoriteDoc = await firestore.collection('favorites').add({
                ...favorite,
                authorId: authorId,
                createdAt: new Date()
            })

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            dispatch({ type: 'CREATE_FAVORITE_ERROR', err })
        }
    }
}

export const checkFavorite = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'FAVORITE_CHECKED', payload })
    }
}

export const uncheckFavorite = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'FAVORITE_UNCHECKED', payload })
    }
}

export const deleteFavorite = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'FAVORITE_DELETED', payload })
    }
}

// export const editFavoriteAction = ({ favoriteId }) => {
//     return async (dispatch, getState, { getFirebase, getFirestore }) => {
//         // We pause the dispatch, thanks to thunk middleware (a function) --> 
//         // We can now add some asynchronous call to our firestore db before disptaching
//         const firestore = getFirestore();
//         const authorId = getState().firebase.auth.uid;

//         try {
//             // Start the Spinner
//             dispatch({ type: 'LOADING_ACTIVATED', payload: true })

//             const docToUpdate = await firestore.collection('favorites').doc(favoriteId).get()
//             docToUpdate.ref.update({
//                 label: tagLabel,
//             })

//             // Finish the Spinner
//             dispatch({ type: 'LOADING_ACTIVATED', payload: false })

//         } catch (err) {
//             console.error("Error while trying to update tag: ", err)
//         }
//     }
// }

export const deleteFavoriteAction = favoriteId => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore();


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const docToDelete = await firestore.collection('favorites').doc(favoriteId).get()
            docToDelete.ref.delete()

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("Error while tring to delete favorite: ", err)
        }

    }
}