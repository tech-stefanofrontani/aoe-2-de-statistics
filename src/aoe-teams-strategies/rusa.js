// import { players } from './players';

const players2 = [
  { steamId: "76561198370388153", name: "banana" },
  { steamId: "76561199191745935", name: "bruno" },
  { steamId: "76561198356913423", name: "conde" },
  { steamId: "76561199092441496", name: "condefer" },
  { steamId: "76561199040101522", name: "facu" },
  { steamId: "76561199045023149", name: "fede" },
  { steamId: "76561198825714051", name: "pose" },
  { steamId: "76561199097618949", name: "tano" },
  { steamId: "76561199189617164", name: "tinki" },
  { steamId: "76561198399492656", name: "vicen" },
];

const players = [
  { steamId: "76561198370388153", name: "banana" },
];

function getAllSubsets(players) {
    const subsets = [[]];
    for (const player of players) {
        const last = subsets.length-1;
        for (let i = 0; i <= last; i++) {
            subsets.push( [...subsets[i], player] );
        };
    };
    return subsets;
};

function getAllTeams(players, maxNumberOfTeamMembers) {
    let subsetsOfPlayers = getAllSubsets(players);
    let teams = [];
    for (let i = 2; i < maxNumberOfTeamMembers + 1; i++) {
        teams = [ ...teams, ...subsetsOfPlayers.filter(subset => subset.length == i) ];
    }
    return teams;
}

function getMatchDetails(matchId) {
    return fetch(`https://aoe2.net/api/match?match_id=${matchId}`)
        .then(res => res.json())
}

function getPlayerMatches(player) {
  const reqOptions = {
    headers: {
      "accept": "*/*",
      "accept-language": "en,es-419;q=0.9,es;q=0.8",
      "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "cookie": "__utmz=64474943.1654195368.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); theme=darkly; __utma=64474943.1388053697.1654195368.1654809319.1654814999.34; __utmc=64474943; PLAY_SESSION=eyJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImlkIjoiZGM5ZTk3NTUtZWFkNS00MGJkLTkzNDMtYmZjNGQ1YWM4ZjFmIn0sImV4cCI6MTk3MDE3ODAwMSwibmJmIjoxNjU0ODE4MDAxLCJpYXQiOjE2NTQ4MTgwMDF9.mLm_MzrroMNuwENNwuUjXla3AaVu3VZ9H6TMOVAogbE",
      "Referer": "https://aoe2.net/",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  };

  return fetch(`https://aoe2.net/api/player/matches?game=aoe2de&steam_id=${player.steamId}&start=0&count=1000`, reqOptions).then((res) => { return res.json() })
}

function isMatchPlayedWithFriends(match, friends) {
    const matchPlayers = match.players;
    const myTeam = matchPlayers.find(player => player.steam_id == players[0].steamId).team;
    for (let friend of friends) {
        const friendFound = matchPlayers.filter(player => (player.team == myTeam)).find(player => (player.steam_id == friend.steamId));
        if(friendFound) return true;
    };
    return false;
};

var teams = getAllTeams(players, 4).map((playersTeam) => new Team(playersTeam));

getPlayerMatches(players[0]).then(matches => {
    console.log(matches.filter(match => match.players.length == 2 && match.players.find(player => player.steam_id == 76561198825714051)).map(match => match))
    const _players = [...players];
    const friends = _players.splice(1);
    const matchesWithFriends = matches.filter(match => isMatchPlayedWithFriends(match, friends));
    const completeTeams = teams.map((_team) => {
        const teamToAnalyzed = { ..._team };
        let addStatisticToTeam = false;
        for (let i = 0; i < matchesWithFriends.length; i++) {
            // Match a analizar
            const match = matchesWithFriends[i];
            
            // Team a comparar -> saco el team del players[0], tinkiwinki en este caso.
            const playerToAnalyzedTeam = match.players.find(player => player.steam_id == players[0].steamId).team;
            
            // Filtro los players con el team `playerToAnalyzedTeam` para este match:
            const playersToAnalyzed = match.players.filter((player) => player.team == playerToAnalyzedTeam);

            let matchTeamIsSameAsTeam = true;
            for (let i = 0; i < playersToAnalyzed.length; i++) {
                const playerToAnalyzed = playersToAnalyzed[i];
                const isMatchPlayerInTeam = !!(_team.players.find(teamPlayer => teamPlayer.steamId == playerToAnalyzed.steam_id));
                if (!isMatchPlayerInTeam) {
                    matchTeamIsSameAsTeam = false;
                    break;
                };
            };

            if (!matchTeamIsSameAsTeam) {
                continue;
            };

            playersToAnalyzed[0].won ? _team.addWin() : _team.addLoose();
        };
    });
    console.log("teams -->", teams.filter(team => team.players.find(player => true || player.name === "condemalo")));
});

function Team(teamPlayers) {
    this.wins = { total: 0, percentage: 0 };
    this.losses = { total: 0, percentage: 0 };
    this.totalMatches = 0;
    this.players = teamPlayers;
};

Team.prototype.sumMatch = function() {
    this.totalMatches = this.totalMatches + 1;
};
Team.prototype.addWin = function() {
    this.sumMatch();
    const totalWins = this.wins.total + 1;
    this.wins = { total: totalWins, percentage: totalWins / this.totalMatches };
    this.losses = { ...this.losses, percentage: this.losses.total / this.totalMatches };
};
Team.prototype.addLoose = function() {
    this.sumMatch();
    const totalLosses = this.losses.total + 1;
    this.losses = { total: totalLosses, percentage: totalLosses / this.totalMatches };
    this.wins = { ...this.wins, percentage: this.wins.total / this.totalMatches };
};