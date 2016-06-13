var PlayScene = cc.Scene.extend({
    level: 1,
    
    score: 0,
    
    step: 10,
    
    ctor:function () {
        this._super();

        //加载当前关卡以及当前基础分数
        this.level = parseInt(cc.sys.localStorage.getItem('level')) || 1;
        this.score = parseInt(cc.sys.localStorage.getItem('score')) || 0;
        this.step  = Constant.LEVELS[this.level - 1]['limitStep'];

        //添加背景
        var bgLayer = new BackgroundLayer();
        this.addChild(bgLayer, 1);
        bgLayer.bake();

        //添加数据层
        var dataLayer = new DataLayer(this);
        this.addChild(dataLayer, 2);

        //添加游戏层
        var candyLayer = new CandyLayer(this);
        this.addChild(candyLayer, 3);
    }
});