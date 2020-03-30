# Template usage

## content types

For binary payloads use: `binary` content type
For json payloads use: `json` content type
For string payloads use: `string` content type

## Hooks

Use the hooks to control the flow of information outside the generated code.

These are the available hooks:

| Hookname | Callback type | Description |
| BeforeSendingData | (Message: any) => new data | Called before sending any data.
| RevievedData | (recieved data: any) => new data | Called after data is recieved.
