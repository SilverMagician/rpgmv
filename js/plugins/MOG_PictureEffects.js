//=============================================================================
// MOG_PictureEffects.js
//=============================================================================

/*:
 * @plugindesc (v1.1) Adiciona novas funções no sistema de mostrar imagens.
 * @author Moghunter
 * 
 * @help  
 * =============================================================================
 * +++ MOG - Picture Effects (v1.1) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Adiciona novas funções no sistema de mostrar imagens.
 * =============================================================================
 * UTILIZAÇÃO.
 * =============================================================================
 * Utilize os comandos através do Plugin Command.
 *
 * =============================================================================
 * * POSITIONS * 
 * =============================================================================
 * --- > Posição da imagem no player. < ----
 *
 * picture_player_position : PICTURE_ID
 *
 * --- > Posição da imagem no evento. < ----
 *
 * picture_event_position : PICTURE_ID : EVENT_ID
 *
 * --- > Posição fixa no mapa. < ----
 *
 * picture_map_position : PICTURE_ID
 * 
 *
 * (NOTA - A função MOVE não funciona nos efeitos de Posição.)
 *
 * =============================================================================
 * * EFFECTS * 
 * ============================================================================= 
 * ---> Efeito Respirar < -----
 * 
 * picture_breath_effect : PICTURE ID : true
 *
 * ---> Efeito Flutuar < -----
 * 
 * picture_float_effect : PICTURE ID : true
 *
 * ---> Efeito Tremer < -----
 * 
 * picture_shake_effect : PICTURE ID : true : Power
 *
 * =============================================================================
 * * ANIMATED * 
 * ============================================================================= 
 * 
 * picture_animated : PICTURE_ID : NUMBER_OF_FRAMES : ANIMATION_SPEED
 *
 * (NOTA - A largura da imagem é dividida pelo numero de frames.)
 *
 *
 * =============================================================================
 * * HISTÓRICO * 
 * =============================================================================  
 * (1.1) - Melhoria no efeito tremer.
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_PictureEffects = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_PictureEffects');

//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _alias_mog_picefc_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_alias_mog_picefc_pluginCommand.call(this,command, args)
	
	if (command === "picture_player_position")  { 
	    if ($gameScreen.picture(args[1]) ) {
	        $gameScreen.picture(Number(args[1]))._positionData[0] = 1;
		};
	};
	
	if (command === "picture_event_position")  { 
	    if ($gameScreen.picture(args[1]) && args[3]) {	       
	  	$gameMap.events().forEach(function(event) {
		if (!event._erased && event.eventId() === Number(args[3])) {
	    	$gameScreen.picture(Number(args[1]))._positionData[0] = 2;
            $gameScreen.picture(Number(args[1]))._positionData[4] = args[3];
			$gameScreen.picture(Number(args[1]))._positionData[5] = $gameMap._mapId
		};
        }, this); 
		};
	};
	if (command === "picture_animated")  {
		if ($gameScreen.picture(args[1]) && args[3]) {
		   var frm = Math.min(Math.max(Number(args[3]),1),999);	
		   var speed = args[5] ? args[5] : 20;
     	   $gameScreen.picture(Number(args[1]))._animeData = [true,frm,9999,0,speed];
		};
	};	
	if (command === "picture_map_position")  { 
	    if ($gameScreen.picture(args[1])) {
	        $gameScreen.picture(Number(args[1]))._positionData[0] = 3;
		};
	};	
	if (command === "picture_shake_effect")  {
		if ($gameScreen.picture(args[1]) && args[3]) {
			if (String(args[3]) === "true") {
			   var pw = args[5] ? args[5] : 10;
	     	   $gameScreen.picture(Number(args[1]))._shake = [true,20,0,0,pw];
			} else {
		       $gameScreen.picture(Number(args[1]))._shake = [false,2,0,0,0];
		    };
		};
	};
	if (command === "picture_breath_effect")  {
		if ($gameScreen.picture(args[1]) && args[3]) {
			if (String(args[3]) === "true") {
	     	   $gameScreen.picture(Number(args[1]))._breathEffect = [true,0,0,0,0];
			} else {
		       $gameScreen.picture(Number(args[1]))._breathEffect = [false,0,0,0,0];
		    };
		};
	};
	if (command === "picture_float_effect")  {
		if ($gameScreen.picture(args[1]) && args[3]) {
			if (String(args[3]) === "true") {
	     	   $gameScreen.picture(Number(args[1]))._floatEffect = [true,0,0,0,0];
			} else {
		       $gameScreen.picture(Number(args[1]))._floatEffect = [false,0,0,0,0];
		    };
		};
	};		
	return true;
};

//=============================================================================
// ** Game Character Base 
//=============================================================================

//==============================
// * Screen RealX
//==============================
Game_CharacterBase.prototype.screen_realX = function() {
    return this.scrolledX() * $gameMap.tileWidth()
};

//==============================
// * Screen RealY
//==============================
Game_CharacterBase.prototype.screen_realY = function() {
    return this.scrolledY() * $gameMap.tileHeight()
};

//==============================
// * Pict FX
//==============================
Game_Map.prototype.pictFX = function() {
	return this._displayX * this.tileWidth();
};

//==============================
// * Pict FY
//==============================
Game_Map.prototype.pictFY = function() {
	return this._displayY * this.tileHeight();
};

//=============================================================================
// ** Game Picture
//=============================================================================	

//==============================
// * initBasic
//==============================
var _mog_pect_gpicture_initBasic = Game_Picture.prototype.initBasic;
Game_Picture.prototype.initBasic = function() {
	_mog_pect_gpicture_initBasic.call(this);
	this.initPicEffectBasic();
};

//==============================
// * initPicEffectBasic
//==============================
Game_Picture.prototype.initPicEffectBasic = function() {
	this._position = [0,0];
	this._zoom = [100,100];	
	this._effectType = 0;
	this._shake = [false,0,0,0,0];
	this._breathEffect = [false,0,0,0];
	this._floatEffect = [false,0,0,0];
	this._positionData = [0,0,0,0,0,0,0];
	this._animeData = [false,0,0,0,0];
	this._filters = [];
};


//==============================
// * Pic X
//==============================
Game_Picture.prototype.picX = function() {
	return this._position[0] + this._positionData[1] + this._shake[2];
};

//==============================
// * Pic Y
//==============================
Game_Picture.prototype.picY = function() {
	return this._position[1] + this._positionData[2] + this._shake[3] + this._floatEffect[3];
};

//==============================
// * Zoom X
//==============================
Game_Picture.prototype.zoomX = function() {
	return this._zoom[0] + this._breathEffect[2];
};

//==============================
// * Zoom Y
//==============================
Game_Picture.prototype.zoomY = function() {
	return this._zoom[1] + this._breathEffect[3];
};

//==============================
// * Opacity
//==============================
Game_Picture.prototype.opacity = function() {
	return this._opacity;
};

//==============================
// * Erase
//==============================
var _mog_pect_gpicture_erase = Game_Picture.prototype.erase;
Game_Picture.prototype.erase = function() {
	_mog_pect_gpicture_erase.call(this);
	this.initPicEffectBasic();
};

//==============================
// * Show
//==============================
var _mog_pect_gpicture_show = Game_Picture.prototype.show;
Game_Picture.prototype.show = function(name, origin, x, y, scaleX,scaleY, opacity, blendMode) {
	_mog_pect_gpicture_show.call(this,name, origin, x, y, scaleX,scaleY, opacity, blendMode)
	this.initPicEffectBasic();
	this._position[0] = x;
	this._position[1] = y;
	this._positionData[1] = x;
	this._positionData[2] = y;
	this._zoom[0] = scaleX;
	this._zoom[1] = scaleY;
	if (this._breathEffect[0]) {
	   this._breathEffect[3] = (Math.random() * 0.20).toFixed(2);
	};
	if (this._floatEffect[0]) {
		this._floatEffect[3] = -(Math.random() * 15).toFixed(2);
	};
};

//==============================
// * Move
//==============================
var _mog_pect_gpicture_move = Game_Picture.prototype.move;
Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,opacity, blendMode, duration) {
    _mog_pect_gpicture_move.call(this,origin, x, y, scaleX, scaleY,opacity, blendMode, duration)
	this._positionData[1] = x;
    this._positionData[2] = y;
};

//==============================
// * update Move
//==============================
Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {		
        var d = this._duration;
		if (this._positionData[0] === 0) {
			this._x = (this._x * (d - 1) + this._targetX) / d;
			this._y = (this._y * (d - 1) + this._targetY) / d;	
		};
        this._zoom[0] = (this._scaleX  * (d - 1) + this._targetScaleX)  / d;
        this._zoom[1] = (this._scaleY  * (d - 1) + this._targetScaleY)  / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;		
        this._duration--;
		this.updatePictureEffects();
    };
};

//==============================
// * Game Picture
//==============================
var _mog_pect_gpicture_update = Game_Picture.prototype.update;
Game_Picture.prototype.update = function() {
	_mog_pect_gpicture_update.call(this);
	this.updatePictureEffects();
};

//==============================
// * Update Picture Effects
//==============================
Game_Picture.prototype.updatePictureEffects = function() {
	if (this._shake[1] > 0) {this.updateShake()};
	if (this._breathEffect[0]) {this.updateBreathEffect()};
	if (this._floatEffect[0]) {this.updateFloatEffect()};
	if (this._positionData[0] > 0) {this.updatePicPosEfct()};
	this._scaleX = this.zoomX();
	this._scaleY = this.zoomY();
};

//==============================
// * Update Breath Effect
//==============================
Game_Picture.prototype.updateBreathEffect = function() {
	if (this._duration > 0) {return};
	if (this._breathEffect[1] === 0) {
		this._breathEffect[3] += 0.05;
		if (this._breathEffect[3] >= 2) {this._breathEffect[1] = 1};
	} else {
		this._breathEffect[3] -= 0.05;
		if (this._breathEffect[3] <= 0) {this._breathEffect[1] = 0};
	};	
};

//==============================
// * Update Float Effect
//==============================
Game_Picture.prototype.updateFloatEffect = function() {
	if (this._duration > 0) {return};
	if (this._floatEffect[1] === 0) {
		this._floatEffect[3] -= 0.2;
		if (this._floatEffect[3] <= -15) {this._floatEffect[1] = 1};
	} else {
		this._floatEffect[3] += 0.2;
		if (this._floatEffect[3] >= 0) {this._floatEffect[1] = 0};
	};	
};

//==============================
// * Update Shake
//==============================
Game_Picture.prototype.updateShake = function() {
	this._shake[1] --
	this._shake[2] = Math.random() * this._shake[4];
	this._shake[3] = Math.random() * this._shake[4];
	if (this._shake[1] <= 0) {
		if (this._shake[0]) {this._shake[1] = 20
		} else {
		   this._shake[2] = 0;
		   this._shake[3] = 0;
		};
	};
};

//==============================
// * Update Picture Pos Effct
//==============================
Game_Picture.prototype.updatePicPosEfct = function() {
	 if (this._positionData[0] === 1) {
		 this._position[0] = $gamePlayer.screenX();
		 this._position[1] = $gamePlayer.screenY();
	 } else if (this._positionData[0] === 2) {
		 var event = $gameMap.events()[this._positionData[4] - 1]
		 if (event && !event._erased && this._positionData[5] === $gameMap._mapId) {
		    this._position[0] = event.screenX();
		    this._position[1] = event.screenY();
		 } else {
		    this._position[0] = $gamePlayer.screenX();
		    this._position[1] = $gamePlayer.screenY();			 
		 };
	 } else {	 
		 this._position[0] = -$gameMap.pictFX();
		 this._position[1] = -$gameMap.pictFY();
	 };
	this._x = this.picX();
	this._y = this.picY();	 
};

//=============================================================================
// ** Sprite Picture
//=============================================================================	

//==============================
// * Update Bitmap
//==============================
var _mog_picefc_sprpic_updateBitmap = Sprite_Picture.prototype.updateBitmap;
Sprite_Picture.prototype.updateBitmap = function() {
	_mog_picefc_sprpic_updateBitmap.call(this);
	if (this.picture() && this.picture()._animeData[0]) {this.updateFrames(this.picture())};	
};

//==============================
// * Update Frames
//==============================
Sprite_Picture.prototype.updateFrames = function(picture) {
	if (!this.bitmap.isReady()) {this.visible = false;return};
	this.visible = true
	if (!this._picFrames) {this.setPicFrames(picture)};
	picture._animeData[2] ++
	if (picture._animeData[2] < picture._animeData[4]) {return};
	picture._animeData[2]  = 0
	this.setFrame(picture._animeData[3] * this._picFrames[3],0,this._picFrames[3],this._picFrames[4])
	picture._animeData[3] ++
	if (picture._animeData[3] >= this._picFrames[0]) {picture._animeData[3] = 0}
};

//==============================
// * set PicFrames
//==============================
Sprite_Picture.prototype.setPicFrames = function(picture) {
	var w = this.bitmap.width / picture._animeData[1]
	var h = this.bitmap.height;
	this._picFrames = [picture._animeData[1],0,0,w,h];
	this.setFrame(picture._animeData[3] * this._picFrames[3],0,this._picFrames[3],this._picFrames[4]);
};

//==============================
// * Update Origin
//==============================
var _mog_picefc_sprpic_updateOther = Sprite_Picture.prototype.updateOther;
Sprite_Picture.prototype.updateOther = function() {
	_mog_picefc_sprpic_updateOther.call(this)
    this.updatePicEffect();
};

//==============================
// * Update Pic Effect
//==============================
Sprite_Picture.prototype.updatePicEffect = function() {
	if (this.picture()._breathEffect[0]) {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
		this.y += this.height / 2;
	};
	if (this.picture()._positionData[0] === 0) { 
	   this.x += this.picture()._shake[2];
	   this.y += this.picture()._shake[3]; 
	   if (this.picture()._floatEffect[0]) {this.y += this.picture()._floatEffect[3]};
	};
};