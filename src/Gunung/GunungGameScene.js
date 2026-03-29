// ============================================================
//  GunungGameScene.js — Gameplay Habitat Gunung (Self-Contained)
//  Progres disimpan: localStorage key "gunung_maxLevel"
// ============================================================

class GunungGameScene extends Phaser.Scene {
    constructor() {
        super("GunungGameScene");
    }

    static get ANIMALS() {
        return {
            correct: ["gunung_condor", "gunung_domba", "gunung_elang", "gunung_macan", "gunung_marmot"],
            trap: [
                "kutub_anjinglaut", "kutub_pausbeluga", "kutub_beruang", "kutub_pinguin", "kutub_walrus",
                "laut_hiu", "laut_lumbalumba", "laut_orca", "laut_uburubur", "laut_penyu", "laut_kepiting",
                "sungai_bangau", "sungai_belut", "sungai_buaya", "sungai_kepiting", "sungai_katak",
                "hutan_berangberang", "hutan_kelinci", "hutan_monyet", "hutan_toucan", "hutan_ular",
                "gurun_fennec", "gurun_kalajengking", "gurun_unta", "gurun_kadal",
                "danau_angsa", "danau_ikanlele", "danau_ikannila", "danau_japati", "danau_bebek",
            ],
        };
    }

    static get LEVEL_CONFIG() {
        return [
            null,
            { speed: 135, spawnMs: 1250, pctCorrect: 0.68, target: 8,  timer: 60 },
            { speed: 195, spawnMs: 920,  pctCorrect: 0.52, target: 10, timer: 45 },
            { speed: 265, spawnMs: 680,  pctCorrect: 0.42, target: 12, timer: 30 },
        ];
    }

    static get SIZE_MAP() {
        return {
            // Hewan Gunung (benar)
            "gunung_condor": 130,
            "gunung_domba":  100,
            "gunung_elang":  120,
            "gunung_macan":  140,
            "gunung_marmot":  70,
            // Trap — Kutub
            "kutub_anjinglaut": 110, "kutub_pausbeluga": 150, "kutub_beruang": 140, "kutub_pinguin": 80, "kutub_walrus": 120,
            // Trap — Laut
            "laut_hiu": 150, "laut_lumbalumba": 130, "laut_orca": 160, "laut_uburubur": 80, "laut_penyu": 100, "laut_kepiting": 70,
            // Trap — Sungai
            "sungai_bangau": 100, "sungai_belut": 100, "sungai_buaya": 150, "sungai_kepiting": 70, "sungai_katak": 60,
            // Trap — Hutan
            "hutan_berangberang": 90, "hutan_kelinci": 75, "hutan_monyet": 95, "hutan_toucan": 80, "hutan_ular": 120,
            // Trap — Gurun
            "gurun_fennec": 85, "gurun_kalajengking": 70, "gurun_unta": 160, "gurun_kadal": 110,
            // Trap — Danau
            "danau_angsa": 90, "danau_ikanlele": 85, "danau_ikannila": 95, "danau_japati": 75, "danau_bebek": 80,
        };
    }

    init(data) {
        this.level   = data.level || 1;
        this.isMuted = this.registry.get("isMuted") || false;
    }

    preload() {
        if (!this.textures.exists("gunung_bg"))        this.load.image("gunung_bg",        "Asset/Gunung/bgGunung.png");
        if (!this.textures.exists("gunung_timer"))     this.load.image("gunung_timer",     "Asset/Gunung/Timer.png");
        if (!this.textures.exists("gunung_keranjang")) this.load.image("gunung_keranjang", "Asset/Gunung/keranjang.png");
        if (!this.textures.exists("gunung_awan"))      this.load.image("gunung_awan",      "Asset/Gunung/Awan.png");

        // Hewan Gunung
        this.load.image("gunung_condor", "Asset/Hewan/HewanGunung/condor.png");
        this.load.image("gunung_domba",  "Asset/Hewan/HewanGunung/dombaGunung.png");
        this.load.image("gunung_elang",  "Asset/Hewan/HewanGunung/elang.png");
        this.load.image("gunung_macan",  "Asset/Hewan/HewanGunung/macan.png");
        this.load.image("gunung_marmot", "Asset/Hewan/HewanGunung/marmot.png");

        // Trap — Kutub
        this.load.image("kutub_anjinglaut", "Asset/Hewan/HewanKutub/AnjingLaut.png");
        this.load.image("kutub_pausbeluga", "Asset/Hewan/HewanKutub/PausBeluga.png");
        this.load.image("kutub_beruang",    "Asset/Hewan/HewanKutub/beruangkutub.png");
        this.load.image("kutub_pinguin",    "Asset/Hewan/HewanKutub/pinguin.png");
        this.load.image("kutub_walrus",     "Asset/Hewan/HewanKutub/walrus.png");
        // Trap — Laut
        this.load.image("laut_hiu",        "Asset/Hewan/HewanLaut/Hiu.png");
        this.load.image("laut_lumbalumba", "Asset/Hewan/HewanLaut/LumbaLumba.png");
        this.load.image("laut_orca",       "Asset/Hewan/HewanLaut/Orca.png");
        this.load.image("laut_uburubur",   "Asset/Hewan/HewanLaut/UburUbur.png");
        this.load.image("laut_penyu",      "Asset/Hewan/HewanLaut/penyu.png");
        this.load.image("laut_kepiting",   "Asset/Hewan/HewanLaut/kepiting.png");
        // Trap — Sungai
        this.load.image("sungai_bangau",   "Asset/Hewan/HewanSungai/Bangau.png");
        this.load.image("sungai_belut",    "Asset/Hewan/HewanSungai/Belut.png");
        this.load.image("sungai_buaya",    "Asset/Hewan/HewanSungai/Buaya.png");
        this.load.image("sungai_kepiting", "Asset/Hewan/HewanSungai/Kepiting Sungai.png");
        this.load.image("sungai_katak",    "Asset/Hewan/HewanSungai/katak.png");
        // Trap — Hutan
        this.load.image("hutan_berangberang", "Asset/Hewan/HewanHutan/BerangBerang.png");
        this.load.image("hutan_kelinci",      "Asset/Hewan/HewanHutan/Kelinci.png");
        this.load.image("hutan_monyet",       "Asset/Hewan/HewanHutan/Monyet.png");
        this.load.image("hutan_toucan",       "Asset/Hewan/HewanHutan/Toucan.png");
        this.load.image("hutan_ular",         "Asset/Hewan/HewanHutan/ular.png");
        // Trap — Gurun
        this.load.image("gurun_fennec",       "Asset/Hewan/HewanGurun/RubahFennec.png");
        this.load.image("gurun_kalajengking", "Asset/Hewan/HewanGurun/kalajengking.png");
        this.load.image("gurun_unta",         "Asset/Hewan/HewanGurun/unta.png");
        this.load.image("gurun_kadal",        "Asset/Gurun/kadalGurun.png");
        // Trap — Danau
        this.load.image("danau_angsa",    "Asset/Hewan/HewanDanau/Angsa.png");
        this.load.image("danau_ikanlele", "Asset/Hewan/HewanDanau/IkanLele.png");
        this.load.image("danau_ikannila", "Asset/Hewan/HewanDanau/IkanNila.png");
        this.load.image("danau_japati",   "Asset/Hewan/HewanDanau/Japati.png");
        this.load.image("danau_bebek",    "Asset/Hewan/HewanDanau/bebek.png");

        // UI Result
        this.load.image("ui_panel",  "Asset/PanelBintang.png");
        this.load.image("ui_bintang","Asset/Bintang.png");
        this.load.image("ui_home",   "Asset/Home.png");
        this.load.image("ui_retry",  "Asset/Retry.png");
        this.load.image("ui_next",   "Asset/NextLevel.png");

        // Audio
        if (!this.cache.audio.exists("sfxClick"))     this.load.audio("sfxClick",     "Asset/Sound/select.mp3");
        if (!this.cache.audio.exists("ting_star"))     this.load.audio("ting_star",     "Asset/Sound/ting_star.mp3");
        if (!this.cache.audio.exists("ifNextLevel"))   this.load.audio("ifNextLevel",   "Asset/Sound/IfNextLevel.mp3");
        if (!this.cache.audio.exists("ifFailedStar0")) this.load.audio("ifFailedStar0", "Asset/Sound/IfFailedStar0.mp3");
        if (!this.cache.audio.exists("TangkapBenar"))  this.load.audio("TangkapBenar",  "Asset/Sound/TangkapBenar.mp3");
        if (!this.cache.audio.exists("SalahTangkap"))  this.load.audio("SalahTangkap",  "Asset/Sound/SalahTangkap.mp3");
        if (!this.cache.audio.exists("bgmGunung"))     this.load.audio("bgmGunung",     "Asset/Sound/bgmGunung.mp3");
    }

    create() {
        this.sound.stopAll();
        this.sound.mute = this.isMuted;

        if (this.cache.audio.exists("bgmGunung")) {
            this.bgmGunung = this.sound.add("bgmGunung", { loop: true, volume: 0.4 });
            if (!this.isMuted) this.bgmGunung.play();
        }

        this.cameras.main.fadeIn(400, 0, 0, 0);

        const cfg = GunungGameScene.LEVEL_CONFIG[this.level];
        this.scoreCorrect = 0;
        this.scoreWrong   = 0;
        this.timeLeft     = cfg.timer;
        this.levelActive  = true;
        this.resultShown  = false;

        const w = this.scale.width, h = this.scale.height;
        this.animalGroup = this.physics.add.group();
        this._buildBackground(w, h);
        this._buildBasket(w, h);
        this._buildHUD(w, h);
        this._buildControls(w, h);

        this.physics.add.overlap(this.basket, this.animalGroup, this._onCatch, null, this);
        this.timerEvent = this.time.addEvent({ delay: 1000, callback: this._onTick, callbackScope: this, repeat: cfg.timer - 1 });
        this._scheduleNextSpawn();
    }

    update() {
        if (!this.levelActive) return;
        const w = this.scale.width, h = this.scale.height, bw = this.basket.width * this.basket.scaleX;
        if (this.cursors.left.isDown)       this.basket.x = Math.max(bw / 2, this.basket.x - 7);
        else if (this.cursors.right.isDown) this.basket.x = Math.min(w - bw / 2, this.basket.x + 7);
        if (this.isDragging && this.dragX !== null) this.basket.x = Phaser.Math.Clamp(this.dragX, bw / 2, w - bw / 2);
        this.animalGroup.getChildren().forEach(a => { if (a.y > h + 60) a.destroy(); });
        if (this.hudTimer)   this.hudTimer.setText(this.timeLeft.toString());
        if (this.hudCorrect) this.hudCorrect.setText("✅ " + this.scoreCorrect + " / " + GunungGameScene.LEVEL_CONFIG[this.level].target);
        if (this.hudWrong)   this.hudWrong.setText("❌ " + this.scoreWrong);
    }

    _buildBackground(w, h) {
        if (this.textures.exists("gunung_bg")) {
            this.add.image(w / 2, h / 2, "gunung_bg").setDisplaySize(w, h);
        } else {
            this.add.rectangle(w / 2, h / 2, w, h, 0x10182a);
        }
        this.add.rectangle(w / 2, h / 2, w, h, 0x060c16, 0.22);

        const ui = Math.min(w / 900, h / 550);
        if (this.textures.exists("gunung_awan")) {
            const sc = ui * 0.6;
            const c1 = this.add.image(-160, h * 0.07, "gunung_awan").setScale(sc).setAlpha(0.75).setDepth(2);
            const c2 = this.add.image(w + 160, h * 0.16, "gunung_awan").setScale(sc * 0.72).setAlpha(0.55).setDepth(2);
            this.tweens.add({ targets: c1, x: w + 180, duration: 26000, ease: "Linear", repeat: -1, onRepeat: () => { c1.x = -160; } });
            this.tweens.add({ targets: c2, x: -160,    duration: 38000, ease: "Linear", repeat: -1, onRepeat: () => { c2.x = w + 180; } });
        }

        this.add.text(12, h - 12, "⛰️ GUNUNG  |  Level " + this.level, {
            fontSize: "15px", fontFamily: "Arial, sans-serif",
            color: "#ffffff", stroke: "#08101c", strokeThickness: 3,
        }).setOrigin(0, 1).setAlpha(0.75).setDepth(3);
    }

    _buildBasket(w, h) {
        const ui = Math.min(w / 900, h / 550);
        this.basket = this.physics.add.image(w / 2, h - 72 * ui, "gunung_keranjang");
        this.basket.setScale((150 * ui) / this.basket.width);
        this.basket.setImmovable(true);
        this.basket.body.allowGravity = false;
    }

    _buildHUD(w, h) {
        const ui    = Math.min(w / 900, h / 550);
        const style = { fontSize: `${Math.floor(18 * ui)}px`, fontFamily: "Arial Black, Arial, sans-serif", color: "#ffffff", stroke: "#08101c", strokeThickness: 4 };

        this.hudCorrect = this.add.text(12, 12, "✅ 0 / " + GunungGameScene.LEVEL_CONFIG[this.level].target, style).setOrigin(0, 0).setDepth(10);
        this.hudWrong   = this.add.text(12, 12 + 25 * ui, "❌ 0", style).setOrigin(0, 0).setDepth(10);

        this.timerBg = this.add.image(w - 15 * ui, 15 * ui, "gunung_timer").setOrigin(1, 0).setDepth(9);
        this.timerBg.setScale((140 * ui) / this.timerBg.width);
        const timerCX = (w - 15 * ui) - (this.timerBg.width * this.timerBg.scaleX) / 2;
        const timerCY = (15 * ui) + (this.timerBg.height * this.timerBg.scaleY) / 2;

        this.hudTimer = this.add.text(timerCX, timerCY, this.timeLeft.toString(), {
            fontSize: `${Math.floor(26 * ui)}px`, fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff", stroke: "#000000", strokeThickness: 4,
        }).setOrigin(0.5).setDepth(10);
    }

    _buildControls(w, h) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isDragging = false; this.dragX = null;
        this.input.on("pointerdown", ptr => { this.isDragging = true;  this.dragX = ptr.x; });
        this.input.on("pointermove", ptr => { if (this.isDragging) this.dragX = ptr.x; });
        this.input.on("pointerup",   ()  => { this.isDragging = false; this.dragX = null; });
    }

    _scheduleNextSpawn() {
        if (!this.levelActive) return;
        const cfg   = GunungGameScene.LEVEL_CONFIG[this.level];
        const delay = Phaser.Math.Between(cfg.spawnMs * 0.8, cfg.spawnMs * 1.2);
        this.time.addEvent({ delay, callback: () => { this.spawnAnimal(this.scale.width); this._scheduleNextSpawn(); }, callbackScope: this });
    }

    spawnAnimal(w) {
        if (!this.levelActive) return;
        const cfg       = GunungGameScene.LEVEL_CONFIG[this.level];
        const isCorrect = Math.random() < cfg.pctCorrect;
        const pool      = isCorrect ? GunungGameScene.ANIMALS.correct : GunungGameScene.ANIMALS.trap;
        const texKey    = pool[Phaser.Math.Between(0, pool.length - 1)];
        const animal    = this.animalGroup.create(Phaser.Math.Between(50, w - 50), -50, texKey);

        const ui     = Math.min(w / 900, this.scale.height / 550);
        const maxDim = Math.max(animal.width, animal.height);
        animal.setScale(((GunungGameScene.SIZE_MAP[texKey] || 90) * ui / maxDim) * Phaser.Math.FloatBetween(0.88, 1.12));
        animal.setData("isCorrect", isCorrect);
        animal.setVelocityY(cfg.speed * Phaser.Math.FloatBetween(0.85, 1.15));
        animal.body.allowGravity = false;

        const sign = Math.random() < 0.5 ? 1 : -1;
        this.tweens.add({ targets: animal, angle: 14 * sign, duration: Phaser.Math.Between(400, 650), yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }

    _onCatch(basket, animal) {
        if (animal.getData("isCorrect")) {
            this.scoreCorrect++;
            this._showFeedback(animal.x, animal.y, "+1", "#d0eeff");
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
        const fb = this.add.text(x, y, txt, { fontSize: "28px", fontFamily: "Arial Black, Arial, sans-serif", color, stroke: "#000", strokeThickness: 4 }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets: fb, y: y - 65, alpha: 0, duration: 700, ease: "Quad.easeOut", onComplete: () => fb.destroy() });
    }

    _shakeBasket() {
        const ox = this.basket.x;
        this.tweens.add({ targets: [this.basket], x: "+=14", duration: 55, yoyo: true, repeat: 3, ease: "Sine.easeInOut", onComplete: () => { this.basket.x = ox; } });
    }

    _onTick() {
        this.timeLeft--;
        if (this.timeLeft <= 10 && this.hudTimer) {
            this.hudTimer.setStyle({ color: "#ff4444" });
            this.tweens.add({ targets: this.hudTimer, scaleX: 1.2, scaleY: 1.2, duration: 200, yoyo: true, ease: "Sine.easeInOut" });
        }
        if (this.timeLeft <= 0) this._endLevel();
    }

    _endLevel() {
        if (!this.levelActive) return;
        this.levelActive = false;
        if (this.bgmGunung) this.bgmGunung.stop();
        this.animalGroup.getChildren().forEach(a => a.destroy());
        this.animalGroup.clear(true, true);

        const isWin = this.scoreCorrect >= GunungGameScene.LEVEL_CONFIG[this.level].target;
        if (isWin) {
            const saved = parseInt(localStorage.getItem("gunung_maxLevel") || "1");
            localStorage.setItem("gunung_maxLevel", String(Math.min(Math.max(saved, this.level + 1), 3)));
            this._playSfx("ifNextLevel");
        } else {
            this._playSfx("ifFailedStar0");
        }
        this.time.delayedCall(300, () => this._showResult(isWin));
    }

    _showResult(isWin) {
        if (this.resultShown) return;
        this.resultShown = true;
        const w = this.scale.width, h = this.scale.height;

        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x020408, 0.72).setDepth(30).setAlpha(0);
        this.tweens.add({ targets: overlay, alpha: 1, duration: 350 });

        const panel = this.add.image(w / 2, h * 0.46, "ui_panel").setDepth(31).setAlpha(0).setScale(0.7);
        const tps   = (Math.min(w * 0.75, 500) / panel.width);
        this.tweens.add({ targets: panel, alpha: 1, scale: tps, duration: 400, ease: "Back.out(1.5)" });

        const pH = panel.height * tps, pW = panel.width * tps, pcX = panel.x, pcY = panel.y;

        let stars = 0;
        if (isWin) { stars = 1; if (this.scoreWrong <= 3) stars = 2; if (this.scoreWrong === 0) stars = 3; if (this.scoreCorrect >= GunungGameScene.LEVEL_CONFIG[this.level].target + 5) stars = 3; }

        const slots = [{ x: pcX - pW * 0.299, y: pcY - pH * 0.33 }, { x: pcX, y: pcY - pH * 0.33 }, { x: pcX + pW * 0.299, y: pcY - pH * 0.33 }];
        for (let i = 0; i < 3; i++) {
            const s  = this.add.image(slots[i].x, slots[i].y, "ui_bintang").setDepth(32).setAlpha(0).setScale(3).setOrigin(0.5);
            const fs = (pW * 0.30) / s.width;
            if (i < stars) { this.time.delayedCall(400 + i * 250, () => { this._playSfx("ting_star"); this.tweens.add({ targets: s, alpha: 1, scale: fs, duration: 350, ease: "Back.out(2)" }); }); }
            else { s.setTint(0x404040); this.time.delayedCall(400 + i * 150, () => { this.tweens.add({ targets: s, alpha: 0.6, scale: fs, duration: 300, ease: "Quad.easeOut" }); }); }
        }

        this.add.text(pcX, pcY - pH * 0.56, isWin ? "LUAR BIASA!" : "AYO COBA LAGI!", { fontSize: `${Math.floor(pH * 0.08)}px`, fontFamily: "Arial Black, Arial, sans-serif", color: isWin ? "#d0eeff" : "#ff8080", stroke: "#000", strokeThickness: 5 }).setOrigin(0.5).setDepth(32).setAlpha(0);

        const cfg = GunungGameScene.LEVEL_CONFIG[this.level];
        this.add.text(pcX, pcY - pH * 0.03,  `${this.scoreCorrect} / ${cfg.target}`, { fontSize: `${Math.floor(pH * 0.11)}px`, fontFamily: "Arial Black, Arial, sans-serif", color: isWin ? "#ffffff" : "#ffdddd", stroke: "#000", strokeThickness: 5 }).setOrigin(0.5).setDepth(32).setAlpha(0);
        this.add.text(pcX, pcY + pH * 0.055, "Hewan Benar", { fontSize: `${Math.floor(pH * 0.05)}px`, fontFamily: "Arial, sans-serif", color: "#ffdf80", stroke: "#000", strokeThickness: 3 }).setOrigin(0.5).setDepth(32).setAlpha(0);

        const bY = pcY + pH * 0.18, bW = pW * 0.30, bH = pH * 0.08;
        const wrongBg = this.add.graphics().setDepth(31);
        wrongBg.fillStyle(0xcc2200, 0.75); wrongBg.fillRoundedRect(pcX - bW * 0.5, bY - bH * 0.5, bW, bH, 10); wrongBg.setAlpha(0);
        this.add.text(pcX, bY, `❌  Salah: ${this.scoreWrong}`, { fontSize: `${Math.floor(pH * 0.055)}px`, fontFamily: "Arial Black, Arial, sans-serif", color: "#ffffff", stroke: "#550000", strokeThickness: 3 }).setOrigin(0.5).setDepth(32).setAlpha(0);

        this.time.delayedCall(800, () => {
            this.children.getAll().filter(c => c.depth === 32 && c.alpha === 0).forEach(c => { this.tweens.add({ targets: c, alpha: 1, duration: 350 }); });
            this.tweens.add({ targets: wrongBg, alpha: 1, duration: 350 });
        });

        const btnDefs = [
            { key: "ui_home",  action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("GunungScene"); }); } },
            { key: "ui_retry", action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("GunungGameScene", { level: this.level }); }); } },
        ];
        if (isWin && this.level < 3) btnDefs.push({ key: "ui_next", action: () => { this.cameras.main.fadeOut(300, 0, 0, 0); this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("GunungGameScene", { level: this.level + 1 }); }); } });

        const gap = pW * 0.35, bSX = pcX - (gap * (btnDefs.length - 1)) / 2, btnY = pcY + pH * 0.38;
        const bts = (pW * 0.14) / (this.textures.get("ui_home").getSourceImage().width || 150);
        btnDefs.forEach((def, i) => {
            const bx = bSX + i * gap, btn = this.add.image(bx, btnY, def.key).setDepth(33).setAlpha(0).setInteractive({ useHandCursor: true });
            btn.setScale(bts * 0.4);
            this.time.delayedCall(850 + i * 150, () => { this.tweens.add({ targets: btn, alpha: 1, scale: bts, duration: 400, ease: "Back.out(1.5)" }); });
            btn.on("pointerover", () => this.tweens.add({ targets: btn, scale: bts * 1.08, duration: 110, ease: "Back.out(2)" }));
            btn.on("pointerout",  () => this.tweens.add({ targets: btn, scale: bts,        duration: 110, ease: "Back.out(2)" }));
            btn.on("pointerdown", () => { this._playSfx("sfxClick"); this.tweens.add({ targets: btn, scale: bts * 0.9, duration: 70, yoyo: true, onComplete: def.action }); });
        });
    }

    _playSfx(key) {
        if (this.isMuted) return;
        if (this.cache.audio.exists(key)) this.sound.play(key, { volume: 0.7 });
    }
}

window.GunungGameScene = GunungGameScene;
