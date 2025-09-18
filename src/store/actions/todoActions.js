export const createTodo = (todo) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            await firestore.collection('todos').add({
                ...todo,
                authorFirstName: profile.firstName,
                authorLastName: profile.lastName,
                authorId: authorId,
                createdAt: new Date()
            })

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            dispatch({ type: 'CREATE_TODO_ERROR', err })
        }
    }
}

export const updateFavoriteAction = (myTodo) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            // Get current todo and update it with new data (favorite is active or not)
            const currentTodoId = myTodo.id
            const docToUpdate = await firestore.collection('todos').doc(currentTodoId).get()
            docToUpdate.ref.update({ isFavorite: myTodo.isFavorite })

            // Create a new 'favorites' collection document
            // First, check if document already exists. If yes, get it, otherwise create it
            const snaps = await firestore.collection('favorites')
                .where('authorId', '==', authorId)
                .where('categoryId', '==', myTodo.categoryId)
                .where('tagId', '==', myTodo.tagId)
                .where('label', '==', myTodo.label)
                .get()

            if (snaps.docs.length === 0) {
                await firestore.collection('favorites').add({
                    ...myTodo,
                    createdAt: new Date()
                })
            } else {
                // Delete favorite document
                const favoriteId = snaps.docs[0].id
                const docToDelete = await firestore.collection('favorites').doc(favoriteId).get()
                docToDelete.ref.delete()
            }

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("err: ", err)
        }
    }
}

export const deleteTodoAction = todoId => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore();


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const docToDelete = await firestore.collection('todos').doc(todoId).get()
            docToDelete.ref.delete()

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("Error while tring to delete todo: ", err)
        }

    }
}

export const updateTodoAction = (props) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        try {
            const todoId = props.id
            const todoOldLabel = props.oldLabel
            const todoLabel = props.label

            const todosSameLabel = await firestore.collection('todos')
                .where('authorId', '==', authorId).where('label', '==', todoLabel).get()

            // Only if array is not empty and label has not been changed by user
            if (todosSameLabel.docs.length > 0 && todoLabel !== todoOldLabel)
                todosSameLabel.docs.forEach(snap => {
                    const messageLabel = `'${todoLabel}' already exists. Please select a different label.`
                    dispatch({
                        type: 'TODO_UPDATED_LABEL_FAILED',
                        payload: messageLabel
                    })
                })
            else {
                // Start the Spinner
                dispatch({ type: 'LOADING_ACTIVATED', payload: true })
                const docToUpdate = await firestore.collection('todos').doc(todoId).get()
                docToUpdate.ref.update({
                    label: todoLabel,
                })

                // Finish the Spinner
                dispatch({ type: 'LOADING_ACTIVATED', payload: false })
            }
        } catch (err) {
            console.error("Error while trying to update todo: ", err)
        }
    }
}

export const selectTodoAction = (payload) => {
    // payload: {id: '...', label: '...'}
    return (dispatch) => {
        dispatch({ type: 'TODO_SELECTED', payload })
    }
}