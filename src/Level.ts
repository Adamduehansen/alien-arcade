import { makeSprite, t } from '@replay/core';
import { WebInputs } from '@replay/web';
import { Background } from './Background';

enum Direction {
  NoWhere = 0,
  Up = 1,
  Right = 2,
  Down = 4,
  Left = 8,
}

interface State {
  xPosition: number;
  yPosition: number;
  speed: number;
  direction: Direction;
  loaded: boolean;
}

const MAX_SPEED = 5;

const getSpeedDirection = function (
  direction: Direction,
  speed: number
): { speedX: number; speedY: number } {
  switch (direction) {
    case Direction.Up:
      return { speedX: 0, speedY: speed };
    case Direction.Down:
      return { speedX: 0, speedY: -speed };
    case Direction.Left:
      return { speedX: -speed, speedY: 0 };
    case Direction.Right:
      return { speedX: speed, speedY: 0 };
    case Direction.Up + Direction.Right:
      return { speedX: speed, speedY: speed };
    case Direction.Up + Direction.Left:
      return { speedX: -speed, speedY: speed };
    case Direction.Down + Direction.Right:
      return { speedX: speed, speedY: -speed };
    case Direction.Down + Direction.Left:
      return { speedX: -speed, speedY: -speed };
    default:
      return { speedX: 0, speedY: 0 };
  }
};

export const Level = makeSprite<Record<string, unknown>, State, WebInputs>({
  init: function ({ updateState, preloadFiles }) {
    preloadFiles({
      imageFileNames: ['Spaceship_16x16.png'],
    }).then(() => {
      updateState((state) => {
        return {
          ...state,
          loaded: true,
        };
      });
    });

    return {
      xPosition: 0,
      yPosition: 0,
      speed: 0,
      direction: Direction.NoWhere,
      loaded: false,
    };
  },
  loop: function ({ state, device }) {
    if (!state.loaded) {
      return { ...state };
    }

    let { xPosition, yPosition, speed, direction } = state;

    const { inputs } = device;

    if (
      inputs.keysDown['ArrowUp'] ||
      inputs.keysDown['ArrowDown'] ||
      inputs.keysDown['ArrowRight'] ||
      inputs.keysDown['ArrowLeft']
    ) {
      if (speed < MAX_SPEED) {
        speed += 0.1;
      } else {
        speed = MAX_SPEED;
      }
    } else {
      if (speed > 0) {
        speed -= 0.1;
      } else {
        speed = 0;
      }
    }

    const keysDown = Object.keys(inputs.keysDown);

    if (keysDown.includes('ArrowUp')) {
      direction = Direction.Up;
    }

    if (keysDown.includes('ArrowDown')) {
      direction = Direction.Down;
    }

    if (keysDown.includes('ArrowLeft')) {
      direction = Direction.Left;
    }

    if (keysDown.includes('ArrowRight')) {
      direction = Direction.Right;
    }

    if (keysDown.includes('ArrowUp') && keysDown.includes('ArrowRight')) {
      direction = Direction.Up | Direction.Right;
    }

    if (keysDown.includes('ArrowUp') && keysDown.includes('ArrowLeft')) {
      direction = Direction.Up | Direction.Left;
    }

    if (keysDown.includes('ArrowDown') && keysDown.includes('ArrowLeft')) {
      direction = Direction.Down | Direction.Left;
    }

    if (keysDown.includes('ArrowDown') && keysDown.includes('ArrowRight')) {
      direction = Direction.Down | Direction.Right;
    }

    if (speed) {
      const { speedX, speedY } = getSpeedDirection(direction, speed);
      yPosition += speedY;
      xPosition += speedX;
    } else {
      direction = Direction.NoWhere;
    }

    return {
      ...state,
      xPosition,
      yPosition,
      speed,
      direction,
    };
  },
  render: function ({ state }) {
    if (!state.loaded) {
      return [
        Background({
          id: 'Background',
        }),
        t.text({
          color: 'yellow',
          text: 'Loading...',
        }),
      ];
    } else {
      return [
        Background({
          id: 'Background',
        }),
        t.image({
          fileName: 'Spaceship_16x16.png',
          height: 50,
          width: 50,
          y: state.yPosition,
          x: state.xPosition,
        }),
      ];
    }
  },
});
