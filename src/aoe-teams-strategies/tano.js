import { players } from './players';

function calculateTeamsOf2() {
    var _players = [ ...players ];
    var teams = [];

    for (let i = 0; i < _players.length; i++) {
        var player1 = _players[i];
        for (let j = i + 1; j < _players.length; j++) {
            var player2 = _players[j]
            var newTeam = [ player1, player2 ];
            teams.push(newTeam);
        }
    }

    return teams;
}

function calculateTeamsOf3() {
    var _players = [ ...players ];
    var teams = [];
    
    for (let i = 0; i < _players.length - 2; i++) {
        var player1 = _players[i];
        for (let j = i + 1; j < _players.length; j++) {
            var player2 = _players[j];
            for (let w = j + 1; w < _players.length; w++) {
                var player3 = _players[w];
                var newTeam = [ player1, player2, player3 ];
                teams.push(newTeam);
            }
        }
    }

    return teams;
}

function calculateTeamsOf4() {
    var _players = [ ...players ];
    var teams = [];
    
    for (let i = 0; i < _players.length - 2; i++) {
        var player1 = _players[i];
        for (let j = i + 1; j < _players.length; j++) {
            var player2 = _players[j];
            for (let w = j + 1; w < _players.length; w++) {
                var player3 = _players[w];
                for (let z = w + 1; z < _players.length; z++) {
                    var player4 = _players[z];
                    var newTeam = [ player1, player2, player3, player4 ];
                    teams.push(newTeam);
                }
            }
        }
    }

    return teams;
}

function Team(players) {
    this.players = players;
    this.losses = 0;
    this.wins = 0;
}

var formatTeams = [ ...calculateTeamsOf2(), ...calculateTeamsOf3(), ...calculateTeamsOf4() ].map((teamPlayers) => {
    return new Team(teamPlayers)
});

console.log(formatTeams);