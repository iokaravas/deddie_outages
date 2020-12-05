const fs = require('fs')
const log = require('./log.js')

const readDataFile = (options, storage) => {
  log.info('Read data file')

  if (fs.existsSync(options.dataFile)) { // Read data file if exists

    try {
      return JSON.parse(fs.readFileSync(options.dataFile, 'utf8'))
    } catch (e) { // Handle case where the file format is messed up / empty file
      log.warning('Unable to read data file ' + options.dataFile)
      return []
    }

  } else {

    fs.writeFileSync(options.dataFile, JSON.stringify(storage, null, 4), function (err) {
      if (err) {
        log.info('Error creating data file')
        log.warning('Program will not save data')
      } else {
        log.info('Created new data file')
      }
    })

    return []
  }
}

const updateDataFile = (options, data) => {
  log.info('Updating JSON file ' + options.dataFile)

  fs.writeFileSync(options.dataFile, JSON.stringify(data, null, 4), function (err) {
    if (err) {
      log.error('Error updating file')
    }
  })
}

module.exports = {
  readDataFile,
  updateDataFile
}
