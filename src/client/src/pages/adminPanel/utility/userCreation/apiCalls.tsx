




import BaseApiHandler from "../../../../network/baseApiHandler";

/**
 * Class containing methods for getting data from the server
*/
export default class APICalls {


    public static getAllUsers(): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        groupId: number;
    }[]> {

        return fetch(`/api/user/get?ids=*`, {
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

        return fetch(`/api/role/get?ids=*`, {
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

        return fetch(`/api/role/user/get?role=2`, {
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

    public static getAllManagerGroups() {
        
        return fetch("/api/group/manager/get?manager=*", {
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
