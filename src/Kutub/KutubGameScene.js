// ============================================================
//  KutubGameScene.js — Gameplay Habitat Kutub (Self-Contained)
//  Asset: Asset/LevelKutub/Bg.png
//  Progres disimpan: localStorage key "kutub_maxLevel"
// ============================================================

class KutubGameScene extends Phaser.Scene {
    constructor() {
        super("KutubGameScene");
    }

    // ──────────────────────────────────────────────
    //  DATA HEWAN KUTUB
    // ──────────────────────────────────────────────
    static get ANIMALS() {
        return {
            correct: ["kutub_anjinglaut", "kutub_pausbeluga", "kutub_beruang", "kutub_pinguin", "kutub_walrus"],
            trap: [
                "laut_hiu", "laut_lumbalumba", "laut_orca", "laut_uburubur", "laut_penyu", "laut_kepiting",
                "sungai_bangau", "sungai_belut", "sungai_buaya", "sungai_kepiting", "sungai_katak"
            ],
        };
    }

    // ──────────────────────────────────────────────
    //  LEVEL CONFIG
    // ──────────────────────────────────────────────
    static get LEVEL_CONFIG() {
        return [
            null,
            { speed: 130, spawnMs: 1300, pctCorrect: 0.68, target: 8, timer: 60 }, // Level 1
            { speed: 190, spawnMs: 950, pctCorrect: 0.52, target: 10, timer: 45 }, // Level 2
            { speed: 260, spawnMs: 700, pctCorrect: 0.42, target: 12, timer: 30 }, // Level 3
        ];
    }

    // ──────────────────────────────────────────────
    //  INIT
    // ──────────────────────────────────────────────
    init(data) {
        this.level = data.level || 1;
        this.isMuted = this.registry.get("isMuted") || false;
    }

    preload() {
        if (!this.textures.exists("kutub_bg")) {
            this.load.image("kutub_bg", "Asset/Kutub/Bg.png");
        }
        if (!this.textures.exists("kutub_timer")) {
            this.load.image("kutub_timer", "Asset/Kutub/TimerGame.png");
        }
        if (!this.textures.exists("kutub_keranjang")) {
            this.load.image("kutub_keranjang", "Asset/Kutub/keranjang.png");
        }

        // Hewan Kutub
        this.load.image("kutub_anjinglaut", "Asset/Hewan/HewanKutub/AnjingLaut.png");
        this.load.image("kutub_pausbeluga", "Asset/Hewan/HewanKutub/PausBeluga.png");
        this.load.image("kutub_beruang", "Asset/Hewan/HewanKutub/beruangkutub.png");
        this.load.image("kutub_pinguin", "Asset/Hewan/HewanKutub/pinguin.png");
        this.load.image("kutub_walrus", "Asset/Hewan/HewanKutub/walrus.png");

        // Hewan Trap (Laut & Sungai)
        this.load.image("laut_hiu", "Asset/Hewan/HewanLaut/Hiu.png");
        this.load.image("laut_lumbalumba", "Asset/Hewan/HewanLaut/LumbaLumba.png");
        this.load.image("laut_orca", "Asset/Hewan/HewanLaut/Orca.png");
        this.load.image("laut_uburubur", "Asset/Hewan/HewanLaut/UburUbur.png");
        this.load.image("laut_penyu", "Asset/Hewan/HewanLaut/penyu.png");
        this.load.image("laut_kepiting", "Asset/Hewan/HewanLaut/kepiting.png");

        this.load.image("sungai_bangau", "Asset/Hewan/HewanSungai/Bangau.png");
        this.load.image("sungai_belut", "Asset/Hewan/HewanSungai/Belut.png");
        this.load.image("sungai_buaya", "Asset/Hewan/HewanSungai/Buaya.png");
        this.load.image("sungai_kepiting", "Asset/Hewan/HewanSungai/Kepiting Sungai.png");
        this.load.image("sungai_katak", "Asset/Hewan/HewanSungai/katak.png");

        // UI Result Layar Akhir
        this.load.image("ui_panel", "Asset/PanelBintang.png");
        this.load.image("ui_bintang", "Asset/Bintang.png");
        this.load.image("ui_home", "Asset/Home.png");
        this.load.image("ui_retry", "Asset/Retry.png");
        this.load.image("ui_next", "Asset/NextLevel.png");

        if (!this.cache.audio.exists("sfxClick")) {
            this.load.audio("sfxClick", "Asset/Sound/select.mp3");
        }
        if (!this.cache.audio.exists("timeout")) {
            this.load.audio("timeout", "Asset/Sound/timeout.mp3");
        }
        if (!this.cache.audio.exists("lvup")) {
            this.load.audio("lvup", "Asset/Sound/lvup.mp3");
        }
        if (!this.cache.audio.exists("ting_star")) {
            this.load.audio("ting_star", "Asset/Sound/ting_star.mp3");
        }
        if (!this.cache.audio.exists("ifNextLevel")) {
            this.load.audio("ifNextLevel", "Asset/Sound/IfNextLevel.mp3");
        }
        if (!this.cache.audio.exists("ifFailedStar0")) {
            this.load.audio("ifFailedStar0", "Asset/Sound/IfFailedStar0.mp3");
        }
        if (!this.cache.audio.exists("TangkapBenar")) {
            this.load.audio("TangkapBenar", "Asset/Sound/TangkapBenar.mp3");
        }
        if (!this.cache.audio.exists("SalahTangkap")) {
            this.load.audio("SalahTangkap", "Asset/Sound/SalahTangkap.mp3");
        }
        if (!this.cache.audio.exists("bgmKutub")) {
            this.load.audio("bgmKutub", "Asset/Sound/bgmKutub.mp3");
        }
    }

    create() {
        this.sound.stopAll();
        this.sound.mute = this.isMuted;

        if (this.cache.audio.exists("bgmKutub")) {
            this.bgmKutub = this.sound.add("bgmKutub", { loop: true, volume: 0.4 });
            if (!this.isMuted) this.bgmKutub.play();
        }

        this.cameras.main.fadeIn(400, 0, 0, 0);

        const cfg = KutubGameScene.LEVEL_CONFIG[this.level];

        // State
        this.scoreCorrect = 0;
        this.scoreWrong = 0;
        this.timeLeft = cfg.timer;
        this.spawnTimer = 0;
        this.levelActive = true;
        this.resultShown = false;

        const w = this.scale.width;
        const h = this.scale.height;

        this.animalGroup = this.physics.add.group();

        this._buildBackground(w, h);
        this._buildBasket(w, h);
        this._buildHUD(w, h);
        this._buildControls(w, h);

        this.physics.add.overlap(
            this.basket,
            this.animalGroup,
            this._onCatch,
            null,
            this
        );

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this._onTick,
            callbackScope: this,
            repeat: cfg.timer - 1,
        });

        // Memulai loop spawn menggunakan addEvent
        this._scheduleNextSpawn();
    }

    update(time, delta) {
        if (!this.levelActive) return;

        const w = this.scale.width;
        const h = this.scale.height;
        const cfg = KutubGameScene.LEVEL_CONFIG[this.level];
        const bw = this.basket.width * this.basket.scaleX;

        // ── Keyboard ──
        if (this.cursors.left.isDown) {
            this.basket.x = Math.max(bw / 2, this.basket.x - 7);
        } else if (this.cursors.right.isDown) {
            this.basket.x = Math.min(w - bw / 2, this.basket.x + 7);
        }

        // ── Touch drag ──
        if (this.isDragging && this.dragX !== null) {
            this.basket.x = Phaser.Math.Clamp(this.dragX, bw / 2, w - bw / 2);
        }

        // Sync label keranjang
        if (this.basketLabel) this.basketLabel.x = this.basket.x;

        // ── Buang hewan keluar bawah ──
        this.animalGroup.getChildren().forEach(a => {
            if (a.y > h + 60) {
                a.destroy();
            }
        });

        // ── Update HUD ──
        if (this.hudTimer) this.hudTimer.setText(this.timeLeft.toString());
        if (this.hudCorrect) this.hudCorrect.setText("✅ " + this.scoreCorrect + " / " + KutubGameScene.LEVEL_CONFIG[this.level].target);
        if (this.hudWrong) this.hudWrong.setText("❌ " + this.scoreWrong);
    }

    // ──────────────────────────────────────────────
    //  BACKGROUND
    // ──────────────────────────────────────────────
    _buildBackground(w, h) {
        if (this.textures.exists("kutub_bg")) {
            this.add.image(w / 2, h / 2, "kutub_bg").setDisplaySize(w, h);
        } else {
            this.add.rectangle(w / 2, h / 2, w, h, 0xd0eaf7);
        }
        // Label level
        this.add.text(12, h - 12, "❄️ KUTUB  |  Level " + this.level, {
            fontSize: "15px", fontFamily: "Arial, sans-serif",
            color: "#ffffff", stroke: "#003366", strokeThickness: 3,
        }).setOrigin(0, 1).setAlpha(0.75).setDepth(1);
    }

    // ──────────────────────────────────────────────
    //  KERANJANG
    // ──────────────────────────────────────────────
    _buildBasket(w, h) {
        const ui = Math.min(w / 900, h / 550);
        const basketY = h - 72 * ui;

        this.basket = this.physics.add.image(w / 2, basketY, "kutub_keranjang");

        // Set ukuran lebar keranjang proporsional dengan layar, misal 150px pada baseline
        const targetW = 150 * ui;
        this.basket.setScale(targetW / this.basket.width);

        this.basket.setImmovable(true);
        this.basket.body.allowGravity = false;

        // Label keranjang dihapus
        this.basketLabel = null;
    }

    // ──────────────────────────────────────────────
    //  HUD
    // ──────────────────────────────────────────────
    _buildHUD(w, h) {
        const ui = Math.min(w / 900, h / 550);
        const style = {
            fontSize: `${Math.floor(18 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff",
            stroke: "#003366",
            strokeThickness: 4,
        };

        // Pindah statistik ke kiri
        this.hudCorrect = this.add.text(12, 12, "✅ 0 / " + KutubGameScene.LEVEL_CONFIG[this.level].target, style).setOrigin(0, 0).setDepth(10);
        this.hudWrong = this.add.text(12, 12 + (25 * ui), "❌ 0", style).setOrigin(0, 0).setDepth(10);

        // Timer pindah ujung kanan dengan background TimerGame.png
        this.timerBg = this.add.image(w - 15 * ui, 15 * ui, "kutub_timer").setOrigin(1, 0).setDepth(9);

        // Sesuaikan ukuran asset timer agar tidak kebesaran
        const targetTimerW = 140 * ui;
        this.timerBg.setScale(targetTimerW / this.timerBg.width);

        // Posisi teks timer harus berada di atas gambar timer
        const timerCenterX = (w - 15 * ui) - (this.timerBg.width * this.timerBg.scaleX) / 2;
        const timerCenterY = (15 * ui) + (this.timerBg.height * this.timerBg.scaleY) / 2;

        this.hudTimer = this.add.text(timerCenterX, timerCenterY, this.timeLeft.toString(), {
            fontSize: `${Math.floor(26 * ui)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        }).setOrigin(0.5).setDepth(10);
    }

    // ──────────────────────────────────────────────
    //  KONTROL
    // ──────────────────────────────────────────────
    _buildControls(w, h) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.isDragging = false;
        this.dragX = null;

        this.input.on("pointerdown", ptr => { this.isDragging = true; this.dragX = ptr.x; });
        this.input.on("pointermove", ptr => { if (this.isDragging) this.dragX = ptr.x; });
        this.input.on("pointerup", () => { this.isDragging = false; this.dragX = null; });
    }

    // ──────────────────────────────────────────────
    //  SPAWN HEWAN
    // ──────────────────────────────────────────────
    _scheduleNextSpawn() {
        if (!this.levelActive) return;
        const cfg = KutubGameScene.LEVEL_CONFIG[this.level];
        // Variasi delay manual agar lebih natural
        const delay = Phaser.Math.Between(cfg.spawnMs * 0.8, cfg.spawnMs * 1.2);

        this.time.addEvent({
            delay: delay,
            callback: () => {
                this.spawnAnimal(this.scale.width);
                this._scheduleNextSpawn();
            },
            callbackScope: this
        });
    }

    spawnAnimal(w) {
        if (!this.levelActive) return;

        const cfg = KutubGameScene.LEVEL_CONFIG[this.level];
        const isCorrect = Math.random() < cfg.pctCorrect;
        const pool = isCorrect ? KutubGameScene.ANIMALS.correct : KutubGameScene.ANIMALS.trap;
        const texKey = pool[Phaser.Math.Between(0, pool.length - 1)];

        const x = Phaser.Math.Between(50, w - 50);
        const startY = -50;

        const animal = this.animalGroup.create(x, startY, texKey);

        // Ukuran hewan disamaratakan agar tidak ada yang kebesaran/kekecilan
        const ui = Math.min(w / 900, this.scale.height / 550);
        // Menggunakan dimensi terbesar (width atau height) agar proporsional
        const maxDim = Math.max(animal.width, animal.height);
        const baseScale = (90 * ui) / maxDim; // Target ukuran sekitar 90px
        
        const randomScale = Phaser.Math.FloatBetween(0.85, 1.15); // Sedikit variasi agar natural
        animal.setScale(baseScale * randomScale);

        animal.setData("isCorrect", isCorrect);

        // Variasi kecepatan jatuh yang natural
        const speedVar = Phaser.Math.FloatBetween(0.85, 1.15);
        animal.setVelocityY(cfg.speed * speedVar);
        animal.body.allowGravity = false;

        // Sedikit rotasi (wobble) agar lebih dinamis
        const sign = Math.random() < 0.5 ? 1 : -1;
        this.tweens.add({
            targets: animal,
            angle: 15 * sign,
            duration: Phaser.Math.Between(400, 600),
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut"
        });
    }

    // ──────────────────────────────────────────────
    //  TANGKAP
    // ──────────────────────────────────────────────
    _onCatch(basket, animal) {
        const isCorrect = animal.getData("isCorrect");

        if (isCorrect) {
            this.scoreCorrect++;
            this._showFeedback(animal.x, animal.y, "+1", "#4ac8f0");
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

        this.tweens.add({
            targets: fb, y: y - 65, alpha: 0,
            duration: 700, ease: "Quad.easeOut",
            onComplete: () => fb.destroy(),
        });
    }

    _shakeBasket() {
        const ox = this.basket.x;
        this.tweens.add({
            targets: [this.basket],
            x: `+=14`, duration: 55, yoyo: true, repeat: 3,
            ease: "Sine.easeInOut",
            onComplete: () => {
                this.basket.x = ox;
            },
        });
    }

    // ──────────────────────────────────────────────
    //  TIMER TICK
    // ──────────────────────────────────────────────
    _onTick() {
        this.timeLeft--;
        if (this.timeLeft <= 0) this._endLevel();
    }

    // ──────────────────────────────────────────────
    //  LEVEL SELESAI → Tampil hasil inline
    // ──────────────────────────────────────────────
    _endLevel() {
        if (!this.levelActive) return;
        this.levelActive = false;

        if (this.bgmKutub) {
            this.bgmKutub.stop();
        }

        // Bersihkan hewan
        this.animalGroup.getChildren().forEach(a => {
            a.destroy();
        });
        this.animalGroup.clear(true, true);

        const isWin = this.scoreCorrect >= KutubGameScene.LEVEL_CONFIG[this.level].target;

        // Simpan unlock jika menang
        if (isWin) {
            const saved = parseInt(localStorage.getItem("kutub_maxLevel") || "1");
            const newMax = Math.max(saved, this.level + 1);
            localStorage.setItem("kutub_maxLevel", String(Math.min(newMax, 3)));
            this._playSfx("ifNextLevel");
        } else {
            this._playSfx("ifFailedStar0");
        }

        // Tunda sebentar lalu tampil overlay hasil
        this.time.delayedCall(300, () => this._showResult(isWin));
    }

    // ──────────────────────────────────────────────
    //  OVERLAY HASIL (Menggunakan Panel, Bintang & Tombol Asset)
    // ──────────────────────────────────────────────
    _showResult(isWin) {
        if (this.resultShown) return;
        this.resultShown = true;

        const w = this.scale.width;
        const h = this.scale.height;
        const ui = Math.min(w / 900, h / 550);

        // Overlay gelap
        const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000011, 0.72).setDepth(30).setAlpha(0);
        this.tweens.add({ targets: overlay, alpha: 1, duration: 350 });

        // Panel Bintang
        const panel = this.add.image(w / 2, h * 0.46, "ui_panel").setDepth(31).setAlpha(0).setScale(0.7);
        const targetPanelScale = (Math.min(w * 0.75, 500) / panel.width);
        this.tweens.add({ targets: panel, alpha: 1, scale: targetPanelScale, duration: 400, ease: "Back.out(1.5)" });

        const panelH = panel.height * targetPanelScale;
        const panelW = panel.width * targetPanelScale;

        // Logika Bintang
        let stars = 0;
        if (isWin) {
            stars = 1; // Menang = 1 bintang
            if (this.scoreWrong <= 3) stars = 2; // Salah maksimal 3 = 2 bintang
            if (this.scoreWrong === 0) stars = 3; // Lulus sempurna = 3 bintang
            // Jika skor sangat melampaui target, beri kompensasi 3 bintang
            if (this.scoreCorrect >= KutubGameScene.LEVEL_CONFIG[this.level].target + 5) stars = 3;
        }

        // === PARAMETER LAYOUT PANEL RESULT ===
        // Semua posisi dihitung relatif terhadap pusat geometric panel (panelCenterX, panelCenterY)
        const STAR_Y_OFFSET = 0.33;    // Bintang: semakin besar = semakin tinggi sejajar slot transparan
        const STAR_X_LEFT = 0.299;    // Bintang Kiri: semakin besar = semakin melebar ke kiri
        const STAR_X_RIGHT = 0.299;    // Bintang Kanan: semakin besar = semakin melebar ke kanan
        const TITLE_Y_OFFSET = 0.56;   // Judul teks di atas panel (menggunakan nilai negatif, sem. besar = sem. tinggi)
        const SCORE_Y_OFFSET = -0.03;  // Skor Utama "12 / 12" (negatif = sedikit ditarik ke atas agar pas tengah area pucat)
        const LABEL_Y_OFFSET = 0.055;  // Label kuning "Hewan Benar" (di bawah skor utama)
        const BADGE_Y_OFFSET = 0.18;   // Kartu/badge merah "Salah: X" (tepat di bawah area pucat)
        const BUTTON_Y_OFFSET = 0.38;  // Tombol Home/Retry/Next (disetel sekitar 0.38 agar aman di dalam panel)
        const STAR_SIZE = 0.31;        // Skala visual bintang kuning
        // =====================================

        const panelCenterX = panel.x;
        const panelCenterY = panel.y;

        // 1. Posisi Bintang
        const starSlots = [
            { x: panelCenterX - panelW * STAR_X_LEFT, y: panelCenterY - panelH * STAR_Y_OFFSET },
            { x: panelCenterX, y: panelCenterY - panelH * STAR_Y_OFFSET },
            { x: panelCenterX + panelW * STAR_X_RIGHT, y: panelCenterY - panelH * STAR_Y_OFFSET },
        ];

        if (stars > 0) {
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
        }

        // 2. Judul atas panel
        const titleTxt = isWin ? "LUAR BIASA!" : "AYO COBA LAGI!";
        const titleClr = isWin ? "#4ac8f0" : "#ff8080";
        this.add.text(panelCenterX, panelCenterY - panelH * TITLE_Y_OFFSET, titleTxt, {
            fontSize: `${Math.floor(panelH * 0.08)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: titleClr, stroke: "#000", strokeThickness: 5,
        }).setOrigin(0.5).setDepth(32).setAlpha(0);

        // 3. Area Panel Oranye Pucat (Skor & Label)
        const cfg = KutubGameScene.LEVEL_CONFIG[this.level];
        const mainScoreTxt = `${this.scoreCorrect} / ${cfg.target}`;

        // Skor Utama (besar, rata tengah vertikal & horizontal terhadap titik offset)
        this.add.text(panelCenterX, panelCenterY + panelH * SCORE_Y_OFFSET, mainScoreTxt, {
            fontSize: `${Math.floor(panelH * 0.11)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: isWin ? "#ffffff" : "#ffdddd",
            stroke: "#000", strokeThickness: 5,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        // Label "Hewan Benar" (kuning, merapat di bawah skor)
        this.add.text(panelCenterX, panelCenterY + panelH * LABEL_Y_OFFSET, "Hewan Benar", {
            fontSize: `${Math.floor(panelH * 0.05)}px`,
            fontFamily: "Arial, sans-serif",
            color: "#ffdf80", stroke: "#000", strokeThickness: 3,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        // 4. Badge Merah "Salah Tangkap"
        const badgeY = panelCenterY + panelH * BADGE_Y_OFFSET;
        const badgeW = panelW * 0.30;
        const badgeH = panelH * 0.08;

        const wrongBg = this.add.graphics().setDepth(31);
        wrongBg.fillStyle(0xcc2200, 0.75);
        wrongBg.fillRoundedRect(
            panelCenterX - badgeW * 0.5,
            badgeY - badgeH * 0.5,
            badgeW, badgeH, 10
        );
        wrongBg.setAlpha(0);

        this.add.text(panelCenterX, badgeY, `❌  Salah: ${this.scoreWrong}`, {
            fontSize: `${Math.floor(panelH * 0.055)}px`,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ffffff", stroke: "#550000", strokeThickness: 3,
        }).setOrigin(0.5, 0.5).setDepth(32).setAlpha(0);

        // Tampilkan statistik & badge setelah bintang
        this.time.delayedCall(800, () => {
            this.children.getAll().filter(c => c.depth === 32 && c.alpha === 0).forEach(c => {
                this.tweens.add({ targets: c, alpha: 1, duration: 350 });
            });
            this.tweens.add({ targets: wrongBg, alpha: 1, duration: 350 });
        });

        // 5. Tombol (Home, Retry, Next)
        const isWinAndHasNext = isWin && this.level < 3;
        const btnDefs = [];

        btnDefs.push({
            key: "ui_home", action: () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("KutubScene"); });
            }
        });

        btnDefs.push({
            key: "ui_retry", action: () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("KutubGameScene", { level: this.level }); });
            }
        });

        if (isWinAndHasNext) {
            btnDefs.push({
                key: "ui_next", action: () => {
                    this.cameras.main.fadeOut(300, 0, 0, 0);
                    this.cameras.main.once("camerafadeoutcomplete", () => { this.scene.start("KutubGameScene", { level: this.level + 1 }); });
                }
            });
        }

        const btnGap = panelW * 0.35;
        const totalW = btnGap * (btnDefs.length - 1);
        const bStartX = panelCenterX - totalW / 2;
        const btnY = panelCenterY + panelH * BUTTON_Y_OFFSET;

        // Mendapatkan lebar asli gambar `ui_home` untuk mengkalkulasi skalar pengecilan
        const homeImg = this.textures.get("ui_home").getSourceImage();
        const baseImgW = homeImg.width || 150;
        const btnTargetScale = (panelW * 0.14) / baseImgW; // Ukuran tombol diperkecil

        btnDefs.forEach((def, i) => {
            const bx = bStartX + i * btnGap;
            const btn = this.add.image(bx, btnY, def.key).setDepth(33).setAlpha(0).setInteractive({ useHandCursor: true });
            btn.setScale(btnTargetScale * 0.4); // Awal start kecil untuk pop in tween

            this.time.delayedCall(850 + i * 150, () => {
                this.tweens.add({ targets: btn, alpha: 1, scale: btnTargetScale, duration: 400, ease: "Back.out(1.5)" });
            });

            btn.on("pointerover", () => { this.tweens.add({ targets: btn, scale: btnTargetScale * 1.08, duration: 110, ease: "Back.out(2)" }); });
            btn.on("pointerout", () => { this.tweens.add({ targets: btn, scale: btnTargetScale, duration: 110, ease: "Back.out(2)" }); });
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
        if (this.cache.audio.exists(key)) {
            this.sound.play(key, { volume: 0.7 });
        }
    }
}

window.KutubGameScene = KutubGameScene;
