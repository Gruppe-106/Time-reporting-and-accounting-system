interface AdminPanelUser {
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


interface Manager {
    managerId: number,
    firstName: string,
    lastName: string,
    groupId: number
}


export type {AdminPanelUser,Manager}


//Front page


interface FrontPageUser {
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



export type {FrontPageUser,Tasks}


