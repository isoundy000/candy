var CandyLayer = cc.Layer.extend({

    playScene: null,
    
    matrixLayer: null,

    matrix: [],

    moving: false,

    ctor: function (playScene) {
        this._super();

        this.playScene = playScene;

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
        this.addChild(clippingNode, 1);

        this.bindEvent();
    },

    initMatrix: function () {
        for(var i = 0; i < Constant.CANDY_MATRIX_SIZE; i++) {
            var col = [];

            for(var j = 0; j < Constant.CANDY_MATRIX_SIZE; j++) {
                var candy = CandySprite.createRandomCandy();
                candy.attr({
                    x: i * Constant.CANDY_SIZE + Constant.CANDY_SIZE / 2,
                    y: j * Constant.CANDY_SIZE + Constant.CANDY_SIZE / 2,
                    width: Constant.CANDY_SIZE,
                    height: Constant.CANDY_SIZE
                });
                this.matrixLayer.addChild(candy);

                col.push(candy);
            }

            this.matrix[i] = col;
        }
    },

    interact: function (pos) {
        if (this.moving)
            return;

        //获取被点击的糖果索引
        var mi = this.convertPosToMatrixIndex(pos);
        if (mi.row < 0 ||
            mi.row >= Constant.CANDY_MATRIX_SIZE ||
            mi.col < 0 ||
            mi.col >= Constant.CANDY_MATRIX_SIZE)
            return;

        //找出连续的糖果的索引
        var indexes = this.findContinuesCandies(mi.row, mi.col);
        if (indexes.length <= 1)
            return;

        this.moving = true;

        //消除连续的糖果
        this.wipe(indexes);

        //补充新糖果
        this.replenish();

        this.moving = false;

        //计算分数和剩余步数
        this.playScene.score += indexes.length * indexes.length;
        this.playScene.step  -= 1;
        if (this.playScene.score >= Constant.LEVELS[this.playScene.level - 1]['targetScore']) { //过关
            cc.sys.localStorage.setItem('level', this.playScene.level + 1);
            cc.sys.localStorage.setItem('score', 30 * this.playScene.step);
            this.showSuccess();
        }
        else if (this.playScene.step <= 0) { //闯关失败, 重来
            this.showFail();
        }
    },

    findContinuesCandies: function (row, col) {
        var indexes = [];

        var targetCandy = this.matrix[col][row];
        this.findSameCandy(targetCandy.type, row, col, indexes);

        return indexes;
    },

    findSameCandy: function (type, row, col, indexes) {
        if (row < 0 ||
            row >= Constant.CANDY_MATRIX_SIZE ||
            col < 0 ||
            col >= Constant.CANDY_MATRIX_SIZE)
            return;

        var exist = indexes.some(function (index) {
            return index.row == row && index.col == col;
        });

        if (!exist && this.matrix[col][row].type == type) {
            indexes.push({row: row, col: col});

            this.findSameCandy(type, row, col - 1, indexes);
            this.findSameCandy(type, row, col + 1, indexes);
            this.findSameCandy(type, row - 1, col, indexes);
            this.findSameCandy(type, row + 1, col, indexes);
        }
    },

    wipe: function (indexes) {
        indexes.forEach(function (index) {
            var candy = this.matrix[index.col][index.row];

            this.matrix[index.col][index.row] = null;
            this.matrixLayer.removeChild(candy);
        }.bind(this));
    },

    replenish: function () {
        for (var col = 0; col < Constant.CANDY_MATRIX_SIZE; col++) {
            var np = 0;  //空位置数量
            var row = 0; //当前行号

            while (row < this.matrix[col].length) {
                if (this.matrix[col][row] == null) { //如果当前位置为空, 则在该列上方生成新的糖果
                    var newCandy = CandySprite.createRandomCandy();
                    newCandy.attr({
                        x: col * Constant.CANDY_SIZE + Constant.CANDY_SIZE / 2,
                        y: this.matrix[col].length * Constant.CANDY_SIZE + Constant.CANDY_SIZE / 2,
                        width: Constant.CANDY_SIZE,
                        height: Constant.CANDY_SIZE
                    });

                    this.matrixLayer.addChild(newCandy); //把新生成的糖果添加到糖果矩阵图层
                    this.matrix[col].push(newCandy); //把新生成的糖果添加到糖果矩阵

                    np++;
                }
                else {
                    if(np > 0) { //如果空位置数大于0, 当前糖果要下落

                        //改变糖果矩阵
                        var candy = this.matrix[col][row];
                        this.matrix[col][row - np] = candy;
                        this.matrix[col][row] = null;

                        //播放下落动画
                        var candyAction = cc.moveTo(
                                Math.sqrt(2 * np * Constant.CANDY_SIZE / 300),
                                cc.p(candy.x, candy.y - np * Constant.CANDY_SIZE
                            )).easing(cc.easeIn(2));
                        candy.runAction(candyAction);
                    }
                }

                row++;
            }

            //删除矩阵外的数据
            this.matrix[col].splice(Constant.CANDY_MATRIX_SIZE, this.matrix[col].length - Constant.CANDY_MATRIX_SIZE);
        }
    },

    showSuccess: function () {
        var size = cc.director.getWinSize();

        var bg = new cc.LayerColor(cc.color(255, 255, 255), 500, 500);
        bg.attr({
            x: (size.width - bg.width) / 2,
            y: (size.height - bg.height) / 2
        });
        this.addChild(bg, 2);

        var successText = new cc.LabelTTF('恭喜, 已完成第' + this.playScene.level + '关, \n剩余步数30倍奖励!', 'arial', 50);
        successText.attr({
            x: bg.width / 2,
            y: bg.height / 2,
            color: cc.color(0, 0, 0)
        });

        bg.addChild(successText);
        this.unbindEvent();

        this.scheduleOnce(function () {
            cc.director.runScene(new cc.TransitionPageTurn(2, new PlayScene()));
        }.bind(this), 2);
    },

    showFail: function () {
        var size = cc.director.getWinSize();

        var bg = new cc.LayerColor(cc.color(255, 255, 255), 500, 500);
        bg.attr({
            x: (size.width - bg.width) / 2,
            y: (size.height - bg.height) / 2
        });
        this.addChild(bg, 2);

        var successText = new cc.LabelTTF('失败了, 重头来过吧', 'arial', 50);
        successText.attr({
            x: bg.width / 2,
            y: bg.height / 2,
            color: cc.color(0, 0, 0)
        });

        bg.addChild(successText);
        this.unbindEvent();

        this.scheduleOnce(function () {
            cc.director.runScene(new cc.TransitionPageTurn(2, new PlayScene()));
        }.bind(this), 2);
    },

    bindEvent: function () {
        if ('mouse' in cc.sys.capabilities) {
            this.mouseEventListner = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseDown: this.onMouseDown.bind(this)
            });
            cc.eventManager.addListener(this.mouseEventListner, this.matrixLayer);
        }
        else {
            this.touchEventListner = cc.EventListener.create({
                event: cc.EventListener.MOUSE,
                onMouseDown: this.onTouchBegan.bind(this)
            });
            cc.eventManager.addListener(this.touchEventListner, this.matrixLayer);
        }
    },

    unbindEvent: function () {
        if ('mouse' in cc.sys.capabilities) {
            cc.eventManager.removeListener(this.mouseEventListner)
        }
        else {
            cc.eventManager.removeListener(this.touchEventListner);
        }
    },

    onMouseDown: function (event) {
        var pos = event.getLocation();
        this.interact(pos);
    },

    onTouchBegan: function (touch) {
        var pos = touch.getLocation();
        this.interact(pos);
    },

    convertPosToMatrixIndex: function (pos) {
        pos = this.matrixLayer.convertToNodeSpace(pos);
        var col = parseInt(pos.x / Constant.CANDY_SIZE);
        var row = parseInt(pos.y / Constant.CANDY_SIZE);
        return {row: row, col: col};
    }
});