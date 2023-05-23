interface User {
    email: string,
    firstName: string,
    lastName: string,
    id: number,
    groupId: number
}


interface Tasks {
    projectId: number,
    projectName: string,
    taskId: number,
    taskName: string
}


interface StateTypes {

    //Database
    user: User
    tasks: Tasks[]

    // * Controlling components
    loading: boolean

    // * Component variables
    loadingText: string
    searchQuery: string

}


export type {
    User,
    Tasks,
    StateTypes
}

