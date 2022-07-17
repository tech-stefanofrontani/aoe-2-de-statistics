const getPlayerMatches = ({ count = "1000", start = "0", game = "aoe2de", playersIds }) => {
  fetch(`http://localhost:4000/matches?game=${game}&count=${count}&start=${start}&playersIds=${playersIds}`)
    .then((res) => {
      res.json();
    })
    .then(matches => {
      console.log(matches);
    })
}