import { makeSprite, t } from '@replay/core';

export interface Props {
  text: string;
  width: number;
  height: number;
  size: number;
  selected: boolean;
}

export const MenuButton = makeSprite<Props>({
  render: function ({ props }) {
    return [
      t.rectangle({
        color: props.selected ? 'white' : 'black',
        width: props.width + 10,
        height: props.height + 10,
      }),
      t.rectangle({
        color: 'yellow',
        width: props.width,
        height: props.height,
      }),
      t.text({
        color: 'black',
        text: props.text,
        scaleX: props.size,
        scaleY: props.size,
      }),
    ];
  },
});
