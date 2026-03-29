const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 0 }, debug: false },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [MenuScene, HabitatScene, KutubScene, KutubGameScene, LautScene, LautGameScene, SungaiScene, SungaiGameScene, HutanScene, HutanGameScene, GurunScene, GurunGameScene, DanauScene, DanauGameScene, GunungScene, GunungGameScene, RawaScene, RawaGameScene, SavanaScene, SavanaGameScene],
};

new Phaser.Game(config);
