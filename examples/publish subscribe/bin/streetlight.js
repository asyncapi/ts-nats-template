const {AvailableEvents, NatsAsyncApiClient, AnonymousMessage1Message} = require("nats-client");
const natsClient = new NatsAsyncApiClient();
const streetlight = "test_1";
const stopApplication = () => {
	setTimeout(() => {
		natsClient.disconnect();
	}, 1000)
};
natsClient.on(AvailableEvents.connect, (connection, serverURL, info) => {
	console.log("NatsAsyncApiClient connected");

	//Listen for when the controller want to turn on the streetlight
	natsClient.subscribeToStreetlightStreetlightIdCommandTurnon(
		async (err, msg, streetlight_id) => {
			console.log(`Streetlight: Received message to turn on the streetlight ${streetlight_id}, publish message was: ${JSON.stringify(msg)}`)

			//lets publish that the light is turned on.
			const publish = async (lumen) => {
				try{
					console.log(`Streetlight: publishing that the light is turned on`);
					const publishMessage = new AnonymousMessage1Message.Convert.toAnonymousMessage1(JSON.stringify({lumen: lumen}));
					await natsClient.publishToStreetlightStreetlightIdEventTurnon(publishMessage, streetlight);
					stopApplication();
				}catch(e){
					console.log("Streetlight: Something went wrong when requesting the event StreetlightStreetlightIdEventTurnon");
					console.log(e);
				}
			}
			publish(msg.lumen);
		}, 
		streetlight,
		{
			max: 1
		}
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
