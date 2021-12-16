import { NatsAsyncApiClient, TurnOnRequest, NatsTypescriptTemplateError, GeneralReply } from 'reply-example-with-streetlight';

const streetlightToListenFor = '*';

/**
 * Setup a reply handler to process requests
 */
export async function setupReply() {
  const client = new NatsAsyncApiClient();
  await client.connectToLocal();
  const onRequest = async (err?: NatsTypescriptTemplateError, msg?: TurnOnRequest, streetlight_id?: string): Promise<GeneralReply> => {
    if(err) {
        console.log(err);
    }
    console.log(`Received ${msg.marshal()} for streetlight ${streetlight_id}`);
    const replyMessage = new GeneralReply({});
    replyMessage.statusCode = 200;
    replyMessage.statusMessage = 'All OK';
    setTimeout(async () => {
      await client.disconnect();
    }, 100);
    return replyMessage;
  }
  await client.replyToStreetlightStreetlightIdCommandTurnon(onRequest, (error) => {console.error(error);}, streetlightToListenFor, undefined, {max: 1});
}
setupReply();