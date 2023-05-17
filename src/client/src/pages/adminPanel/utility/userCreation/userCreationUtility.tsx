import type { UserObject, CheckFieldsReturn, FieldMap } from "../../adminPanelTypes"


/**
 * Class containing utility methods
*/
export default class Utility {

    /**
     * Method to validate fields
     * @param userObject The object containing the current field information
     * @returns Object containing information about missings fields if any
     */
    public static checkFields(userObject: UserObject): CheckFieldsReturn {
        const missing: string[] = [];
        const fieldMap: FieldMap = {
            firstName: "First name",
            lastName: "Last name",
            email: "Email address",
            password: "Password",
            assignedToManager: "Assign manager",
            roles: "Assign roles",
        };

        for (const key in userObject) {
            if (userObject.hasOwnProperty(key) && userObject[key] === null) {
                missing.push(key);
            }
        }

        const valid: boolean = missing.length === 0;
        let missingString: string = "";

        if (!valid) {
            if (missing.length === 1) {
                missingString = `Missing field: ${fieldMap[missing[0]]}`;
            } else {
                missingString = "Missing fields: ";
                for (let i = 0; i < missing.length - 1; i++) {
                    missingString += `${fieldMap[missing[i]]}, `;
                }
                missingString += `and ${fieldMap[missing[missing.length - 1]]}`;
            }
        }

        return {
            valid,
            missingFields: missing.length,
            errorString: missingString,
        };
    }


}