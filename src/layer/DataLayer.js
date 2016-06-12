var DataLayer = cc.Layer.extend({
    playScene: null,

    levelLabel: null,

    scoreLabel: null,

    stepLabel: null,

    level: 1,

    score: 1,

    step: 1,

    ctor: function (playScene) {
        this._super();

        this.playScene = playScene;

        this.init();
    },

    init: function () {
        this._super();

        var size = cc.director.getWinSize();

        var levelLabel = new cc.LabelTTF('Level', 'Microsoft YaHei', 24);
        levelLabel.attr({
            x: 100,
            y: size.height - 30,
            color: new cc.Color(80, 80, 80)
        });
        this.addChild(levelLabel);

        var scoreLabel = new cc.LabelTTF('Score', 'Microsoft YaHei', 24);
        scoreLabel.attr({
            x: size.width / 2,
            y: size.height - 30,
            color: new cc.Color(80, 80, 80)
        });
        this.addChild(scoreLabel);

        var stepLabel = new cc.LabelTTF('Step', 'Microsoft YaHei', 24);
        stepLabel.attr({
            x: size.width - 100,
            y: size.height - 30,
            color: new cc.Color(80, 80, 80)
        });
        this.addChild(stepLabel);

        var level = new cc.LabelTTF(this.level, 'Microsoft YaHei', 24);
        level.attr({
            x: 100,
            y: size.height - 60,
            color: new cc.Color(0, 0, 0)
        });
        this.addChild(level);

        var score = new cc.LabelTTF(this.score, 'Microsoft YaHei', 24);
        score.attr({
            x: size.width / 2,
            y: size.height - 60,
            color: new cc.Color(0, 0, 0)
        });
        this.addChild(score);

        var step = new cc.LabelTTF(this.step, 'Microsoft YaHei', 24);
        step.attr({
            x: size.width - 100,
            y: size.height - 60,
            color: new cc.Color(0, 0, 0)
        });
        this.addChild(step);
    }
});