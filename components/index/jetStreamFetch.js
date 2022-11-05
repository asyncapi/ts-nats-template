import { camelCase, getMessageType, realizeParametersForChannelWrapper, renderJSDocParameters, realizeParametersForChannelWithoutType, pascalCase} from '../../utils/index';

export function JetstreamFetch(channelName, message, messageDescription, channelParameters) {
  return `
  /**
    * JetStream fetch function.
    * 
    * Pull message from \`${channelName}\`
    * 
    * ${messageDescription}
    * 
    * @param onDataCallback to call when messages are received
    ${renderJSDocParameters(channelParameters)}
    * @param options to pull message with, bindings from the AsyncAPI document overwrite these if specified
    */
    public jetStreamFetch${pascalCase(channelName)}(
      onDataCallback: (
        err ? : NatsTypescriptTemplateError,
        msg?: ${getMessageType(message)}
        ${realizeParametersForChannelWrapper(channelParameters, false)},
        jetstreamMsg?: Nats.JsMsg) => void
      ${realizeParametersForChannelWrapper(channelParameters)},
    ): void {
      if (!this.isClosed() && this.nc !== undefined && this.codec !== undefined && this.js !== undefined) {
          ${camelCase(channelName)}Channel.jetsStreamFetch(
          onDataCallback,
          this.js,
          this.codec
          ${Object.keys(channelParameters).length ? ` ,${realizeParametersForChannelWithoutType(channelParameters)}` : ''}
        );
      } else {
        throw NatsTypescriptTemplateError.errorForCode(ErrorCode.NOT_CONNECTED);
      }
    }
    `;
}
