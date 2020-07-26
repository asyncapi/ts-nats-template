const {AvailableEvents, NatsAsyncApiClient, TestClient, TurnonCommandMessage} = require("nats-client");
const natsTestClient = new TestClient.NatsAsyncApiTestClient();
const streetlight = "test_1";
const stopApplication = () => {
	setTimeout(() => {
		natsTestClient.disconnect();
	}, 1000)
};
natsTestClient.on(AvailableEvents.connect, async (connection, serverURL, info) => {
	console.log("StreetLightController: connected");

	//Listen for when the streetlight turns on.
	natsTestClient.subscribeToStreetlightStreetlightIdEventTurnon(
		(err, msg, streetlight_id) => {
			return new Promise((resolve, reject) => {
				console.log(`StreetLightController: Received message that streetlight ${streetlight_id} is turned on message was: ${JSON.stringify(msg)}`);
				stopApplication();
			});
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
		await natsTestClient.connectToHost("localhost:4222", {reconnectTimeWait: 1000, reconnect: true, waitOnFirstConnect: true, maxReconnectAttempts: -1});
	}catch(e){
		console.log("Could not connect client")
		console.log(e);
	}
}
connect();

// Wait a bit before sending the request.
const timeoutFunction = setTimeout(async () => {
	if(!natsTestClient.isClosed()){
		clearTimeout(timeoutFunction);
		console.log(`StreetLightController: Publishing to turn on the streetlight`)
		const publishMessage = TurnonCommandMessage.Convert.toTurnonCommand(JSON.stringify({lumen: 100}));
		await natsTestClient.publishToStreetlightStreetlightIdCommandTurnon(publishMessage, streetlight);
	}
}, 5000);