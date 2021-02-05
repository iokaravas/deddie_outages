const fetch = require('node-fetch')
const cheerio = require('cheerio')
const log = require('./log.js')

// This will return fetched data - Municipality and Prefecture is set in options.js
const fetcher = async (reqOptions) => {
  log.info('fetcher(): Fetching outages')
  return await fetch('https://siteapps.deddie.gr/Outages2Public/?Length=4', reqOptions).then(res => res.text())
    .then(text => {
      const fetchedData = []
      const $ = cheerio.load(text)
      // Parse returned table per row
      $('#tblOutages > tbody > tr').each((index, element) => {
        const tds = $(element).find('td')
        // Convert dates to machine readable date
        const from = new Date($(tds[0]).text().replace('πμ', 'am').replace('μμ', 'pm')).toISOString()
        const to = new Date($(tds[1]).text().replace('πμ', 'am').replace('μμ', 'pm')).toISOString()
        // Clean up texts for rest
        const municipality = $(tds[2]).text().replace(/(\r\n|\n|\r)/gm, '').trim()
        const location = $(tds[3]).text().replace(/(\r\n|\n|\r)/gm, '').trim()
        const noteNumber = $(tds[4]).text()
        const reason = $(tds[5]).text()
        // Add new row
        fetchedData.push({from, to, municipality, location, noteNumber, reason})
      })

      log.info(`fetcher(): Fetched ${fetchedData.length} entries`)
      return fetchedData
    })
}

module.exports = fetcher
