import React from 'react';
import { Link } from 'react-router-dom';
import { Player } from '../../types/Player';
import styles from './PlayerCard.module.scss';

interface propsTypes {
  player: {
    name: Player["name"],
    steamId: Player["steamId"],
  }
}

const PlayerCard = ({ player }: propsTypes) => {
  const { name, steamId } = player;
  return (
    <li className={`${styles.root} ${true ? "cursor-pointer" : ""}`}>
      <Link className={`${styles.player}`} to={`/players/${steamId}`}>
        <p className={styles.player__name}>{`${name}`}</p>
        <p className={styles.player__steamId}>{`(${steamId})`}</p>
      </Link>  
    </li>
  );
};

export default PlayerCard;