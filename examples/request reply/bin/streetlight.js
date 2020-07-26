const {AvailableEvents, NatsAsyncApiClient, GeneralReplyMessage, AnonymousMessage3Message} = require("nats-client");
const natsClient = new NatsAsyncApiClient();
const streetlight = "test_1";
const stopApplication = () => {
	natsClient.disconnect();
}
natsClient.on(AvailableEvents.connect, (connection, serverURL, info) => {
	console.log("NatsAsyncApiClient connected");

	//Listen for when the controller want to turn on the streetlight
	natsClient.replyToStreetlightStreetlightIdCommandTurnon(
		(err, msg, streetlight_id) => {
			return new Promise(async (resolve, reject) => {
				console.log(`NatsClient: Received request to turn on the streetlight ${streetlight_id}, request message was: ${JSON.stringify(msg)}`)
				const replyMessage = new GeneralReplyMessage.Convert.toGeneralReply(JSON.stringify({status_code: 200, status_message: "Ok"}));
				resolve(replyMessage);
				
				//lets request that the light is turned on.
				const request = async (lumen) => {
					try{
						console.log(`NatsClient: requesting that the light is turned on`)
						const newRequestMessage = new AnonymousMessage3Message.Convert.toAnonymousMessage3(JSON.stringify({lumen: lumen}));
						const replyFromRequest = await natsClient.requestStreetlightStreetlightIdEventTurnon(newRequestMessage, streetlight);
						console.log(`NatsClient: received reply to our request. Reply was: ${JSON.stringify(replyFromRequest)}`);
						stopApplication();
					}catch(e){
						console.log("NatsClient: Something went wrong when requesting the event StreetlightStreetlightIdEventTurnon");
						console.log(e);
					}
				}
				request(msg.lumen);
			});
		}, (err) => {
			console.log("NatsClient: Could not setup reply");
			console.log(err);
		}, 
		streetlight
	);
});
async function connect(){
	console.log("Connecting client");
	try{
		await natsClient.connectToHost("localhost:4222", {reconnectTimeWait: 1000, reconnect: true, waitOnFirstConnect: true, maxReconnectAttempts: -1});
	}catch(e){
		console.log("Could not connect client")
		console.log(e);
	}
}
connect();
