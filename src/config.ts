// config.ts

import * as THREE from 'three';
import { SceneManagerConfig } from './core/Managers/SceneManager';

export const DEBUG = true;

export const SCENE = {
  backgroundColor: 0xa0a0a0,
  fog: {
    enabled: false,
    color: 0xa0a0a0,
    near: 20,
    far: 100,
  },
};

export const MODELS = {
  ground: 'assets/models/ground.glb',
  skybox: 'assets/models/skybox.glb',
};

export const manifest = {
  bundles: [
    {
      name: 'game-assets',
      assets: [
        { alias: 'corn', src: 'assets/images/corn.png' },
        { alias: 'cow', src: 'assets/images/cow.png' },
        { alias: 'grape', src: 'assets/images/grape.png' },
        { alias: 'money', src: 'assets/images/money.png' },
        { alias: 'plus', src: 'assets/images/plus-button.png' },
        { alias: 'sheep', src: 'assets/images/sheep.png' },
        { alias: 'smoke', src: 'assets/images/smoke.png' },
        { alias: 'strawberry', src: 'assets/images/strawberry.png' },
        { alias: 'tomato', src: 'assets/images/tomato.png' },
        { alias: 'shop_open', src: 'assets/images/Game shop green.png' },
        { alias: 'shop_close', src: 'assets/images/Game shop red.png' },
        { alias: 'finger', src: 'assets/images/finger.png' },
      ],
    },
  ],
};

export const sceneManagerConfig: SceneManagerConfig = {
  scenes: [
    {
      name: 'Base',
      models: [
        { name: 'ground', url: 'assets/models/ground.glb', position: [0, 0, 10] },
        { name: 'objects', url: 'assets/models/objects.glb', position: [70, 5, 0] },
        { name: 'sky', url: 'assets/models/skybox.glb', position: [0, 50, 0] },
      ],
    },
  ],
};

export const Animations = {
  chicken: {
    id: 'chicken_1',
    idle: 'idle_chicken',
    action: 'action_chicken',
    sound: 'sound_chicken',
  },
  sheep: {
    id: 'sheep_1',
    idle: 'idle_sheep',
    action: 'action_sheep',
    sound: 'sound_sheep',
  },
  cow: {
    id: 'cow_1',
    idle: 'idle_cow',
    action: 'action_cow',
    sound: 'sound_cow',
  },
};

export const CAMERA = {
  fov: 20,
  near: 1,
  far: 2000,
  pos: {
    x: 0,
    y: 55,
    z: 100,
  },
};

export const GRID = {
  rows: 19,
  columns: 16,
  cubeSize: 2,
  gap: 0.1,
  freeColor: 0x75735e, // light gray for free cells
  filledColor: 0x9c0000, // blue for filled cells
  startX: -1,
  startZ: 3,
  sizePointer: 2,

  // Приклад матриці для блокування клітин (1 = заблоковано, 0 = доступно)
  nonInteractiveMatrix: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

export const GAME_GRID_CONFIG = {
  RAYCASTER_THRESHOLD: 0.1,
  GEOMETRY_HEIGHT: 0.1,
  CUBE_Y: 4.4,
  GAME_OBJECT_Y: 4.2,
  CLICK_DELAY: 0.3,
  CUBE_OPACITY: 0.01,
  BLOCKED_COLOR: 0x888888,
  EDGE_LINE_COLOR: 0x000000,
  EDGE_LINE_WIDTH: 1,
  EDGE_OPACITY: 0,
};

export const RENDERER = {
  antialias: false,
  pixelRatio: window.devicePixelRatio,
  shadow: {
    enabled: true,
    type: THREE.PCFShadowMap,
  },
};

export const TWEENS = {
  ligthChange: {
    duration: 2,
    ease: 'power2.inOut',
  },
};

export const DIRECTIONAL_LIGHT_PRESETS = {
  day: {
    color: 0xffffff,
    intensity: 6,
    position: { x: 50, y: 60, z: 50 },
    shadow: {
      camera: {
        left: -50,
        right: 50,
        top: 50,
        bottom: -50,
        near: 0.0,
        far: 1000,
      },
      bias: -0.0004,
      normalBias: 0.005,
      mapSize: { x: 4096, y: 4096 },
    },
  },
  night: {
    color: 0x6666ff,
    intensity: 1,
    position: { x: 10, y: 30, z: 10 },
    shadow: {
      camera: {
        left: -30,
        right: 30,
        top: 30,
        bottom: -30,
        near: 50,
        far: 100,
      },
      bias: -0.0002,
      normalBias: 0.005,
      mapSize: { x: 2048, y: 2048 },
    },
  },
  morning: {
    color: 0xffcc99,
    intensity: 6,
    position: { x: -20, y: 40, z: 20 },
    shadow: {
      camera: {
        left: -40,
        right: 40,
        top: 40,
        bottom: -40,
        near: 1,
        far: 150,
      },
      bias: -0.0003,
      normalBias: 0.007,
      mapSize: { x: 2048, y: 2048 },
    },
  },
  dusk: {
    color: 0xff9966,
    intensity: 4,
    position: { x: -30, y: 25, z: -20 },
    shadow: {
      camera: {
        left: -40,
        right: 40,
        top: 40,
        bottom: -40,
        near: 1,
        far: 150,
      },
      bias: -0.0003,
      normalBias: 0.007,
      mapSize: { x: 2048, y: 2048 },
    },
  },
};

export const UI = {};

export const LIST = {
  x: 50,
  y: 200,
  scale: 0.5,
  listItems: ['CHICKEN', 'CORN', 'COW', 'GRAPE', 'SHEEP', 'STRABERRY', 'TOMATO'],
  listID: ['chicken_1', 'corn_1', 'cow_1', 'grape_1', 'sheep_1', 'strawberry_1', 'tomato_1'],
  texOpen: 'shop_open',
  texClose: 'shop_close',
  labelStyle: {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 2, lineJoin: 'round' },
    dropShadow: {
      color: 'RGBA(0, 0, 0, 0.5)',
      blur: 4,
      angle: Math.PI / 6,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  },
  itemStyle: {
    fontFamily: 'Arial',
    fontSize: 20,
    fill: '#ffffff',
    stroke: { color: '#4a1850', width: 2, lineJoin: 'round' },
    dropShadow: {
      color: 'RGBA(0, 0, 0, 0.5)',
      blur: 2,
      angle: Math.PI / 6,
      distance: 2,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  },
  selectItems: {
    width: 200,
    height: 50,
    backgroundColor: 'RGBA(245, 66, 66, 0.5)',
    hoverColor: 'RGBA(245, 66, 66, 0.7)',
  },
  scrollBox: {
    width: 200,
    height: 350,
    radius: 30,
    offset: {
      x: 200,
      y: -200,
    },
  },
  openBgSprite: {
    x: 20,
    scale: 0.3,
  },
  closedBgSprite: {
    scale: 0.3,
  },
};

export const POPUP_CONFIG = {
  width: 400,
  height: 200,
  backgroundColor: 'RGBA(245, 66, 66, 0.8)',
  borderColor: 0xffffff,
  borderThickness: 2,
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff',
    wordWrap: true,
    aling: 'center',
    wordWrapWidth: 440,
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: 'RGBA(245, 66, 6, 0.5)',
    borderColor: 0xffffff,
    borderThickness: 2,
    textStyle: {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: '#ffffff',
    },
  },
  spacing: 50,
};

export type CameraAnimationConfig = {
  duration: number;
  delay: number;
  ease: string;
};

export const DEFAULT_CAMERA_ANIMATION_CONFIG: CameraAnimationConfig = {
  duration: 0.24,
  delay: 0,
  ease: 'power4.in',
};

export const HELPER = {
  steps: [
    { position: { x: 100, y: 300 }, text: 'Welcome! Click here to start.' },
    { position: { x: 250, y: 350 }, text: 'Great! Now, select Ship.' },
    { position: { x: 500, y: 500 }, text: 'Almost done! Click on field to buy ship!.' },
  ],
  handAnimationDuration: 0.5,
  loopAnimation: { scaleMin: 0.05, scaleMax: 0.1, duration: 1 },
};
