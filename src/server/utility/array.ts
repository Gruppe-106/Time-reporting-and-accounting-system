export function arrayIntersection<t>(arr1:t[], arr2:t[]): t[] {
    return arr1.filter((value:t) => { if (arr2.indexOf(value) > -1) return value; });
}