import { Text, Indent } from "@asyncapi/generator-react-sdk";
export function Bracket({children}){
    return <Text>
    {`{`}
        {children}
    {`}`}</Text>
}