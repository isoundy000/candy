var BackgroundLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.director.getWinSize();

        var bgSprite = new cc.Sprite(res.Background_jpg);
        bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(bgSprite);
    }
});