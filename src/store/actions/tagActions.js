export const createTag = (tag) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    // We pause the dispatch, thanks to thunk middleware (a function) -->
    // We can now add some asynchronous call to our firestore db before disptaching
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;

    try {
      // Start the Spinner
      dispatch({ type: "LOADING_ACTIVATED", payload: true });

      await firestore.collection("tags").add({
        ...tag,
        authorFirstName: profile.firstName,
        authorLastName: profile.lastName,
        authorId: authorId,
        createdAt: new Date(),
      });

      // Close the Spinner
      dispatch({ type: "LOADING_ACTIVATED", payload: false });
    } catch (err) {
      dispatch({ type: "CREATE_TAG_ERROR", err });
    }
  };
};

export const updateTagAction = (props) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    // We pause the dispatch, thanks to thunk middleware (a function) -->
    // We can now add some asynchronous call to our firestore db before disptaching
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    try {
      const tagId = props.id;
      const tagOldLabel = props.oldLabel;
      const tagLabel = props.label;

      const tagsSameLabel = await firestore
        .collection("tags")
        .where("authorId", "==", authorId)
        .where("label", "==", tagLabel)
        .get();

      // Only if array is not empty and label has not been changed by user
      if (tagsSameLabel.docs.length > 0 && tagLabel !== tagOldLabel)
        tagsSameLabel.docs.forEach((snap) => {
          const messageLabel = `'${tagLabel}' already exists. Please select a different label.`;
          dispatch({
            type: "TAG_UPDATED_LABEL_FAILED",
            payload: messageLabel,
          });
        });
      else {
        // Start the Spinner
        dispatch({ type: "LOADING_ACTIVATED", payload: true });

        const docToUpdate = await firestore.collection("tags").doc(tagId).get();
        docToUpdate.ref.update({
          label: tagLabel,
        });

        // Finish the Spinner
        dispatch({ type: "LOADING_ACTIVATED", payload: false });
      }
    } catch (err) {
      console.error("Error while trying to update tag: ", err);
    }
  };
};

export const deleteTagAction = (tagId) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    // We pause the dispatch, thanks to thunk middleware (a function) -->
    // We can now add some asynchronous call to our firestore db before disptaching
    const firestore = getFirestore();
    const authorId = getState().firebase.auth.uid;

    try {
      // Start the Spinner
      dispatch({ type: "LOADING_ACTIVATED", payload: true });

      const docToDelete = await firestore.collection("tags").doc(tagId).get();
      docToDelete.ref.delete();

      // Delete all favorites which property 'tagId' equals the tag deleted
      const favoriteDocsToDelete = await firestore
        .collection("favorites")
        .where("authorId", "==", authorId)
        .where("tagId", "==", tagId)
        .get();

      favoriteDocsToDelete.forEach((doc) => {
        doc.ref.delete();
      });

      // Finish the Spinner
      dispatch({ type: "LOADING_ACTIVATED", payload: false });
    } catch (err) {
      console.error("Error while tring to delete tag: ", err);
    }
  };
};

export const selectTagAction = (payload) => {
  // payload: {id: '...', label: '...'}
  console.log("Payload of my selectTagAction: ", payload);
  return (dispatch) => {
    dispatch({ type: "TAG_SELECTED", payload });
  };
};

export const setTagIdAction = (payload) => {
  // payload is the tag id selected
  return (dispatch) => {
    dispatch({ type: "TAG_IDED", payload });
  };
};
