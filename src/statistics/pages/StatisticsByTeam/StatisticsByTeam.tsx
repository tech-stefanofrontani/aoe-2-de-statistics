import { access } from 'fs';
import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../../shared/components/Button/Button';
import { Checkbox } from '../../../shared/components/Checkbox/Checkbox';
import { Chip } from '../../../shared/components/Chip/Chip';
import { Loader } from '../../../shared/components/Loader/Loader';
import { Player } from '../../types/Player';
import styles from './StatisticsByTeam.module.scss';

const useAfterFirstRenderEffect = (func: any, deps: any) => {
  const didMount = useRef(false);

  useEffect(() => {
      if (didMount.current) func();
      else didMount.current = true;
  }, deps);
}


const matches = [
  { ranked: null, rating_type: "2", players: [{}] },
  { ranked: true, rating_type: "3", players: [{}] },
  { ranked: true, rating_type: "1", players: [{}] },
  { ranked: null, rating_type: "1", players: [{}] },
  { ranked: null, rating_type: "3", players: [{}] },
]

const players: Player[] = [
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

const ratingTypes = [
  {
    id: 2,
    label: "1v1 Random Map"
  },
  {
    id: 4,
    label: "Team Random Map"
  },
  {
    id: 5,
    label: "1v1 Random Map Quick Play"
  },
  {
    id: 6,
    label: "Team Random Map Quick Play"
  },
  {
    id: 1,
    label: "1v1 Death Match"
  },
  {
    id: 3,
    label: "Team Death Match"
  },
  {
    id: 13,
    label: "1v1 Empire Wars"
  },
  {
    id: 7,
    label: "1v1 Empre Wars Quick Play"
  },
  {
    id: 14,
    label: "Team Empire Wars"
  },
  {
    id: 8,
    label: "Team Empre Wars Quick Play"
  },
  {
    id: 9,
    label: "Battle Royale Quick Play"
  },
] as const;

interface FilterKey {
  [key: string]: FilterValue
}
interface FilterValue {
  label: string,
  checked: boolean
}

type FilterTypes = /* "ranked" | "ratingTypes" */  |  "players";

interface FilterType {
  valid: boolean,
  filters: FilterKey
  label?: string,
}

type IFilters = {
  [key in FilterTypes]: FilterType
}

type IPlayer = {}

type Match = {
  players: Player[],
  ranked: boolean,
  won: boolean,
  ratingType: typeof ratingTypes[number]["id"],
}

type MatchesGroups = "all" | "lost" | "won";
type MatchesGroupsValues = {
  total: number,
  matches: Match[],
  percentage?: number
}

type MatchesByRatingType = {
  [key in MatchesGroups]: MatchesGroupsValues
}

type TeamStatisticsResponse = {
  matchesByRatingType: Record<typeof ratingTypes[number]["id"], MatchesByRatingType>
}

const StatisticsByTeam = () => {
  const [params, setParams] = useSearchParams();
  
  const playersIdsParams = params.get("players_ids");
  const preloadedPlayersIds = playersIdsParams?.split(",");

  const ratingTypesParams = params.get("rating_types");
  const preloadedRatingTypesIds = ratingTypesParams?.split(",").map(ratingType => Number(ratingType));

  const [ratingTypesFilters, setRatingTypesFilters] = useState<FilterKey>( ratingTypes.reduce((acc, curr) => {
    const foundRatingType = preloadedRatingTypesIds?.find(preloadedRatingTypeId => preloadedRatingTypeId === curr.id);
    return {
      ...acc,
      [curr.id]: {
        ...curr,
        checked: !ratingTypesParams ? true : !!foundRatingType
      }
    }}, {})
  );
    
  const [formValid, setFormValid] = useState(false);
  const [filters, setFilters] = useState<IFilters>((() => {
    return {
      players: {
        label: "Jugadores",
        valid: !!preloadedPlayersIds,
        filters: players.reduce((acc, player) => {
          const foundPlayer = preloadedPlayersIds?.find(preloadPlayerId => preloadPlayerId == player.steamId);
          return {
            ...acc,
            [player.steamId]: {
              label: player.name,
              checked: !!foundPlayer,
            }
          }
        }, {})
      }
    }
  })())
  
  const { isLoading, isFetching, data: teamStatistics, refetch } = useQuery<TeamStatisticsResponse>(
    ["matches", ...Object.keys(filters.players.filters) ],
    () => fetch(`http://localhost:4000/aoeNet/players/matches?playersIds=${params.get(`players_ids`)}`).then(res => res.json()),
    {
      enabled: !!playersIdsParams,
      keepPreviousData: true
    }
  )

  const handleFilterValidation = (filterType: FilterTypes, filters: FilterKey) => {
    const validations = {
      players: () => {
        const playersSelected = Object.entries(filters).filter(([filterKey, filterValue]) => filterValue.checked);
        return playersSelected.length > 1 && playersSelected.length < 5;
      }
    }

    return validations[filterType]()
  }

  const handleChangeOnFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    const arr = event.currentTarget.name.split("-");
    const filterType = arr[0] as FilterTypes;
    const filterValue = arr[1];
    
    const updatedFilters = {
      ...filters[filterType].filters,
      [filterValue]: {
        ...filters[filterType].filters[filterValue],
        checked: checked
      }
    }
    
    const filterValid = handleFilterValidation(filterType, updatedFilters);

    setFilters({
      ...filters,
      [filterType]: {
        ...filters[filterType],
        valid: filterValid,
        filters: updatedFilters
      }
    });
  };

  const setFiltersParamsInUrl = () => {
    const players_ids = Object.entries(filters.players.filters).filter(([playerId, playerObj]) => playerObj.checked).reduce((acc, [playerId, playerObj]) => {
      return acc ? `${acc},${playerId}` : playerId
    }, "");
    
    params.set("players_ids", players_ids);
    setParams(params)
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFiltersParamsInUrl();
    refetch();
  };

  const handleRatingTypeClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentTarget = event.currentTarget;
    const clickedRatingType = currentTarget.value;
    const ratingTypeChecked = currentTarget.checked;
    setRatingTypesFilters({
      ...ratingTypesFilters,
      [clickedRatingType]: {
        ...ratingTypesFilters[clickedRatingType],
        checked: ratingTypeChecked
      }
    })
  }

  useEffect(() => {
    const formValid = !Boolean(
      Object.entries(filters).find(([filterType, filter], index) => {
        return !filter.valid
      })
    );
    setFormValid(formValid);
  }, [filters]);

  useAfterFirstRenderEffect(() => {
    const rating_types = Object.entries(ratingTypesFilters).filter(([ratingTypeId, ratingTypeObj]) => ratingTypeObj.checked).reduce((acc, [ratingTypeId, ratingTypeObj]) => {
      return acc ? `${acc},${ratingTypeId}` : ratingTypeId
    }, "");

    params.set("rating_types", rating_types);
    setParams(params);
  }, [ratingTypesFilters]);

  const filteredMatchesByRatingType = teamStatistics && teamStatistics.matchesByRatingType
    ? [ ...Object.entries(teamStatistics.matchesByRatingType) ].reduce((acc, [ratingTypeId, matchesByRatingType]) => {
        return ratingTypesFilters[ratingTypeId]?.checked ? { ...acc, [ratingTypeId]: matchesByRatingType } :  { ...acc }
      }, {})
    : {};

  const matches = Object.entries<MatchesByRatingType>(filteredMatchesByRatingType).reduce<Array<Match>>((acc, [ratingTypeId, ratingTypeMatches]) => {
    return [ ...acc, ...ratingTypeMatches.all.matches ]
  }, []);

  return (
      <div className={styles.root}>
      <aside className={styles.aside}>
        <form onSubmit={handleSubmit}>
          {Object.entries(filters).map(([filterType, filterTypeValues], index) => {
            return (
              <fieldset key={index}>
                <legend>{filterTypeValues.label}</legend>
                  {Object.entries(filterTypeValues.filters).map(([filterTypeValue, filterTypeValueObj], index) => {
                    return (
                      <div key={index} className={styles.checkbox_container}>
                        <Checkbox
                          labelProps={{
                            description: filterTypeValueObj.label,
                          }}
                          inputProps={{
                            id: `${filterType}-${filterTypeValue}`,
                            onChange: handleChangeOnFilter,
                            name: `${filterType}-${filterTypeValue}`,
                            checked: filterTypeValueObj.checked,
                          }}
                          />
                      </div>
                    );
                  })}
              </fieldset>
            )
          })}
          <Button disabled={!formValid} label={"Buscar partidas"} type='submit' />
        </form>
      </aside>
      <main className={styles.statisticsByTeam}>
        <div className={styles.team}>
          <span>Equipo</span>
          <ul className={styles.team__players}>
            {
              Object.entries(filters.players.filters).filter(([playerId, playerObj]) => playerObj.checked).map(([playerId, playerObj], index) => {
                return (
                  <li key={index} className={styles.team__player}>{playerObj.label}</li>
                  )
                })
              }
          </ul>
        </div>
        <ul className={styles.game_types}>
          {Object.entries(ratingTypesFilters).map(([ratingTypeId, ratingType], index) => {
            return (
              <li key={index}>
                <Chip
                  inputProps={{
                    id: ratingTypeId,
                    name: ratingType.label,
                    onChange: handleRatingTypeClick,
                    value: ratingTypeId,
                    checked: ratingType.checked
                  }}
                  labelProps={{
                    htmlFor: ratingType.label,
                    description: ratingType.label
                  }}
                  ></Chip>
              </li>
            )
          })}
        </ul>
        {isLoading || isFetching
          ? <Loader />
          : <>
            <div className={styles.team_data}>
              {Object.entries(filteredMatchesByRatingType).length
                ? <>
                  <table className={styles.statistics}>
                    <tbody>
                    {
                      [ ...Object.entries<MatchesByRatingType>(filteredMatchesByRatingType) ].map(([ratingTypeId, matchesByRatingType], index) => {
                        const ratingType = ratingTypes.find(ratingType => ratingType.id == Number(ratingTypeId));
                        const totalWonMatches = matchesByRatingType.won.total;
                        const totalLostMatches = matchesByRatingType.lost.total;
                        const totalAllMatches = matchesByRatingType.all.total;
                        const wonPercentage = matchesByRatingType.won.percentage && matchesByRatingType.won.percentage*100;
                        const lostPercentage = matchesByRatingType.lost.percentage && matchesByRatingType.lost.percentage*100;

                        return (
                          <tr key={index}>
                            <td data-rating-type-name>{ratingType?.label} ({totalAllMatches})</td>
                            <td data-percentages>
                              <div className={styles.games_bar}>
                                {wonPercentage
                                  ? <div data-percentage-games-won className={styles.games_bar__wins} style={{ width: `${wonPercentage}%` }}><span>{`${wonPercentage}% (${totalWonMatches})`}</span></div>
                                  : null
                                }
                                {lostPercentage
                                  ? <div data-percentage-games-lost className={styles.games_bar__losses} style={{ width: `${lostPercentage}%` }}><span>{`${lostPercentage}% (${totalLostMatches})`}</span></div>
                                  : null
                                }
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    }
                    </tbody>
                  </table>
                  <table className={styles.matches}>
                    <thead>
                      <tr>
                        <th data-ranked>Ranked</th>
                        <th data-rating-type>Tipo de partida</th>
                        <th data-number-players>N°Players</th>
                        <th data-won>Ganada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches
                        .map((match: Match, index: number) => {
                          const matchRatingType = ratingTypes.find(ratingType => ratingType.id === match.ratingType) || { label: "No type found" };
                          return (
                            <tr key={index}>
                                <td data-ranked>{match.ranked ? "Ranked" : "No ranked"}</td>
                                <td data-rating-type>{matchRatingType.label}</td>
                                <td data-number-players>{match.players.length}</td>
                                <td data-won>{match.won ? "Si" : "No"}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                </>
                : <p className={styles.no_matches_filtered}>No hay partidas con estos criterios</p>
              }
            </div>
          </>
        }
      </main>
    </div>
  );
}

export default StatisticsByTeam;