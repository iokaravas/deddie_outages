# deddie_outages

A [Node](http://nodejs.org/) script that parses the planned power interruptions' website of the Hellenic Electricity Distribution Network Operator (DEDDIE/HEDNO) deddie.gr

The script can be run once or set to check every X minutes. It keeps the latest planned outages scrapped in `./.outages.json`.
It will compare these outages and report back/notify only for new ones. 

Please note that this is a personal side project I worked on during my free time. I may use weird/uncommon ways of doing stuff just for learning purposes.
As it stands though, the software is fully functional, and I'm pushing only working prototypes.

If you wish you can always drop me a line with suggestions/issues in [issues](https://github.com/iokaravas/insomniac/issues) or at [@karavas](https://twitter.com/karavas).

### Dependencies

deddie_outages has the following dependencies:

- [cheerio](https://www.npmjs.com/package/cheerio) (for parsing purposes)
- [dotenv](https://www.npmjs.com/package/dotenv) (configuration purposes)
- [minimist](https://www.npmjs.com/package/minimist) (for running using arguments from CLI)
- [pushover-notifications](https://www.npmjs.com/package/pushover-notifications) (used to send notifications to many devices, if you own an account at [pushover](https://pushover.net/).

### Quick Start

You can grab a copy:


    git clone https://github.com/iokaravas/deddie_outages

### Executing

Example run to get all outages for ATTICA (ΑΤΤΙΚΗ)

    deddie_outages --p=10
    
Getting all options
    
    deddie_outpages.js --help
    
    In order to use you need a prefectureID (--p) and a municipalityID (--m)
    You can get a list using --list-prefectures and --list-municipalities=number
    ---
    Usage: < --p=number --m=number [--runevery=number (minutes)] [--notify]
     deddie_outages --p=10 --m=112 --runevery=3 --notify


#### Optionally you should setup `.env` for notifications to work, (need a Pushover app/api key)
    PUSHOVER_DEVICE=S10
    PUSHOVER_USER=u6Xwnb3DAfGx9BNuGKyDfD33ZiQVbh
    PUSHOVER_TOKEN=a7ui5sturig74qw4cz843ukv658e316
    PUSHOVER_SUFFIX= @deddie
    PUSHOVER_SOUND=

#### Required IDs (Prefecture/Municipality)
You can find all prefecture/municipality combinations of IDs in file [prefs.munics.csv](prefs.munics.csv)
and can access the lists through the CLI, too:

Listing all prefectures:

    deddie_outages --list-prefectures

Listing municipalities for a single prefecture:

    deddie_outages --list-municipalities=10
    
### Authors

* **Ioannis (John) Karavas** - *Initial work* - [iokaravas](https://github.com/iokaravas)

See also the list of [contributors](https://github.com/insomniac/contributors) who participated in this project.

****DISCLAIMER:****

Parsing is quite fragile. Since sites change all the time, it is not uncommon for parsers to break when pages change in some way.

### TODO
Several things could be added and/or improved, including :

* Perhaps use of node-cron for refined scheduling?
* Better way to read CSV? Didn't want to include a csv reader...
* Allow for better search for prefectures/municipalities
* Handle more potential errors
* Add verbose option
* Batch lookup
* Better naming
