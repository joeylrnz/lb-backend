import axios from 'axios';

import { messages } from './messages';

async function main() {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    let endpoint = 'shipment';
    if (message.type === 'ORGANIZATION') {
      endpoint = 'organization';
    }

    try {
      await axios.post(`http://localhost:3001/${endpoint}`, message);
      console.log('message sent:', i);
    } catch (error: any) {
      console.error(error.code);
    }
  }
}

main();