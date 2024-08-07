const axios = require('axios');

async function sendSuprSendEvent(distinctId, eventName, properties) {
  const options = {
    method: 'POST',
    url: 'https://hub.suprsend.com/event/', // Ensure this is the correct endpoint for your use case
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization:'Bearer SS.OKBwS3lEVhGWv-Ca-L55G-PlzCMKzoyJNZvgG_t72Qs' 
    },
    data: {
      distinct_id: distinctId,
      event: eventName,
      properties: properties,
      
    }
  };

  try {
    const response = await axios.request(options);
    console.log("Event sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending event:", error.response ? error.response.data : error.message);
  }
}

module.exports = { sendSuprSendEvent };


