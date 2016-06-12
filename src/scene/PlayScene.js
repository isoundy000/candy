var PlayScene = cc.Scene.extend({
    ctor:function () {
        this._super();

        var size = cc.director.getWinSize();

        //添加背景
        var bgLayer = new BackgroundLayer();
        this.addChild(bgLayer, 1);
        bgLayer.bake();

        //添加数据层
        var dataLayer = new DataLayer(this);
        this.addChild(dataLayer, 2);

        //添加游戏层
        var candyLayer = new CandyLayer();
        this.addChild(candyLayer, 3);
    }
});