const ratingTypes = [
  { id: 0, label: "Lobby", },
  { id: 2, label: "1v1 Random Map" },
  { id: 4, label: "Team Random Map" },
  { id: 5, label: "1v1 Random Map Quick Play" },
  { id: 6, label: "Team Random Map Quick Play" },
  { id: 1, label: "1v1 Death Match" },
  { id: 3, label: "Team Death Match" },
  { id: 13, label: "1v1 Empire Wars" },
  { id: 7, label: "1v1 Empre Wars Quick Play" },
  { id: 14, label: "Team Empire Wars" },
  { id: 8, label: "Team Empre Wars Quick Play" },
  { id: 9, label: "Battle Royale Quick Play" },
] as const;

export { ratingTypes };