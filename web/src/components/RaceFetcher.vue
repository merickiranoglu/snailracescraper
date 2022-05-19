<script setup>
import { ref, onMounted } from "vue";

// reactive state
let races = ref([]);
let isFetched = ref(false);
let league = ref(6);
let manualFetch = ref(false);
let selectedRace = ref(undefined);
let showRaceDetails = ref(false);
let selectedSnail = ref({ id: -1 });
let athleteScores = ref([]);

let mySnailSpeed = ref(0);
let mySnails = [
  {
    id: 1413,
    name: "Snail #1413",
    league: 5, //'Gold'
    genome: "AGAMXAGAAXMAAAAAAMHX",
    adaptations: ["Unknown", "Snow", "Unknown"],
    purity: 11,
    distances: [],
  },
  {
    id: 2994,
    name: "Snail #2994",
    league: 6, //'Plat',
    genome: "HHGMGGGMAGGGGHGGXGAX",
    adaptations: ["Forest", "Unknown", "Unknown"],
    purity: 11,
    distances: [],
  },
  {
    id: 4276,
    name: "Snail #4276",
    league: 6, //'Plat',
    genome: "AAHHHHMGHGXMXHHHHGHH",
    adaptations: ["Unknown", "Wind", "Unknown"],
    purity: 11,
    distances: [10],
  },
];

function sendNotification(data) {
  if (data == undefined || !data) {
    return false;
  }
  var title = data.title === undefined ? "Notification" : data.title;
  var clickCallback = data.clickCallback;
  var message = data.message === undefined ? "null" : data.message;
  var icon =
    data.icon === undefined
      ? "https://cdn2.iconfinder.com/data/icons/mixed-rounded-flat-icon/512/megaphone-64.png"
      : data.icon;
  var sendNotification = function () {
    var notification = new Notification(title, {
      icon: icon,
      body: message,
    });
    if (clickCallback !== undefined) {
      notification.onclick = function () {
        clickCallback();
        notification.close();
      };
    }
  };

  if (!window.Notification) {
    return false;
  } else {
    if (Notification.permission === "default") {
      Notification.requestPermission(function (p) {
        if (p !== "denied") {
          sendNotification();
        }
      });
    } else {
      sendNotification();
    }
  }
}

function evaluateRaces(snail) {
  for (let race of races.value) {
    race.score = 0;
    if (race.conditions.includes(snail.adaptations[0])) {
      race.score += 1;
    }
    if (race.conditions.includes(snail.adaptations[1])) {
      race.score += 1;
    }
    if (race.conditions.includes(snail.adaptations[2])) {
      race.score += 1;
    }
    if (snail.distances.includes(race.distance * 1)) {
      race.score += 1;
    }
    if (race.score > 1 && race.athletes.length > 5) {
      fillSelectedRaceInfo(race);
    }
  }
}

async function fetchRaces(snail) {
  var data = JSON.stringify({
    operationName: "getOnboardingRaces",
    variables: {
      limit: 20,
      offset: 0,
      filters: {
        league: snail.league * 1,
        owner: "0x2282191E8ceD924f6afFdA6EE71E251299e7a46f",
      },
    },
    query:
      "query getOnboardingRaces($limit: Int, $offset: Int, $filters: RaceFilters) {\n  onboarding_races_promise(limit: $limit, offset: $offset, filters: $filters) {\n    ... on Problem {\n      problem\n      __typename\n    }\n    ... on Races {\n      all {\n        id\n        conditions\n        distance\n        league\n        status\n        race_type\n        starts_at\n        athletes\n        prize_pool\n        track\n        athletes\n        participation\n        __typename\n      }\n      own {\n        id\n        conditions\n        distance\n        league\n        status\n        race_type\n        starts_at\n        athletes\n        prize_pool\n        track\n        athletes\n        participation\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      races.value = JSON.parse(
        this.responseText
      ).data.onboarding_races_promise.all;

      isFetched.value = true;
      evaluateRaces(snail);
    }
  });

  xhr.open("POST", "https://api.snailtrail.art/graphql/");
  xhr.setRequestHeader(
    "authorization",
    "Basic MzJCdk1yUVZnZ281aWtNZzpMcUczMThWNVdSQ2VQZncwWElxTnBHVm96VnVFNk13YQ=="
  );
  xhr.setRequestHeader("content-type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("postman-token", "91b5768d-7b7a-0d08-c9dc-1c7c9eb004ed");
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

  xhr.send(data);
}

async function getSnailFromAPI(id) {
  return new Promise((resolve) => {
    var data = JSON.stringify({
      operationName: "getSingleSnail",
      variables: { filters: {} },
      query:
        "query getSingleSnail {\n  snail_promise(token_id: " +
        id +
        ") {\n    ... on Problem {\n      problem\n      __typename\n    }\n    ... on Snail {\n      id\n      klass\n      generation\n      adaptations\n      purity\n      gender {\n        value\n        id\n        can_change_at\n        last_change_at\n        __typename\n      }\n      name\n      genome\n      family\n      image\n      image_nobg\n      owner\n      market {\n        price\n        item_id\n        price_wei\n        on_sale\n        last_sale\n        highest_sale\n        __typename\n      }\n      gene_market {\n        price\n        item_id\n        price_wei\n        on_sale\n        __typename\n      }\n      stats {\n        races\n        elo\n        earned_avax\n        earned_token\n        mission_tickets\n        win_ratio\n        top_three_ratio\n        experience {\n          xp\n          level\n          on\n          remaining\n          reward\n          __typename\n        }\n        __typename\n      }\n      visuals {\n        trait_type\n        value\n        count\n        percentage\n        __typename\n      }\n      new_born\n      breeding {\n        breed_detail {\n          monthly_breed_limit\n          monthly_breed_available\n          monthly_breed_used\n          children\n          cycle_start\n          cycle_end\n          days_remaining\n          breed_count_total\n          breed_count_male\n          breed_count_female\n          __typename\n        }\n        __typename\n      }\n      more_stats(seasons: [1]) {\n        season\n        season_stats {\n          category_name\n          category_id\n          category_stats {\n            ... on CounterStat {\n              name\n              count\n              __typename\n            }\n            ... on MeanStat {\n              name\n              count\n              min\n              mean\n              max\n              std\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}",
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function (res) {
      if (this.readyState === 4) {
        resolve(this.responseText);
        return this.responseText;
      }
    });

    xhr.open("POST", "https://api.snailtrail.art/graphql/");
    xhr.setRequestHeader(
      "authorization",
      "Basic MzJCdk1yUVZnZ281aWtNZzpMcUczMThWNVdSQ2VQZncwWElxTnBHVm96VnVFNk13YQ=="
    );
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.setRequestHeader(
      "postman-token",
      "91b5768d-7b7a-0d08-c9dc-1c7c9eb004ed"
    );
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

    xhr.send(data);
  });
}

function selectSnail(snail) {
  athleteScores.value = [];
  selectedSnail.value = snail;
  league.value = snail.league;
  fetchRaces(selectedSnail.value);
}

function estimateSpeedOfSnail(race, snail) {
  let adaptationMatchCount = getAdaptationMatchCount(race, snail);

  let geneScore = { X: 1.4, A: 1.3, M: 1.2, H: 1.1, G: 1 };
  let coefficient = [
    4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -2, -3,
  ];

  if (coefficient[17] < 0 && adaptationMatchCount > 0) {
    coefficient[17] = -coefficient[17];
  }
  if (coefficient[18] < 0 && adaptationMatchCount > 1) {
    coefficient[18] = -coefficient[18];
  }
  if (coefficient[19] < 0 && adaptationMatchCount > 2) {
    coefficient[19] = -coefficient[19];
  }

  snail.speedEstimate = 0;
  for (let i = 0; i < snail.genome.length; i++) {
    let gene = snail.genome[i];
    let coefficientOfThisGene = coefficient[i];
    let geneValue = geneScore[gene] * coefficientOfThisGene;
    snail.speedEstimate += geneValue;
  }
  return snail.speedEstimate.toFixed(3);
}

function getAdaptationMatchCount(race, snail) {
  let adaptationMatchCount = 0;
  for (let snailAdaptation of snail.adaptations) {
    if (race.conditions.includes(snailAdaptation)) {
      adaptationMatchCount += 1;
    }
  }
  return adaptationMatchCount;
}

function getPurityScore(race, snail) {
  return snail.purity * 5;
}

function getGenerationScore(snail) {
  return 1;
}

function getSnailElo(snail) {
  return snail.stats.elo / 20;
}

function getSnailTopThreeRatio(snail) {
  let ratio = snail.stats.top_three_ratio;
  return (ratio.substring(0, ratio.length - 2) * 3);
}

async function fillSelectedRaceInfo(race) {
  athleteScores.value = [];
  showRaceDetails.value = true;
  selectedRace.value = race;

  let selectedSnailData = await getSnailFromAPI(selectedSnail.value.id);
  selectedSnail.value.stats =
    JSON.parse(selectedSnailData).data.snail_promise.stats;
  selectedSnail.value.genomeSpeedScore = estimateSpeedOfSnail(
    race,
    selectedSnail.value
  );
  (selectedSnail.value.adaptationScore = (
    (getAdaptationMatchCount(race, selectedSnail.value) * 100) /
    3
  ).toFixed(0)),
    (selectedSnail.value.purityScore = getPurityScore(
      race,
      selectedSnail.value
    )),
    (selectedSnail.value.eloScore = getSnailElo(selectedSnail.value));
  selectedSnail.value.topThreeRatioScore = getSnailTopThreeRatio(
    selectedSnail.value
  );
  selectedSnail.value.totalScore = getTotalScore(selectedSnail.value);

  athleteScores.value.push(selectedSnail.value);

  for (let athlete of race.athletes) {
    let athleteData = await getSnailFromAPI(athlete);
    let snail = JSON.parse(athleteData).data.snail_promise;
    snail.genomeSpeedScore = estimateSpeedOfSnail(race, snail);
    snail.adaptationScore = (
      (getAdaptationMatchCount(race, snail) * 100) /
      3
    ).toFixed(0);
    snail.purityScore = getPurityScore(race, snail);
    snail.eloScore = getSnailElo(snail);
    snail.topThreeRatioScore = getSnailTopThreeRatio(snail);
    snail.totalScore = getTotalScore(snail);
    if (!(athleteScores.value.filter((x) => x.id === snail.id).length > 0)) {
      athleteScores.value.push(snail);
    }

    athleteScores.value.sort((a, b) => {
      return a.totalScore < b.totalScore;
    });
  }

  for (let i = 0; i < athleteScores.value.length; i++) {
    if (athleteScores.value[i].id === selectedSnail.value.id) {
      if (i < 3) {
        sendNotification({
          title: "Snail Race found!",
          message: "Easy bucketssss",
          icon: "https://www.snailtrail.art/assets/img/favicon.png",
          clickCallback: function () {
            alert("do something when clicked on notification");
          },
        });
      }
    }
  }
}

function getTotalScore(snail) {
  return (
    snail.adaptationScore * 1.05 +
    snail.purityScore * 1.1 +
    snail.genomeSpeedScore * 4 * 1.2 +
    snail.eloScore +
    snail.topThreeRatioScore
  ).toFixed(2);
}

// lifecycle hooks

function fetchSnail(interval, index) {
  selectedSnail.value = mySnails[index % 3];
  fetchRaces(mySnails[index % 3]);
  setTimeout(() => {
    fetchSnail(interval, index + 1);
  }, interval);
}

onMounted(async () => {
  let snail = await getSnailFromAPI(1413);
});
</script>

<template>
  <div style="text-align: center">
    <h2>My Snails</h2>
  </div>
  <div style="text-align: center; margin-bottom: 1rem">
    <button @click="fetchSnail(15000, 0)">Start Listening</button>
  </div>
  <div style="display: flex">
    <div style="width: 33%" v-for="(snail, i) in mySnails">
      <div
        class="snailBox"
        :class="{
          activeSnail: snail.id === selectedSnail.id,
        }"
        @click="selectSnail(snail)"
      >
        <img
          v-bind:src="'https://i.snailtrail.art/snail/' + snail.id + '.png'"
          style="width: 100px; height: 100px"
        />
        <div>
          {{ snail.name }} - {{ snail.league }} - {{ snail.adaptations[0] }} -
          {{ snail.adaptations[1] }} -
          {{ snail.adaptations[2] }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="manualFetch">
    Select League:

    <input type="radio" id="platinum" value="6" v-model="league" />
    <label for="6">Platinum</label>

    <input type="radio" id="gold" value="5" v-model="league" />
    <label for="5">Gold</label>

    <input type="radio" id="silver" value="4" v-model="league" />
    <label for="4">Silver</label>

    <input type="radio" id="bronze" value="3" v-model="league" />
    <label for="3">Bronze</label>
    <div>Adaptations:</div>
    <div>
      Landscape Adaptation
      <select v-model="selectedLandscapeAdaptation">
        <option>Unknown</option>
        <option v-for="(adaptation, i) in landscapeAdaptations">
          {{ adaptation }}
        </option>
      </select>
    </div>
    <div>
      Weather Adaptation
      <select v-model="selectedWeatherAdaptation">
        <option>Unknown</option>
        <option v-for="(adaptation, i) in weatherAdaptations">
          {{ adaptation }}
        </option>
      </select>
    </div>
    <div>
      Athletics Adaptation
      <select v-model="selectedAthleticsAdaptation">
        <option>Unknown</option>
        <option v-for="(adaptation, i) in athleticsAdaptations">
          {{ adaptation }}
        </option>
      </select>
    </div>
    <div>
      <button @click="fetchRaces()">Fetch Races</button>
      isFetched: {{ isFetched }}
    </div>
  </div>

  <div v-if="isFetched" style="display: flex; flex-direction: row">
    <div style="display: flex; flex-direction: column">
      <h2>Active Races</h2>
      <div v-for="(race, i) in races">
        <div
          style="cursor: pointer; min-width:200px;"
          @click="fillSelectedRaceInfo(race)"
          :class="{
            matchesOneCondition: race.score === 1,
            matchesTwoCondition: race.score === 2,
            matchesThreeCondition: race.score === 3,
          }"
        >
          <div>
            {{ race.distance }}m - Score:
            {{ race.score }}
          </div>
          <div>Track : {{ race.track }}</div>
        </div>
        <hr />
      </div>
    </div>
    <div style="margin-left: 2rem" v-if="showRaceDetails">
      <h2>Race Details {{ selectedRace.id }}</h2>
      <div>
        Adaptations:
        <span v-for="(condition, i) in selectedRace.conditions">
          {{ condition }}
        </span>
      </div>
      <table>
        <tr>
          <th style="text-decoration: underline">Athlete</th>
          <th style="text-decoration: underline">Genome Speed</th>
          <th style="text-decoration: underline">Adaptation Score</th>
          <th style="text-decoration: underline">Purity Score</th>
          <th style="text-decoration: underline">Elo Score</th>
          <th style="text-decoration: underline">Top 3 Ratio Score</th>
          <th style="text-decoration: underline">Total Score</th>
        </tr>
        <tr v-for="athleteScore in athleteScores">
          <th
            style="border: 1px dotted gray"
            v-if="athleteScore.id === selectedSnail.id"
          >
            {{ athleteScore.id }} (owned)
          </th>
          <th v-else>{{ athleteScore.id }}</th>

          <th>{{ athleteScore.genomeSpeedScore }}</th>
          <th>{{ athleteScore.adaptationScore }}</th>
          <th>{{ athleteScore.purityScore }}</th>
          <th>{{ athleteScore.eloScore.toFixed(2) }}</th>
          <th>{{ athleteScore.topThreeRatioScore.toFixed(2) }}</th>
          <th>{{ athleteScore.totalScore }}</th>
        </tr>
      </table>
    </div>
    <div style="display:flex; justify-content:center; width:100%; margin-top: 5rem" v-if="!showRaceDetails">
        <h1>Looking for a race, Please wait...</h1>
    </div>
  </div>
</template>

<style scoped>
input {
  margin-left: 1rem;
  margin-right: 0.5rem;
}
span {
  padding-right: 0.2rem;
  padding-left: 0.2rem;
}

.matchesOneCondition {
  background-color: rgb(195, 198, 210);
}

.matchesTwoCondition {
  background-color: rgb(96, 148, 164);
}

.matchesThreeCondition {
  background-color: #3bf8cf;
}

.snailBox {
  background-color: #f5f5d3;
  cursor: pointer;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  text-align: center;
  height: 180px;
}

.activeSnail {
  border: 1px solid black;
}

th {
  min-width: 100px;
  width: 33%;
}
</style>
