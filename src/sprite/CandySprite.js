var CandySprite = cc.Sprite.extend({
    type: 0,

    ctor: function(type) {
        this._super(res['Candy_' + (type + 1) + '_png']);

        this.type = type;
    }
});

CandySprite.createRandomCandy = function () {
    var type = parseInt(Math.random() * (Constant.CANDY_TYPE_COUNT - 1));
    return new CandySprite(type);
}
