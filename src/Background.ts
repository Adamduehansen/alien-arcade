import { makeSprite, t } from '@replay/core';

export const Background = makeSprite<Record<string, unknown>>({
  render: function ({ device }) {
    return [
      t.rectangle({
        width: device.size.width,
        height: device.size.height,
        color: 'black',
      }),
    ];
  },
});
