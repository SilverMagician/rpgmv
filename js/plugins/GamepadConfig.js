//=============================================================================
// Yanfly Engine Plugins - Gamepad Config
// GamepadConfig.js
// Version: 1.00
//=============================================================================

var Imported = Imported || {};
Imported.GamepadConfig = true;

var Yanfly = Yanfly || {};
Yanfly.GamepadConfig = Yanfly.GamepadConfig || {};

//=============================================================================
 /*:
 * @plugindesc v1.00 允许玩家调整其游戏平板的按钮设置
 * @author Yanfly Engine Plugins
 *
 * @param Command Name
 * @desc 在主菜单显示的进入本插件窗口的选项名字。
 * @default Gamepad Config
 *
 * @param Button Name
 * @desc 按钮在设置界面的名字的显示格式。
 * @default Button %1
 *
 * @param OK Button
 * @desc 确认按钮的指令名字。
 * @default OK / Talk
 *
 * @param OK Help
 * @desc 确认按钮的帮助信息。
 * @default 用于向操作界面发送确认指令，也用于与游戏中的人物等互动、对话。
 *
 * @param Cancel Button
 * @desc 取消按钮的指令名字。
 * @default Cancel
 *
 * @param Cancel Help
 * @desc 取消按钮的帮助信息。
 * @default 用于在操作界面发送取消指令。
 *
 * @param Shift Button
 * @desc Shift按钮的指令名字。
 * @default Dash
 *
 * @param Shift Help
 * @desc Shift按钮的帮助信息。
 * @default 按住这个按钮来让角色在游戏中用奔跑的方式移动。
 *
 * @param Menu Button
 * @desc 菜单按钮的指令名字。
 * @default Menu
 *
 * @param Menu Help
 * @desc 菜单按钮的帮助信息。
 * @default 用于呼出主菜单。
 *
 * @param PageUp Button
 * @desc Page Up按钮的指令名字。
 * @default Page Up
 *
 * @param PageUp Help
 * @desc Page Up按钮的帮助信息
 * @default 用这个按钮来快速对菜单执行翻页操作。
 *
 * @param PageDown Button
 * @desc Page Down按钮的指令名字。
 * @default Page Down
 *
 * @param PageDown Help
 * @desc Page Down按钮的帮助信息
 * @default 用这个按钮来快速对菜单执行翻页操作。
 *
 * @param Reset Default
 * @desc 将按钮设置恢复为默认状态的按钮的名字。
 * @default Reset to Default
 *
 * @param Reset Help
 * @desc 将按钮设置恢复为默认状态的按钮的帮助信息。
 * @default 重置你的按键配置。
 *
 * @param Finish Config
 * @desc 完成设置的按钮的名字。
 * @default Finish Configuration
 *
 * @param Finish Help
 * @desc 完成设置的按钮的帮助信息。
 * @default 你已经完成了对你的游戏平板的按键配置了吗？
 *
 * @help 如果检测到玩家在使用游戏平板进行游戏，则在选项界面添加一个
 * "Gamepad Config"的选项。
 *
 * 玩家可以按照他们的习惯来定制自己的按键配置，并且这些按键配置会自动在游戏开始
 * 时被读取。
 * 注意，如果在Option界面或者Gamepad Config界面内没有检测到游戏平板设备，游戏会
 * 自动把玩家弹出设置界面，以防止玩家被锁在设置界面里。
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Yanfly.Parameters = PluginManager.parameters('GamepadConfig');
Yanfly.Param = Yanfly.Param || {};

Yanfly.Param.GamepadConfigName = String(Yanfly.Parameters['Command Name']);
Yanfly.Param.GamepadConfigButton = String(Yanfly.Parameters['Button Name']);
Yanfly.Param.GamepadConfigOkTx = String(Yanfly.Parameters['OK Button']);
Yanfly.Param.GamepadConfigOkHelp = String(Yanfly.Parameters['OK Help']);
Yanfly.Param.GamepadConfigCancelTx = String(Yanfly.Parameters['Cancel Button']);
Yanfly.Param.GamepadConfigCancelHelp = String(Yanfly.Parameters['Cancel Help']);
Yanfly.Param.GamepadConfigShiftTx = String(Yanfly.Parameters['Shift Button']);
Yanfly.Param.GamepadConfigShiftHelp = String(Yanfly.Parameters['Shift Help']);
Yanfly.Param.GamepadConfigMenuTx = String(Yanfly.Parameters['Menu Button']);
Yanfly.Param.GamepadConfigMenuHelp = String(Yanfly.Parameters['Menu Help']);
Yanfly.Param.GamepadConfigPgUpTx = String(Yanfly.Parameters['PageUp Button']);
Yanfly.Param.GamepadConfigPgUpHelp = String(Yanfly.Parameters['PageUp Help']);
Yanfly.Param.GamepadConfigPgDnTx = String(Yanfly.Parameters['PageDown Button']);
Yanfly.Param.GamepadConfigPgDnHelp = String(Yanfly.Parameters['PageDown Help']);
Yanfly.Param.GamepadConfigResetTx = String(Yanfly.Parameters['Reset Default']);
Yanfly.Param.GamepadConfigResetHelp = String(Yanfly.Parameters['Reset Help']);
Yanfly.Param.GamepadConfigFinishTx = String(Yanfly.Parameters['Finish Config']);
Yanfly.Param.GamepadConfigFinishHelp = String(Yanfly.Parameters['Finish Help']);

//=============================================================================
// Input
//=============================================================================

Input.getPressedGamepadButton = function() {
	if (Yanfly.Param.GamepadTimer > 0) {
		Yanfly.Param.GamepadTimer -= 1;
		return -1;
	}
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) {
					return this.gamepadButtonId(gamepad);
				}
			}
		}
  }
	return -1;
};

Input.gamepadButtonId = function(gamepad) {
  var buttons = gamepad.buttons;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].pressed) return i;
  }
	return -1;
};

Input.getGamepadButton = function(type) {
	for (var i = 0; i < 12; ++i) {
		if (Input.gamepadMapper[i] === type) return i;
	}
	return null;
};

Input.isControllerConnected = function() {
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) return true;
			}
		}
	}
	return false;
};

//=============================================================================
// ConfigManager
//=============================================================================

ConfigManager.gamepadInput = {
	0: 'ok',
	1: 'cancel',
	2: 'shift',
	3: 'menu',
	4: 'pageup',
	5: 'pagedown',
	12: 'up',
	13: 'down',
	14: 'left',
	15: 'right',
};

Yanfly.GamepadConfig.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
  var config = Yanfly.GamepadConfig.ConfigManager_makeData.call(this);
	config.gamepadInput = this.gamepadInput;
	return config;
};

Yanfly.GamepadConfig.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
  Yanfly.GamepadConfig.ConfigManager_applyData.call(this, config);
	this.gamepadInput = this.readGamepadConfig(config, 'gamepadInput');
	this.applyGamepadConfig();
};

ConfigManager.applyGamepadConfig = function() {
	Input.gamepadMapper = this.gamepadInput;
	Input.update();
	Input.clear();
};

ConfigManager.readGamepadConfig = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return value;
    } else {
        return {
					0: 'ok',
					1: 'cancel',
					2: 'shift',
					3: 'menu',
					4: 'pageup',
					5: 'pagedown',
					12: 'up',
					13: 'down',
					14: 'left',
					15: 'right',
				};
    }
};

//=============================================================================
// Window_MenuCommand
//=============================================================================

Yanfly.GamepadConfig.Window_Options_addGeneralOptions =
	Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
  Yanfly.GamepadConfig.Window_Options_addGeneralOptions.call(this);
	this.addGameConfigCommand();
};

Window_Options.prototype.addGameConfigCommand = function() {
	if (Input.isControllerConnected()) {
		this.addCommand(Yanfly.Param.GamepadConfigName, 'gamepadConfig', true);
		this._addedController = true;
	}
};

Yanfly.GamepadConfig.Window_Options_update =
	Window_Options.prototype.update;
Window_Options.prototype.update = function() {
	Yanfly.GamepadConfig.Window_Options_update.call(this);
	if (this._addedController && !Input.isControllerConnected()) {
		this.refresh();
		this.height = this.windowHeight();
		this.updatePlacement();
	}
};

Yanfly.GamepadConfig.Window_Options_drawItem =
	Window_Options.prototype.drawItem;
Window_Options.prototype.drawItem = function(index) {
    if (this.commandSymbol(index) === 'gamepadConfig') {
			var rect = this.itemRectForText(index);
			var text = this.commandName(index);
	    this.resetTextColor();
	    this.changePaintOpacity(this.isCommandEnabled(index));
	    this.drawText(text, rect.x, rect.y, rect.width, 'left');
		} else {
			Yanfly.GamepadConfig.Window_Options_drawItem.call(this, index);
		}
};

Yanfly.GamepadConfig.Window_Options_processOk =
	Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
  if (this.commandSymbol(this.index()) === 'gamepadConfig') {
		Window_Command.prototype.processOk.call(this);
	} else {
		Yanfly.GamepadConfig.Window_Options_processOk.call(this);
	}
};

//=============================================================================
// Window_GamepadConfig
//=============================================================================

function Window_GamepadConfig() {
    this.initialize.apply(this, arguments);
}

Window_GamepadConfig.prototype = Object.create(Window_Command.prototype);
Window_GamepadConfig.prototype.constructor = Window_GamepadConfig;

Window_GamepadConfig.prototype.initialize = function(helpWindow) {
	var wy = helpWindow.height;
	Window_Command.prototype.initialize.call(this, 0, wy);
  this.setHelpWindow(helpWindow);
	this.height = Graphics.boxHeight - wy;
	this.refresh();
	this.activate();
	this.select(0);
};

Window_GamepadConfig.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

Window_GamepadConfig.prototype.makeCommandList = function(index) {
	for (var i = 0; i < 6; ++i) {
		var text = this.getButtonTypeText(i);
		this.addCommand(text, 'button', true);
	}
	this.addCommand('', 'filler', true);
	this.addCommand(this.getButtonTypeText(7), 'reset', true);
	this.addCommand(this.getButtonTypeText(8), 'finish', true);
};

Window_GamepadConfig.prototype.drawItem = function(index) {
	if (index > 5) {
		Window_Command.prototype.drawItem.call(this, index);
	} else {
		var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
		var ww = rect.width / 2;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, ww, align);
		var text = this.getButtonConfig(index);
		this.drawText(text, rect.x + ww, rect.y, ww, align);
	}
};

Window_GamepadConfig.prototype.getButtonTypeText = function(index) {
	if (index === 0) return Yanfly.Param.GamepadConfigOkTx;
	if (index === 1) return Yanfly.Param.GamepadConfigCancelTx;
	if (index === 2) return Yanfly.Param.GamepadConfigShiftTx;
	if (index === 3) return Yanfly.Param.GamepadConfigMenuTx;
	if (index === 4) return Yanfly.Param.GamepadConfigPgUpTx;
	if (index === 5) return Yanfly.Param.GamepadConfigPgDnTx;
	if (index === 7) return Yanfly.Param.GamepadConfigResetTx;
	if (index === 8) return Yanfly.Param.GamepadConfigFinishTx;
	return '';
};

Window_GamepadConfig.prototype.getButtonConfig = function(index) {
	if (index > 5) return '';
	var key = this.getButtonKey(index);
	var button = Input.getGamepadButton(key);
  return Yanfly.Param.GamepadConfigButton.format(button);
};

Window_GamepadConfig.prototype.getButtonKey = function(index) {
	if (index === 0) return 'ok';
	if (index === 1) return 'cancel';
	if (index === 2) return 'shift';
	if (index === 3) return 'menu';
	if (index === 4) return 'pageup';
	if (index === 5) return 'pagedown';
};

Window_GamepadConfig.prototype.itemTextAlign = function() {
    return 'center';
};

Window_GamepadConfig.prototype.clearButtonConfig = function(index) {
    var rect = this.itemRectForText(index);
		rect.x += rect.width / 2;
		rect.width /= 2;
		this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

Window_GamepadConfig.prototype.updateHelp = function() {
    if (!this._helpWindow) return;
		switch (this.index()) {
		case 0:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigOkHelp);
			break;
		case 1:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigCancelHelp);
			break;
		case 2:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigShiftHelp);
			break;
		case 3:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigMenuHelp);
			break;
		case 4:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigPgUpHelp);
			break;
		case 5:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigPgDnHelp);
			break;
		case 7:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigResetHelp);
			break;
		case 8:
			this._helpWindow.setText(Yanfly.Param.GamepadConfigFinishHelp);
			break;
		default:
			this._helpWindow.clear();
			break;
		}
};

//=============================================================================
// Scene_Options
//=============================================================================

Yanfly.GamepadConfig.Scene_Options_createOptionsWindow =
	Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
  Yanfly.GamepadConfig.Scene_Options_createOptionsWindow.call(this);
	this._optionsWindow.setHandler('gamepadConfig',
		this.commandGamepadConfig.bind(this));
};

Scene_Options.prototype.commandGamepadConfig = function() {
	SceneManager.push(Scene_GamepadConfig);
};

//=============================================================================
// Scene_GamepadConfig
//=============================================================================

function Scene_GamepadConfig() {
  this.initialize.apply(this, arguments);
}

Scene_GamepadConfig.prototype = Object.create(Scene_MenuBase.prototype);
Scene_GamepadConfig.prototype.constructor = Scene_GamepadConfig;

Scene_GamepadConfig.prototype.initialize = function() {
  Scene_MenuBase.prototype.initialize.call(this);
};

Scene_GamepadConfig.prototype.create = function() {
  Scene_MenuBase.prototype.create.call(this);
  this.createHelpWindow();
	this.createGamepadConfigWindow();
};

Scene_GamepadConfig.prototype.terminate = function() {
  Scene_MenuBase.prototype.terminate.call(this);
  ConfigManager.save();
};

Scene_GamepadConfig.prototype.update = function() {
  Scene_MenuBase.prototype.update.call(this);
	this.updateAttachedController();
	this.updateButtonConfig();
	this.updateAfterConfig();
};

Scene_GamepadConfig.prototype.updateAttachedController = function() {
	if (Input.isControllerConnected()) return;
	this.popScene();
};

Scene_GamepadConfig.prototype.createGamepadConfigWindow = function() {
	this._configWindow = new Window_GamepadConfig(this._helpWindow);
	this._configWindow.setHandler('button', this.commandButton.bind(this));
	this._configWindow.setHandler('reset', this.commandReset.bind(this));
	this._configWindow.setHandler('finish', this.popScene.bind(this));
	this.addWindow(this._configWindow);
};

Scene_GamepadConfig.prototype.commandButton = function() {
	var index = this._configWindow.index();
	this._configWindow.clearButtonConfig(index);
	this._configEnabled = true;
	Yanfly.Param.GamepadTimer = 12;
};

Scene_GamepadConfig.prototype.commandReset = function() {
	ConfigManager.gamepadInput = {
		0: 'ok',
		1: 'cancel',
		2: 'shift',
		3: 'menu',
		4: 'pageup',
		5: 'pagedown',
		12: 'up',
		13: 'down',
		14: 'left',
		15: 'right',
	};
	ConfigManager.applyGamepadConfig();
	this.refreshWindows();
};

Scene_GamepadConfig.prototype.refreshWindows = function() {
	this._configWindow.refresh();
	this._configWindow.activate();
	ConfigManager.save();
};

Scene_GamepadConfig.prototype.updateButtonConfig = function() {
	if (!this._configEnabled) return;
	var buttonId = Input.getPressedGamepadButton();
	if (buttonId > 11) return;
	if (buttonId >= 0) this.applyButtonConfig(buttonId);
};

Scene_GamepadConfig.prototype.applyButtonConfig = function(buttonId) {
	this._configEnabled = false;
	var index = this._configWindow.index();
	var newConfig = this._configWindow.getButtonKey(index);
	var formerConfig = Input.gamepadMapper[buttonId];
	var formerButton = Input.getGamepadButton(newConfig);
	ConfigManager.gamepadInput[buttonId] = newConfig;
	ConfigManager.gamepadInput[formerButton] = formerConfig;
	ConfigManager.applyGamepadConfig();
	this._configTimer = 12;
};

Scene_GamepadConfig.prototype.updateAfterConfig = function() {
	if (!this._configTimer) return;
	if (--this._configTimer > 0) return;
	SoundManager.playEquip();
	this.refreshWindows();
};

//=============================================================================
// End of File
//=============================================================================
