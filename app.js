const got = require('got')
var http = require("https");
var request = require("request");
const axios = require('axios')

const graphql = {uri:"https://api.snailtrail.art/graphql/",token:"MzJCdk1yUVZnZ281aWtNZzpMcUczMThWNVdSQ2VQZncwWElxTnBHVm96VnVFNk13YQ=="}
const variables = { operationName: 'getOnboardingRaces',
variables: 
 { limit: 20,
   offset: 0,
   filters: 
    { league: 5,
      owner: '0x2282191E8ceD924f6afFdA6EE71E251299e7a46f' } },
query: 'query getOnboardingRaces($limit: Int, $offset: Int, $filters: RaceFilters) {\n  onboarding_races_promise(limit: $limit, offset: $offset, filters: $filters) {\n    ... on Problem {\n      problem\n      __typename\n    }\n    ... on Races {\n      all {\n        id\n        conditions\n        distance\n        league\n        status\n        race_type\n        starts_at\n        athletes\n        prize_pool\n        track\n        athletes\n        participation\n        __typename\n      }\n      own {\n        id\n        conditions\n        distance\n        league\n        status\n        race_type\n        starts_at\n        athletes\n        prize_pool\n        track\n        athletes\n        participation\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}' }

const headersSnail = { 'cache-control': 'no-cache',
'referer': 'https://www.snailtrail.art',
'origin': 'https://www.snailtrail.art',
'content-type': 'application/json',
'authorization': 'Basic MzJCdk1yUVZnZ281aWtNZzpMcUczMThWNVdSQ2VQZncwWElxTnBHVm96VnVFNk13YQ==',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36',
'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-site',
"crossdomain": 'true'

}

