import { Text } from "@asyncapi/generator-react-sdk";
import { pascalCase, getMessageType, realizeParametersForChannel, isBinaryPayload, isStringPayload, isJsonPayload, realizeParametersForChannelWithoutType} from "../../utils/general";
import { Bracket } from "../bracket";
export function Subscribe({defaultContentType, channelName, message, messageDescription, channelParameters}){
    return <Text>
  /**
  *  {messageDescription}
  * @param onDataCallback Called when message received.
  */
  public subscribeTo{pascalCase(channelName)}(
      onDataCallback : (
        err?: NatsTypescriptTemplateError, 
        msg?: {getMessageType(message)}
        { 
          channelParameters.length && 
          <Text>, {realizeParametersForChannel(channelParameters, false)}</Text>
        }) ={">"} void
      {
        channelParameters.length && 
        <Text>
        ,{realizeParametersForChannel(channelParameters)}
        </Text>
      },
      flush?: boolean,
      options?: SubscriptionOptions
    ): Promise{"<Subscription>"} <Bracket>
    return new Promise(async (resolve, reject) ={">"} <Bracket>
      {
          isBinaryPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.binaryClient!;</Text>
      }

      {
          isStringPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.stringClient!;</Text>
      }

      {
          isJsonPayload(message.contentType(), defaultContentType) && 
          <Text>const nc: Client = this.jsonClient!;</Text>
      }
      <If 
        condition={"nc"} 
        elseChildren={<Text>reject(NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED));</Text>}>
        <Try 
          exception={"e"}
          catchChildren={<Text>reject(e);</Text>}>
          const sub = await {camelCase(channelName)}Channel.subscribe(
            onDataCallback, nc
            {
              channelParameters.length && 
              <Text>
              ,{realizeParametersForChannelWithoutType(channelParameters)}
              </Text>
            }, 
            options
          );
          <If 
            condition={"flush"} 
            elseChildren={<Text>resolve(sub);</Text>}>
            this.jsonClient!.flush(() ={">"} <Bracket>
              resolve(sub);
            </Bracket>);
          </If>
        </Try>
      </If>
    </Bracket>);
  </Bracket>
    </Text>
}

function Try({catchChildren, exception, children}){
  return <Text>
    try <Bracket>
      {children}
    </Bracket>catch ({exception})<Bracket>
      {catchChildren}
    </Bracket>
  </Text>
}
function If({condition, elseChildren, children}){
  return <Text>
    if({condition})<Bracket>
      {children}
    </Bracket>
    {
    elseChildren && 
      <Text>
        else <Bracket>
          {elseChildren}
        </Bracket>
      </Text>
    
    }
  </Text>
}