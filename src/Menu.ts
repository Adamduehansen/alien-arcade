import { makeSprite, t } from '@replay/core';
import { WebInputs } from '@replay/web';
import { Background } from './Background';
import { MenuButton } from './MenuButton';

interface State {
  titleScale: number;
  titleScaleDirection: 'Up' | 'Down' | never;
  selectedMenuButton: 'Play' | 'Leaderboard';
}

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
}

export const Menu = makeSprite<Props, State, WebInputs>({
  init: function () {
    return {
      titleScale: 5,
      titleScaleDirection: 'Up',
      selectedMenuButton: 'Play',
    };
  },
  loop: function ({ props, state, device }) {
    let { titleScale, titleScaleDirection, selectedMenuButton } = state;

    switch (titleScaleDirection) {
      case 'Up':
        titleScale += 0.05;
        break;
      case 'Down':
        titleScale -= 0.05;
        break;
    }

    if (titleScale > 7 && titleScaleDirection === 'Up') {
      titleScaleDirection = 'Down';
    } else if (titleScale < 5 && titleScaleDirection === 'Down') {
      titleScaleDirection = 'Up';
    }

    if (device.inputs.keysJustPressed['ArrowDown']) {
      selectedMenuButton = 'Leaderboard';
    } else if (device.inputs.keysJustPressed['ArrowUp']) {
      selectedMenuButton = 'Play';
    }

    if (device.inputs.keysJustPressed['Enter']) {
      if (selectedMenuButton === 'Play') {
        props.onPlay();
      } else if (selectedMenuButton === 'Leaderboard') {
        props.onLeaderboard();
      }
    }

    return {
      titleScale,
      titleScaleDirection,
      selectedMenuButton,
    };
  },
  render: function ({ state, device }) {
    return [
      Background({
        id: 'Background',
      }),
      t.text({
        color: 'yellow',
        text: 'Alien Arcade',
        scaleY: state.titleScale,
        scaleX: state.titleScale,
        y: device.size.height / 2 - 100,
      }),
      MenuButton({
        id: 'PlayButton',
        text: 'Play',
        width: 150,
        height: 50,
        size: 3,
        selected: state.selectedMenuButton === 'Play',
      }),
      MenuButton({
        id: 'LeaderboardButton',
        text: 'Leaderboard',
        width: 250,
        height: 50,
        size: 3,
        y: -70,
        selected: state.selectedMenuButton === 'Leaderboard',
      }),
    ];
  },
});
