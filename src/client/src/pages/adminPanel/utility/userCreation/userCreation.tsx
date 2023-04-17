/**
 * Class containing utility methods
*/
export default class Utility {

    /**
     * Method to validate fields
     * @param userObject The object containing the current field information
     * @returns Object containing information about missings fields if any
     */
    public static CheckFields(userObject: {
        [key: string]: any
        firstName: string | null,
        lastName: string | null,
        email: string | null,
        password: string | null,
        assignedToManager: number | null
        roles: { id: number, name: string }[] | null
    }): {
        valid: boolean,
        missingFields: number,
        errorString: string
    } {
        let missing: string[] = []
        let keys: string[] = Object.keys(userObject)
        let missingString: string = "";
        let valid: boolean = true

        for (let i = 0; i < keys.length; i++) {

            if (userObject[keys[i]] === null) {
                missing.push(keys[i])
            }
        }

        if (missing.length > 0) {

            valid = false;
            let split: string = ""

            if (missing.length === 1) {

                if (missing[0] === "firstName") {
                    split = "First name"
                } else if (missing[0] === "lastName") {
                    split = "Last name"
                } else if (missing[0] === "email") {
                    split = "Email address"
                } else if (missing[0] === "password") {
                    split = "Password"
                } else if (missing[0] === "assignedToManager") {
                    split = "Assign manager"
                } else if (missing[0] === "roles") {
                    split = "Assign roles"
                }


                missingString += "Missing field: " + split

            } else if (missing.length > 1) {


                missingString += "Missing fields: "

                for (let i = 0; i < missing.length - 1; i++) {

                    if (missing[i] === "firstName") {
                        split = "First name"
                    } else if (missing[i] === "lastName") {
                        split = "Last name"
                    } else if (missing[i] === "email") {
                        split = "Email address"
                    } else if (missing[i] === "password") {
                        split = "Password"
                    } else if (missing[i] === "assignedToManager") {
                        split = "Assign manager"
                    } else if (missing[i] === "roles") {
                        split = "Assign roles"
                    }
                    if (split) {
                        missingString += split + ", "
                    }
                    split = ""
                }

                missingString += " and "

                if (missing[missing.length - 1] === "firstName") {
                    split = "First name"
                } else if (missing[missing.length - 1] === "lastName") {
                    split = "Last name"
                } else if (missing[missing.length - 1] === "email") {
                    split = "Email address"
                } else if (missing[missing.length - 1] === "password") {
                    split = "Password"
                } else if (missing[missing.length - 1] === "assignedToManager") {
                    split = "Assign manager"
                } else if (missing[missing.length - 1] === "roles") {
                    split = "Assign roles"
                }
                missingString += split
            }

        }

        return {
            valid: valid,
            missingFields: missing.length,
            errorString: missingString
        }
    }

}