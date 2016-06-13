var DataLayer = cc.Layer.extend({
    playScene: null,

    levelText: 1,

    scoreText: 1,

    stepText: 1,

    ctor: function (playScene) {
        this._super();

        this.playScene = playScene;

        this.init();

        this.scheduleUpdate();
    },

    init: function () {
        this._super();

        var size = cc.director.getWinSize();

        var levelLabel = new cc.LabelTTF('Level', 'Microsoft YaHei', 24);
        levelLabel.attr({
            x: 100,
            y: size.height - 30,
            color: cc.color(80, 80, 80)
        });
        this.addChild(levelLabel);

        var scoreLabel = new cc.LabelTTF('Score', 'Microsoft YaHei', 24);
        scoreLabel.attr({
            x: size.width / 2,
            y: size.height - 30,
            color: cc.color(80, 80, 80)
        });
        this.addChild(scoreLabel);

        var stepLabel = new cc.LabelTTF('Step', 'Microsoft YaHei', 24);
        stepLabel.attr({
            x: size.width - 100,
            y: size.height - 30,
            color: cc.color(80, 80, 80)
        });
        this.addChild(stepLabel);

        var levelText = new cc.LabelTTF(this.playScene.level, 'Microsoft YaHei', 24);
        levelText.attr({
            x: 100,
            y: size.height - 60,
            color: cc.color(0, 0, 0)
        });
        this.addChild(levelText);
        this.levelText = levelText;

        var scoreText = new cc.LabelTTF(this.playScene.score, 'Microsoft YaHei', 24);
        scoreText.attr({
            x: size.width / 2,
            y: size.height - 60,
            color: cc.color(0, 0, 0)
        });
        this.addChild(scoreText);
        this.scoreText = scoreText;

        var stepText = new cc.LabelTTF(this.playScene.step, 'Microsoft YaHei', 24);
        stepText.attr({
            x: size.width - 100,
            y: size.height - 60,
            color: cc.color(0, 0, 0)
        });
        this.addChild(stepText);
        this.stepText = stepText;
    },

    update: function (dt) {
        this.levelText.setString(this.playScene.level);
        this.scoreText.setString(this.playScene.score);
        this.stepText.setString(this.playScene.step);
    }
});