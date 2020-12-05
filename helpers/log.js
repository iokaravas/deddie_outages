const formatConsoleDate = (date) => {
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  let milliseconds = date.getMilliseconds()

  return '[' +
    ((hour < 10) ? '0' + hour : hour) +
    ':' +
    ((minutes < 10) ? '0' + minutes : minutes) +
    ':' +
    ((seconds < 10) ? '0' + seconds : seconds) +
    '.' +
    ('00' + milliseconds).slice(-3) +
    '] '
}

const log = {
  writeLog: true,
  info: (param) => (log.writeLog ? console.log(formatConsoleDate(new Date()) + 'Info: ' + param) : null),
  warning: (param) => (log.writeLog ? console.log(formatConsoleDate(new Date()) + 'Warning: ' + param) : null),
  error: (error) => console.log(formatConsoleDate(new Date()) + 'Error: ' + error),
  normal: (param) => console.log(param) // Coerced to string
};

module.exports = log
