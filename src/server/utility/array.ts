/**
 * @param arr1 array 1
 * @param arr2 array 2
 * @return Returns the intersection between two arrays of SAME type
 */
export function arrayIntersection<t>(arr1:t[], arr2:t[]): t[] {
    return arr1.filter((value:t) => { if (arr2.indexOf(value) > -1) return value; });
}

/**
 * @param arr string[]: Array to filter
 * @return string[]: Returns only numeric elements of a string array
 */
export function arrayOnlyNumeric(arr: string[]) {
    return arr.filter((value) => {
        if (!Number.isNaN(parseInt(value))) return value;
    })
}

/**
 * Converts and returns a string array, from any array
 * @param {any[]} arr
 */
export function arrayToStringArray(arr: any[]) {
    // Convert list to list of strings
    return arr.map((value) => {
        return value.toString()
    });
}