const axios = require('axios');

async function triggerSuprSendEvent(distinct_id, event, properties) {
  const suprSendApiKey = process.env.WORKSPACE_KEY;

  const payload = {
    distinct_id,
    event,
    properties
  };

  try {
    const response = await axios.post('https://hub.suprsend.com/event/', payload, {
      headers: {
        'Authorization': `Bearer ${suprSendApiKey}`,
        'accept': 'application/json',
        'content-type': 'application/json'
      }
    });
    console.log('SuprSend Event Triggered:', response.data);
  } catch (error) {
    console.error('Error triggering SuprSend event:', error);
  }
}

module.exports = triggerSuprSendEvent;