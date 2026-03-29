// ============================================================
//  HutanGameScene.js — Gameplay Habitat Hutan (Self-Contained)
//  Progres disimpan: localStorage key "hutan_maxLevel"
// ============================================================

class HutanGameScene extends Phaser.Scene {
    constructor() {
        super("HutanGameScene");
    }

    // ──────────────────────────────────────────────
    //  DATA HEWAN HUTAN
    // ──────────────────────────────────────────────
    static get ANIMALS() {
        return {
            correct: ["hutan_berangberang", "hutan_kelinci", "hutan_monyet", "hutan_toucan", "hutan_ular"],
            trap: [
                "kutub_anjinglaut", "kutub_pausbeluga", "kutub_beruang", "kutub_pinguin", "kutub_walrus",
                "laut_hiu", "laut_lumbalumba", "laut_orca", "laut_uburubur", "laut_penyu", "laut_kepiting",
                "sungai_bangau", "sungai_belut", "sungai_buaya", "sungai_kepiting", "sungai_katak",
            ],
        };
    }

    // ──────────────────────────────────────────────
    //  LEVEL CONFIG
    // ──────────────────────────────────────────────
    static get LEVEL_CONFIG() {
        return [
            null,
            { speed: 130, spawnMs: 1300, pctCorrect: 0.68, target: 8,  timer: 60 }, // Level 1
            { speed: 190, spawnMs: 950,  pctCorrect: 0.52, target: 10, timer: 45 }, // Level 2
            { speed: 260, spawnMs: 700,  pctCorrect: 0.42, target: 12, timer: 30 }, // Level 3
        ];
    }

    // ──────────────────────────────────────────────
    //  UKURAN HEWAN (px target dimensi terbesar)
    // ──────────────────────────────────────────────
    static get SIZE_MAP() {
        return {
            // Hewan Hutan (benar)
            "hutan_berangberang": 90,
            "hutan_kelinci":      75,
            "hutan_monyet":       95,
            "hutan_toucan":       80,
            "hutan_ular":         120,
            // Hewan Trap — Kutub
            "kutub_anjinglaut":   110,
            "kutub_pausbeluga":   150,
            "kutub_beruang":      140,
            "kutub_pinguin":       80,
            "kutub_walrus":       120,
            // Hewan Trap — Laut
            "laut_hiu":           150,
            "laut_lumbalumba":    130,
            "laut_orca":          160,
            "laut_uburubur":       80,
            "laut_penyu":         100,
            "laut_kepiting":       70,
            // Hewan Trap — Sungai
            "sungai_bangau":      100,
            "sungai_belut":       100,
            "sungai_buaya":       150,
            "sungai_kepiting":     70,
            "sungai_katak":        60,
        };
    }

    // ──────────────────────────────────────────────
    //  INIT
    // ──────────────────────────────────────────────
    init(data) {
        this.level    = data.level || 1;
        this.isMuted  = this.registry.get("isMuted") || false;
    }

    preload() {
        // Background & UI Hutan
        if (!this.textures.exists("hutan_bg")) {
            this.load.image("hutan_bg", "Asset/Hutan/bgHutan.png");
        }
        if (!this.textures.exists("hutan_timer")) {
            this.load.image("hutan_timer", "Asset/Hutan/Timer.png");
        }
        if (!this.textures.exists("hutan_keranjang")) {
            this.load.image("hutan_keranjang", "Asset/Hutan/keranjang.png");
        }
        if (!this.textures.exists("hutan_awan")) {
            this.load.image("hutan_awan", "Asset/Hutan/Awan.png");
        }

        // Hewan Hutan (benar)
        this.load.image("hutan_berangberang", "Asset/Hewan/HewanHutan/BerangBerang.png");
        this.load.image("hutan_kelinci",      "Asset/Hewan/HewanHutan/Kelinci.png");
        this.load.image("hutan_monyet",       "Asset/Hewan/HewanHutan/Monyet.png");
        this.load.image("hutan_toucan",       "Asset/Hewan/HewanHutan/Toucan.png");
        this.load.image("hutan_ular",         "Asset/Hewan/HewanHutan/ular.png");

        // Hewan Trap — Kutub
        this.load.image("kutub_anjinglaut", "Asset/Hewan/HewanKutub/AnjingLaut.png");
        this.load.image("kutub_pausbeluga", "Asset/Hewan/HewanKutub/PausBeluga.png");
        this.load.image("kutub_beruang",    "Asset/Hewan/HewanKutub/beruangkutub.png");
        this.load.image("kutub_pinguin",    "Asset/Hewan/HewanKutub/pinguin.png");
        this.load.image("kutub_walrus",     "Asset/Hewan/HewanKutub/walrus.png");

        // Hewan Trap — Laut
        this.load.image("laut_hiu",        "Asset/Hewan/HewanLaut/Hiu.png");
        this.load.image("laut_lumbalumba", "Asset/Hewan/HewanLaut/LumbaLumba.png");
        this.load.image("laut_orca",       "Asset/Hewan/HewanLaut/Orca.png");
        this.load.image("laut_uburubur",   "Asset/Hewan/HewanLaut/UburUbur.png");
        this.load.image("laut_penyu",      "Asset/Hewan/HewanLaut/penyu.png");
        this.load.image("laut_kepiting",   "Asset/Hewan/HewanLaut/kepiting.png");

        // Hewan Trap — Sungai
        this.load.image("sungai_bangau",   "Asset/Hewan/HewanSungai/Bangau.png");
        this.load.image("sungai_belut",    "Asset/Hewan/HewanSungai/Belut.png");
        this.load.image("sungai_buaya",    "Asset/Hewan/HewanSungai/Buaya.png");
        this.load.image("sungai_kepiting", "Asset/Hewan/HewanSungai/Kepiting Sungai.png");
        this.load.image("sungai_katak",    "Asset/Hewan/HewanSungai/katak.png");

        // UI Result
        this.load.image("ui_panel",  "Asset/PanelBintang.png");
        this.load.image("ui_bintang","Asset/Bintang.png");
        this.load.image("ui_home",   "Asset/Home.png");
        this.load.image("ui_retry",  "Asset/Retry.png");
        this.load.image("ui_next",   "Asset/NextLevel.png");

        // Audio
        if (!this.cache.audio.exists("sfxClick"))     this.load.audio("sfxClick",     "Asset/Sound/select.mp3");
        if (!this.cache.audio.exists("timeout"))       this.load.audio("timeout",       "Asset/Sound/timeout.mp3");
        if (!this.cache.audio.exists("lvup"))          this.load.audio("lvup",          "Asset/Sound/lvup.mp3");
        if (!this.cache.audio.exists("ting_star"))     this.load.audio("ting_star",     "Asset/Sound/ting_star.mp3");
        if (!this.cache.audio.exists("ifNextLevel"))   this.load.audio("ifNextLevel",   "Asset/Sound/IfNextLevel.mp3");
        if (!this.cache.audio.exists("ifFailedStar0")) this.load.audio("ifFailedStar0", "Asset/Sound/IfFailedStar0.mp3");
        if (!this.cache.audio.exists("TangkapBenar"))  this.load.audio("TangkapBenar",  "Asset/Sound/TangkapBenar.mp3");
        if (!this.cache.audio.exists("SalahTangkap"))  this.load.audio("SalahTangkap",  "Asset/Sound/SalahTangkap.mp3");
        if (!this.cache.audio.exists("bgmHutan"))      this.load.audio("bgmHutan",      "Asset/Sound/bgmHutan.mp3");
    }

    create() {
        this.sound.stopAll();
        this.sound.mute = this.isMuted;

        if (this.cache.audio.exists("bgmHutan")) {
            this.bgmHutan = this.sound.add("bgmHutan", { loop: true, volume: 0.4 });
            if (!this.isMuted) this.bgmHutan.play();
        }

        this.cameras.main.fadeIn(400, 0, 0, 0);

        const cfg = HutanGameScene.LEVEL_CONFIG[this.level];

        this.scoreCorrect = 0;
        this.scoreWrong   = 0;
        this.timeLeft     = cfg.timer;
        this.levelActive  = true;
        this.resultShown  = false;

        const w = this.scale.width;
        const h = this.scale.height;

        this.animalGroup = this.physics.add.group();

        this._buildBackground(w, h);
        this._buildBasket(w, h);
        this._buildHUD(w, h);
        this._buildControls(w, h);

        this.physics.add.overlap(this.basket, this.animalGroup, this._onCatch, null, this);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this._onTick,
            callbackScope: this,
            repeat: cfg.timer - 1,
        });

        this._scheduleNextSpawn();
    }

    update() {
        if (!this.levelActive) return;

        const w  = this.scale.width;
        const h  = this.scale.height;
        const bw = this.basket.width * this.basket.scaleX;

        if (this.cursors.left.isDown) {
            this.basket.x = Math.max(bw / 2, this.basket.x - 7);
        } else if (this.cursors.right.isDown) {
            this.basket.x = Math.min(w - bw / 2, this.basket.x + 7);
        }

        if (this.isDragging && this.dragX !== null) {
            this.basket.x = Phaser.Math.Clamp(this.dragX, bw / 2, w - bw / 2);
        }

        this.animalGroup.getChildren().forEach(a => {
            if (a.y > h + 60) a.destroy();
        });

        if (this.hudTimer)   this.hudTimer.setText(this.timeLeft.toString());
        if (this.hudCorrect) this.hudCorrect.setText("✅ " + this.scoreCorrect + " / " + HutanGameScene.LEVEL_CONFIG[this.level].target);
        if (this.hudWrong)   this.hudWrong.setText("❌ " + this.scoreWrong);
    }

    // ──────────────────────────────────────────────
    //  BACKGROUND
    // ──────────────────────────────────────────────
    _buildBackground(w, h) {
        if (this.textures.exists("hutan_bg")) {
            this.add.image(w / 2, h / 2, "hutan_bg").setDisplaySize(w, h);
        } else {
            this.add.rectangle(w / 2, h / 2, w, h, 0x0a2a0a);
        }
        // Overlay gelap transparan nuansa hutan
        this.add.rectangle(w / 2, h / 2, w, h, 0x051000, 0.22);

        // Awan animasi
        const ui = Math.min(w / 900, h / 550);
        if (this.textures.exists("hutan_awan")) {
            const cloudSc = ui * 0.6;
            const cloud1 = this.add.image(-160, h * 0.10, "hutan_awan").setScale(cloudSc).setAlpha(0.45).setDepth(2);
            const cloud2 = this.add.image(w + 160, h * 0.18, "hutan_awan").setScale(cloudSc * 0.72).setAlpha(0.30).setDepth(2);

            this.tweens.add({ targets: cloud1, x: w + 180, duration: 30000, ease: "Linear", repeat: -1, onRepeat: () => { cloud1.x = -160; } });
            this.tweens.add({ targets: cloud2, x: -160, duration: 42000, ease: "Linear", repeat: -1, onRepeat: () => { cloud2.x = w + 180; } });
        }

        this.add.text(12, h - 12, "🌳 HUTAN  |  Level " + this.level, {
            fontSize: "15px", fontFamily: "Arial, sans-serif",
            color: "#ffffff", stroke: "#0a1a00", strokeThickness: 3,
        }).setOrigin(0, 1).setAlpha(0.75).setDepth(3);
    }

    // ──────────────────────────────────────────────
    //  KERANJANG
    // ──────────────────────────────────────────────
    _buildBasket(w, h) {
        const ui = Math.min(w / 900, h / 550);
        const basketY = h - 72 * ui;

        this.basket = this.physics.add.image(w / 2, basketY, "hutan_keranjang");
        const targetW = 150 * ui;
        this.basket.setScale(targetW / this.basket.width);
        this.basket.setImmovable(true);
        this.basket.body.allowGravity = false;
    }

    // ──────────────────────────────────────────────
    //  HUD
    // ──────────────────────────────────────────────
    _buildHUD(w, h) {
        const ui = Math.min(w / 900, h / 550);
        const style = {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff", stroke: "#0a1a00", strokeThickness: 4,
        };

        this.hudCorrect = this.add.text(12, 12, "✅ 0 / " + HutanGameScene.LEVEL_CONFIG[this.level].target, style).setOrigin(0, 0).setDepth(10);
        this.hudWrong   = this.add.text(12, 12 + 25 * ui, "❌ 0", style).setOrigin(0, 0).setDepth(10);

        // Timer — asset gambar, kanan atas
        this.timerBg = this.add.image(w - 15 * ui, 15 * ui, "hutan_timer").setOrigin(1, 0).setDepth(9);
        const targetTimerW = 140 * ui;
        this.timerBg.setScale(targetTimerW / this.timerBg.width);

        const timerCX = (w - 15 * ui) - (this.timerBg.width * this.timerBg.scaleX) / 2;
        const timerCY = (15 * ui) + (this.timerBg.height * this.timerBg.scaleY) / 2;

        this.hudTimer = this.add.text(timerCX, timerCY, this.timeLeft.toString(), {
            fontSize: `${Math.floor(26 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff", stroke: "#000000", strokeThickness: 4,
        }).setOrigin(0.5).setDepth(10);
    }

    // ──────────────────────────────────────────────
    //  KONTROL
    // ──────────────────────────────────────────────
    _buildControls(w, h) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isDragging = false;
        this.dragX = null;

        this.input.on("pointerdown", ptr => { this.isDragging = true;  this.dragX = ptr.x; });
        this.input.on("pointermove", ptr => { if (this.isDragging) this.dragX = ptr.x; });
        this.input.on("pointerup",   ()  => { this.isDragging = false; this.dragX = null; });
    }

    // ──────────────────────────────────────────────
    //  SPAWN HEWAN
    // ──────────────────────────────────────────────
    _scheduleNextSpawn() {
        if (!this.levelActive) return;
        const cfg = HutanGameScene.LEVEL_CONFIG[this.level];
        const delay = Phaser.Math.Between(cfg.spawnMs * 0.8, cfg.spawnMs * 1.2);

        this.time.addEvent({
            delay,
            callback: () => {
                this.spawnAnimal(this.scale.width);
                this._scheduleNextSpawn();
            },
            callbackScope: this,
        });
    }

    spawnAnimal(w) {
        if (!this.levelActive) return;

        const cfg       = HutanGameScene.LEVEL_CONFIG[this.level];
        const isCorrect = Math.random() < cfg.pctCorrect;
        const pool      = isCorrect ? HutanGameScene.ANIMALS.correct : HutanGameScene.ANIMALS.trap;
        const texKey    = pool[Phaser.Math.Between(0, pool.length - 1)];

        const x = Phaser.Math.Between(50, w - 50);
        const animal = this.animalGroup.create(x, -50, texKey);

        const ui = Math.min(w / 900, this.scale.height / 550);
        const targetDim = (HutanGameScene.SIZE_MAP[texKey] || 90) * ui;
        const maxDim    = Math.max(animal.width, animal.height);
        const baseScale = targetDim / maxDim;
        animal.setScale(baseScale * Phaser.Math.FloatBetween(0.88, 1.12));
        animal.setData("isCorrect", isCorrect);

        animal.setVelocityY(cfg.speed * Phaser.Math.FloatBetween(0.85, 1.15));
        animal.body.allowGravity = false;

        // Goyang pelan (swing)
        const sign = Math.random() < 0.5 ? 1 : -1;
        this.tweens.add({
            targets: animal, angle: 14 * sign,
            duration: Phaser.Math.Between(400, 650),
            yoyo: true, repeat: -1, ease: "Sine.easeInOut",
        });
    }

    // ──────────────────────────────────────────────
    //  TANGKAP
    // ──────────────────────────────────────────────
    _onCatch(basket, animal) {
        const isCorrect = animal.getData("isCorrect");
        if (isCorrect) {
            this.scoreCorrect++;
            this._showFeedback(animal.x, animal.y, "+1", "#a8ff6a");
            this._playSfx("TangkapBenar");
        } else {
            this.scoreWrong++;
            this._showFeedback(animal.x, animal.y, "✕", "#e74c3c");
            this._shakeBasket();
            this._playSfx("SalahTangkap");
        }
        animal.destroy();
    }

    _showFeedback(x, y, txt, color) {
        const fb = this.add.text(x, y, txt, {
            fontSize: "28px", fontFamily: "Arial Black, Arial, sans-serif",
            color, stroke: "#000", strokeThickness: 4,
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: fb, y: y - 65, alpha: 0, duration: 700, ease: "Quad.easeOut", onComplete: () => fb.destroy() });
    }

    _shakeBasket() {
        const ox = this.basket.x;
        this.tweens.add({
            targets: [this.basket], x: "+=14", duration: 55, yoyo: true, repeat: 3,
            ease: "Sine.easeInOut", onComplete: () => { this.basket.x = ox; },
        });
    }

    // ──────────────────────────────────────────────
    //  TIMER TICK
    // ──────────────────────────────────────────────
    _onTick() {
        this.timeLeft--;

        // Flash merah saat timer kritis
        if (this.timeLeft <= 10 && this.hudTimer) {
            this.hudTimer.setStyle({ color: "#ff4444" });
            this.tweens.add({ targets: this.hudTimer, scaleX: 1.2, scaleY: 1.2, duration: 200, yoyo: true, ease: "Sine.easeInOut" });
        }

        if (this.timeLeft <= 0) this._endLevel();
    }

    // ──────────────────────────────────────────────
    //  LEVEL SELESAI
    // ──────────────────────────────────────────────
    _endLevel() {
        if (!this.levelActive) return;
        this.levelActive = false;

        if (this.bgmHutan) this.bgmHutan.stop();

        this.animalGroup.getChildren().forEach(a => a.destroy());
        this.animalGroup.clear(true, true);

        const isWin = this.scoreCorrect >= HutanGameScene.LEVEL_CONFIG[this.level].target;

        if (isWin) {
            const saved  = parseInt(localStorage.getItem("hutan_maxLevel") || "1");
            const newMax = Math.max(saved, this.level + 1);
            localStorage.setItem("hutan_maxLevel", String(Math.min(newMax, 3)));
            this._playSfx("ifNextLevel");
        } else {
            this._playSfx("ifFailedStar0");
        }

        this.time.delayedCall(300, () => this._showResult(isWin));
    }

    // ──────────────────────────────────────────────
    //  OVERLAY HASIL — Panel Bintang
    // ──────────────────────────────────────────────
    _showResult(isWin) {
        if (this.resultShown) return;
        this.resultShown = true;

        const w = this.scale.width;
        const h = this.scale.height;

        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x020d00, 0.72).setDepth(30).setAlpha(0);
        this.tweens.add({ targets: overlay, alpha: 1, duration: 350 });

        const panel = this.add.image(w / 2, h * 0.46, "ui_panel").setDepth(31).setAlpha(0).setScale(0.7);
        const targetPanelScale = (Math.min(w * 0.75, 500) / panel.width);
        this.tweens.add({ targets: panel, alpha: 1, scale: targetPanelScale, duration: 400, ease: "Back.out(1.5)" });

        const panelH = panel.height * targetPanelScale;
        const panelW = panel.width  * targetPanelScale;

        // Logika bintang
        let stars = 0;
        if (isWin) {
            stars = 1;
            if (this.scoreWrong <= 3)  stars = 2;
            if (this.scoreWrong === 0) stars = 3;
            if (this.scoreCorrect >= HutanGameScene.LEVEL_CONFIG[this.level].target + 5) stars = 3;
        }

        const STAR_Y_OFFSET   = 0.33;
        const STAR_X_LEFT     = 0.299;
        const STAR_X_RIGHT    = 0.299;
        const TITLE_Y_OFFSET  = 0.56;
        const SCORE_Y_OFFSET  = -0.03;
        const LABEL_Y_OFFSET  = 0.055;
        const BADGE_Y_OFFSET  = 0.18;
        const BUTTON_Y_OFFSET = 0.38;
        const STAR_SIZE       = 0.30;

        const panelCenterX = panel.x;
        const panelCenterY = panel.y;

        // 1. Bintang
        const starSlots = [
            { x: panelCenterX - panelW * STAR_X_LEFT, y: panelCenterY - panelH * STAR_Y_OFFSET },
            { x: panelCenterX,                         y: panelCenterY - panelH * STAR_Y_OFFSET },
            { x: panelCenterX + panelW * STAR_X_RIGHT, y: panelCenterY - panelH * STAR_Y_OFFSET },
        ];

        for (let i = 0; i < 3; i++) {
            const starImg = this.add.image(starSlots[i].x, starSlots[i].y, "ui_bintang")
                .setDepth(32).setAlpha(0).setScale(3).setOrigin(0.5);
            const finalScale = (panelW * STAR_SIZE) / starImg.width;

            if (i < stars) {
                this.time.delayedCall(400 + i * 250, () => {
                    this._playSfx("ting_star");
                    this.tweens.add({ targets: starImg, alpha: 1, scale: finalScale, duration: 350, ease: "Back.out(2)" });
                });
            } else {
                starImg.setTint(0x404040);
                this.time.delayedCall(400 + i * 150, () => {
                    this.tweens.add({ targets: starImg, alpha: 0.6, scale: finalScale, duration: 300, ease: "Quad.easeOut" });
                });
            }
        }

        // 2. Judul
        const titleTxt = isWin ? "LUAR BIASA!" : "AYO COBA LAGI!";
        const titleClr = isWin ? "#a8ff6a" : "#ff8080";
        this.add.text(panelCenterX, panelCenterY - panelH * TITLE_Y_OFFSET, titleTxt, {
            fontSize: `${Math.floor(panelH * 0.08)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: titleClr, stroke: "#000", strokeThickness: 5,
        }).setOrigin(0.5).setDepth(32).setAlpha(0);

        // 3. Skor
        const cfg = HutanGameScene.LEVEL_CONFIG[this.level];
        this.add.text(panelCenterX, panelCenterY + panelH * SCORE_Y_OFFSET, `${this.scoreCorrect} / ${cfg.target}`, {
            fontSize: `${Math.floor(panelH * 0.11)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: isWin ? "#ffffff" : "#ffdddd", stroke: "#000", strokeThickness: 5,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        this.add.text(panelCenterX, panelCenterY + panelH * LABEL_Y_OFFSET, "Hewan Benar", {
            fontSize: `${Math.floor(panelH * 0.05)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#ffdf80", stroke: "#000", strokeThickness: 3,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        // 4. Badge Salah
        const badgeY = panelCenterY + panelH * BADGE_Y_OFFSET;
        const badgeW = panelW * 0.30;
        const badgeH = panelH * 0.08;
        const wrongBg = this.add.graphics().setDepth(31);
        wrongBg.fillStyle(0xcc2200, 0.75);
        wrongBg.fillRoundedRect(panelCenterX - badgeW * 0.5, badgeY - badgeH * 0.5, badgeW, badgeH, 10);
        wrongBg.setAlpha(0);

        this.add.text(panelCenterX, badgeY, `❌  Salah: ${this.scoreWrong}`, {
            fontSize: `${Math.floor(panelH * 0.055)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff", stroke: "#550000", strokeThickness: 3,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        this.time.delayedCall(800, () => {
            this.children.getAll().filter(c => c.depth === 32 && c.alpha === 0).forEach(c => {
                this.tweens.add({ targets: c, alpha: 1, duration: 350 });
            });
            this.tweens.add({ targets: wrongBg, alpha: 1, duration: 350 });
        });

        // 5. Tombol
        const isWinAndHasNext = isWin && this.level < 3;
        const btnDefs = [
            { key: "ui_home",  action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("HutanScene"); }); } },
            { key: "ui_retry", action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("HutanGameScene", { level: this.level }); }); } },
        ];
        if (isWinAndHasNext) {
            btnDefs.push({ key: "ui_next", action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("HutanGameScene", { level: this.level + 1 }); }); } });
        }

        const btnGap         = panelW * 0.35;
        const totalWBtn      = btnGap * (btnDefs.length - 1);
        const bStartX        = panelCenterX - totalWBtn / 2;
        const btnY           = panelCenterY + panelH * BUTTON_Y_OFFSET;
        const homeImg        = this.textures.get("ui_home").getSourceImage();
        const btnTargetScale = (panelW * 0.14) / (homeImg.width || 150);

        btnDefs.forEach((def, i) => {
            const bx  = bStartX + i * btnGap;
            const btn = this.add.image(bx, btnY, def.key).setDepth(33).setAlpha(0).setInteractive({ useHandCursor: true });
            btn.setScale(btnTargetScale * 0.4);

            this.time.delayedCall(850 + i * 150, () => {
                this.tweens.add({ targets: btn, alpha: 1, scale: btnTargetScale, duration: 400, ease: "Back.out(1.5)" });
            });

            btn.on("pointerover", () => this.tweens.add({ targets: btn, scale: btnTargetScale * 1.08, duration: 110, ease: "Back.out(2)" }));
            btn.on("pointerout",  () => this.tweens.add({ targets: btn, scale: btnTargetScale,        duration: 110, ease: "Back.out(2)" }));
            btn.on("pointerdown", () => {
                this._playSfx("sfxClick");
                this.tweens.add({ targets: btn, scale: btnTargetScale * 0.9, duration: 70, yoyo: true, onComplete: def.action });
            });
        });
    }

    // ──────────────────────────────────────────────
    //  AUDIO
    // ──────────────────────────────────────────────
    _playSfx(key) {
        if (this.isMuted) return;
        if (this.cache.audio.exists(key)) this.sound.play(key, { volume: 0.7 });
    }
}

window.HutanGameScene = HutanGameScene;
