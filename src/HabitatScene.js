class HabitatScene extends Phaser.Scene {
  constructor() {
    super("HabitatScene");
    this.isMuted = false;
    this.soundIcon = null;
  }

  preload() {
    // Background + UI
    this.load.image("hab_bg", "Asset/SelectHabitat/bg.png");
    this.load.image("hab_sound", "Asset/SelectHabitat/SOUND.png");
    this.load.image("hab_mute", "Asset/Menu Scene/mute.png");
    this.load.image("hab_credit", "Asset/SelectHabitat/CREDIT.png");
    this.load.image("hab_back", "Asset/SelectHabitat/Back.png");
    this.load.image("hab_title", "Asset/SelectHabitat/pilihhabitat.png");
    this.load.image("hab_awan", "Asset/SelectHabitat/Awan.png");

    // Tombol habitat
    this.load.image("btn_hutan", "Asset/SelectHabitat/hutan.png");
    this.load.image("btn_savana", "Asset/SelectHabitat/savana.png");
    this.load.image("btn_rawa", "Asset/SelectHabitat/rawa.png");
    this.load.image("btn_danau", "Asset/SelectHabitat/danau.png");
    this.load.image("btn_laut", "Asset/SelectHabitat/laut.png");
    this.load.image("btn_kutub", "Asset/SelectHabitat/kutub.png");
    this.load.image("btn_gurun", "Asset/SelectHabitat/gurun.png");
    this.load.image("btn_sungai", "Asset/SelectHabitat/sungai.png");
    this.load.image("btn_gunung", "Asset/SelectHabitat/gunung.png");

    // Audio
    this.load.audio("sfxClick", "Asset/Sound/select.mp3");
  }

  create() {
    // Sync mute state dari registry
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

    this.cameras.main.fadeIn(400, 0, 0, 0);

    this.layout();
    this.scale.on("resize", () => this.layout());
  }

  // ===== Helpers =====
  getUIScale(w, h) {
    return Math.min(w / 900, h / 550);
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

    if (!this.isMuted && this.cache.audio.exists("bgmMenu")) {
        let bgms = this.sound.getAll("bgmMenu");
        if (bgms.length > 0 && !bgms[0].isPlaying) {
            bgms[0].play();
        }
    }

    if (this.soundIcon) {
      this.soundIcon.setTexture(this.isMuted ? "hab_mute" : "hab_sound");
    }
  }

  // ===== Bouncy Button =====
  makeBouncyButton(btn, baseScale, onClick) {
    btn.setScale(baseScale);
    btn.setInteractive({ useHandCursor: true });

    btn.on("pointerover", () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: baseScale * 1.08, duration: 150, ease: "Back.out(2)" });
    });

    btn.on("pointerout", () => {
      this.tweens.killTweensOf(btn);
      this.tweens.add({ targets: btn, scale: baseScale, duration: 150, ease: "Back.out(2)" });
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

    const overlay = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.55)
      .setDepth(10).setInteractive();

    const panelW = Math.min(w * 0.6, 460);
    const panelH = Math.min(h * 0.55, 320);
    const panel = this.add.rectangle(w / 2, h / 2, panelW, panelH, 0x1a4a2e)
      .setDepth(11).setStrokeStyle(3, 0x5ecf7a);

    const title = this.add.text(w / 2, h / 2 - panelH * 0.35, "CREDIT", {
      fontSize: `${Math.floor(panelH * 0.12)}px`,
      fontFamily: "Arial Black, Arial, sans-serif",
      color: "#f5d742",
      stroke: "#6b3a00",
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(12);

    const lines = [
      "Game Design & Programming",
      "by [Nama Tim / Kelas]",
      "",
      "Art & Assets: [Nama]",
      "Sound: [Nama]",
      "",
      "Dibuat untuk Gamelab 2026",
    ];
    const body = this.add.text(w / 2, h / 2 + panelH * 0.02, lines.join("\n"), {
      fontSize: `${Math.floor(panelH * 0.07)}px`,
      fontFamily: "Arial, sans-serif",
      color: "#e8f5e9",
      align: "center",
      lineSpacing: 6,
    }).setOrigin(0.5).setDepth(12);

    const closeBtn = this.add.text(
      w / 2 + panelW / 2 - 18,
      h / 2 - panelH / 2 + 14,
      "✕", {
      fontSize: `${Math.floor(panelH * 0.1)}px`,
      fontFamily: "Arial, sans-serif",
      color: "#ffffff",
    }
    ).setOrigin(0.5).setDepth(12).setInteractive({ useHandCursor: true });

    const closeAll = () => {
      this.tweens.add({
        targets: [overlay, panel, title, body, closeBtn],
        alpha: 0,
        duration: 200,
        onComplete: () => {
          overlay.destroy(); panel.destroy(); title.destroy();
          body.destroy(); closeBtn.destroy();
        },
      });
    };

    closeBtn.on("pointerover", () => closeBtn.setStyle({ color: "#f5d742" }));
    closeBtn.on("pointerout", () => closeBtn.setStyle({ color: "#ffffff" }));
    closeBtn.on("pointerdown", closeAll);
    overlay.on("pointerdown", closeAll);

    [overlay, panel, title, body, closeBtn].forEach(o => o.setAlpha(0));
    this.tweens.add({ targets: [overlay, title, body, closeBtn], alpha: 1, duration: 250 });
    panel.setScale(0.8);
    this.tweens.add({ targets: panel, scale: 1, alpha: 1, duration: 300, ease: "Back.out(1.5)" });
  }

  // ===== Layout =====
  layout() {
    const w = this.scale.width;
    const h = this.scale.height;
    const ui = this.getUIScale(w, h);

    this.tweens.killAll();
    this.children.removeAll();

    // ── BG ──
    this.add.image(w / 2, h / 2, "hab_bg").setDisplaySize(w, h);

    // ── Awan (dua layer, arah berlawanan) ──
    const cloudY1 = h * 0.12;
    const cloudY2 = h * 0.20;
    const cloudSc = ui * 0.65;

    const cloud1 = this.add.image(-180, cloudY1, "hab_awan")
      .setScale(cloudSc).setAlpha(0.85).setDepth(1);
    const cloud2 = this.add.image(w + 180, cloudY2, "hab_awan")
      .setScale(cloudSc * 0.80).setAlpha(0.70).setDepth(1);

    this.tweens.add({
      targets: cloud1, x: w + 180, duration: 26000,
      ease: "Linear", repeat: -1,
      onRepeat: () => { cloud1.x = -180; },
    });
    this.tweens.add({
      targets: cloud2, x: -180, duration: 34000,
      ease: "Linear", repeat: -1,
      onRepeat: () => { cloud2.x = w + 180; },
    });

    // ── Judul "Pilih Habitat" (image asset) ──
    const titleImg = this.add.image(w / 2, -60, "hab_title")
      .setScale(ui * 0.75).setAlpha(0).setDepth(2);

    this.tweens.add({
      targets: titleImg,
      y: h * 0.10,
      alpha: 1,
      duration: 650,
      ease: "Back.out(1.5)",
      delay: 80,
    });

    // Float pelan-pelan
    this.time.delayedCall(780, () => {
      this.tweens.add({
        targets: titleImg,
        y: h * 0.10 - 5,
        duration: 1800,
        yoyo: true, repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

    // ── Ikon SOUND & CREDIT ──
    const leftX = 58 * ui;
    const topY = h * 0.10;
    const gapY = 75 * ui;

    const soundKey = this.isMuted ? "hab_mute" : "hab_sound";
    this.soundIcon = this.add.image(leftX, topY, soundKey).setAlpha(0).setDepth(3);
    this.tweens.add({
      targets: this.soundIcon, alpha: 1, duration: 400, delay: 200,
      onComplete: () => {
        this.makeBouncyButton(this.soundIcon, 0.62 * ui, () => {
          this.playClick();
          this.toggleSound();
        });
      },
    });

    // const creditIcon = this.add.image(leftX, topY + gapY, "hab_credit").setAlpha(0).setDepth(3);
    // this.tweens.add({
    //   targets: creditIcon, alpha: 1, duration: 400, delay: 300,
    //   onComplete: () => {
    //     this.makeBouncyButton(creditIcon, 0.62 * ui, () => {
    //       this.playClick();
    //       this.showCreditPopup();
    //     });
    //   },
    // });

    // ── Tombol BACK (image asset, kanan atas) ──
    const backBtn = this.add.image(w - 30, 30, "hab_back")
      .setOrigin(1, 0).setScale(ui * 0.65).setAlpha(0).setDepth(3);

    this.tweens.add({
      targets: backBtn, alpha: 1, duration: 400, delay: 200,
      onComplete: () => {
        this.makeBouncyButton(backBtn, ui * 0.65, () => {
          this.playClick();
          this.cameras.main.fadeOut(300, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MenuScene");
          });
        });
      },
    });

    // ── Grid Habitat (3x3 — staggered pop-in) ──
    const habitats = [
      { key: "btn_hutan", id: "hutan", label: "Hutan" },
      { key: "btn_savana", id: "savana", label: "Savana" },
      { key: "btn_rawa", id: "rawa", label: "Rawa" },
      { key: "btn_danau", id: "danau", label: "Danau" },
      { key: "btn_laut", id: "laut", label: "Laut" },
      { key: "btn_kutub", id: "kutub", label: "Kutub" },
      { key: "btn_gurun", id: "gurun", label: "Gurun" },
      { key: "btn_sungai", id: "sungai", label: "Sungai" },
      { key: "btn_gunung", id: "gunung", label: "Gunung" },
    ];

    const cols = 3;
    const gridW = w * 0.72;
    const startX = w * 0.5 - gridW / 2 + gridW / (cols * 2);
    const gapX = gridW / cols;
    const startY = h * 0.38;
    const gapGridY = h * 0.175;
    const habScale = 0.78 * ui;

    habitats.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * gapX;
      const y = startY + row * gapGridY;

      const btn = this.add.image(x, y, item.key)
        .setScale(0).setAlpha(0).setDepth(2);

      this.tweens.add({
        targets: btn,
        scale: habScale,
        alpha: 1,
        duration: 380,
        delay: 350 + i * 65,
        ease: "Back.out(1.7)",
        onComplete: () => {
          this.makeBouncyButton(btn, habScale, () => {
            this.playClick();
            if (item.id === "kutub") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("KutubScene");
              });
            } else if (item.id === "laut") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("LautScene");
              });
            } else if (item.id === "sungai") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("SungaiScene");
              });
            } else if (item.id === "hutan") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("HutanScene");
              });
            } else if (item.id === "gurun") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("GurunScene");
              });
            } else if (item.id === "danau") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("DanauScene");
              });
            } else if (item.id === "gunung") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("GunungScene");
              });
            } else if (item.id === "rawa") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("RawaScene");
              });
            } else if (item.id === "savana") {
              this.cameras.main.fadeOut(350, 0, 0, 0);
              this.cameras.main.once("camerafadeoutcomplete", () => {
                this.scene.start("SavanaScene");
              });
            } else {
              console.log("Habitat belum tersedia:", item.id);
            }
          });
        },
      });
    });
  }
}

window.HabitatScene = HabitatScene;
