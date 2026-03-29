// ============================================================
//  KutubScene.js — Pilih Level Kutub (dengan Level Lock)
//  Progres disimpan: localStorage key "kutub_maxLevel"
//  Asset: Asset/LevelKutub/Bg.png, 1.png, 2.png, 3.png
// ============================================================

class KutubScene extends Phaser.Scene {
    constructor() {
        super("KutubScene");
        this.isMuted = false;
    }

    preload() {
        this.load.image("kutub_bg", "Asset/Kutub/Bg.png");
        this.load.image("kutub_lv1", "Asset/Kutub/1.png");
        this.load.image("kutub_lv2", "Asset/Kutub/2.png");
        this.load.image("kutub_lv3", "Asset/Kutub/3.png");
        this.load.image("kutub_gembok", "Asset/Kutub/gembok.png");

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

    // ──────────────────────────────────────────────
    //  BACA PROGRESS
    // ──────────────────────────────────────────────
    _getMaxLevel() {
        return parseInt(localStorage.getItem("kutub_maxLevel") || "1");
    }

    // ──────────────────────────────────────────────
    //  LAYOUT
    // ──────────────────────────────────────────────
    _buildLayout() {
        const w = this.scale.width;
        const h = this.scale.height;
        const ui = Math.min(w / 900, h / 550);
        const maxLevel = this._getMaxLevel();

        // ── Background ──
        this.add.image(w / 2, h / 2, "kutub_bg").setDisplaySize(w, h);
        this.add.rectangle(w / 2, h / 2, w, h, 0x001020, 0.35);

        // ── Judul ──
        const title = this.add.text(w / 2, -60, "❄️  HABITAT KUTUB", {
            fontSize: `${Math.floor(48 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#e0f7ff", stroke: "#003366", strokeThickness: 6,
            shadow: { offsetX: 2, offsetY: 3, color: "#000", blur: 6, fill: true },
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        const sub = this.add.text(w / 2, -60, "Pilih Level", {
            fontSize: `${Math.floor(24 * ui)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#b0e0ff", stroke: "#001030", strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0).setDepth(2);

        this.tweens.add({ targets: title, y: h * 0.14, alpha: 1, duration: 600, ease: "Back.out(1.4)", delay: 80 });
        this.tweens.add({ targets: sub, y: h * 0.24, alpha: 1, duration: 500, ease: "Back.out(1.4)", delay: 200 });

        this.time.delayedCall(720, () => {
            this.tweens.add({ targets: title, y: h * 0.14 - 8, duration: 1600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
        });

        // ── Tombol Level ──
        const levels = [
            { key: "kutub_lv1", level: 1, desc: "Mudah" },
            { key: "kutub_lv2", level: 2, desc: "Sedang" },
            { key: "kutub_lv3", level: 3, desc: "Sulit" },
        ];

        const btnScale = ui * 1.1;
        const totalW = w * 0.72;
        const colW = totalW / 3;
        const startX = w / 2 - totalW / 2 + colW / 2;
        const btnY = h * 0.56;

        levels.forEach((lvl, i) => {
            const bx = startX + i * colW;
            const unlocked = lvl.level <= maxLevel;

            // Tombol gambar
            const btn = this.add.image(bx, btnY, lvl.key)
                .setScale(0).setAlpha(0).setDepth(3);

            // Efek abu-abu jika terkunci
            if (!unlocked) btn.setTint(0x607080);

            // Pop-in animasi
            this.tweens.add({
                targets: btn, scale: btnScale, alpha: 1,
                duration: 400, delay: 350 + i * 120, ease: "Back.out(1.7)",
                onComplete: () => {
                    if (unlocked) {
                        this._makeBouncyButton(btn, btnScale, () => {
                            this._playClick();
                            this.cameras.main.fadeOut(350, 0, 0, 0);
                            this.cameras.main.once("camerafadeoutcomplete", () => {
                                this.scene.start("KutubGameScene", { level: lvl.level });
                            });
                        });
                    } else {
                        // Tombol terkunci — klik tampil pesan
                        btn.setInteractive({ useHandCursor: false });
                        btn.on("pointerdown", () => this._showLockedMsg(bx, btnY, w, h, lvl.level, ui));
                    }
                },
            });

            // Ikon gembok jika terkunci
            if (!unlocked) {
                const lock = this.add.image(bx, btnY, "kutub_gembok")
                    .setOrigin(0.5).setAlpha(0).setDepth(4);

                // Sesuaikan skala asset gembok agar pas di atas tombol
                const lockTargetSize = 50 * ui;
                lock.setScale(lockTargetSize / lock.width);

                this.tweens.add({ targets: lock, alpha: 1, duration: 300, delay: 450 + i * 120 });
            }

            // Label deskripsi
            const descTxt = this.add.text(bx, btnY + 80 * ui, lvl.desc, {
                fontSize: `${Math.floor(18 * ui)}px`,
                fontFamily: "Arial, sans-serif",
                color: unlocked ? "#c8eeff" : "#607080",
                stroke: "#001a33", strokeThickness: 3,
            }).setOrigin(0.5).setAlpha(0).setDepth(3);
            this.tweens.add({ targets: descTxt, alpha: 1, duration: 350, delay: 450 + i * 120 });
        });

        // ── Tombol BACK ──
        const backTxt = this.add.text(w / 2, h * 0.89, "← Kembali ke Pilih Habitat", {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#a0d8f0", stroke: "#001a33", strokeThickness: 3,
        }).setOrigin(0.5).setAlpha(0).setDepth(3).setInteractive({ useHandCursor: true });

        this.tweens.add({ targets: backTxt, alpha: 1, duration: 400, delay: 700 });
        backTxt.on("pointerover", () => { this.tweens.add({ targets: backTxt, scale: 1.08, duration: 120, ease: "Back.out(2)" }); backTxt.setStyle({ color: "#ffffff" }); });
        backTxt.on("pointerout", () => { this.tweens.add({ targets: backTxt, scale: 1, duration: 120, ease: "Back.out(2)" }); backTxt.setStyle({ color: "#a0d8f0" }); });
        backTxt.on("pointerdown", () => {
            this._playClick();
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("HabitatScene"); });
        });
    }

    // ──────────────────────────────────────────────
    //  PESAN TERKUNCI
    // ──────────────────────────────────────────────
    _showLockedMsg(bx, btnY, w, h, level, ui) {
        // Buang toast lama jika ada
        if (this._lockToast) this._lockToast.destroy();

        const msg = `Selesaikan Level ${level - 1} dulu! 🔒`;
        const toast = this.add.text(w / 2, btnY - 90 * ui, msg, {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffdd55", stroke: "#000", strokeThickness: 4,
            backgroundColor: "#00000088",
            padding: { x: 14, y: 8 },
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this._lockToast = toast;
        this.tweens.add({
            targets: toast, alpha: 1, y: btnY - 100 * ui,
            duration: 280, ease: "Quad.easeOut",
            onComplete: () => {
                this.time.delayedCall(1600, () => {
                    this.tweens.add({ targets: toast, alpha: 0, duration: 250, onComplete: () => toast.destroy() });
                });
            },
        });
    }

    // ──────────────────────────────────────────────
    //  BOUNCY BUTTON
    // ──────────────────────────────────────────────
    _makeBouncyButton(btn, baseScale, onClick) {
        btn.setInteractive({ useHandCursor: true });
        btn.on("pointerover", () => { this.tweens.killTweensOf(btn); this.tweens.add({ targets: btn, scale: baseScale * 1.10, duration: 150, ease: "Back.out(2)" }); });
        btn.on("pointerout", () => { this.tweens.killTweensOf(btn); this.tweens.add({ targets: btn, scale: baseScale, duration: 150, ease: "Back.out(2)" }); });
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

window.KutubScene = KutubScene;
