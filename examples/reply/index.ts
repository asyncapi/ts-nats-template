import { NatsAsyncApiClient, AnonymousSchema_1, NatsTypescriptTemplateError, GeneralReply, AnonymousSchema_5 } from 'asyncapi-nats-client';

const streetlightToListenFor = '*';
const client = new NatsAsyncApiClient();

export async function closeClient(){
  await client.disconnect();
}

/**
 * Setup a reply handler to process requests
 */
async function setup() {
  await client.connectToLocal();
  const onRequest = async (err?: NatsTypescriptTemplateError, msg?: AnonymousSchema_1, streetlight_id?: string): Promise<GeneralReply> => {
    if(err) {
        console.log(err);
    }
    console.log(`Received ${msg.marshal()} for streetlight ${streetlight_id}`);
    const replyMessage = new GeneralReply({});
    replyMessage.statusCode = 200;
    replyMessage.statusMessage = 'All OK';
    return replyMessage;
  }
  await client.replyToStreetlightStreetlightIdCommandTurnon(onRequest, (error) => {console.error(error);}, streetlightToListenFor);
}
setup();