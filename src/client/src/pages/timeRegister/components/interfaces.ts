export interface Api {
    status: number,
    data: TimeSheetData[]
}

export interface AddModalApi {
    status: number,
    data: SearchData[]
}

// Loaded data from database, used in TimeSheetRow and TimeSheetPage
export interface TimeSheetData {
    projectName?: string;
    userId?: number,
    taskName?: string;
    taskId: number;
    time: number;
    date: number;
    approved: boolean,
    managerLogged: boolean
}

export interface SearchData {
    taskId: number,
    taskName: string,
    projectId: number,
    projectName: string,
    isRendered?: boolean
}

export interface TaskRowData {
    projectName: string;
    taskName: string;
    taskId: number;
    approved?: boolean,
    managerLogged?: boolean
    objectData: {
        time: number;
        date: number;
    }[]
}

// Props used in TimeSheetPage
export interface TimeSheetProp {
    userId: number;
}

// Variable states in TimeSheetPage
export interface TimeSheetState {
    stateRowData: Map<number, TaskRowData>;
    prevRowSubmitData: TimeSheetData[];
    deletedItems: TimeSheetData[];
    searchDataState: SearchData[]
    selectedProject: SearchData
    offsetState: number;
    isUpdating: boolean;
    showAddRowModal: boolean;
    showDeleteRowModal: boolean;
    headerDates: string[];
    times: number[];
    deleteId: number | undefined,
    delRowTaskProject: {
        projectName: string | undefined,
        taskName: string | undefined,
    },
}

// State of UserTimeSheet
export interface UserState {
  userId: number;
}