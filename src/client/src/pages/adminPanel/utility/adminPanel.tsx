
import APICalls from "./userCreation/apiCalls";


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

interface Manager {
    managerId: number,
    firstName: string,
    lastName: string,
    groupId: number
}

export default class AdminUtil {

    public static async updateUsers(managers: Manager[]): Promise<{ users: User[], groups: number[] }> {


        const dbUsers: User[] = await APICalls.getAllUsers()
        const groups: number[] = []
        dbUsers.forEach((ele: User) => groups.push(ele.groupId))
        dbUsers.forEach((ele: User) => {
            ele.orginalGroupId = ele.groupId
            ele.orginalEmail = ele.email
            ele.orginalFirstName = ele.firstName
            ele.orginalLastName = ele.lastName
            ele.validEmail = true
            ele.validFirstName = true
            ele.validLastName = true
            ele.manager = managers.filter((man: Manager) => man.groupId === ele.groupId && man.managerId !== ele.id).concat(managers.filter((man: Manager) => man.groupId !== ele.groupId))
        })

        return {users:dbUsers,groups}

    }
}