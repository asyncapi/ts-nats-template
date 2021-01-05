
import { kebabCase} from "../utils/general";

export default function({ asyncapi }) {
  let name = "NatsTSclient";
  let version = "1.0.0"
  let description = "";
  if(asyncapi.info().title()){
    name = kebabCase(asyncapi.info().title());
  }
  if(asyncapi.info().version()){
    version = asyncapi.info().version();
  }
  if(asyncapi.info().description()){
    description = asyncapi.info().description();
  }
  return <File name={"package.json"}>
  {
    `
    {
      "name": "${name}",
      "description": "${description}",
      "version": "${version}",
      "main": "dist/index.js",
      "types": "dist/index.d.ts",
      "scripts": {
        "watch": "tsc --watch",
        "build": "tsc",
        "test:integration": "./node_modules/.bin/mocha -r ts-node/register src/tests/**/*.spec.ts --exit --timeout 10000"
      },
      "dependencies": {
        "@types/klaw-sync": "^6.0.0",
        "@types/node": "13.9.5",
        "ts-nats": "1.2.4",
        "typescript": "3.4.3",
        "ts-nkeys":"1.0.16"
      },
      "devDependencies": {
        "ts-node": "^8.10.2",
        "@types/mocha": "^8.0.4",
        "@types/chai": "^4.2.14",
        "chai": "^4.2.0",
        "mocha": "^8.2.1"
      }
    }
    `
  }
  </File>
}