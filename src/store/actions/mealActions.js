export const createMeal = (meal) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            await firestore.collection('meals').add({
                ...meal,
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

export const deleteMealAction = mealId => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore();


        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const docToDelete = await firestore.collection('meals').doc(mealId).get()
            docToDelete.ref.delete()

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("Error while tring to delete meal: ", err)
        }

    }
}

export const updateMeal = (meal) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore()

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const docToUpdate = await firestore.collection('meals').doc(meal.id).get()
            docToUpdate.ref.update({
                label: meal.label,
            })

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("err: ", err)
        }
    }
}
