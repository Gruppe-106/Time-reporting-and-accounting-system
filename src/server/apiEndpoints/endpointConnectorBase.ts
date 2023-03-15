import EndpointBase, {User} from "./endpointBase";
abstract class EndpointConnectorBase extends EndpointBase{
    abstract tableSecond:object[];
    abstract tableConnector:object[];
}

export default EndpointConnectorBase;