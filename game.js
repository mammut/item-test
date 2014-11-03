$(function(){
  var pos = {x: 100, y: 280};
  var poses;
  var images = {};
  var loader = new PxLoader();
  var helmets;
  var weapons;

  var Player = function(game, x, y){
    this.x = x || pos.x;
    this.y = y || pos.y;
    this.game = game;
    this.pose = "damage";
    this.playerType = "warrior";
    this.helmet = new Helmet(2, this);
    this.weapon = new Weapon(2, this);
  }

  Player.prototype.render = function() {
    var self = this;
    var x = self.x - poses[self.playerType][self.pose].base.x * images[self.playerType + '_'+self.pose].width;
    var y = self.y - poses[self.playerType][self.pose].base.y * images[self.playerType + '_'+self.pose].height;

    this.weapon.render(x + images[self.playerType + '_'+self.pose].width *poses[self.playerType][self.pose].hand.x, y + images[self.playerType + '_'+self.pose].height * poses[self.playerType][self.pose].hand.y, poses[self.playerType][self.pose].handRot);
    self.game.ctx.drawImage(images[self.playerType + '_'+self.pose], x, y);
    this.helmet.render(x + images[self.playerType + '_'+self.pose].width *poses[self.playerType][self.pose].head.x, y + images[self.playerType + '_'+self.pose].height * poses[self.playerType][self.pose].head.y, poses[self.playerType][self.pose].headRot);
  };

  var Helmet = function(id, player) {
    this.id = id || 0;
    this.player = player;
    this.x = helmets[this.id].center.x;
    this.y = helmets[this.id].center.y;
    this.img = images['helmets_'+this.id];
  };

  Helmet.prototype.render = function(headX, headY, rot) {
    var x =  -this.img.width  * this.x;
    var y =  -this.img.height * this.y;
    var ctx = this.player.game.ctx;

    ctx.save();
    ctx.translate(headX,headY);
    ctx.rotate(rot * Math.PI/180);
    ctx.drawImage(this.img, x, y);
    ctx.restore();
  }

  var Weapon = function(id, player) {
    this.id = id || 0;
    this.player = player;
    this.x = weapons[this.id].center.x;
    this.y = weapons[this.id].center.y;
    this.img = images['weapons_'+this.id];
  };

  Weapon.prototype.render = function(handX, handY, rot) {
    var x =  -this.img.width  * this.x;
    var y =  -this.img.height * this.y;
    var ctx = this.player.game.ctx;

    ctx.save();
    ctx.translate(handX,handY);
    ctx.rotate(rot * Math.PI/180);
    ctx.drawImage(this.img, x, y);
    ctx.restore();
  }

  var Game = function(canvasId) {
    this.ctx = document.getElementById("screen").getContext('2d');
    this.gameSize = { x: this.ctx.canvas.width, y: this.ctx.canvas.height };
    var self =  this;

    var p = new Player(this,170, 380);
    var p2 = new Player(this);
    var p3 = new Player(this, 80, 540);
    update();
    function update() {
      self.ctx.clearRect(0, 0, self.gameSize.x, self.gameSize.y);
      self.ctx.beginPath();
      self.ctx.moveTo(0, 380);
      self.ctx.lineTo(self.gameSize.x, 380);
      self.ctx.stroke();
      self.ctx.moveTo(170, 0);
      self.ctx.lineTo(170, self.gameSize.y);
      self.ctx.stroke();
      p2.render();
      p.render();
      p3.render();
    }

    $('#relax').on('click', function(){
      p.pose = "relax";
      update();
    });

    $('#damage').on('click', function(){
      p.pose = "damage";
      update();
    });

    $('#attack').on('click', function(){
      p.pose = "attack1";
      update();
      setTimeout(function(){
        p.pose = "attack2";
        update();
        setTimeout(function(){
          p.pose = "attack3";
          update();
          setTimeout(function(){
            p.pose = "relax";
            update();
          }, 300);
        }, 200);
      }, 200);
    });

    $('.espada').on('click', function(){
      $this = $(this);
      p.weapon = new Weapon($this.attr('id'), p);
      update();
    });
    $('.casco').on('click', function(){
      $this = $(this);
      console.log($this);
      p.helmet = new Helmet($this.attr('id'), p);
      update();
    });
    $('.tt').on('click', function(){
      $this = $(this);
      console.log($this);
      p.playerType = $this.attr('id');
      update();
    });
  };

  window.onload = function() {
    $.get('resources/poses/poses.json', function(data){
      poses = data;
      ["warrior", "archer"].forEach(function(playerType, i) {
        ["relax", "attack1", "attack2", "attack3", "damage"].forEach(function(pose, j) {
          images[playerType + '_' + pose] = loader.addImage('resources/poses/' + playerType + '/' + pose + '.png');
        });
      });
    });

    $.get('resources/items/helmets.json', function(data){
      helmets = data;
      _.each(data, function(i){
        images['helmets_'+i.id] = loader.addImage('resources/items/helmets/' + i.path);
      });
    });

    $.get('resources/items/weapons.json', function(data){
      weapons = data;
      _.each(data, function(i){
        images['weapons_'+i.id] = loader.addImage('resources/items/weapons/' + i.path);
      });
    }).done(function(){
      loader.start();
    });

    loader.addCompletionListener(function() {
        new Game();
        console.log(images);
    });
  };
});
