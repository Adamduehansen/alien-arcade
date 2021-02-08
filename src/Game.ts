import { GameProps, makeSprite } from '@replay/core';
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
  render: function () {
    return [
      Menu({
        id: 'Menu',
      }),
    ];
  },
});
