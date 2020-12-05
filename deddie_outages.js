const options = require('./options.js')
const fetcher = require('./helpers/fetcher.js')
const {readDataFile, updateDataFile} = require('./helpers/fileHandler.js')
const {sendPushNotification} = require('./helpers/pushover.js')
const log = require('./helpers/log.js')

const app = {

  storage: {
    outages: [], // This stays in sync with local file
    tmpOutages: [], // Used for new outages (latest fetch)
    newOutages: [],  // Used for messages
    scheduler: null
  },

  // Grabs the latest outages from deddie's site using options supplied and updates local storage
  getOutages: async () => fetcher(options.requestOptions(options.prefectureID,options.municipalityID)), // looks weird but options is changed

  // Reads stored data from file - if data file doesn't exist it'll be created.
  readData: () => { app.storage.outages = readDataFile(options, app.storage.outages) },

  // Checks if we found new outages that weren't stored before (in file or for this session)
  hasNewOutages: () => {

    log.info('hasNewOutages() : Comparing outages data')

    let indexes = []
    let outages = app.storage.outages
    let tmpOutages = app.storage.tmpOutages

    if (outages.length) {
      // Keep already 'seen' outages as indexes using municipality-location-noteNumber
      outages.map((outage) => {
        indexes.push(`${outage.municipality}-${outage.location}-${outage.noteNumber}`)
      })

      // Keep only outages we got that don't appear in these indexes
      app.storage.newOutages = tmpOutages.filter((outage) => 
        !indexes.includes(`${outage.municipality}-${outage.location}-${outage.noteNumber}`)
      )

    } else { // No older outages, keep the new ones
      app.storage.newOutages = [...tmpOutages]
    }

    // Update file with new outages (if any)
    if (app.storage.newOutages.length) {

      log.info(app.storage.newOutages.length + ' new outages detected')

      outages = outages.concat(app.storage.newOutages)

      updateDataFile(options, outages)

    } else {
      log.info('hasNewOutages() : No new outages')
    }

    return (app.storage.newOutages.length !== 0)
  },

  notifyUser: (outages) => sendPushNotification(options,outages),

  processData: () => {

    app.getOutages().then((outages) => {

      // set local outages
      app.storage.tmpOutages = outages

      let hasNewOutages = app.hasNewOutages()

      // If filter and not notify, show on screen what we got
      if (hasNewOutages) {
        app.storage.tmpOutages.forEach(function (outage) {
          log.normal(outage)
        })
      }

      if (options.notify && hasNewOutages) {
        app.notifyUser(app.storage.tmpOutages)
      }

    }).catch((e) => {
      log.error('Failed to get outages')
      log.error(e)
    })
    
  },

  run: async () => {
    app.readData()
    app.processData()

    if ((options.interval !== false) && (!app.storage.scheduler)) {
      app.schedule()
    }
  },

  schedule: () => {
    log.info('Running scheduled for every ' + options.interval + ' minutes.')

    app.storage.scheduler = setInterval(() => { // Schedule next
      app.processData()
    }, options.interval * 60000)
  }
  
}

const argopts = {
  boolean: true,
  default: {
    'notify': false,
  }
}

const argv = require('minimist')(process.argv.slice(2), argopts);

options.prefectureID = argv.p
options.municipalityID = argv.m
options.interval = (argv.runevery) ? argv.runevery : false
options.notify = argv.notify

if (argv.hasOwnProperty('help')||(!options.municipalityID||!options.prefectureID)) {
  log.normal('In order to use you need a prefectureID (--p) and a municipalityID (--m)')
  log.normal('You can get that by checking out https://siteapps.deddie.gr/Outages2Public, more info in README')
  log.normal('---')
  log.normal('Usage: < --p=number --m=number [--runevery=number (minutes)] [--notify]')
  log.normal(' deddie_outages --p=10 --m=112 --runevery=3 --notify')
} else {
  app.run()
}
