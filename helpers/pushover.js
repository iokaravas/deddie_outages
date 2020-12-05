const log = require('./log.js')
const push = require('pushover-notifications')

const sendPushNotification = (options,outages) => {

  log.info('sendPushNotification() : Notifying user via pushover')

  // Create new outages' messages
  let newOutagesMsg = []

  outages.map(function (outage) {
    // Format appropriately
    const fromDate = new Date(outage.from).toLocaleString('el-GR',{dateStyle:'short', timeStyle:'short'})
    const toDate = new Date(outage.to).toLocaleString('el-GR',{dateStyle:'short', timeStyle:'short'})
    newOutagesMsg.push(`<b>${fromDate} - ${toDate}</b><br/>${outage.municipality} - ${outage.location} (${outage.reason})`)
  })

  log.info('sendPushNotification() : Creating pushover connection...')

  let p = new push({
    user: options.pushover.user,
    token: options.pushover.token
  })

  let msg = {
    title: "New outage" + ((newOutagesMsg.length !== 1) ? "s " : " ") ,
    message: newOutagesMsg.join('<br/>'),
    html: options.pushover.message.html,
    sound: options.pushover.message.sound,
    device: options.pushover.message.device
  }

  log.info('sendPushNotification() : Sending pushover notification')

  // Send PushOver Messages
  p.send(msg, function (err, result) {
    if (err) {
      throw err
    }

    result = JSON.parse(result) // will trust this for now

    if (result.status === 1) {
      log.info("sendPushNotification() : Successfully sent pushover notification to user")
    } else {
      log.error("sendPushNotification() : Error in sending pushover notification")
    }
  })
  
}

module.exports = {
  sendPushNotification
}
