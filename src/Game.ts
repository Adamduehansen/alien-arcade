import { GameProps, makeSprite } from '@replay/core';
import { Level } from './Level';
import { Menu } from './Menu';

type Screen = 'Menu' | 'Level';

interface GameState {
  screen: Screen;
}

export const gameProps: GameProps = {
  id: 'Game',
  size: {
    width: 600,
    height: 800,
  },
};

export const Game = makeSprite<GameProps, GameState>({
  init: function () {
    return {
      screen: 'Menu',
    };
  },
  render: function ({ state, updateState }) {
    return [
      state.screen === 'Menu'
        ? Menu({
            id: 'Menu',
            onPlay: () => {
              updateState((state) => {
                return {
                  ...state,
                  screen: 'Level',
                };
              });
            },
            onLeaderboard: () => {
              console.log('Going to leaderboard');
            },
          })
        : null,
      state.screen === 'Level'
        ? Level({
            id: 'Level',
          })
        : null,
    ];
  },
});
