import { Container, TextStyle, Sprite, Assets, Texture } from 'pixi.js';
import { Select } from '@pixi/ui';
import { playSound } from '../Utils/Sound';
import { ItemManager } from '../Managers/ItemsManager';
import { LIST } from '../../config';
import { Event } from '../Managers/EventManager';
import gsap from 'gsap';
export class List {
  public container: Container;
  public helperStepOne: boolean = false;
  public helperStepTwo: boolean = false;
  public helperStart: boolean = false;

  constructor() {
    this.container = new Container();
    this.initList();

    Event.once('HELPER:SHOW', () => {
      this.helperStart = true;
    });
  }

  private createTextStyles(): { labelStyle: TextStyle; itemTextStyle: TextStyle } {
    const labelStyle: TextStyle = new TextStyle(LIST.labelStyle) as TextStyle;
    const itemTextStyle: TextStyle = new TextStyle(LIST.itemStyle) as TextStyle;
    return { labelStyle, itemTextStyle };
  }

  private createBackgroundSprites(): { openBgSprite: Sprite; closeBgSprite: Sprite } {
    const openTexture: Texture = Assets.get(LIST.texOpen);
    const closeTexture: Texture = Assets.get(LIST.texClose);

    const openBgSprite: Sprite = new Sprite(openTexture);
    openBgSprite.x = LIST.openBgSprite.x;
    openBgSprite.scale.set(LIST.openBgSprite.scale);
    openBgSprite.anchor.set(0.5);

    const closeBgSprite: Sprite = new Sprite(closeTexture);
    closeBgSprite.scale.set(LIST.closedBgSprite.scale);

    return { openBgSprite, closeBgSprite };
  }

  private createSelectList(labelStyle: TextStyle, itemTextStyle: TextStyle, openBgSprite: Sprite, closeBgSprite: Sprite, listItems: string[]): Select {
    return new Select({
      closedBG: openBgSprite,
      openBG: closeBgSprite,
      textStyle: labelStyle,
      items: {
        items: listItems,
        textStyle: itemTextStyle,
        backgroundColor: LIST.selectItems.backgroundColor,
        hoverColor: LIST.selectItems.hoverColor,
        width: LIST.selectItems.width,
        height: LIST.selectItems.height,
      },
      scrollBox: {
        width: LIST.scrollBox.width,
        height: LIST.scrollBox.height,
        radius: LIST.scrollBox.radius,
        offset: {
          x: LIST.scrollBox.offset.x,
          y: LIST.scrollBox.offset.y,
        },
      },
    });
  }

  private attachEventHandlers(selectList: Select, listIDs: string[], itemManager: ItemManager): void {
    selectList.onSelect.connect((value: number) => {
      if (!this.helperStepTwo && this.helperStart) {
        Event.dispatch('HELPER:NEXT:STEP');
        Event.dispatch('GRID:ENABLE');
        this.helperStepTwo = true;
      }
      const id: string = listIDs[value];
      itemManager.selectedItem = id;
      gsap.to(selectList.scale, { duration: 0.25, x: LIST.scale, y: LIST.scale, ease: 'elastic' });
    });
    selectList.eventMode = 'static';
    selectList.addEventListener('pointerdown', () => {
      gsap.to(selectList.scale, { duration: 0.25, x: LIST.scale + 0.1, y: LIST.scale + 0.1, ease: 'elastic' });
      playSound('sound_click');
      if (!this.helperStepOne && this.helperStart) {
        Event.dispatch('HELPER:NEXT:STEP');
        this.helperStepOne = true;
      }
    });
  }

  private initList(): void {
    const itemManager = ItemManager.getInstance();
    const listItems: string[] = LIST.listItems;
    const listIDs: string[] = LIST.listID;

    const { labelStyle, itemTextStyle } = this.createTextStyles();
    const { openBgSprite, closeBgSprite } = this.createBackgroundSprites();

    const selectList: Select = this.createSelectList(labelStyle, itemTextStyle, openBgSprite, closeBgSprite, listItems);
    this.container.addChild(selectList);

    this.attachEventHandlers(selectList, listIDs, itemManager);

    selectList.position.set(LIST.x, LIST.y);
    selectList.scale.set(LIST.scale);
    itemManager.selectedItem = listIDs[0];
  }
}
