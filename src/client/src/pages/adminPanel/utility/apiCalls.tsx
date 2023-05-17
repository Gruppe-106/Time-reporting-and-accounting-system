import BaseApiHandler from "../../../network/baseApiHandler";



/**
 * Class containing methods for getting data from the server
*/
export default class APICalls {


    /**
     * Gets a single user from the server
     * @param id If of the user
     * @returns A user object if found
     */
    public static getUser<T>(id: number): Promise<T> {
        const apiHandler: BaseApiHandler = new BaseApiHandler()
        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/user/get?ids=${id}`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data[0] as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })
    }

    /**
     * Gets the tasks of a specific user
     * @param id The id of the user
     * @returns The tasks and corrosponding projects if any
     */
    public static getTasks<T>(id: number): Promise<T> {
        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/user/task/project/get?user=${id}`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })
    }


    public static getAllUsers<T>(): Promise<T> {

        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/user/get?ids=*`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })
    }

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static getAllRoles<T>(): Promise<T> {
        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/role/get?ids=*`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })

    }

    /**
     * Get all roles from the database
     * @returns Promise containing all possible roles
    */
    public static getAllManagers<T>(): Promise<T> {
        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/role/user/get?role=2`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })

    }


    /**
     * Gets all manager groups
     * @returns the manager groups object
     */
    public static getAllManagerGroups<T>(): Promise<T> {

        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.get(`/api/group/manager/get?manager=*`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response.data as T)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })

    }


    public static deleteUser(id: number): Promise<void> {
        const apiHandler: BaseApiHandler = new BaseApiHandler()

        return new Promise((resolve, reject) => {
            apiHandler.delete(`/api/user/remove?user=${id}`, {}, (value) => {
                const response = JSON.parse(JSON.stringify(value));
                if (response.status === 400) {
                    throw new Error("Status 400 bad request")
                } else if (response.status === 200) {
                    resolve(response)
                } else {
                    throw new Error(`Unexpected response status: ${response.status}`)
                }
            })
        })
    }

}
