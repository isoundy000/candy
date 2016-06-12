var CandyLayer = cc.Layer.extend({
    matrixLayer: null,

    matrix: [],

    ctor: function () {
        this._super();

        this.init();
    },
    
    init: function () {
        this._super();
        
        var size = cc.director.getWinSize();

        var clippingNode = new cc.ClippingNode();

        var matrixLayer  = new cc.Layer();
        matrixLayer.attr({
            x: (size.width - Constant.CANDY_SIZE * Constant.CANDY_MATRIX_SIZE) / 2,
            y: (size.height - Constant.CANDY_SIZE *  Constant.CANDY_MATRIX_SIZE) / 2
        });
        this.matrixLayer = matrixLayer;
        this.initMatrix();
        clippingNode.addChild(this.matrixLayer);

        var stencil = new cc.DrawNode();
        stencil.drawRect(
            cc.p(matrixLayer.x, matrixLayer.y),
            cc.p(matrixLayer.x + Constant.CANDY_SIZE * Constant.CANDY_MATRIX_SIZE, matrixLayer.y + Constant.CANDY_SIZE * Constant.CANDY_MATRIX_SIZE),
            cc.color(0, 0, 0),
            1,
            cc.color(0, 0, 0)
        );

        clippingNode.setStencil(stencil);
        this.addChild(clippingNode);

        this.bindEvent();
    },

    initMatrix: function () {
        for(var i = 0; i < Constant.CANDY_MATRIX_SIZE; i++) {
            var col = [];

            for(var j = 0; j < Constant.CANDY_MATRIX_SIZE; j++) {
                var candy = CandySprite.createRandomCandy(j, i);
                candy.attr({
                    x: i * Constant.CANDY_SIZE + Constant.CANDY_SIZE / 2,
                    y: Constant.CANDY_SIZE * Constant.CANDY_MATRIX_SIZE - j * Constant.CANDY_SIZE - Constant.CANDY_SIZE / 2,
                    width: Constant.CANDY_SIZE,
                    height: Constant.CANDY_SIZE
                });
                this.matrixLayer.addChild(candy);
                col.push(candy);
            }

            this.matrix[i] = col;
        }
    },

    bindEvent: function () {
        
    }
});