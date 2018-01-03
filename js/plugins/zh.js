/*:
 * RS_Window_KorNameEdit.js
 * @plugindesc This plugin allows you to type in korean in the Name Input Proccessing <RS_Window_KorNameEdit>
 *
 * @author biud436
 * @since 2015.10.19
 * @version 1.6.0 (2016.06.18)
 *
 * @param windowWidth
 * @desc Number
 * @default 580
 *
 * @param windowCenter
 * @desc Boolean
 * @default false
 *
 * @param editWindow_Opacity
 * @desc This value is opacity of a name edit window between 0 and 255.
 * @default 225
 *
 * @param askingText
 * @desc This is a text hint
 * @default Please enter the name
 *
 * @param outlineWidth
 * @desc
 * @default 1
 *
 * @param outlineColor
 * @desc
 * @default black
 *
 * @param fontColor
 * @desc
 * @default white
 *
 * @param standardFontSize
 * @desc
 * @default 28
 *
 * @param Chinese Fonts
 * @desc
 * @default SimHei, Heiti TC, sans-serif, Noto Sans
 *
 * @param Korean Fonts
 * @desc
 * @default Noto Sans, Dotum, AppleGothic, sans-serif
 *
 * @param Default Fonts
 * @desc
 * @default GameFont
 *
 * @param Default CharWidth
 * @desc This plugin calculates the text width using this text when the system language is English.
 * @default A
 *
 * @help
 * This plugin provides a keyboard that allows you to type in korean
 * or other native language in the Name Input Proccessing.
 *
 * This plugin provides following the pluginCommand below.
 *
 * KNE width number
 * KNE center true/false
 * KNE outlineWidth number
 * KNE outlineColor string
 * KNE fontColor string
 * KNE fontSize number
 * KNE opacity number
 * KNE askText string
 *
 * - Change Log
 * 2016.03.05 (v1.3.3) - Fixed the class structure.
 * 2016.03.22 (v1.4.0) - Fixed a bug that causes a serious problem.
 * 2016.04.05 (v1.5.0) - Fixed a bug that causes to delete the text automatically
 * when you can type Hangul text of length less than 2.
 * 2016.06.18 (v1.6.0) - Fixed the inheritance structure, and the parameter called 'askText'.
 * 2016.08.09 (v1.6.1) - Fixed shouldPreventDefault function of Input class.
 * 2016.12.20 (v1.6.2) : Added Default CharWidth parameter.
 * That is because this plugin has a bug that 'navigator.language' has always returned
 * 'en-US' due to a bug of crosswalk-10.39.235.16 xwalk library. So I added this
 * to solve the problem of returning the wrong character width.
 */
 /*:ko
  * RS_Window_KorNameEdit.js
  * @plugindesc ?? ?? ?? ?? ???????. <RS_Window_KorNameEdit>
  * @author ????(biud436)
  *
  * @since 2015.10.19
  * @version 1.6.0 (2016.06.18)
  *
  * @param windowWidth
  * @desc ???? ?????.
  * @default 580
  *
  * @param windowCenter
  * @desc true ?? false? ?????.
  * @default false
  *
  * @param editWindow_Opacity
  * @desc ?? ???? ??? ??? 0 ~ 255 ??? ?? ?? ?????.
  * @default 225
  *
  * @param askingText
  * @desc ??? ??
  * @default ??? ?????.
  *
  * @param outlineWidth
  * @desc ??? ??
  * @default 1
  *
  * @param outlineColor
  * @desc ??? ??
  * @default black
  *
  * @param fontColor
  * @desc ?? ??
  * @default white
  *
  * @param standardFontSize
  * @desc ?? ?? ??
  * @default 28
  *
  * @param Chinese Fonts
  * @desc ??? ??
  * @default SimHei, Heiti TC, sans-serif
  *
  * @param Korean Fonts
  * @desc ??? ??
  * @default Noto Sans, Dotum, AppleGothic, sans-serif
  *
  * @param Default Fonts
  * @desc ?? ??
  * @default GameFont
  *
  * @param Default CharWidth
  * @desc ??? ??? ??? ??, ?? ??? ???? ???? ?? ?????.
  * @default A
  *
  * @help
  *
  * ? ????? ??? ?? ???? ???? ?????.
  *
  * ??? ??? (Korean)
  * KNE ? ??
  * KNE ???? true/false
  * KNE ????? ??
  * KNE ????? ???
  * KNE ???? ???
  * KNE ???? ??
  * KNE ??? ??
  * KNE ??? ???
  *
  * - ?? (???)
  * http://www.google.com/get/noto/#/family/noto-sans-kore
  *
  * - Change Log
  * 2015.10.19 - ?? ???
  * 2015.12.10 - ?? ??(?? ?? ?? ??)
  * 2016.02.15 - ???? ???? ? ???? ??? ??
  * 2016.03.22 - ???? ????? ???? ?? ? ? ?? ???? ????? ??? ??????.
  * 2016.04.05 - ?? ?? ?, ? ?? ??? ? ???? ?? ??? ???????.
  * 2016.06.18 - ?? ?? ??, ???? ?? ? ??, ?? ?? ?? ??, ??? ??? ?? ?? ? ?? ?? ?? ??
  * 2016.12.20 (v1.6.2) : Default CharWidth ?? ???? ????? ??????.
  * ??????? crosswalk-10.39.235.16? ???? ???? ? ?? ??? ???? ?? ??? ????.
  * (??? ??? ?? 'en-US'? ???? ????? ?? ??? ?????)
  */

var Imported = Imported || {};
Imported.Window_KorNameEdit = true;

(function() {

  // private static class
  function RSMatch() {
      throw new Error('This is a static class');
  }

  // private class
  function TextBox() {
    this.initialize.apply(this, arguments);
  };

  //===========================================================================
  // Private Members
  //===========================================================================

  var parameters = $plugins.filter(function (i) {
    return i.description.contains('<RS_Window_KorNameEdit>');
  });

  parameters = (parameters.length > 0) && parameters[0].parameters;

  RSMatch.windowWidth = Number(parameters['windowWidth'] || 580);
  RSMatch.windowCenter = String(parameters['windowCenter'] || 'false');
  RSMatch.outlineWidth = Number(parameters['outlineWidth'] || 1);
  RSMatch.outlineColor = String(parameters['outlineColor'] || 'black');
  RSMatch.fontColor = String(parameters['fontColor'] || 'white');
  RSMatch.opacity = Number(parameters['editWindow_Opacity'] || 225);
  RSMatch.askText = String(parameters['askingText'] || 'Please enter the name');
  RSMatch.standardFontSize = Number(parameters['standardFontSize'] || 28);
  RSMatch.fonts = {
    'ChineseFonts': parameters['Chinese Fonts'] || 'SimHei, Heiti TC, sans-serif',
    'KoreanFonts': parameters['Korean Fonts'] || 'Dotum, AppleGothic, sans-serif',
    'DefaultFonts': parameters['Default Fonts'] || 'GameFont',
  };
  RSMatch.defaultCharWidth = parameters['Default CharWidth'] || 'A';

  var original_Input_shouldPreventDefault = Input._shouldPreventDefault;
  var dialog_Input_shouldPreventDefault = function(keyCode) {
      switch (keyCode) {
      case 33:    // pageup
      case 34:    // pagedown
      case 37:    // left arrow
      case 38:    // up arrow
      case 39:    // right arrow
      case 40:    // down arrow
          return true;
      }
      return false;
  };


  //===========================================================================
  // TextBox Class
  //===========================================================================

  TextBox.BACK_SPACE = 8;
  TextBox.ENTER = 13;
  TextBox.IS_NOT_CHAR = 32;
  TextBox.KEYS_ARRAY = 255;

  TextBox.prototype.initialize = function(_editWindow)  {
    this._editWindow = _editWindow;
    this.createTextBox();
    this.getFocus();
    this.startToConvertInput();
  };

  TextBox.prototype.createTextBox = function() {
    this._textBox = document.createElement('input');
    this._textBox.type = "text";
    this._textBox.id = "textBox";
    this._textBox.style.opacity = 0;
    this._textBox.style.zIndex = 1000;
    this._textBox.autofocus = false;
    this._textBox.width = 1;
    this._textBox.height = 1;
    this._textBox.multiple = false;
    this._textBox.style.imeMode = 'active';

    if($gameSystem.isJapanese()) {
      this._textBox.inputmode = 'katakana';
    }

    this._textBox.style.position = 'absolute';
    this._textBox.style.top = 0;
    this._textBox.style.left = 0;
    this._textBox.style.right = 0;
    this._textBox.style.bottom = 0;

    this._textBox.onkeydown = this.onKeyDown.bind(this);

    document.body.appendChild(this._textBox);
  };

  TextBox.prototype.startToConvertInput = function () {
    Input._shouldPreventDefault = dialog_Input_shouldPreventDefault;
  };

  TextBox.prototype.startToOriginalInput = function () {
    Input._shouldPreventDefault = original_Input_shouldPreventDefault;
  };


  TextBox.prototype.setEvent = function(func) {
    this._textBox.onchange = func;
  };

  TextBox.prototype.terminateTextBox = function() {
    document.body.removeChild(this._textBox);
    this.startToOriginalInput();
  };

  TextBox.prototype.onKeyDown = function(e) {
    var keyCode = e.which;
    this.getFocus();
    if (keyCode < TextBox.IS_NOT_CHAR) {
      if(keyCode === TextBox.BACK_SPACE) {
        this.backSpace();
      } else if(keyCode === TextBox.ENTER) {
        if(this.getTextLength() <= 0) {
          e.preventDefault();
          // console.error("?? ??? ???? ?????");
        }
      }
    } else if (keyCode < TextBox.KEYS_ARRAY) {
      //
    }
  }

  TextBox.prototype.getTextLength = function() {
    return this._textBox.value.length;
  };

  TextBox.prototype.getMaxLength = function() {
    return this._editWindow._maxLength;
  };

  TextBox.prototype.backSpace = function() {
    this._editWindow._name = this._editWindow._name.slice(0, this._textBox.value.length - 1);
    this._editWindow._index = this._textBox.value.length;
    this._textBox.value = this._editWindow._name;
    this._editWindow.refresh();
  };

  TextBox.prototype.refreshNameEdit = function()  {
    this._editWindow._name = this._textBox.value.toString();
    this._editWindow._index = this._textBox.value.length || 0;
    this._editWindow.refresh();
  };

  TextBox.prototype.update = function() {
    if(this.getTextLength() <= this._editWindow._maxLength) {
      this.refreshNameEdit();
    }
  };

  TextBox.prototype.getFocus = function() {
    this._textBox.focus();
  };

  TextBox.prototype.terminate =  function() {
    this.terminateTextBox();
  };

  //===========================================================================
  // Window_NameEdit Class
  //===========================================================================

  function Window_KorNameEdit() {
     this.initialize.apply(this, arguments);
  }

  Window_KorNameEdit.prototype = Object.create(Window_NameEdit.prototype);
  Window_KorNameEdit.prototype.constructor = Window_KorNameEdit;

  Window_KorNameEdit.prototype.initialize = function(actor, maxLength) {
    Window_NameEdit.prototype.initialize.call(this, actor, maxLength);
  };

  Window_KorNameEdit.prototype.standardFontFace = function() {
      if ($gameSystem.isChinese()) {
          return RSMatch.fonts.ChineseFonts;
      } else if ($gameSystem.isKorean()) {
          return RSMatch.fonts.KoreanFonts;
      } else {
          return RSMatch.fonts.DefaultFonts;
      }
  };

  Window_KorNameEdit.prototype.charWidth = function () {
    // TODO: This code has a bug that 'navigator.language' has always returned
    // 'en-US' due to a bug of crosswalk-10.39.235.16 xwalk library.
    var text = RSMatch.defaultCharWidth;
    if (navigator.language.match(/^zh/)) { // isChinese
        text = '\u4E00';
    } else if (navigator.language.match(/^ko/)) { // isKorean
        text = '\uAC00';
    } else if (navigator.language.match(/^ja/)) { // isJapanese
        text = '\u3042';
    }
    return this.textWidth(text);
  };

  Window_KorNameEdit.prototype.drawActorFace = function(actor, x, y, width, height) {
      this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
      this.changeTextColor(this.hpColor(actor));
      this.drawText(RSMatch.askText, this.left(), y + this.fittingHeight(1) / 2, this.width);
  };

  Window_KorNameEdit.prototype.itemRect = function(index) {
      return {
          x: this.left() + index * this.charWidth(),
          y: this.fittingHeight(1),
          width: this.charWidth(),
          height: this.lineHeight()
      };
  };

  Window_KorNameEdit.prototype.windowWidth = function () {
    return RSMatch.windowWidth;
  };

  Window_KorNameEdit.prototype.drawChar = function (index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.contents.outlineWidth = RSMatch.outlineWidth;
    this.contents.outlineColor = RSMatch.outlineColor;
    this.contents.fontColor = RSMatch.fontColor;
    this.drawText(this._name[index] || '', rect.x, rect.y)
  };

  Window_KorNameEdit.prototype.standardFontSize = function() {
      return RSMatch.standardFontSize;
  };

  //===========================================================================
  // Scene_Name Class
  //===========================================================================

  function Scene_KorName() {
      this.initialize.apply(this, arguments);
  }

  Scene_KorName.prototype = Object.create(Scene_Name.prototype);
  Scene_KorName.prototype.constructor = Scene_KorName;

  Scene_KorName.prototype.initialize = function() {
      Scene_Name.prototype.initialize.call(this);
  };

  Scene_KorName.prototype.update = function() {
    Scene_Name.prototype.update.call(this);
  }

  Scene_KorName.prototype.create = function () {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createTextBox();
    this._textBox.setEvent( this.onInputOk.bind(this) );
  };

  Scene_KorName.prototype.createEditWindow = function() {
      this._editWindow = new Window_KorNameEdit(this._actor, this._maxLength);
      this.addWindow(this._editWindow);
  };

  Scene_KorName.prototype.createTextBox =  function() {
    this._textBox = new TextBox(this._editWindow);
    if(RSMatch.windowCenter === "true") {
      this._editWindow.y = Graphics.boxHeight / 2 - this._editWindow.height / 2;
    }
    this._editWindow.opacity = RSMatch.opacity;
  }

  Scene_KorName.prototype.update = function() {
    this._textBox.getFocus();
    this._textBox.update();
    Scene_MenuBase.prototype.update.call(this);
  }

  Scene_KorName.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    this._textBox.terminate();
  }

  //===========================================================================
  // Game_Interpreter
  //===========================================================================

  // Name Input Processing
  Game_Interpreter.prototype.command303 = function() {
      if (!$gameParty.inBattle()) {
          if ($dataActors[this._params[0]]) {
              SceneManager.push(Scene_KorName);
              SceneManager.prepareNextScene(this._params[0], this._params[1]);
          }
      }
      return true;
  };

  //===========================================================================
  // Game_Interpreter
  //===========================================================================

  var alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      alias_Game_Interpreter_pluginCommand.call(this, command, args);
      if(command === "KNE") {
        switch(args[0]) {
          case 'width':
          case '?':
            RSMatch.windowWidth = Number(args[1] || 580);
            break;
          case 'center':
          case '????':
            RSMatch.windowCenter = String(args[1] || 'false');
            break;
          case 'outlineWidth':
          case '?????':
            RSMatch.windowWidth = Number(args[1] || 1);
            break;
          case 'outlineColor':
          case '?????':
            RSMatch.outlineColor = String(args[1] || 'black');
            break;
          case 'fontColor':
          case '????':
            RSMatch.fontColor = String(args[1] || 'white');
            break;
          case 'fontSize':
          case '????':
            RSMatch.standardFontSize = Number(args[1] || 28);
            break;
          case 'opacity':
          case '???':
            var _opacity = Number(args[1] || 1);
            RSMatch.opacity = _opacity.clamp(0, 255);
            break;
          case 'askText':
          case '???':
            RSMatch.askText = String(args.slice(1).join(""));
            break;
        }
      }
  };

})();