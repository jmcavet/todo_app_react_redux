export function areEqual(arr1, arr2) {
    if (arr1.length === arr2.length) {
        return arr1.every(element => {
            if (arr2.includes(element)) return true
            return false
        })
    }
    return false
}