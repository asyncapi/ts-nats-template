import { File } from '@asyncapi/generator-react-sdk';
export default function readmeFile({ asyncapi }) {
  return <File name={'README.md'}>
    {
      `
# ${asyncapi.info().title() }

${asyncapi.info().description() || ''}


Available nats encodings:
https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
    `
    }
  </File>;
}