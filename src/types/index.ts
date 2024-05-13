export interface ImageLoadConfig {
    key: string;
    path: string;
}

export interface SpritesheetLoadConfig {
  key: string;
  path: string;
  frameConfig: {
    frameWidth: number;
    frameHeight: number;
  };
}

export interface vector2 {
  x: number;
  y: number;
}

export interface AudioLoadConfig {
    key: string;
    volume: number;
    path: string;
}

export interface ItemBase {
  x: number;
  y: number;
  texture?: string;
  name?: string;
  scale?: { scaleX: number; scaleY: number };
  origin?: { x: number; y: number };
  offset?: { x: number; y: number };
}

export interface ItemData extends ItemBase {
  align?: 'center' | 'left' | 'right';
  frame?: string;
  flipX?: boolean;
  flipY?: boolean;
  depth?: number;
  scrollFactor?: number;
  angle?: number;
  color?: number;
  radius?: number;
  alpha?: number;
  stroke?: number;
  strokeColor?: number;
}

export interface TextObject extends ItemData {
  text: string;
  style?: Phaser.Types.GameObjects.Text.TextStyle;
  wordWrapWidth?: number;
  lineHeight?: number;
  isInterActive?: boolean;
}

export interface RectData extends ItemData {
    width: number;
    height: number;
}

export interface ImageButtonConfig {
    id?: string;
    x: number;
    y: number;
    angle?: number;
    depth?: number;
    scaleX?: number;
    scaleY?: number;
    scale?: number;
    frames: {
        texture: string;
        up?: string;
        over?: string;
        down?: string ;
        disabled?: string;
        highlightedUp?: string;
        highlightedOver?: string;
        highlightedDown?: string;
    };
    hitArea?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    text?: {
        lineHeight: number;
        text: string;
        xOffset: number;
        yOffset: number;
        origin: { x: number; y: number };
        upStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        overStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        downStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        disabledStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        highlightedUpStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        highlightedOverStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
        highlightedDownStyle: { style: Phaser.Types.GameObjects.Text.TextStyle };
    };
}