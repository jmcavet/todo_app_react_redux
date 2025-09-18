export const createRecipe = (recipe) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const snapshotSimilarLabel = await firestore.collection('recipes')
                .where('title', '==', recipe.title)
                .get()

            if (snapshotSimilarLabel.docs.length > 0) {
                const messageTitle = `Recipe '${recipe.title}' already exists. Please select a different label.`
                dispatch({
                    type: 'RECIPE_UPDATED_LABEL_FAILED',
                    payload: messageTitle
                })
            } else {
                try {
                    const docRef = await firestore.collection('recipes').add({
                        ...recipe,
                        authorFirstName: profile.firstName,
                        authorLastName: profile.lastName,
                        authorId: authorId,
                        createdAt: new Date()
                    })

                    // Display the Popup message
                    const message = `Recipe ${recipe.label} successfully created!`
                    dispatch({ type: 'RECIPE_TAG_CREATED', payload: message })

                    // Set the Recipe (state) 'id' property (so that it becomes active)
                    dispatch({ type: 'RECIPE_IDED', payload: docRef.id })

                    // Finish the Spinner
                    dispatch({ type: 'LOADING_ACTIVATED', payload: false })
                } catch (error) {
                    console.error("Promise rejected: ", error)
                }
            }
        } catch (err) {
            dispatch({ type: 'RECIPE_CREATED_FAILED', payload: err })
        }
    }
}

export const updateRecipe = (myRecipe) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            // Get current todo and update it with new data (favorite is active or not)
            const currentRecipeId = myRecipe.myId
            const docToUpdate = await firestore.collection('recipes').doc(currentRecipeId).get()
            docToUpdate.ref.update({
                title: myRecipe.title,
                steps: myRecipe.steps,
                ingredients: myRecipe.ingredients,
                tags: myRecipe.tags,
                source: myRecipe.source
            })

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("err: ", err)
        }
    }
}

export const deleteRecipeAction = recipeId => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();

        // Start the Spinner
        dispatch({ type: 'LOADING_ACTIVATED', payload: true })

        try {
            const docToDelete = await firestore.collection('recipes').doc(recipeId).get()
            docToDelete.ref.delete()

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("Error while tring to delete recipe: ", err)
        }
    }
}

export const createRecipeTag = (recipeTag) => {
    console.log("I am creating a recipe tag through this action...: ", recipeTag)
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before dispatching
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            const snapshotSimilarName = await firestore.collection('recipeTags')
                .where('authorId', '==', authorId)
                .where('name', '==', recipeTag.name)
                .get()

            if (snapshotSimilarName.docs.length > 0) {
                const messageTitle = `Recipe tag '${recipeTag.name}' already exists. Please enter a different name.`
                dispatch({
                    type: 'RECIPE_TAG_ALREADY_CREATED',
                    payload: messageTitle
                })
            } else {
                try {
                    await firestore.collection('recipeTags').add({
                        ...recipeTag,
                        authorFirstName: profile.firstName,
                        authorLastName: profile.lastName,
                        authorId: authorId,
                        createdAt: new Date()
                    })

                    // Finish the Spinner
                    dispatch({ type: 'LOADING_ACTIVATED', payload: false })
                } catch (error) {
                    console.error("Promise rejected: ", error)
                }
            }
        } catch (err) {
            console.error(err)
            // dispatch({ type: 'RECIPE_TAG_CREATED_FAILED', payload: err })
        }
    }
}

export const updateRecipeTag = (recipeTag) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        try {
            // Start the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: true })

            // Get current recipeTag and update it with new data
            const docToUpdate = await firestore.collection('recipeTags').doc(recipeTag.id).get()
            docToUpdate.ref.update({
                name: recipeTag.name,
            })

            // Close the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("err: ", err)
        }
    }
}


export const deleteRecipeTag = recipeTagId => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();

        // Start the Spinner
        dispatch({ type: 'LOADING_ACTIVATED', payload: true })

        try {
            const docToDelete = await firestore.collection('recipeTags').doc(recipeTagId).get()
            docToDelete.ref.delete()

            await firestore.collection('recipes').get()

            // Finish the Spinner
            dispatch({ type: 'LOADING_ACTIVATED', payload: false })
        } catch (err) {
            console.error("Error while tring to delete recipe tag: ", err)
        }
    }
}



export const filterRecipeTags = (payload) => {
    return (dispatch) => {
        dispatch({ type: 'RECIPE_TAGS_FILTERED', payload })
    }
}

