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

interface Position {
  x: number;
  y: number;
}

interface State {
  player: Position;
  speed: number;
  direction: Direction;
  loaded: boolean;
  rockets: Array<Position>;
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
      player: {
        x: 0,
        y: 0,
      },
      speed: 0,
      direction: Direction.NoWhere,
      loaded: false,
      rockets: [],
    };
  },
  loop: function ({ state, device }) {
    if (!state.loaded) {
      return { ...state };
    }

    let { speed, direction, rockets } = state;
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

    if (inputs.keysDown['ArrowUp']) {
      direction = Direction.Up;
    }

    if (inputs.keysDown['ArrowDown']) {
      direction = Direction.Down;
    }

    if (inputs.keysDown['ArrowLeft']) {
      direction = Direction.Left;
    }

    if (inputs.keysDown['ArrowRight']) {
      direction = Direction.Right;
    }

    if (inputs.keysDown['ArrowUp'] && inputs.keysDown['ArrowRight']) {
      direction = Direction.Up | Direction.Right;
    }

    if (inputs.keysDown['ArrowUp'] && inputs.keysDown['ArrowLeft']) {
      direction = Direction.Up | Direction.Left;
    }

    if (inputs.keysDown['ArrowDown'] && inputs.keysDown['ArrowLeft']) {
      direction = Direction.Down | Direction.Left;
    }

    if (inputs.keysDown['ArrowDown'] && inputs.keysDown['ArrowRight']) {
      direction = Direction.Down | Direction.Right;
    }

    if (speed) {
      const { speedX, speedY } = getSpeedDirection(direction, speed);
      state.player.y += speedY;
      state.player.x += speedX;
    } else {
      direction = Direction.NoWhere;
    }

    // Spawn rocket
    if (inputs.keysJustPressed[' ']) {
      rockets = [
        ...rockets,
        {
          x: state.player.x,
          y: state.player.y,
        },
      ];
    }

    // Update rocket positions.
    rockets = rockets.map(({ x, y }) => {
      return {
        x: x,
        y: y + 10,
      };
    });

    // Clear out-of-bounds rockets
    rockets = rockets.filter(({ y }) => {
      return y < device.size.height / 2;
    });

    return {
      ...state,
      rockets,
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
        ...state.rockets.map((position) => {
          return t.rectangle({
            color: 'red',
            width: 10,
            height: 10,
            x: position.x,
            y: position.y,
          });
        }),
        t.image({
          fileName: 'Spaceship_16x16.png',
          height: 50,
          width: 50,
          x: state.player.x,
          y: state.player.y,
        }),
      ];
    }
  },
});
