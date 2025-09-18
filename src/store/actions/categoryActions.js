export const createCategory = (category) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore()
        const profile = getState().firebase.profile
        const authorId = getState().firebase.auth.uid

        try {
            const snapshotSimilarLabel = await firestore.collection('categories')
                .where('authorId', '==', authorId)
                .where('label', '==', category.label)
                .get()

            if (snapshotSimilarLabel.docs.length > 0) {
                const messageLabel = `Category '${category.label}' already exists. Please select a different label.`
                dispatch({
                    type: 'CATEGORY_UPDATED_LABEL_FAILED',
                    payload: messageLabel
                })
            } else {
                try {
                    // Start the Spinner
                    dispatch({ type: 'LOADING_ACTIVATED', payload: true })

                    const docRef = await firestore.collection('categories').add({
                        ...category,
                        authorFirstName: profile.firstName,
                        authorLastName: profile.lastName,
                        authorId: authorId,
                        createdAt: new Date()
                    })

                    // Display the Popup message
                    const message = `Category ${category.label} successfully created!`
                    dispatch({ type: 'CATEGORY_CREATED', payload: message })

                    // Set the Category (state) 'id' property (so that it becomes active)
                    dispatch({ type: 'CATEGORY_IDED', payload: docRef.id })

                    // TEST !!!!
                    const categoryId = docRef.id
                    console.log("TESTING WITH CATEGORY ID: ", categoryId)
                    dispatch({ type: 'CATEGORY_FILTERED_NEW', payload: categoryId })

                    // Finish the Spinner
                    dispatch({ type: 'LOADING_ACTIVATED', payload: false })
                } catch (error) {
                    console.error("Promise rejected: ", error)
                }
            }
        } catch (err) {
            dispatch({ type: 'CATEGORY_CREATED_FAILED', payload: err })
        }
    }
}


export const updateCategoryAction = stateCategory => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        try {
            // Check if label already exists. If yes, abort with warning message
            const snaps = await firestore.collection('categories')
                .where('authorId', '==', authorId).where('label', '==', stateCategory.label).get()

            // Only if array is not empty and label has not been changed by user
            if (snaps.docs.length > 0 && stateCategory.label !== stateCategory.oldLabel)
                snaps.docs.forEach(snap => {
                    const messageLabel = `Category '${stateCategory.label}' already exists. Please select a different label.`
                    dispatch({
                        type: 'CATEGORY_UPDATED_LABEL_FAILED',
                        payload: messageLabel
                    })
                })
            else {
                // Start the Spinner
                dispatch({ type: 'LOADING_ACTIVATED', payload: true })

                // Get current category and update it with new data
                const currentCategoryId = stateCategory.id
                const docToUpdate = await firestore.collection('categories').doc(currentCategoryId).get()
                docToUpdate.ref.update({
                    label: stateCategory.label,
                    color: stateCategory.color
                })
                const message = `Category '${stateCategory.oldLabel}' successfully renamed '${stateCategory.label}'`
                dispatch({
                    type: 'CATEGORY_UPDATED',
                    payload: {
                        color: stateCategory.color,
                        label: stateCategory.label,
                        updatedMessage: message
                    }
                })

                // Finish the Spinner
                dispatch({ type: 'LOADING_ACTIVATED', payload: false })
            }
        } catch (err) {
            dispatch({ type: 'CATEGORY_UPDATED_FAILED', payload: err })
        }
    }
}

export const deleteCategoryAction = (categoryId) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore()
        const authorId = getState().firebase.auth.uid

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            // Get current category and delete it
            const categoryDocToDelete = await firestore.collection('categories').doc(categoryId).get()
            categoryDocToDelete.ref.delete()

            // Delete all tags which property 'categoryId' equals the catagory deleted
            const tagDocsToDelete = await firestore.collection('tags')
                .where('authorId', '==', authorId)
                .where('categoryId', '==', categoryId)
                .get()

            tagDocsToDelete.forEach(doc => {
                doc.ref.delete()
            })

            // Delete all favorites which property 'categoryId' equals the catagory deleted
            const favoriteDocsToDelete = await firestore.collection('favorites')
                .where('authorId', '==', authorId)
                .where('categoryId', '==', categoryId)
                .get()

            favoriteDocsToDelete.forEach(doc => {
                doc.ref.delete()
            })

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })

        } catch (err) {
            console.error("My error for deleting category: ", err)
        }
    }
}

export const selectCategory = (payload) => {
    // payload: {label: '...', color: '...'}
    return (dispatch) => {
        dispatch({ type: 'CATEGORY_SELECTED', payload })
    }
}

export const setCategoryId = (payload) => {
    // payload is the category id selected
    return (dispatch) => {
        dispatch({ type: 'CATEGORY_IDED', payload })
    }
}
