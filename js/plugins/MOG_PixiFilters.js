//=============================================================================
// MOG_PixiFilters.js
//=============================================================================

/*:
 * @plugindesc (v1.4) Ativa alguns filtros gráficos padrões do Rpg Maker MV.
 * @author Moghunter
 * 
 * @param Blur Loop
 * @desc Ativar Loop na animação de Blur.
 * @default false
 * 
 * @param Pixelate Loop
 * @desc Ativar Loop na animação de Pixelate.
 * @default false
 *
 * @help  
 * =============================================================================
 * +++ MOG - (Default) Pixi Filters (v1.4) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Permite ativar alguns filtros gráficos padrões do Rpg Maker MV 
 * durante o jogo.
 * =============================================================================
 * Para ativar os filtros basta usar o comando abaixo através do Plugin Command.
 *
 * filter_effect : TYPE
 *
 * TYPE = Efeitos de 0 a 8.
 * 0 - Blur Filter.
 * 1 - Pixelate Filter.
 * 2 - Invert Filter.
 * 3 - Gray Filter.
 * 4 - DotScreen Filter.
 * 5 - ColorStep Filter.
 * 6 - CrossHatch Filter.
 * 7 - RGBSplit Filter.
 * 8 - Twist Filter.
 *
 * =============================================================================
 * Para remover o filtro use o comando abaixo através do Plugin Command.
 *
 * filter_clear
 *
 * =============================================================================
 * FILTER ANIMATION
 * =============================================================================
 * Para ativar a animação do filtro use o comando abaixo.
 *
 * filter_animation : TYPE : POWER/DURATION
 *
 * TYPE = Efeitos de 0 a 6.
 * 0 - Blur Filter.
 * 1 - Pixelate Filter.
 * 3 - DotScreen Filter.
 * 4 - ColorStep Filter.
 * 5 - RGBSplit Filter.
 * 6 - Twist Filter. 
 *
 * =============================================================================
 * HISTÓRICO
 * =============================================================================
 * (1.4) - Correção do Bug de resetar os efeitos de outros plugins ao 
 *         usar a função Clear.
 * (1.3) - Corrigido o efeito do Tint Screen.  
 * (1.2) - Melhoria na velocidade das animações. 
 * (1.1) - Adição da animação dos filtros.
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_PixiFilters = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_PixiFilters');
    Moghunter.pixiFilter_BlurLoop = String(Moghunter.parameters['Blur Loop'] || "false");
	Moghunter.pixiFilter_PixelateLoop = String(Moghunter.parameters['Pixelate Loop'] || "false");
	
//=============================================================================
// ** Game_Interpreter
//=============================================================================	

//==============================
// * PluginCommand
//==============================
var _alias_mog_pixifilters_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_alias_mog_pixifilters_pluginCommand.call(this,command, args)
	if (command === "filter_effect")  { 
	    $gameSystem.clearPixiAnimation();
	    $gameSystem._pixiFilterData = [true, Number(args[1])];
    };	
	if (command === "filter_animation" && args[1])  {
		if (args[1] === 0) {
			var d = args[3] ? args[3] : 20;
		} else if (args[1] === 1) {
			var d = args[3] ? args[3] : 5;
		} else if (args[1] === 2) {
			var d = args[3] ? args[3] : 5;
		} else if (args[1] === 3) {
			var d = args[3] ? args[3] : 20;		
		} else if (args[1] === 4) {
			var d = args[3] ? args[3] : 5;					
		} else {
			var d = args[3] ? args[3] : 30;
		};
	    p = Math.min(Math.max((Math.abs(d)), 0.1),999);
	    $gameSystem._pixiFilterData = [false,-1];
	    $gameSystem._pixiFilterEffects = [true, Number(args[1]),0,0,0,1,0,p];
    };		
	if (command === "filter_clear")  {$gameSystem.clearPixiFData()};
	return true;
};

//=============================================================================
// ** Game System
//=============================================================================	

//==============================
// * Initialize
//==============================
var _mog_pixifilters_gsys_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	_mog_pixifilters_gsys_initialize.call(this);
	this.clearPixiFData();
	this._pixiFilterData[0] = false;
	this._pixiFilterEffects[0]  = false;
};

//==============================
// * clear PixiFData
//==============================
Game_System.prototype.clearPixiFData = function() {
	this._pixiFilterData = [true,-1];
	this._pixiFilterEffects = [true,-1,0,0,0,1,0,0];
};

//==============================
// * clear PixiAnimation
//==============================
Game_System.prototype.clearPixiAnimation = function() {
	this._pixiFilterEffects = [false,-1,0,0,0,1,0,0];
};

//=============================================================================
// ** Spriteset Base
//=============================================================================	

//==============================
// * Initialize
//==============================
var _mog_pixifilter_spritesetbase_initialize = Spriteset_Base.prototype.initialize;
Spriteset_Base.prototype.initialize = function() {
	_mog_pixifilter_spritesetbase_initialize.call(this);
	this.pixeFilterSetup();
};
	
//==============================
// * Initialize
//==============================
Spriteset_Base.prototype.pixeFilterSetup = function() {
	this._pixFilterInit = true;
    this._blurloop = String(Moghunter.pixiFilter_BlurLoop) === "true" ? true : false;
	this._pixelateloop = String(Moghunter.pixiFilter_PixelateLoop) === "true" ? true : false;
	if (this.pfData()[1] != -1) {this.refreshPixiFilterAnimation()};
    if ($gameSystem._pixiFilterData[1] != -1) {this.refreshPixiFilter()};
};

//==============================
// * Update
//==============================
var _mog_pixifilter_spritesetbase_update = Spriteset_Base.prototype.update;
Spriteset_Base.prototype.update = function() {
	_mog_pixifilter_spritesetbase_update.call(this);
	this.updatePixiFilters();
};

//==============================
// * Update Pixi Filters
//==============================
Spriteset_Base.prototype.updatePixiFilters = function() {
   if ($gameSystem._pixiFilterEffects[0]) {this.refreshPixiFilterAnimation()};
   if (this.pfData()[1] != -1 && this.pixiFilter() && this._pixFilterInit) {this.updateFilterAnimation()}
   if ($gameSystem._pixiFilterData[0]) {this.refreshPixiFilter()};
};

//==============================
// * PFData
//==============================
Spriteset_Base.prototype.pfData = function() {
   return $gameSystem._pixiFilterEffects;
};

//==============================
// * PixiFilter
//==============================
Spriteset_Base.prototype.pixiFilter = function() {
   return this._baseSprite.filters[0];
};

//==============================
// * PixiFilter Clear
//==============================
Spriteset_Base.prototype.pixiFilterClear = function() {
   this._baseSprite.filters = [this._toneFilter];
};

//==============================
// * Refresh Pixi Filters Ani
//==============================
Spriteset_Base.prototype.refreshPixiFilterAnimation = function() {
   $gameSystem._pixiFilterEffects[0] = false;
   this.pixiFilterClear();
   this.setPixiFilterAnimation();
};

//==============================
// * Set PixiFilter Ani
//==============================
Spriteset_Base.prototype.setPixiFilterAnimation = function() {
   if (this.pfData()[1] === 0) {
       var filter = new PIXI.BlurFilter();
	   this._baseSprite.filters = [filter,this._toneFilter];
	   this.pixiFilter().blurX = this.pfData()[4];
	   this.pixiFilter().blurY = 0;
	   this.pfData()[2] = this.pfData()[5];
   } else if (this.pfData()[1] === 1) {
       var filter = new PIXI.PixelateFilter();
	   this._baseSprite.filters = [filter,this._toneFilter];	   
	   this.pixiFilter().size.x = this.pfData()[4];
	   this.pixiFilter().size.y = this.pfData()[4];
   } else if (this.pfData()[1] === 2) {
	   var filter = new PIXI.DotScreenFilter();
	   this._baseSprite.filters = [filter,this._toneFilter];
   } else if (this.pfData()[1] === 3) {
	   var filter = new PIXI.ColorStepFilter();	   
	   this._baseSprite.filters = [filter,this._toneFilter];	
	   this.pixiFilter().step = this.pfData()[5];  	   
   } else if (this.pfData()[1] === 4) {
	   var filter = new PIXI.RGBSplitFilter();
	   this._baseSprite.filters = [filter,this._toneFilter];	 
   } else if (this.pfData()[1] === 5) {   			
	   var filter = new PIXI.TwistFilter();
	   this._baseSprite.filters = [filter,this._toneFilter];
	   this.pixiFilter().radius	 = 5;
	   this.pixiFilter().angle = this.pfData()[4];
   } else if (this.pfData()[1] === 6) {

   } else {
	  $gameSystem.clearPixiAnimation();
   };	
};

//==============================
// * Update Filter Animation
//==============================
Spriteset_Base.prototype.updateFilterAnimation = function() {  
   if (this.pfData()[1] === 0) {
	   this.updatePixiBlurEffect();
   } else if (this.pfData()[1] === 1) {
	   this.updatePixiPixelateEffect();
   } else if (this.pfData()[1] === 2) {
	   this.updatePixiDotEffect();		   
   } else if (this.pfData()[1] === 3) {
	   this.updateColorStepEffect(); 	   
   } else if (this.pfData()[1] === 4) {
       this.updateRGBSplitEffect();
   } else if (this.pfData()[1] === 5) {  
       this.updateTwistEffect(); 
   } else {this.pfData()[1] = -1;
   };	   
	 
};

//==============================
// * Update Twist Effect
//==============================
Spriteset_Base.prototype.updateTwistEffect = function() {
	if (this.pfData()[2] === 0) {
		this.pixiFilter().angle += 0.01;
		if (this.pixiFilter().angle >= 16) {
			this.pfData()[2] = 1;
		};
	} else {
		this.pixiFilter().angle -= 0.01;
		if (this.pixiFilter().angle <= 6.0) {
		   this.pfData()[2] = 0;
		};		
	};	
    if (this.pixiFilter().angle) {this.pfData()[4] = this.pixiFilter().angle};
};

//==============================
// * Update RGBSplitEffect
//==============================
Spriteset_Base.prototype.updateRGBSplitEffect = function() {
	this.pfData()[6] ++;
	if (this.pfData()[6] < this.pfData()[7]) {return};
	this.pfData()[6] = 0;  	
	this.pixiFilter().red.x = Math.randomInt(10);
	this.pixiFilter().green.y = -Math.randomInt(20);
	this.pixiFilter().blue.x = Math.randomInt(10);
};

//==============================
// * Update Color Step Effect
//==============================
Spriteset_Base.prototype.updateColorStepEffect = function() {
	this.pfData()[6] ++;
	if (this.pfData()[6] < this.pfData()[7]) {return};
	this.pfData()[6] = 0;
	this.pixiFilter().step = 1.0 + (Math.random() * 2.5);
	if (this.pixiFilter().step) {this.pfData()[5] = this.pixiFilter().step};
};

//==============================
// * Update Dot Effect
//==============================
Spriteset_Base.prototype.updatePixiDotEffect = function() {
	this.pfData()[6] ++;
	if (this.pfData()[6] < this.pfData()[7]) {return};
	this.pfData()[6] = 0;	
	this.pixiFilter().scale = 2.0 + (Math.random() * 0.5);
};

//==============================
// * Update Pixi Pixelate Effect
//==============================
Spriteset_Base.prototype.updatePixiPixelateEffect = function() {
	if (!this.pixiFilter().size) {return};
	if (this.pfData()[3] > 0) {this.pfData()[3] --;return};
	if (this.pfData()[2] === 0) {
		this.pixiFilter().size.x += 1;
		if (this.pixiFilter().size.x >= 30) {
			this.pixiFilter().size.x = 30;
			this.pfData()[2] = 1;
			this.pfData()[3] = this.pfData()[7]
		};
	} else {
		this.pixiFilter().size.x -= 1;
		if (this.pixiFilter().size.x <= 0) {
			if (this._pixelateloop) {
				this.pixiFilter().size.x = 0.01;
				this.pfData()[2] = 0;
			} else {
			  this.pixiFilterClear();
			  $gameSystem.clearPixiAnimation();
			  return;
			};
		};		
	};	
    if (this.pixiFilter().size.x) {this.pfData()[4] = this.pixiFilter().size.x;
	    this.pixiFilter().size.y = this.pixiFilter().size.x;
	};	
};

//==============================
// * Update Pixi Blur Effect
//==============================
Spriteset_Base.prototype.updatePixiBlurEffect = function() {
	if (this.pfData()[3] > 0) {this.pfData()[3] --;return};
	if (this.pfData()[2] === 0) {
		this.pixiFilter().blurX -= 6;
		if (this.pixiFilter().blurX <= 0) {
			if (this._blurloop) {
			   this.pixiFilter().blurX = 0;
			   this.pfData()[2] = 1;
			   this.pfData()[3] = this.pfData()[7];
			} else {
			   this.pixiFilterClear();
			   $gameSystem.clearPixiAnimation();
			   return;
			};			   
		};
	} else {
		this.pixiFilter().blurX += 6;
		if (this.pixiFilter().blurX >= 180) {
			this.pixiFilter().blurX = 180;
			this.pfData()[2] = 0;
			this.pfData()[3] = this.pfData()[7];
		};		
	};	
    if (this.pixiFilter().blurX) {this.pfData()[4] = this.pixiFilter().blurX};
	this.pfData()[5] = this.pfData()[2];
	this.pixiFilter().blurY = 0
};

//==============================
// * Refresh Pixi Filters
//==============================
Spriteset_Base.prototype.refreshPixiFilter = function() {
   $gameSystem._pixiFilterData[0] = false;
   this.pixiFilterClear();
   var filter = this.setPixiFilter();
   if (filter) {this._baseSprite.filters = [filter,this._toneFilter]
      if ($gameSystem._pixiFilterData[1] === 8) {
          this.pixiFilter().radius = 3;
	      this.pixiFilter().angle = 6.5;
      };
   };
};

//==============================
// * setPixiFilter
//==============================
Spriteset_Base.prototype.setPixiFilter = function() {
   if ($gameSystem._pixiFilterData[1] === 0) {
       return new PIXI.BlurFilter();
   } else if ($gameSystem._pixiFilterData[1] === 1) {
	   return new PIXI.PixelateFilter();
   } else if ($gameSystem._pixiFilterData[1] === 2) {
	   return new PIXI.InvertFilter();
   } else if ($gameSystem._pixiFilterData[1] === 3) {
	   return new PIXI.GrayFilter();
   } else if ($gameSystem._pixiFilterData[1] === 4) {
	   return new PIXI.DotScreenFilter();	
   } else if ($gameSystem._pixiFilterData[1] === 5) {   			
       var filter = new PIXI.ColorStepFilter();
	   filter.step = 2; return filter;
   } else if ($gameSystem._pixiFilterData[1] === 6) {
	  return new PIXI.CrossHatchFilter();
   } else if ($gameSystem._pixiFilterData[1] === 7) {		
	  return new PIXI.RGBSplitFilter();
   } else if ($gameSystem._pixiFilterData[1] === 8) {		
	  return new PIXI.TwistFilter();
   } else if ($gameSystem._pixiFilterData[1] === 9) {
	   var bitmap = ImageManager.loadSystem("Test")
	  return new PIXI.DisplacementFilter(bitmap);	  
   } else {$gameSystem._pixiFilterData[1] = -1;
	  return false;
   };
};