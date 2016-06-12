var CandySprite = cc.Sprite.extend({
    type: 0,

    row: 0,

    col: 0,

    ctor: function(type, row, col) {
        this._super(res['Candy_' + (type + 1) + '_png']);

        this._init(type, row, col);

    },

    _init: function (type, row, col) {
        this.type = type;
        this.row = row;
        this.col = col;
    }
});

CandySprite.createRandomCandy = function (row, col) {
    var type = parseInt(Math.random() * (Constant.CANDY_TYPE_COUNT - 1));
    return new CandySprite(type, row, col);
}
