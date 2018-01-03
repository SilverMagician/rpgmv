//=============================================================================
// MOG_Scrollbar.js
//=============================================================================

/*:
 * @plugindesc (v1.4) Adiciona uma barra de rolamento nas janelas.
 * @author Moghunter
 *
 * @param Width
 * @desc Definição da largura da barra.
 * @default 6
 *
 * @param X-Axis
 * @desc Definição da posição X-Axis da barra.
 * @default 0
 *
 * @param Y-Axis
 * @desc Definição da posição Y-Axis da barra.
 * @default 0
 *
 * @param Border Width
 * @desc Definição do tamanho do contorno.
 * @default 1 
 *
 * @param Border Color
 * @desc Definição da cor do contorno.
 * @default darkgray
 *
 * @param Back Color
 * @desc Definição da cor do fundo.
 * @default white
 *
 * @param Button Color
 * @desc Definição da cor do botão.
 * @default gray
 *
 * @param Always Visible
 * @desc Deixar o medidor sempre visível.
 * @default true
 * 
 * @help  
 * =============================================================================
 * +++ MOG - Scroll Bar (v1.4) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Adiciona uma barra de rolamento nas janelas.
 *
 * =============================================================================
 * HISTÓRICO
 * =============================================================================
 * (v1.4) - Correção o erro de não criar o Scroll bar quando a janela é atualizada. 
 * (v1.3) - Correção do glitch na janela de escolhas.
 * (v1.2) - Melhoria na codificação. 
 * (v1.1) - Correção da posição da barra em janelas de multiplas colunas.
 * 
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_Scrollbar = true;
　　var Moghunter = Moghunter || {}; 

    Moghunter.parameters = PluginManager.parameters('MOG_Scrollbar');
	Moghunter.scrollBarWidth = Number(Moghunter.parameters['Width'] || 6);
    Moghunter.scrollBarX = Number(Moghunter.parameters['X-Axis'] || 0);
    Moghunter.scrollBarY = Number(Moghunter.parameters['Y-Axis'] || 0);
	Moghunter.scrollBarBorderWidth =  Number(Moghunter.parameters['Border Width'] || 1);
	Moghunter.scrollBarBorderColor = String(Moghunter.parameters['Border Color'] || 'darkgray');	
	Moghunter.scrollBarBackColor = String(Moghunter.parameters['Back Color'] || 'white');
	Moghunter.scrollBarButtonColor = String(Moghunter.parameters['Button Color'] || 'gray');
    Moghunter.scrollBarAlwaysVisible = String(Moghunter.parameters['Always Visible'] || 'false');

//=============================================================================
// ** Window Selectable
//=============================================================================	

//==============================
// * Update
//==============================
var _mog_scrollbar_wselc_update = Window_Selectable.prototype.update;
Window_Selectable.prototype.update = function() {
	_mog_scrollbar_wselc_update.call(this);
	this.updateScrollBarBase();
};

//==============================
// * Update ScrollBar Base
//==============================
Window_Selectable.prototype.updateScrollBarBase = function() {
    if (this.needCreateSCrollBar()) {this.createScrollBar()};
	if (this._scrollbar) {this.updateScrollBar()}
};

//==============================
// * Update ScrollBar
//==============================
Window_Selectable.prototype.updateScrollBar = function() {
	 this._scrollbar[0].opacity = this.contentsOpacity;
	 this._scrollbar[1].opacity = this._scrollbar[0].opacity;
	 this._scrollbar[2].opacity = this._scrollbar[0].opacity;
	 if (this._scrollbarIndex != this.index()) {
		 this._scrollbar[2].y = this.scrollBarPosY();
		 this._scrollbarIndex = this.index();
	 };
     this.updateScrollBarVisible();
	 if (this.needRefreshScrollBar()) {this.refreshScrollBar()};
};

//==============================
// * refresh Scroll Bar
//==============================
Window_Selectable.prototype.refreshScrollBar = function() {
     this._maxTopRowScrollBar = this.maxTopRow();
	 if (this._scrollbar) {
		 for (var i = 0; i < 3; i++) {
			this.removeChild(this._scrollbar[i]);	
		 };	 
	 };
	 this._scrollbar = null;
};

//==============================
// * need Refresh Scroll Bar
//==============================
Window_Selectable.prototype.needRefreshScrollBar = function() {
    if (this._maxTopRowScrollBar != this.maxTopRow()) {return true};
	return false;
};

//==============================
// * Update ScrollBar Visible
//==============================
Window_Selectable.prototype.updateScrollBarVisible = function() {
	 if (this._scrollbarVisible[2] != this.active) {
		 this._scrollbarVisible[1] = 2;
	     this._scrollbarVisible[2] = this.active;			 
	 };
	 if (this._scrollbarVisible[1] > 0) {this._scrollbarVisible[1]--;
	 } else {this._scrollbar[0].visible = this.scrollBarVisible();
	 };	 
	 this._scrollbar[1].visible = this._scrollbar[0].visible;
	 this._scrollbar[2].visible = this._scrollbar[0].visible;
};

//==============================
// * Update ScrollBar Visible
//==============================
Window_Selectable.prototype.scrollBarVisible = function() {
    if (!this._scrollbarVisible[0] && !this.active) {return false};
	if (!this.visible) {return false};
	return true;
};

//==============================
// * Update ScrollBar
//==============================
Window_Selectable.prototype.needCreateSCrollBar = function() {
	if (this.maxTopRow() === 0) {return false};
	if (this._scrollbar) {return false};
    return true;
};

//==============================
// * scroll Bar Width
//==============================
Window_Selectable.prototype.scrollBarWidth = function() {
	return Moghunter.scrollBarWidth;
};

//==============================
// * scroll Bar Height
//==============================
Window_Selectable.prototype.scrollBarHeight = function() {
	return Math.floor(this.height - this.padding * 2);
};

//==============================
// * scroll Bar Size
//==============================
Window_Selectable.prototype.scrollBarSize = function() {
	var size = (this.scrollBarHeight() - (this.padding * this.maxTopRow()));
	return Math.min(Math.max(size,this.padding),this.scrollBarHeight());
};

//==============================
// * scroll Bar X
//==============================
Window_Selectable.prototype.scrollBarX = function() {
	return this.width - (this.scrollBarWidth() + 8) + Moghunter.scrollBarX;
};

//==============================
// * scroll Bar Y
//==============================
Window_Selectable.prototype.scrollBarY = function() {
	return this.padding + Moghunter.scrollBarY;
};

//==============================
// * scroll Bar Pos Y
//==============================
Window_Selectable.prototype.scrollBarPosY = function() {
	var space_max = this._scrollbar[1].height - this.scrollBarSize() + this.padding;
 	var space = (space_max - this.padding) / this.maxTopRow();
	var s = Math.min(Math.max(space,0.001),space_max);
	var y = this.scrollBarY() + (s * Math.floor(this.topIndex() / this.maxCols()));
	return Math.min(Math.max(y,this.padding),space_max);
};

//==============================
// * create SCroll Bar
//==============================
Window_Selectable.prototype.createScrollBar = function() {
	this._scrollbarIndex = -99;
	this._scrollbarVisible = [String(Moghunter.scrollBarAlwaysVisible) === 'true' ? true : false,0,null];
	this._scrollbarBorder = Math.min(Math.max(Moghunter.scrollBarBorderWidth,0),this.scrollBarWidth());
    this._scrollbar = [];
	for (var i = 0; i < 3; i++) {
		if (i === 0) {
           this._scrollbar[0] = new Sprite(new Bitmap(this.scrollBarWidth() + (this._scrollbarBorder * 2) ,this.scrollBarHeight() + (this._scrollbarBorder * 2)));
           this._scrollbar[0].bitmap.fillAll(Moghunter.scrollBarBorderColor);
		   this._scrollbar[0].x = this.scrollBarX() - (this._scrollbarBorder);
		   this._scrollbar[0].y = this.scrollBarY() - (this._scrollbarBorder);		   
		} else if (i === 1) {
           this._scrollbar[1] = new Sprite(new Bitmap(this.scrollBarWidth(),this.scrollBarHeight()));
           this._scrollbar[1].bitmap.fillAll(Moghunter.scrollBarBackColor);		   
		} else {
		   this._scrollbar[2] = new Sprite(new Bitmap(this.scrollBarWidth(),this.scrollBarSize()));
	       this._scrollbar[2].bitmap.fillAll(Moghunter.scrollBarButtonColor);
		};
		if (i > 0) {
		   this._scrollbar[i].x = this.scrollBarX();
		   this._scrollbar[i].y = this.scrollBarY();
		};
		this.addChild(this._scrollbar[i]);	
		this._maxTopRowScrollBar = this.maxTopRow();
	};
};

//=============================================================================
// ** Window Choice List
//=============================================================================	

//==============================
// * Update ScrollBar
//==============================
Window_ChoiceList.prototype.needCreateSCrollBar = function() {
    return false;
};