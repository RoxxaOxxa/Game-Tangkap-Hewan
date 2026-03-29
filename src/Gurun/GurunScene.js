// ============================================================
//  GurunScene.js — Pilih Level Gurun (dengan Level Lock)
//  Progres disimpan: localStorage key "gurun_maxLevel"
//  Asset: Asset/Gurun/bgGurun.png, 1.png, 2.png, 3.png
// ============================================================

class GurunScene extends Phaser.Scene {
    constructor() {
        super("GurunScene");
        this.isMuted = false;
    }

    preload() {
        this.load.image("gurun_bg",     "Asset/Gurun/bgGurun.png");
        this.load.image("gurun_lv1",    "Asset/Gurun/1.png");
        this.load.image("gurun_lv2",    "Asset/Gurun/2.png");
        this.load.image("gurun_lv3",    "Asset/Gurun/3.png");
        this.load.image("gurun_gembok", "Asset/Gurun/gembok.png");
        this.load.image("gurun_awan",   "Asset/Gurun/Awan.png");

        if (!this.cache.audio.exists("sfxClick")) {
            this.load.audio("sfxClick", "Asset/Sound/select.mp3");
        }
    }

    create() {
        if (this.registry.has("isMuted")) {
            this.isMuted = this.registry.get("isMuted");
            this.sound.mute = this.isMuted;
        }

        if (this.cache.audio.exists("bgmMenu")) {
            let bgms = this.sound.getAll("bgmMenu");
            if (bgms.length === 0) {
                this.sound.add("bgmMenu", { loop: true, volume: 0.35 }).play();
            } else if (!bgms[0].isPlaying && !this.isMuted) {
                bgms[0].play();
            }
        }

        this.cameras.main.fadeIn(450, 0, 0, 0);
        this._buildLayout();
    }

    _getMaxLevel() {
        return parseInt(localStorage.getItem("gurun_maxLevel") || "1");
    }

    _buildLayout() {
        const w        = this.scale.width;
        const h        = this.scale.height;
        const ui       = Math.min(w / 900, h / 550);
        const maxLevel = this._getMaxLevel();

        // ── Background ──
        this.add.image(w / 2, h / 2, "gurun_bg").setDisplaySize(w, h);
        this.add.rectangle(w / 2, h / 2, w, h, 0x1a0a00, 0.38);

        // ── Awan animasi ── (di gurun bisa berupa debu/kabut tipis)
        const cloudSc = ui * 0.6;
        const cloud1 = this.add.image(-160, h * 0.10, "gurun_awan")
            .setScale(cloudSc).setAlpha(0.55).setDepth(1).setTint(0xffe0a0);
        const cloud2 = this.add.image(w + 160, h * 0.20, "gurun_awan")
            .setScale(cloudSc * 0.75).setAlpha(0.40).setDepth(1).setTint(0xffc060);

        this.tweens.add({ targets: cloud1, x: w + 180, duration: 32000, ease: "Linear", repeat: -1, onRepeat: () => { cloud1.x = -160; } });
        this.tweens.add({ targets: cloud2, x: -160,    duration: 44000, ease: "Linear", repeat: -1, onRepeat: () => { cloud2.x = w + 180; } });

        // ── Judul ──
        const title = this.add.text(w / 2, -60, "🏜️  HABITAT GURUN", {
            fontSize: `${Math.floor(48 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffe8a0", stroke: "#3a1a00", strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 3, color: "#000", blur: 6, fill: true },
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        const sub = this.add.text(w / 2, -60, "Pilih Level", {
            fontSize: `${Math.floor(24 * ui)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#ffcc66", stroke: "#3a1a00", strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        this.tweens.add({ targets: title, y: h * 0.14, alpha: 1, duration: 600, ease: "Back.out(1.4)", delay: 80 });
        this.tweens.add({ targets: sub,   y: h * 0.24, alpha: 1, duration: 500, ease: "Back.out(1.4)", delay: 200 });
        this.time.delayedCall(720, () => {
            this.tweens.add({ targets: title, y: h * 0.14 - 8, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        });

        // ── Tombol Level ──
        const levels = [
            { key: "gurun_lv1", level: 1, desc: "Mudah" },
            { key: "gurun_lv2", level: 2, desc: "Sedang" },
            { key: "gurun_lv3", level: 3, desc: "Sulit" },
        ];

        const btnScale = ui * 1.1;
        const totalW   = w * 0.72;
        const colW     = totalW / 3;
        const startX   = w / 2 - totalW / 2 + colW / 2;
        const btnY     = h * 0.56;

        levels.forEach((lvl, i) => {
            const bx       = startX + i * colW;
            const unlocked = lvl.level <= maxLevel;

            const btn = this.add.image(bx, btnY, lvl.key).setScale(0).setAlpha(0).setDepth(3);
            if (!unlocked) btn.setTint(0x806040);

            this.tweens.add({
                targets: btn, scale: btnScale, alpha: 1,
                duration: 400, delay: 350 + i * 120, ease: "Back.out(1.7)",
                onComplete: () => {
                    if (unlocked) {
                        this._makeBouncyButton(btn, btnScale, () => {
                            this._playClick();
                            this.cameras.main.fadeOut(350, 0, 0, 0);
                            this.cameras.main.once("camerafadeoutcomplete", () => {
                                this.scene.start("GurunGameScene", { level: lvl.level });
                            });
                        });
                    } else {
                        btn.setInteractive({ useHandCursor: false });
                        btn.on("pointerdown", () => this._showLockedMsg(bx, btnY, w, h, lvl.level, ui));
                    }
                },
            });

            if (!unlocked) {
                const lock = this.add.image(bx, btnY, "gurun_gembok")
                    .setOrigin(0.5).setAlpha(0).setDepth(4);
                lock.setScale((50 * ui) / lock.width);
                this.tweens.add({ targets: lock, alpha: 1, duration: 300, delay: 450 + i * 120 });
            }

            const descTxt = this.add.text(bx, btnY + 80 * ui, lvl.desc, {
                fontSize: `${Math.floor(18 * ui)}px`,
                fontFamily: "Arial, sans-serif",
                color: unlocked ? "#ffcc66" : "#806040",
                stroke: "#3a1a00", strokeThickness: 3,
            }).setOrigin(0.5).setAlpha(0).setDepth(3);
            this.tweens.add({ targets: descTxt, alpha: 1, duration: 350, delay: 450 + i * 120 });
        });

        // ── Tombol BACK ──
        const backTxt = this.add.text(w / 2, h * 0.89, "← Kembali ke Pilih Habitat", {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#ffcc66", stroke: "#3a1a00", strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0).setDepth(3).setInteractive({ useHandCursor: true });

        this.tweens.add({ targets: backTxt, alpha: 1, duration: 400, delay: 700 });
        backTxt.on("pointerover", () => { this.tweens.add({ targets: backTxt, scale: 1.08, duration: 120, ease: "Back.out(2)" }); backTxt.setStyle({ color: "#ffffff" }); });
        backTxt.on("pointerout",  () => { this.tweens.add({ targets: backTxt, scale: 1,    duration: 120, ease: "Back.out(2)" }); backTxt.setStyle({ color: "#ffcc66" }); });
        backTxt.on("pointerdown", () => {
            this._playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("HabitatScene"); });
        });
    }

    _showLockedMsg(bx, btnY, w, h, level, ui) {
        if (this._lockToast) this._lockToast.destroy();
        const msg   = `Selesaikan Level ${level - 1} dulu! 🔒`;
        const toast = this.add.text(w / 2, btnY - 90 * ui, msg, {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffdd55", stroke: "#000", strokeThickness: 4,
            backgroundColor: "#00000088",
            padding: { x: 14, y: 8 },
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this._lockToast = toast;
        this.tweens.add({
            targets: toast, alpha: 1, y: btnY - 100 * ui, duration: 280, ease: "Quad.easeOut",
            onComplete: () => {
                this.time.delayedCall(1600, () => {
                    this.tweens.add({ targets: toast, alpha: 0, duration: 250, onComplete: () => toast.destroy() });
                });
            },
        });
    }

    _makeBouncyButton(btn, baseScale, onClick) {
        btn.setInteractive({ useHandCursor: true });
        btn.on("pointerover", () => { this.tweens.killTweensOf(btn); this.tweens.add({ targets: btn, scale: baseScale * 1.10, duration: 150, ease: "Back.out(2)" }); });
        btn.on("pointerout",  () => { this.tweens.killTweensOf(btn); this.tweens.add({ targets: btn, scale: baseScale,        duration: 150, ease: "Back.out(2)" }); });
        btn.on("pointerdown", () => {
            this.tweens.killTweensOf(btn);
            this.tweens.add({ targets: btn, scale: baseScale * 0.92, duration: 80, ease: "Quad.easeOut", yoyo: true, onComplete: () => onClick && onClick() });
        });
    }

    _playClick() {
        if (this.isMuted) return;
        if (this.cache.audio.exists("sfxClick")) this.sound.play("sfxClick", { volume: 0.7 });
    }
}

window.GurunScene = GurunScene;
