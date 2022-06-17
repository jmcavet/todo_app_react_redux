export const createTodo = (todo) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // We pause the dispatch, thanks to thunk middleware (a function) --> 
        // We can now add some asynchronous call to our firestore db before disptaching
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;

        console.log("MY TODO THAT I HAVE JUST CREATED: ", todo);
        firestore.collection('todos').add({
            ...todo,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_TODO', todo })
        }).catch((err) => {
            dispatch({ type: 'CREATE_TODO_ERROR', err })
        })
    }
}