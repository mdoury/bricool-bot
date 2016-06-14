import axios from 'axios';

const fbUrl = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;

export function handleAttachmentsReceived(messagingItem, pageId, entryTimestamp) {
  let promises = [];
  messagingItem.message.attachments.map((attachment) => {
    let message = {}

    if (attachment.type === 'image') {
      message = createImageMessage(attachment)
    } else if (attachment.type === 'audio') {
      message = createAudioMessage(attachment)
    } else if (attachment.type === 'location') {
      message = createLocationMessage(attachment)
    } else if (attachment.type === 'video') {
      message = createVideoMessage(attachment)
    }

    promises.push(sendMessage(message, messagingItem.sender.id));
  });

  return promises;
}

function sendMessage(message, recipientId) {
  const payload = {
    recipient: {
      id: recipientId,
    },
    message: message,
  };

  return axios.post(fbUrl, payload);
}

function createImageMessage(attachment) {
  return {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [{
          title: "rift",
          subtitle: "Next-generation virtual reality",
          item_url: "https://www.oculus.com/en-us/rift/",
          image_url: "http://messengerdemo.parseapp.com/img/rift.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/rift/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Call Postback",
            payload: "Payload for first bubble",
          }],
        }, {
          title: "touch",
          subtitle: "Your Hands, Now in VR",
          item_url: "https://www.oculus.com/en-us/touch/",
          image_url: "http://messengerdemo.parseapp.com/img/touch.png",
          buttons: [{
            type: "web_url",
            url: "https://www.oculus.com/en-us/touch/",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Call Postback",
            payload: "Payload for second bubble",
          }]
        }]
      }
    }
  }
}

function createAudioMessage(attachment) {
  return {
    text: "Audio received, thanks",
  }
}

function createLocationMessage(attachment) {
  const lat = attachment.payload.coordinates.lat;
  const lng = attachment.payload.coordinates.long;
  return {
    text: `Location received, echo: ${lat},${lng}`,
  }
}

function createVideoMessage(attachment) {
  return {
    text: "Video received, thanks",
  }
}
