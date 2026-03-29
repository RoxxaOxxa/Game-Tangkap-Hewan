class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
    this.bgm = null;
    this.isMuted = false;
    this.audioStarted = false;
  }

  preload() {
    this.load.image("bgSky", "Asset/Menu Scene/bg-main.png");
    this.load.image("Awan", "Asset/Menu Scene/Awan.png");
    this.load.image("bgGround", "Asset/Menu Scene/Group 63.png");
    this.load.image("logo", "Asset/Menu Scene/TANGKAP-HEWAN-2-26-2026.png");
    this.load.image("playBtn", "Asset/Menu Scene/PLAY.png");
    this.load.image("soundBtn", "Asset/Menu Scene/SOUND.png");
    this.load.image("muteBtn", "Asset/Menu Scene/mute.png");
    this.load.image("creditBtn", "Asset/Menu Scene/CREDIT.png");
    this.load.image("creditIsi", "Asset/Menu Scene/credit_isi.png");

    // === AUDIO ===
    this.load.audio("bgmMenu", "Asset/Sound/bgm.mp3");
    this.load.audio("sfxClick", "Asset/Sound/select.mp3");
  }

  create() {
    // Sync mute state dari registry (kalau balik dari HabitatScene)
    if (this.registry.has("isMuted")) {
      this.isMuted = this.registry.get("isMuted");
    }

    this.layout();
    this.scale.on("resize", () => this.layout());

    // Unlock audio di klik pertama
    this.input.once("pointerdown", () => {
      this.startBGM();
    });

    // Hapus baris stopBGM di shutdown agar musik lanjut ke HabitatScene
    this.events.on("destroy", this.stopBGM, this);
  }

  // ===== AUDIO =====
  startBGM() {
    if (!this.cache.audio.exists("bgmMenu")) return;

    this.sound.mute = this.isMuted;

    let bgms = this.sound.getAll("bgmMenu");
    let existingBgm;
    if (bgms.length === 0) {
        existingBgm = this.sound.add("bgmMenu", { loop: true, volume: 0.35 });
    } else {
        existingBgm = bgms[0];
    }

    if (!existingBgm.isPlaying && !this.isMuted) {
        existingBgm.play();
    }
    
    this.bgm = existingBgm;
    this.audioStarted = true;
  }

  stopBGM() {
    if (this.bgm) {
      this.bgm.stop();
    }
  }

  playClick() {
    if (this.isMuted) return;
    if (!this.cache.audio.exists("sfxClick")) return;
    this.sound.play("sfxClick", { volume: 0.7 });
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    this.sound.mute = this.isMuted;
    this.registry.set("isMuted", this.isMuted);

    if (!this.isMuted) {
      this.startBGM();
    }

    if (this.soundIcon) {
      this.soundIcon.setTexture(this.isMuted ? "muteBtn" : "soundBtn");
    }
  }

  // ===== Helpers =====
  getUIScale(w, h) {
    return Math.min(w / 900, h / 550);
  }

  makeBouncyButton(btn, baseScale, onClick) {
    btn.setScale(baseScale);
    btn.setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: baseScale * 1.07, duration: 160, ease: "Back.out(2)" });
    });

    btn.on("pointerout", () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: baseScale, duration: 160, ease: "Back.out(2)" });
    });

    btn.on("pointerdown", () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({
        targets: btn,
        scale: baseScale * 0.93,
        duration: 80,
        ease: "Quad.easeOut",
        yoyo: true,
        onComplete: () => onClick && onClick(),
      });
    });
  }

  // ===== Credit Popup =====
  showCreditPopup() {
    const w = this.scale.width;
    const h = this.scale.height;

    // Overlay gelap (klik di luar untuk tutup)
    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.65)
      .setDepth(10)
      .setInteractive();

    // Gambar credit (scale agar muat di layar)
    const img = this.add.image(w / 2, h / 2, "creditIsi").setDepth(11);
    const maxW = w * 0.88;
    const maxH = h * 0.88;
    const scaleX = maxW / img.width;
    const scaleY = maxH / img.height;
    const imgScale = Math.min(scaleX, scaleY, 1);
    img.setScale(imgScale);

    // Tombol tutup (X) di pojok kanan atas gambar
    const imgHalfW = (img.width * imgScale) / 2;
    const imgHalfH = (img.height * imgScale) / 2;
    const closeBtn = this.add
      .text(w / 2 + imgHalfW - 10, h / 2 - imgHalfH + 10, "✕", {
        fontSize: "28px",
        fontFamily: "Arial Black, Arial, sans-serif",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(12)
      .setInteractive({ useHandCursor: true });

    const closeAll = () => {
      this.tweens.add({
        targets: [overlay, img, closeBtn],
        alpha: 0,
        duration: 200,
        onComplete: () => {
          overlay.destroy();
          img.destroy();
          closeBtn.destroy();
        },
      });
    };

    closeBtn.on("pointerover", () => closeBtn.setStyle({ color: "#f5d742" }));
    closeBtn.on("pointerout", () => closeBtn.setStyle({ color: "#ffffff" }));
    closeBtn.on("pointerdown", closeAll);
    overlay.on("pointerdown", closeAll);

    // Animasi masuk
    [overlay, closeBtn].forEach((obj) => {
      obj.setAlpha(0);
      this.tweens.add({ targets: obj, alpha: 1, duration: 250, ease: "Quad.easeOut" });
    });
    img.setAlpha(0).setScale(imgScale * 0.85);
    this.tweens.add({ targets: img, alpha: 1, scale: imgScale, duration: 300, ease: "Back.out(1.5)" });
  }

  // ===== Layout =====
  layout() {
    const w = this.scale.width;
    const h = this.scale.height;
    const ui = this.getUIScale(w, h);

    this.tweens.killAll();
    this.children.removeAll();

    // ── Background ──
    const bg = this.add.image(w / 2, h / 2, "bgSky").setDisplaySize(w, h);

    // ── Awan ──
    const cloudY = h * 0.18;
    const cloudScale = ui * 0.7;

    const cloud1 = this.add.image(-200, cloudY, "Awan").setScale(cloudScale).setAlpha(0.9);
    const cloud2 = this.add.image(w + 200, cloudY + 40, "Awan").setScale(cloudScale * 0.8).setAlpha(0.7);

    this.tweens.add({ targets: cloud1, x: w + 200, duration: 24000, ease: "Linear", repeat: -1, onRepeat: () => cloud1.x = -200 });
    this.tweens.add({ targets: cloud2, x: -200, duration: 32000, ease: "Linear", repeat: -1, onRepeat: () => cloud2.x = w + 200 });

    // ── Ground ──
    const ground = this.add.image(w / 2, h - 90, "bgGround").setDisplaySize(w, 200);

    // ── LOGO (drop + bounce masuk) ──
    const logoTargetY = h * 0.24;
    const logo = this.add.image(w / 2, -120, "logo").setScale(ui * 0.45).setAlpha(0);
    this.tweens.add({
      targets: logo,
      y: logoTargetY,
      alpha: 1,
      duration: 750,
      ease: "Bounce.out",
      delay: 100,
    });

    // Logo float setelah masuk
    this.time.delayedCall(900, () => {
      this.tweens.add({
        targets: logo,
        y: logoTargetY - 9,
        duration: 1300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // ── PLAY Button (slide up masuk) ──
    const playTargetY = h * 0.62;
    const play = this.add.image(w / 2, h + 80, "playBtn").setAlpha(0);
    this.tweens.add({
      targets: play,
      y: playTargetY,
      alpha: 1,
      duration: 600,
      ease: "Back.out(1.4)",
      delay: 300,
      onComplete: () => {
        this.makeBouncyButton(play, ui * 0.9, () => {
          this.startBGM();
          this.playClick();
          this.cameras.main.fadeOut(350, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("HabitatScene");
          });
        });
      },
    });

    // ── Tombol kiri (CREDIT + SOUND) ──
    const leftX = 70;
    const topY = h * 0.10;   // p
    const gapY = 100;

    // Credit
    const credit = this.add.image(leftX, topY, "creditBtn").setAlpha(0);
    this.tweens.add({
      targets: credit, alpha: 1, duration: 500, ease: "Back.out(1.5)", delay: 500,
      onComplete: () => {
        this.makeBouncyButton(credit, ui * 0.6, () => {
          this.playClick();
          this.showCreditPopup();
        });
      },
    });

    // Sound — simpan referensi ke property agar toggleSound bisa swap texture
    const soundKey = this.isMuted ? "muteBtn" : "soundBtn";
    this.soundIcon = this.add.image(leftX, topY + gapY, soundKey).setAlpha(0);
    this.tweens.add({
      targets: this.soundIcon, alpha: 1, duration: 500, ease: "Back.out(1.5)", delay: 650,
      onComplete: () => {
        this.makeBouncyButton(this.soundIcon, ui * 0.6, () => {
          this.playClick();
          this.toggleSound();
        });
      },
    });
  }
}

window.MenuScene = MenuScene;
