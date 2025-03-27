import * as THREE from 'three';
import { InteractionManager } from 'three.interactive';
import gsap from 'gsap';
import { SceneManager } from '../Managers/SceneManager';
import { ItemManager } from '../Managers/ItemsManager';
import { tweenScaleTO } from '../Utils/index';
import { ParticleExplosion } from '../Effects/ParticleExplosion';
import { GAME_GRID_CONFIG } from '../../config';
import { Event } from '../Managers/EventManager';

export interface GameGridOptions {
  rows: number;
  columns: number;
  cubeSize?: number;
  gap?: number;
  freeColor?: number | string;
  filledColor?: number | string;
  startX?: number;
  startZ?: number;
  sizePointer?: number;
  nonInteractiveMatrix?: number[][];
}

export class GameGrid {
  public matrix: number[][];
  public gridGroup: THREE.Group;
  private cubes: THREE.Mesh[][] = [];
  private options: GameGridOptions;
  private interactiveManager: InteractionManager;
  private isInteractive: boolean = true;
  private offsetX: number = 0;
  private offsetZ: number = 0;
  private nonInteractiveMatrix: number[][] = [];
  private sceneManager: SceneManager;
  private particleEffect: ParticleExplosion;
  public helperStart: boolean = true;

  constructor(options: GameGridOptions, interactiveManager: InteractionManager, sceneManager: SceneManager, particleEffect: ParticleExplosion) {
    this.options = { ...options };
    this.interactiveManager = interactiveManager;
    this.setInteractive();
    this.particleEffect = particleEffect;
    this.nonInteractiveMatrix = options.nonInteractiveMatrix || [];
    this.sceneManager = sceneManager;
    this.matrix = Array.from({ length: this.options.rows }, () => Array(this.options.columns).fill(0));
    this.gridGroup = new THREE.Group();
    this.createGrid();
    this.gridGroup.add(this.particleEffect);
    this.gridGroup.castShadow = true;
    this.gridGroup.receiveShadow = true;
    Event.once('HELPER:NEXT:STEP', () => {
      this.helperStart = true;
    });

    Event.once('GRID:ENABLE', () => {
      gsap.delayedCall(GAME_GRID_CONFIG.CLICK_DELAY, () => {
        this.isInteractive = false;
      });
    });
  }

  private setInteractive() {
    this.interactiveManager.closestObject = null;
    this.interactiveManager.raycaster.params.Points.threshold = GAME_GRID_CONFIG.RAYCASTER_THRESHOLD;
    this.interactiveManager.raycaster.params.Line.threshold = GAME_GRID_CONFIG.RAYCASTER_THRESHOLD;
    this.interactiveManager.raycaster.params.Mesh.threshold = GAME_GRID_CONFIG.RAYCASTER_THRESHOLD;
  }

  private calculateOffsets(cubeSize: number, gap: number, startX: number, startZ: number, rows: number, columns: number): { offsetX: number; offsetZ: number } {
    const totalWidth = columns * cubeSize + (columns - 1) * gap;
    const totalDepth = rows * cubeSize + (rows - 1) * gap;
    const offsetX = startX - totalWidth / 2 + cubeSize / 2;
    const offsetZ = startZ + totalDepth / 2 - cubeSize / 2;
    return { offsetX, offsetZ };
  }

  private createCube(row: number, col: number, geometry: THREE.BoxGeometry, cubeSize: number, gap: number): THREE.Mesh {
    const isBlocked = this.nonInteractiveMatrix && this.nonInteractiveMatrix[row] && this.nonInteractiveMatrix[row][col] === 1;
    const material = new THREE.MeshBasicMaterial({
      color: this.options.freeColor,
      transparent: true,
      opacity: GAME_GRID_CONFIG.CUBE_OPACITY,
    });
    const cube = new THREE.Mesh(geometry, material);

    cube.position.x = col * (cubeSize + gap) + this.offsetX;
    cube.position.y = GAME_GRID_CONFIG.CUBE_Y;
    cube.position.z = -row * (cubeSize + gap) + this.offsetZ;
    cube.castShadow = false;
    cube.receiveShadow = true;
    cube.userData.selected = false;

    if (!isBlocked) {
      this.interactiveManager.add(cube);
      //@ts-expect-error
      cube.addEventListener('click', () => this.handleCubeClick(cube, cubeSize, gap));
    } else {
      (cube.material as THREE.MeshBasicMaterial).color.set(GAME_GRID_CONFIG.BLOCKED_COLOR);
    }

    const outline = this.createEdges(geometry);
    cube.add(outline);

    return cube;
  }

  private handleCubeClick(cube: THREE.Mesh, cubeSize: number, gap: number) {
    if (this.isInteractive) return;
    this.isInteractive = true;
    gsap.delayedCall(GAME_GRID_CONFIG.CLICK_DELAY, () => {
      this.isInteractive = false;
    });

    if (this.helperStart) {
      Event.dispatch('HELPER:HIDE');
    }

    const col = Math.round((cube.position.x - this.offsetX) / (cubeSize + gap));
    const row = Math.round(-(cube.position.z - this.offsetZ) / (cubeSize + gap));

    if (!cube.userData.selected) {
      cube.userData.selected = true;
      this.matrix[row][col] = 1;
      (cube.material as THREE.MeshBasicMaterial).color.set(this.options.filledColor!);

      const itemManager = ItemManager.getInstance();
      if (itemManager.selectedItem) {
        const gameObj = this.sceneManager.handleMouseClick(itemManager.selectedItem);
        if (gameObj) {
          tweenScaleTO(gameObj, 0.3, 1);
          this.particleEffect.position.set(cube.position.x, 0.1, cube.position.z);
          this.particleEffect.play();
          gameObj.position.set(cube.position.x, GAME_GRID_CONFIG.GAME_OBJECT_Y, cube.position.z);
          this.gridGroup.add(gameObj);
        }
      } else {
        cube.userData.selected = false;
        this.matrix[row][col] = 0;
      }
    }
    this.updateGrid();
  }

  private createGrid() {
    const { rows, columns, cubeSize = 1, gap = 0.1, startX = 0, startZ = 0 } = this.options;
    const geometry = new THREE.BoxGeometry(cubeSize, GAME_GRID_CONFIG.GEOMETRY_HEIGHT, cubeSize);
    const offsets = this.calculateOffsets(cubeSize, gap, startX, startZ, rows, columns);
    this.offsetX = offsets.offsetX;
    this.offsetZ = offsets.offsetZ;

    for (let i = 0; i < rows; i++) {
      this.cubes[i] = [];
      for (let j = 0; j < columns; j++) {
        const cube = this.createCube(i, j, geometry, cubeSize, gap);
        this.gridGroup.add(cube);
        this.cubes[i][j] = cube;
      }
    }
  }

  protected createEdges(geometry: THREE.BufferGeometry) {
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: GAME_GRID_CONFIG.EDGE_LINE_COLOR,
      linewidth: GAME_GRID_CONFIG.EDGE_LINE_WIDTH,
      transparent: true,
      opacity: GAME_GRID_CONFIG.EDGE_OPACITY,
    });
    const outline = new THREE.LineSegments(edges, lineMaterial);
    outline.name = 'outline';
    return outline;
  }

  public updateGrid() {
    const { filledColor, freeColor, rows, columns } = this.options;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const cube = this.cubes[i]?.[j];
        if (!cube) continue;
        const cellValue = this.matrix[i][j];
        (cube.material as THREE.MeshBasicMaterial).color.set(cellValue === 1 ? filledColor! : freeColor!);
      }
    }
  }

  public fillMatrix(value: number = 1) {
    for (let i = 0; i < this.options.rows; i++) {
      this.matrix[i].fill(value);
    }
    this.updateGrid();
  }

  public clearMatrix() {
    for (let i = 0; i < this.options.rows; i++) {
      this.matrix[i].fill(0);
    }
    this.updateGrid();
  }
}
