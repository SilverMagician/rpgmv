//=============================================================================
// SilvItemLog.js
// Version: 1.08
// License: https://creativecommons.org/licenses/by/4.0/
//=============================================================================
/*:
 * @plugindesc v1.08 Item Log. Displays the last looted items.
   <SilverItemLog>
 * @author Silver
 *
 * @param -- General --
 *
 * @param Auto Gain Loot
 * @desc Automatically add the loot to the party's inventory? true/false
 * @default true
 *
 * @param Auto Log Items
 * @desc Automatically add items to the log window when added through the GainItem command? true/false
 * @default true
 *
 * @param -- Sound --
 *
 * @param Default Volume
 * @desc The default volume level for all ItemLog SFX. Use the value -1 to use the "live AudioManger.seVolume" instead.
 * @default -1
 *
 * @param Default Pitch
 * @desc The default pitch for all ItemLog SFX
 * @default 100
 *
 * @param Item SFX
 * @desc Automatically play this sound when picking up items, armors or weapons. Leave blank to disable.
 * @default Item1
 *
 * @param Gold SFX
 * @desc Automatically play this sound when picking up gold (currency). Leave blank to disable.
 * @default Coin
 *
 * @param -- Positioning & Size --
 *
 * @param Window X
 * @desc x-location of itemlog window. If window-alignment is set to Right, this will act as an offset value instead
 * @default -2
 *
 * @param Window Y
 * @desc y-location of itemlog window. If window-alignment is set to Top, this will act as an offset value instead
 * @default 2
 *
 * @param Window Horizontal Alignment
 * @desc Left/Right
 * @default Right
 *
 * @param Window Vertical Alignment
 * @desc Top/Bottom
 * @default Top
 *
 * @param Window Width
 * @desc width of the itemlog window
 * @default 400
 *
 * @param Window Height
 * @desc height of the itemlog window
 * @default 160
 *
 * @param -- Window Contents --
 *
 * @param Font Size
 * @desc Size of the font
 * @default 24
 *
 * @param Text Offset X
 * @desc Text offset X for the log entries
 * @default 10
 *
 * @param Text Offset Y
 * @desc Text offset Y for the log entries
 * @default 6
 *
 * @param Standard Padding
 * @desc Leave at default (it's basically an X and Y offset)
 * @default 0
 *
 * @param Positive Prefix Text
 * @desc Prefix text
 * @default 获得
 *
 * @param Negative Prefix Text
 * @desc Prefix text
 * @default 失去
 *
 * @param Icon Y-offset
 * @desc Extra Y-offset for the drawing of the icons to better align them with the sentences
 * @default 4
 *
 * @param Window Skin
 * @desc Name of the window skin to use for this window
 * @default Window_ItemLog
 *
 * @param Auto-clear Upon Full-fade
 * @desc Clear the items in the item-window if the window fully faded? true/false
 * @default false
 *
 * @param -- Miscellaneous --
 *
 * @param Fadeout Delay
 * @desc How long before the window starts fading out (in frames)
 * @default 240
 *
 * @param Fadeout Speed
 * @desc How fast the window fades out
 * @default 2
 *
 * @param Text Shading
 * @desc Displays previously looted items in darker text. Set to 0 to disable.
 * @default -0.15
 *
 * @param Gold IconIndex
 * @desc iconindex for the gold/currency icon
 * @default 163
 *
 * @help
 * Plugin Commands:
 * Note that all commands & parameters are NOT case sensitive.
 *
 * ItemLog <loot type> <loot database-index> <amount> <optional: skip (override: does not actually add the item to the inventory)>
 * example to loot 3 potions: ItemLog item 1 3
 * example to loot 5 swords:  ItemLog weapon 1 5
 * example to loot 6 axes:    ItemLog weapon 2 6
 * example to log (but does not add to inventory regardless of the "Auto Gain Loot" parameter) 6 axes:    ItemLog weapon 2 6 skip
 *
 * The exception is gold, examples:
 *                            ItemLog gold 123
 *                            ItemLog gold 999
 *
 *
 * Show the itemlog window w/o adding anything:
 * ItemLog show
 *
 * Clear the items in the itemlog window:
 * Itemlog ClearItems
 *
 * Enable/Disable automatic item-logging:
 * ItemLog EnableLogging
 * ItemLog DisableLogging
 *
 *--------------------------------------
 * Version History:
 *--------------------------------------
 * v1.08 (01 January 2016) [parameters changed]
 * - Code refactoring.
 * - Applied my new coding standards.
 * - Moved the Utilities inside the anonymous function.
 * - Added persistence through saving&loading.
 * - Itemlog contents are now stored between battles and between map transfers.
 * - 2 new parameters ("Default Volume" & "Default Pitch").
 *
 * v1.07a (16 December 2015)
 * - Added two new plugin commands to enable/disable auto-logging of items.
 * v1.07 (15 December 2015) [parameters changed]
 * - Rearranged and categorized parameters
 * - Added this plugin to the global variable Imported.
 * - Added a new plugin-command to clear the itemlog.
 * - Added an option to auto-clear the window upon full-fade.
 *
 * v1.06a (13 December 2015) [parameters changed]
 * - Now supports losing items/gold.
 * - Fixed a minor alignment issue when gaining < 10 items, armors or weapons.
 * - Minor refactoring of the 1.06 code.
 *
 * v1.05 (12 December 2015)
 * - Added a version history.
 * - Fixed a bug that used the wrong amount of gold/item/etc. when using a game-variable instead of a fixed amount.
 * - Added this plugin to Silv.Plugins.
 * - Changed license to https://creativecommons.org/licenses/by/4.0/
 *
 * v1.00 - v1.04 (November 2015)
 */
// Imported
var Imported = Imported || {};
Imported.SILV_ItemLog = 1.08;

// #Parameters
var Silv = Silv || {};
Silv.Parameters = $plugins.filter(function(p) { return p.description.contains('<SilverItemLog>'); })[0].parameters;
Silv.ItemLog = Silv.ItemLog || {};
Silv.ItemLog.Window = null;
Silv.ItemLog.AlreadyPlayedSFX = false;
// General
Silv.ItemLog.AutoLootGain = Silv.Parameters['Auto Gain Loot'].toLowerCase() === 'true';
Silv.ItemLog.AutoLogItems = Silv.Parameters['Auto Log Items'].toLowerCase() === 'true';
// Sound
Silv.ItemLog.PickupSFXItem = Silv.Parameters['Item SFX'];
Silv.ItemLog.PickupSFXGold = Silv.Parameters['Gold SFX'];
Silv.ItemLog.DefaultVolume = parseInt(Silv.Parameters['Default Volume']);
Silv.ItemLog.DefaultPitch = parseInt(Silv.Parameters['Default Pitch']);
// Positioning & Size
Silv.ItemLog.Window_X = parseInt(Silv.Parameters['Window X']);
Silv.ItemLog.Window_Y = parseInt(Silv.Parameters['Window Y']);
Silv.ItemLog.WindowWidth = parseInt(Silv.Parameters['Window Width']);
Silv.ItemLog.WindowHeight = parseInt(Silv.Parameters['Window Height']);
Silv.ItemLog.WindowHorizontalAlignment = Silv.Parameters['Window Horizontal Alignment'].toLowerCase();
Silv.ItemLog.WindowVerticalAlignment = Silv.Parameters['Window Vertical Alignment'].toLowerCase();
// Window Contents
Silv.ItemLog.FontSize = parseInt(Silv.Parameters['Font Size']);
Silv.ItemLog.EntryTextOffsetX = parseInt(Silv.Parameters['Text Offset X']);
Silv.ItemLog.EntryTextOffsetY = parseInt(Silv.Parameters['Text Offset Y']);
Silv.ItemLog.StandardPadding = parseInt(Silv.Parameters['Standard Padding']);

Silv.ItemLog.PositivePrefixText = Silv.Parameters['Positive Prefix Text'];
if (Silv.ItemLog.PositivePrefixText.slice(-1) != ' ') { Silv.ItemLog.PositivePrefixText += ' '; }
Silv.ItemLog.NegativePrefixText = Silv.Parameters['Negative Prefix Text'];
if (Silv.ItemLog.NegativePrefixText.slice(-1) != ' ') { Silv.ItemLog.NegativePrefixText += ' '; }

Silv.ItemLog.IconOffsetY = parseInt(Silv.Parameters['Icon Y-offset']);
Silv.ItemLog.WindowSkin = Silv.Parameters['Window Skin'];
Silv.ItemLog.AutoClearUponFullFade = Silv.Parameters['Auto-clear Upon Full-fade'].toLowerCase() === 'true';

// Miscellaneous
Silv.ItemLog.FadeoutDelay = parseInt(Silv.Parameters['Fadeout Delay']);
Silv.ItemLog.FadeoutSpeed = parseInt(Silv.Parameters['Fadeout Speed']);
Silv.ItemLog.TextShadingValue = parseFloat(Silv.Parameters['Text Shading']);
Silv.ItemLog.GoldIconIndex = parseInt(Silv.Parameters['Gold IconIndex']);

// Non Parameters
Silv.ItemLog.PrefixLength = Math.max(Silv.ItemLog.PositivePrefixText.length, Silv.ItemLog.NegativePrefixText.length);
Silv.ItemLog.StoredData = null;
Silv.ItemLog.TextLines = null;

// Alias
Silv.Alias = Silv.Alias || {};
if (!Silv.AddAlias)
{
	Silv.AddAlias = function(alias, original_method)
	{
		if (Silv.Alias[alias]) { throw new Error('Alias already exists: ' + alias); }
		Silv.Alias[alias] = original_method;
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Queue Limited Size
// - A Stack-object with limited size
// - Automatically removes the first element(s) if it exceeds it's maxSize
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Queue_LSize(maxSize)
{
	this._maxSize = maxSize;
    this.length = 0;
    this._storage = [];
}

Queue_LSize.prototype.itemByIdx = function(index)
{
	return this._storage[index];
};

Queue_LSize.prototype.queue = function(data)
{
    this._storage[this.length] = data;
	this.length++;
	while (this.length > this._maxSize) { this.onAutoRemoval(this.dequeue()); }
};

// For aliasing
Queue_LSize.prototype.onAutoRemoval = function(removed_item) {};

 // Remove and return first item in array
Queue_LSize.prototype.dequeue = function()
{
    if (this.length)
	{
        var deletedData = this._storage.shift();
        this.length--;
        return deletedData;
    }
};
// Remove and return last item in array
Queue_LSize.prototype.pop = function()
{
    if (this.length)
	{
        var deletedData = this._storage.pop();
        this.length--;
        return deletedData;
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function()
{
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function lpad(word, padStr, length)
{
    word = String(word);
    while (word.length < length) word = padStr + word;
    return word;
}

function rpad(word, padStr, length)
{
    word = String(word);
    while (word.length < length) word += padStr;
    return word;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Window
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Window_ItemLog() { this.initialize.apply(this, arguments); }
// Inherit from base window
Window_ItemLog.prototype = Object.create(Window_Base.prototype);
// Set Constructor
Window_ItemLog.prototype.constructor = Window_ItemLog;

Window_ItemLog.prototype.loadWindowskin = function() { this.windowskin = ImageManager.loadSystem(Silv.ItemLog.WindowSkin); };
Window_ItemLog.prototype.standardPadding = function() { return Silv.ItemLog.StandardPadding; };
Window_ItemLog.prototype.standardFontSize = function() { return Silv.ItemLog.FontSize; };

Window_ItemLog.AutoLogItems = Silv.ItemLog.AutoLogItems;

// #Initialization
Window_ItemLog.prototype.initialize = function(x, y, width, height)
{
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._helpWindow = null;
    this._handlers = {};
    this._touching = false;
    this.deactivate();
	this.maxStackLines = parseInt((height - Silv.ItemLog.EntryTextOffsetY * 2) / parseFloat(Silv.ItemLog.FontSize));

	if (!Silv.ItemLog.TextLines) { this.clearItems(); }
	this.fadeOutCnt = 0;
	this.isFadingOut = false;
	this.isFadedOut = false;

	this.update();
};

// Update
Window_ItemLog.prototype.update = function()
{
    Window_Base.prototype.update.call(this);

	Silv.ItemLog.AlreadyPlayedSFX = false;
	this.updateFadeOut();
    this.render();
};

// Update Fading Out
Window_ItemLog.prototype.updateFadeOut = function()
{
	if (this.isFadedOut) { return; }

	if (!this.isFadingOut)
	{
		this.fadeOutCnt++;
		if (this.fadeOutCnt > Silv.ItemLog.FadeoutDelay)
		{
			this.fadeOutCnt = 0;
			this.isFadingOut = true;
		}
	}
	else
	{
		this.fadeOut();
	}
};

Window_ItemLog.prototype.clearItems = function()
{
	Silv.ItemLog.TextLines = new Queue_LSize(this.maxStackLines);
};

Window_ItemLog.prototype.fadeOut = function()
{
	this.opacity = this.contentsOpacity -= Silv.ItemLog.FadeoutSpeed;
	if (this.opacity <= 0) { this.onFullyFadedOut(); }
};

Window_ItemLog.prototype.onFullyFadedOut = function()
{
	this.isFadedOut = true;
	if (Silv.ItemLog.AutoClearUponFullFade) { this.clearItems(); }
};

Window_ItemLog.prototype.resetFade = function()
{
	this.isFadingOut = false;
	this.fadeOutCnt = 0;
	this.opacity = this.contentsOpacity  = 255;
	this.isFadedOut = false;
};

Window_ItemLog.prototype.fadeOutInstantly = function()
{
	this.opacity = this.contentsOpacity = 0;
	this.onFullyFadedOut();
};

// #Draw
Window_ItemLog.prototype.render = function()
{
	if (!Silv.ItemLog.TextLines) { return; }
	this.contents.clear();
	this.resetTextColor();

	var textLinesCnt = Silv.ItemLog.TextLines.length;
	var text = null;
	for (var i = textLinesCnt - 1; i >= 0; i--)
	{
		var line = Silv.ItemLog.TextLines.itemByIdx(i);
		text = line.t1;
		this.drawText(text, Silv.ItemLog.EntryTextOffsetX, Silv.ItemLog.EntryTextOffsetY + i * Silv.ItemLog.FontSize, 256, 'left');
		var newOffsetX = Silv.ItemLog.EntryTextOffsetX + this.contents.measureTextWidth(line.t1);
		this.drawLootIcon(line.iconIndex, newOffsetX, Silv.ItemLog.EntryTextOffsetY + i * Silv.ItemLog.FontSize + Silv.ItemLog.IconOffsetY);
		newOffsetX += Silv.ItemLog.FontSize + 4;
		text = line.t2;
		this.drawText(text, newOffsetX, Silv.ItemLog.EntryTextOffsetY + i * Silv.ItemLog.FontSize, 256, 'left');

		this.contents.textColor = shadeColor(this.contents.textColor, Silv.ItemLog.TextShadingValue);
	}

	function shadeColor(color, percent)
	{
		var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}
};

Window_ItemLog.prototype.drawLootIcon = function(iconIndex, x, y)
{
    var bitmap = ImageManager.loadSystem('IconSet');
	var pw = Window_Base._iconWidth;
	var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y, Silv.ItemLog.FontSize, Silv.ItemLog.FontSize);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #Create the ItemLog window
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Silv.AddAlias('itemlog_Scene_Map_createDisplayObjects', Scene_Map.prototype.createDisplayObjects);
Scene_Map.prototype.createDisplayObjects = function()
{
	Silv.Alias.itemlog_Scene_Map_createDisplayObjects.apply(this, arguments);
	this.createItemLogWindow();
};

Scene_Map.prototype.createItemLogWindow = function()
{
	var x = 0;
	if (Silv.ItemLog.WindowHorizontalAlignment === 'right') { x = Graphics.width - Silv.ItemLog.WindowWidth; }
	var y = 0;
	if (Silv.ItemLog.WindowVerticalAlignment === 'bottom') { y = Graphics.height - Silv.ItemLog.WindowHeight; }

	if (Silv.ItemLog.Window !== null) { this.removeWindow(Silv.ItemLog.Window); }
	Silv.ItemLog.Window = new Window_ItemLog(x + Silv.ItemLog.Window_X, y + Silv.ItemLog.Window_Y, Silv.ItemLog.WindowWidth, Silv.ItemLog.WindowHeight);
	Silv.ItemLog.Window.fadeOutInstantly();
	// if (Silv.ItemLog.StoredData) { Silv.ItemLog.Window.Textlines = Silv.ItemLog.StoredData; }

	this.addChildAt(Silv.ItemLog.Window, 1);
};

// Omg why does RPG Maker not have this method by default...
Scene_Base.prototype.removeWindow = function(window)
{
	var index = this.children.indexOf(window);
	if (index > -1) { this.children.splice(index, 1); }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// #Saving & #Loading
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Silv.AddAlias('itemLog_DataManager_makeSaveContents', DataManager.makeSaveContents);
DataManager.makeSaveContents = function()
{
	var contents = Silv.Alias.itemLog_DataManager_makeSaveContents.apply(this, arguments);
	contents.itemLogData = Silv.ItemLog.TextLines;
	return contents;
};

Silv.AddAlias('itemLog_DataManager_extractSaveContents', DataManager.extractSaveContents);
DataManager.extractSaveContents = function(contents)
{
	Silv.Alias.itemLog_DataManager_extractSaveContents.apply(this, arguments);
	Silv = Silv || {};
	Silv.ItemLog = Silv.ItemLog || {};
	Silv.ItemLog.TextLines = contents.itemLogData;
};
//*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Automatically add items
//------------------------
//
// Explanation of the this._params:
//
// Gold
// [0] = 0: increase, 1: decrease
// [1] = 0: value, 1: $gameVariable was used to determine amount of gold
// [2] = it is a direct amount of gold but if [1] == 1, then this is the gameVariable number that contains the gold-amount instead.
//
//
// Items, Weapons & Armor
// [0] = armor id matching the $dataArmors index
// [1] = 0: increase, 1: decrease
// [2] = 0: value, 1: $gameVariable was used to determine amount of armors
// [3] = it is a direct amount of gold but if [2] == 1, then this is the gameVariable number that contains the gold-amount instead.
// [4] = include equipment? true/false
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Silv.ItemLog.getAmount = function(params) // does not apply to gold! Gold has different parameters.. Yay for RPG Maker...
{
	return ((params[2] === 0) ? params[3] : $gameVariables.value(params[3])) * (params[1] === 1 ? -1 : 1);
};

// Change Gold
Silv.AddAlias('itemLog_Game_Interpreter_command125', Game_Interpreter.prototype.command125);
Game_Interpreter.prototype.command125 = function()
{
	var amount = (this._params[1] === 0) ? this._params[2] : $gameVariables.value(this._params[2]);
	if (this._params[0] === 1) { amount *= -1; }

    var retVal = Silv.Alias.itemLog_Game_Interpreter_command125.apply(this, arguments);
	if (Window_ItemLog.AutoLogItems) { Silv.ItemLog.PluginCommand('ItemLog', ['gold', String(amount), 'skip']); }
    return retVal;
};

// Change Items
Silv.AddAlias('itemLog_Game_Interpreter_command126', Game_Interpreter.prototype.command126);
Game_Interpreter.prototype.command126 = function()
{
    var retVal = Silv.Alias.itemLog_Game_Interpreter_command126.apply(this, arguments);
	if (Window_ItemLog.AutoLogItems) { Silv.ItemLog.PluginCommand('ItemLog', ['item', this._params[0], Silv.ItemLog.getAmount(this._params), 'skip']); }
    return retVal;
};

// Change Weapons
Silv.AddAlias('itemLog_Game_Interpreter_command127', Game_Interpreter.prototype.command127);
Game_Interpreter.prototype.command127 = function()
{
    var retVal = Silv.Alias.itemLog_Game_Interpreter_command127.apply(this, arguments);
	if (Window_ItemLog.AutoLogItems) { Silv.ItemLog.PluginCommand('ItemLog', ['weapon', this._params[0], Silv.ItemLog.getAmount(this._params), 'skip']); }
    return retVal;
};

// Change Armors
Silv.AddAlias('itemLog_Game_Interpreter_command128', Game_Interpreter.prototype.command128);
Game_Interpreter.prototype.command128 = function()
{
    var retVal = Silv.Alias.itemLog_Game_Interpreter_command128.apply(this, arguments);
	if (Window_ItemLog.AutoLogItems) { Silv.ItemLog.PluginCommand('ItemLog', ['armor', this._params[0], Silv.ItemLog.getAmount(this._params), 'skip']); }
    return retVal;
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Plugin Command
// Note: The items are separated by spaces. The command is the first word and any following words are args. args is an array.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Silv.ItemLog.getPrefixText = function(amount)
{
	var prefixText = rpad((amount >= 0) ? Silv.ItemLog.PositivePrefixText : Silv.ItemLog.NegativePrefixText, ' ', Silv.ItemLog.PrefixLength);

	return prefixText;
};

Silv.AddAlias('itemLog_Game_Interpreter_pluginCommand', Game_Interpreter.prototype.pluginCommand);
Game_Interpreter.prototype.pluginCommand = function(command, args)
{
	Silv.Alias.itemLog_Game_Interpreter_pluginCommand.apply(this, arguments);
	if (command.toLowerCase() === 'itemlog') { Silv.ItemLog.PluginCommand(command, args); }
};

Silv.ItemLog.PluginCommand = function(cmd, args)
{
	switch(args[0].toLowerCase())
	{
		case 'show':
			Silv.ItemLog.Window.resetFade();
			return;
		case 'clearitems':
			Silv.ItemLog.Window.clearItems();
			return;
		case 'enablelogging':
			Window_ItemLog.AutoLogItems = true;
			return;
		case 'disablelogging':
			Window_ItemLog.AutoLogItems = false;
			return;
	}

	// arg: item 1 10
	// arg: weapon 2 1
	// arg: weapon 2 1 skip
	// arg: gold 123
	var db = getDatabase(args[0]);
	var lootIdx = parseInt(args[1]);
	var skipAddItemToInventory = (String(args[args.length - 1]).toLowerCase() === 'skip');
	if (db != 'gold')
	{
		var amount = parseInt(args[2]);
		var amountStr = String(args[2]);
		var name = db[lootIdx].name;
		var iconIndex = db[lootIdx].iconIndex;

		var t1 = Silv.ItemLog.getPrefixText(amount) + lpad(Math.abs(amountStr), ' ', 2) + 'x ';
		var t2 = name;

		Silv.ItemLog.TextLines.queue({t1: t1, iconIndex: iconIndex, t2: t2});

        // Add loot
		if (Silv.ItemLog.AutoLootGain && !skipAddItemToInventory)
		{
			$gameParty.gainItem(db[lootIdx], amount);
		}

		// sfx
		if (!Silv.ItemLog.AlreadyPlayedSFX)
		{
			Play_SE(Silv.ItemLog.PickupSFXItem);
			Silv.ItemLog.AlreadyPlayedSFX = true;
		}
	}
	else // Gold
	{
		var amount = parseInt(args[1]);
		Silv.ItemLog.TextLines.queue({t1: Silv.ItemLog.getPrefixText(amount) + '    ', iconIndex: Silv.ItemLog.GoldIconIndex, t2: Math.abs(amount) + ' ' + $dataSystem.currencyUnit});

		// Add loot
		if (Silv.ItemLog.AutoLootGain && !skipAddItemToInventory)
		{
			$gameParty.gainGold(amount);
		}

		// sfx
		if (!Silv.ItemLog.AlreadyPlayedSFX)
		{
			Play_SE(Silv.ItemLog.PickupSFXGold);
			Silv.ItemLog.AlreadyPlayedSFX = true;
		}
	}
	Silv.ItemLog.Window.resetFade(); // Reset the fadeout, if any.

	function getDatabase(code)
	{
		code = code.toLowerCase();
		if (code.contains('item') || code.contains('itm'))
			return $dataItems;
		if (code.contains('armor'))
			return $dataArmors;
		if (code.contains('weapon') || code.contains('wpn'))
			return $dataWeapons;
		if (code.contains('gold'))
			return 'gold';

		throw new Error('getDatabase('+ code + ') ERROR: invalid code.');
	}

	function Play_SE(filename)
	{
		var volume = (Silv.ItemLog.DefaultVolume > -1) ? Silv.ItemLog.DefaultVolume : AudioManager.seVolume;
		AudioManager.playSe({name: filename, volume: volume, pitch: Silv.ItemLog.DefaultPitch, pan: 0});
	}
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the end of this awesome script!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
