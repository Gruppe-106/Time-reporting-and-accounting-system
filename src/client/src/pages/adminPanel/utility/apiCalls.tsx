


/**
 * Class containing methods for getting data from the server
*/
export default class APICalls {


    /**
     * Gets a single user from the server
     * @param id If of the user
     * @returns A user object if found
     */
    public static getUser(id: number): Promise<{status:number, data:{
        email: string,
        firstName: string,
        lastName: string,
        id: number,
        groupId: number
    }[]}> {
        return fetch(`https://10.92.1.237:8080/api/user/get?ids=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });
    }

    /**
     * Gets the tasks of a specific user
     * @param id The id of the user
     * @returns The tasks and corrosponding projects if any
     */
    public static getTasks(id: number): Promise<{
        status: number, data: {
            projectId: number,
            projectName: string,
            taskId: number,
            taskName: string
        }[]
    }> {

        return fetch(`https://10.92.1.237:8080/api/user/task/project/get?user=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });
    }


    public static getAllUsers(): Promise<{status:number,data:{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        groupId: number;
    }[]}> {

        return fetch(`https://10.92.1.237:8080/api/user/get?ids=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });

    }

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static getAllRoles(): Promise<{ status: number, data: { id: number, name: string }[] }> {
        // const apiHandler:BaseApiHandler = new BaseApiHandler()

        return fetch(`https://10.92.1.237:8080/api/role/get?ids=*`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });

    }

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static getAllManagers(): Promise<{ status: number, data: { id: number, name: string }[] }> {
        // const apiHandler:BaseApiHandler = new BaseApiHandler()

        return fetch(`https://10.92.1.237:8080/api/role/user/get?role=2`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });

    }


    /**
     * Gets all manager groups
     * @returns the manager groups object
     */
    public static getAllManagerGroups(): Promise<{
        status: number, data: {
            managerId: number,
            firstName: string,
            lastName: string,
            groupId: number
        }[]
    }> {

        return fetch("https://10.92.1.237:8080/api/group/manager/get?manager=*", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response: Response) => {
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    return response.json()
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
            .catch(error => {
                throw new Error(error.Code);
            });
    }

}
