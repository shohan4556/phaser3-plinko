import * as Phaser from 'phaser';
import { RectData, TextObject } from '../types';

export class PhaserHelpers {

    constructor() { }

    static createContainer(scene: Phaser.Scene, width: number, height: number, debugFill?: boolean): Phaser.GameObjects.Container {
        const container = scene.add?.container(0, 0);
        // container.setDepth(100);
        container.setSize(width, height);

        if (debugFill) {
            const rect = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
            const graphics = scene.add.graphics();
            graphics.fillRectShape(rect).fillStyle(0xfffff);
            graphics.setName('mask');
            container.add(graphics);
        }
        return container;
    }

    static addRectangle(rectData: RectData, context: Phaser.Scene, debugFill: boolean = false): Phaser.GameObjects.Rectangle {
        const { x, y, width, height, depth, name, color, alpha, stroke, strokeColor } = rectData;

        const rect = context.add.rectangle(x || 0, y || 0, width || 0, height || 0, color || 0xffffff);
        if (depth) rect.setDepth(depth);
        if (alpha != null) rect.alpha = alpha;
        if (name) rect.setName(name);

        if (debugFill) {
            const rectShape = new Phaser.Geom.Rectangle(x - width / 2 || 0, y - height / 2 || 0, width || 0, height || 0);
            const graphics = context.add.graphics();
            graphics.fillRectShape(rectShape).fillStyle(0xffffff);
            graphics.setName('mask');
        }

        if (stroke && strokeColor != null) {
            rect.setStrokeStyle(stroke, strokeColor);
        }

        return rect;
    }

    static addRoundedRectangle(rectData: RectData, context: Phaser.Scene): Phaser.GameObjects.Graphics {
        const { x, y, width, height, radius, color, name, alpha, stroke, strokeColor } = rectData;

        const graphics = context.add.graphics();
        graphics.fillStyle(color || 0xffffff, 1);
        graphics.fillRoundedRect(x || 0, y || 0, width || 0, height || 0, radius || 0);
        graphics.setName(name || '');
        if (alpha != null) graphics.alpha = alpha;

        if (stroke && strokeColor != null) {
            graphics.lineStyle(stroke, strokeColor, 1);
            graphics.strokeRoundedRect(x || 0, y || 0, width || 0, height || 0, radius || 0);
        }

        return graphics;
    }

    static addSimpleText(text: string, x: number, y: number, context: Phaser.Scene) {
        return context.add.text(x, y, text, {
            fontFamily: "Roboto-Medium",
            fontSize: 50,
            color: "#ffffff",
            stroke: '#334455',
            strokeThickness: 6
        })
            .setOrigin(0.5)
            .setDepth(2)
            .setInteractive();
    }

    static addText(textData: TextObject, context: Phaser.Scene): Phaser.GameObjects.Text {
        const { x, y, text, style, origin, angle, wordWrapWidth, lineHeight, depth, isInterActive } = textData;

        const textStyle = style || null;
        const textObject = context.add.text(x || 0, y || 0, text || '', textStyle);
        if (origin) textObject.setOrigin(origin.x, origin.y);
        if (angle != null) textObject.angle = angle;
        if (wordWrapWidth != null) textObject.style.setWordWrapWidth(wordWrapWidth);
        if (lineHeight != null) textObject.setLineSpacing(lineHeight);
        if (isInterActive != null) textObject.setInteractive();
        if (depth) textObject.depth = depth;

        return textObject;
    }

    static destroyAll(items: Phaser.GameObjects.GameObject[]): void {
        items.forEach((item) => item.destroy());
    }

    static randomizeArray<T>(arr: T[]): T[] {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    static randomizeString(str: string): string {
        const arr = str.split('');
        return PhaserHelpers.randomizeArray(arr).join('');
    }
}
