import Phaser from 'phaser';
import { ImageButtonConfig } from '../types';

export class ImageButton extends Phaser.GameObjects.Image {
    private config: ImageButtonConfig;
    private callback: (button: ImageButton) => void;
    private text: Phaser.GameObjects.Text | null;
    private highlighted: boolean;
    private disabled: boolean;
    private hitRect: Phaser.Geom.Rectangle | null;
    private id: string;

    constructor(scene: Phaser.Scene, config: ImageButtonConfig, onUpCallback: (button: ImageButton) => void) {
        super(scene, config.x, config.y, config.frames.texture, config.frames.up);
        this.scene = scene;
        this.config = config;
        this.callback = onUpCallback;
        this.highlighted = false;
        this.disabled = false;
        this.hitRect = config.hitArea
            ? new Phaser.Geom.Rectangle(config.hitArea.x, config.hitArea.y, config.hitArea.width, config.hitArea.height)
            : null;
        this.id = config.id || '';
        this.text = null;

        if (config.angle !== undefined) {
            this.angle = config.angle;
        }
        if (config.depth !== undefined) {
            this.depth = config.depth;
        }
        if (config.scaleX !== undefined) {
            this.scaleX = config.scaleX;
        }
        if (config.scaleY !== undefined) {
            this.scaleY = config.scaleY;
        }
        if (config.scale !== undefined) {
            this.setScale(config.scale);
        }

        this.setOrigin(0.5);
        this.addText();
        this.enable();

        this.scene.add.existing(this);
    }

    enable(): void {
        if (this.hitRect) {
            this.setInteractive({ hitArea: this.hitRect, useHandCursor: true }, this.checkHitRect);
        } else {
            this.setInteractive({ useHandCursor: true });
        }
        this.on('pointerover', this.onOver, this);
        this.on('pointerdown', this.onDown, this);
        this.on('pointerout', this.onOut, this);
        this.on('pointerup', this.onUp, this);
        this.setFrame(this.config.frames.up);
        if (this.text) {
            this.text.setStyle(this.config.text.upStyle.style);
        }
        this.disabled = false;
    }

    disable(changeVisuals: boolean = true): void {
        this.off('pointerover', this.onOver, this);
        this.off('pointerdown', this.onDown, this);
        this.off('pointerout', this.onOut, this);
        this.off('pointerup', this.onUp, this);
        this.setInteractive(false);
        if (this.config.frames.disabled && changeVisuals) {
            this.setFrame(this.config.frames.disabled);
        }
        if (this.text && this.config.text.disabledStyle && changeVisuals) {
            this.text.setStyle(this.config.text.disabledStyle.style);
        }
        this.disabled = true;
    }

    isDisabled(): boolean {
        return this.disabled;
    }

    highlight(): void {
        if (this.config.frames.highlightedUp) {
            this.setFrame(this.config.frames.highlightedUp);
        }
        this.highlighted = true;
    }

    unhighlight(): void {
        this.setFrame(this.config.frames.up);
        this.highlighted = false;
    }

    toggleHighlight(): boolean {
        if (this.highlighted) {
            this.unhighlight();
        } else {
            this.highlight();
        }
        return this.highlighted;
    }

    isHighlighted(): boolean {
        return this.highlighted;
    }

    onOver(pointer: Phaser.Input.Pointer): void {
        if (this.highlighted && this.config.frames.highlightedOver) {
            this.setTexture(this.config.frames.highlightedOver);
        } else if (this.config.frames.over) {
            this.setTexture(this.config.frames.over);
        }
        if (this.text) {
            if (this.highlighted && this.config.text.highlightedOverStyle) {
                this.text.setStyle(this.config.text.highlightedOverStyle.style);
            } else if (this.config.text.overStyle) {
                this.text.setStyle(this.config.text.overStyle.style);
            }
        }
    }

    onDown(pointer: Phaser.Input.Pointer): void {
        if (this.highlighted && this.config.frames.highlightedDown) {
            this.setTexture(this.config.frames.highlightedDown);
        } else if (this.config.frames.down) {
            this.setTexture(this.config.frames.down);
        }
        if (this.text) {
            if (this.highlighted && this.config.text.highlightedDownStyle) {
                this.text.setStyle(this.config.text.highlightedDownStyle.style);
            } else if (this.config.text.downStyle) {
                this.text.setStyle(this.config.text.downStyle.style);
            }
        }
    }

    onOut(pointer: Phaser.Input.Pointer): void {
        if (this.highlighted && this.config.frames.highlightedUp) {
            this.setTexture(this.config.frames.highlightedUp);
        } else {
            this.setTexture(this.config.frames.up);
        }
        if (this.text) {
            if (this.highlighted && this.config.text.highlightedUpStyle) {
                this.text.setStyle(this.config.text.highlightedUpStyle.style);
            } else {
                this.text.setStyle(this.config.text.upStyle.style);
            }
        }
    }

    onUp(pointer: Phaser.Input.Pointer): void {
        if (this.highlighted && this.config.frames.highlightedUp) {
            this.setTexture(this.config.frames.highlightedUp);
        } else {
            this.setTexture(this.config.frames.up);
        }
        if (this.text) {
            if (this.highlighted && this.config.text.highlightedUpStyle) {
                this.text.setStyle(this.config.text.highlightedUpStyle.style);
            } else {
                this.text.setStyle(this.config.text.upStyle.style);
            }
        }
        this.callback(this);
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    moveTo(newX: number, newY: number): void {
        this.x = newX;
        this.y = newY;
        if (this.text) {
            this.text.x = newX + this.config.text.xOffset;
            this.text.y = newY + this.config.text.yOffset;
        }
    }

    tweenTo(newX: number, newY: number, duration: number, ease: string = 'linear'): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const targets: any[] = [this];
        if (this.text) {
            targets.push(this.text);
        }
        const xDiff: number = newX - this.x;
        const yDiff: number = newY - this.y;
        const tween: Phaser.Tweens.Tween = this.scene.tweens.add({
            targets: targets,
            x: '+=' + xDiff,
            y: '+=' + yDiff,
            duration: duration,
            ease: ease
        });
    }

    checkHitRect(hitArea: Phaser.Geom.Rectangle, x: number, y: number, gameObject: Phaser.GameObjects.Image): boolean {
        if (x >= hitArea.x && x <= (hitArea.x + hitArea.width) && y >= hitArea.y && y <= (hitArea.y + hitArea.height)) {
            return true;
        } else {
            return false;
        }
    }

    private addText(): void {
        if (this.config.text) {
            this.text = this.scene.add.text(
                this.config.x + this.config.text.xOffset,
                this.config.y + this.config.text.yOffset,
                this.config.text.text,
                this.config.text.upStyle.style
            );
            if (this.config.text.origin) {
                this.text.setOrigin(this.config.text.origin.x, this.config.text.origin.y);
            }
            if (this.config.text.lineHeight) {
                this.text.setLineSpacing(this.config.text.lineHeight);
            }
            this.text.depth = this.depth + 1;
        }
    }

    setText(text: string): void {
        if (this.text) {
            this.text.text = text;
        }
    }

    cleanUp(): void {
        this.disable();
        if (this.text) {
            this.text.destroy();
        }
        this.destroy();
    }
}
