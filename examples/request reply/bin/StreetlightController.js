const {AvailableEvents, TestClient, GeneralReplyMessage, TurnonCommandMessage} = require("nats-client");
const natsTestClient = new TestClient.NatsAsyncApiTestClient();
const streetlight = "test_1";
const stopApplication = () => {
	setTimeout(() => {
		natsTestClient.disconnect();
	}, 1000);
}
natsTestClient.on(AvailableEvents.connect, async (connection, serverURL, info) => {
	console.log("StreetLightController: connected");

	//Listen for when the streetlight turns on.
	natsTestClient.replyToStreetlightStreetlightIdEventTurnon((err, msg, streetlight_id) => {
		return new Promise((resolve, reject) => {
			console.log(`StreetLightController: Received request that streetlight ${streetlight_id} is turned on message was: ${JSON.stringify(msg)}`);
			const replyMessage = new GeneralReplyMessage.Convert.toGeneralReply(JSON.stringify({status_code: 200, status_message: "Ok"}));
			resolve(replyMessage);
			stopApplication();
		});
	}, (err) => {
		console.log("StreetLightController: Could not setup reply");
		console.log(err);
	}, streetlight);
});

async function connect(){
	console.log("Connecting all client");
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
		console.log(`StreetLightController: Requesting to turn on the streetlight`)
		const requestMessage = TurnonCommandMessage.Convert.toTurnonCommand(JSON.stringify({lumen: 100}));
		const replyMessage = await natsTestClient.requestStreetlightStreetlightIdCommandTurnon(requestMessage, streetlight);
		console.log(`StreetLightController: got reply from our request to streetlight ${streetlight}, response message was: ${JSON.stringify(replyMessage)}`)
	}
}, 5000);