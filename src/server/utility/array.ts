export {};

declare global {
        interface Array<T> {
                contains(value: T): boolean;
                toStringArray(): string[];
        }
}

/**
 * Checks if array contains a value
 * @returns {boolean} If array contains a value
 */
Array.prototype.contains =  function <T>(value: T): boolean {
        return (this as T[]).indexOf(value) !== -1;
}

/**
 * Converts to string array from any array
 * @returns {string[]} returns a string array
 */
Array.prototype.toStringArray = function<T>(): string[] {
        return (this as T[]).map((value) => {
                return value.toString()
        });
}

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
export function arrayOnlyNumeric(arr: string[]): string[] {
    return arr.filter((value) => {
        if (!Number.isNaN(parseInt(value))) return value;
    })
}