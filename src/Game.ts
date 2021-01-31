import { GameProps, makeSprite, t } from '@replay/core';

export const gameProps: GameProps = {
  id: 'Game',
  size: {
    width: 400,
    height: 600,
  },
};

export const Game = makeSprite<GameProps>({
  render: function ({ device }) {
    return [
      t.rectangle({
        color: 'black',
        width: device.size.width,
        height: device.size.height,
      }),
    ];
  },
});
