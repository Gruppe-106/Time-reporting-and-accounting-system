abstract class BaseModel<ModelData> {
    abstract GetAllModels():Promise<ModelData[]>;
    abstract GetModelById(id:number):Promise<ModelData>;
}

export default BaseModel;