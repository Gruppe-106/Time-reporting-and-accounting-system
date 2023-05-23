
interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    groupId: number;
    orginalGroupId?: number,
    orginalEmail?: string,
    orginalFirstName?: string,
    orginalLastName?: string,
    validEmail?: boolean
    validFirstName?: boolean
    validLastName?: boolean
    manager?: Manager[]

}


/**
 * Custom types
 */
interface StateTypesAP {

    //Input varriables

    // * Controlling components
    loading: boolean
    editing: boolean
    validEmail: boolean
    validName: boolean
    showPopup: boolean
    showDelete: boolean
    showError: boolean
    //* database varriables
    dbUsers: User[]
    dbManagers: Manager[],
    groupMin: number | undefined,
    groupMax: number | undefined,


    // * Search Varriables
    searchQuery: string;

    // * Row operations
    selectedUsers: User[]
    selectedUsersId: number[]


    // * Component variables
    popupMessage: string,
    popupTitle: string,
    loadingText: string
    buttonText: string,
    userToDelete: User | null


    test: any[]
}



interface Manager {
    managerId: number,
    firstName: string,
    lastName: string,
    groupId: number
}

/**
 * Custom types
 */
interface StateTypesUC {
    // * Input variables
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null,
    assignedToManager: Manager | null,
    selectedRoles: { id: number, name: string }[] | null,

    // * Database variables
    dbRoles: any[],
    dbManagers: any[],

    // * Input validation
    emailValid: boolean,

    // * Controlling components
    submitDisabled: boolean,
    showPopup: boolean,
    loading: boolean,
    reload: boolean,

    // * Component variables
    popupMessage: string,
    popupTitle: string,
    loadingText: string

}

interface DataToSendType {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    password: string | null;
    manager: number | null | undefined;
    roles: number[] | null;
}

interface UserObject {
    [key: string]: any
    firstName: string | null,
    lastName: string | null,
    email: string | null,
    password: string | null,
    assignedToManager: number | null
    roles: { id: number, name: string }[] | null
}

interface CheckFieldsReturn {
    valid: boolean,
    missingFields: number,
    errorString: string
}

interface FieldMap {
    [key: string]: any
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    assignedToManager: string;
    roles: string;
}


interface DBroles {
    id: number;
    name: string;
}


interface UserDataPost {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    manager: number;
}

export type {
    StateTypesUC,
    Manager,
    StateTypesAP,
    User,
    UserObject,
    FieldMap,
    CheckFieldsReturn,
    DataToSendType,
    DBroles,
    UserDataPost
}