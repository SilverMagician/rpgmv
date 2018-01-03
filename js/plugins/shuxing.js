//=============================================================================
// StatDistribution.js
//=============================================================================
 
/*:
@author Icaro10100 / FrozenPhoenix
@plugindesc Get stat points on level up, those points can be spent to increase stat value
 
 
@param PointsName
@desc The name given to stat points
@default Points
 
@param ActorName
@desc The word before the actor's name
@default Name
 
@param ClassName
@desc The word before the actor's class
@default Class
 
@param ExpName
@desc The word before the actor's experience
@default EXP
 
@param IncreaseName
@desc The word that means increase duhhh (if doing game on another language)
@default Increase
 
@param DecreaseName
@desc Same thing as before
@default Decrease
 
@param StatNameColor
@desc The color the stat's name appears, select a number from the windowskin
@default 1
 
@param StatValueColor
@desc The color the stat's value appears, select a number from the windowskin
@default 0
 
@param ShiftIncrease
@desc When holding shift, the amount increased will be multiplicated by this parameter
@default 5
 
@param LevelUpPoints
@desc Points gained on level up, can be any number or formula that returns a number
@default 10
 
@param UsedStats
@desc The basic stats that will be available to increase, put the id separated by a comma Example: 0,3,4,5
@default 0,1,2,3,4,5,6,7
 
@param UsedXStats
@desc Same as before, but for extra parameters (crit/evasion etc)
@default
 
@param ExtraParamNames
@desc Names for the extra stats (crit/evasion etc), just modify the strings in the default.
@default ["Hit rate", "Evasion", "Crit chance", "Crit Evasion", "Magic Evasion", "Magic Reflect", "Counter", "HP Regen", "MP Regen", "TP Regen"]
 
@param DefaultLimits
@desc Highest possible value for the parameter
Just change the values, in order: hp/mp/atk/def/mat/mdf/agi/luk
@default [99999, 9999, 999, 999, 999, 999, 999, 999]
 
@param DefaultxParamLimits
@desc Highest possible value for special parameters
Just change the values, in order: hit/eva/crit/criteva etc.
@default [1, 1, 1, 1, 1, 1, 1, 1, 1, 1] 
 
@param MaxPointsPerLevel
@desc How much points you can spend per level on a single parameter
use any formula that returns a number, leave 0 for no limits
@default 0
 
 
@help
 
*********************************************************************************
 
Actors will gain stat points whenever they level up or when you want to give 
them via script call: $gameActors.actor(id).gainStats(amount)
 
Those points can be used to increase the actor's stats via a custom scene.
To call the scene use the call: SceneManager.sceneDistribution(actor)
 
Example: SceneManager.sceneDistribution($gameParty.members()[0])
Learn the basic script calls
 
To call the scene for the entire party use SceneManager.partyDistribution()
Press Q/W to swap the party members. You can use SceneManager.partyDistribution(id)
to have the scene start with the actor in position "id" in the party, example:
SceneManager.partyDistribution(2) will start the scene with the third actor in the
party.
 
Holding shift while increasing the attributes will increase them faster.
 
Press "x" to toggle between decrease/increase option
 
Put the following tags to determine how much the param/stat will increase per
stat point spent:
 
<ihp: amount>
<imp: amount>
<iatk: amount>
<idef: amount>
<imat: amount>
<imdf: amount>
<iagi: amount>
<iluk: amount>
 
For extra parameters:
 
<ihit: amount>
<ieva: amount>
<icri: amount>
<icev: amount>
<imev: amount>
<imrf: amount>
<icnt: amount>
<ihrg: amount>
<imrg: amount>
<itrg: amount>
 
The tags should be put in the class notebox OR in the actor notebox
 
To have custom parameter limits for each actor/class put those tags in the notebox:
 
<hplimit: >
<mplimit: >
<atklimit: >
<deflimit: >
<matlimit: >
<mdflimit: >
<agilimit: >
<luklimit: >
 
 
 
Feel free to use for free/comercial games, just give credit.
Enjoy
 
ChangeLog:
 
--1.2
-Fixed bug of max hp value displaying 999 on screen even when the actual value was higher
-Added option to add custom limits for parameters, those can be different for each actor
-Added option to limit how much points you can spend on the same parameter each level
-Added party option, press Q/W to swap between party members
-Can now put tags in the actor's note box as well
 
--1.1
-Added names for some stuff
-Added option to decrease stat
-Added support for extra parameters (crit/evasion etc)
 
*********************************************************************************
 
*/
 
 
 
(function() {
 
//Parameters        
var parameters = PluginManager.parameters('StatDistribution');
var        pointsName = String(parameters["PointsName"]);
var        actorName = String(parameters["ActorName"]);
var        className = String(parameters["ClassName"]);
var        expName = String(parameters["ExpName"]);
var        increaseName = String(parameters["IncreaseName"]);
var        decreaseName = String(parameters["DecreaseName"]);
var statNameColor = Number(parameters["StatNameColor"]);
var statValueColor = Number(parameters["StatValueColor"]);
var shiftIncrease = Number(parameters["ShiftIncrease"]);
var        levelUpPoints = String(parameters["LevelUpPoints"]);
var usedStats = String(parameters["UsedStats"]);
var usedXStats = String(parameters["UsedXStats"]);
var xParamNames = String(parameters["ExtraParamNames"]);
var defaultLimits = String(parameters['DefaultLimits']);
var defaultxLimits = String(parameters['DefaultxParamLimits']);
var maxPointsPerLevel = String(parameters['MaxPointsPerLevel']);
 
getLimit = function(id) {
        limits = eval(defaultLimits);
        return limits[id];
}
 
getTag = function(id) {
        switch(id) {
                case 0:
                        return "hplimit";
                case 1:
                        return "mplimit";
                case 2:
                        return "atklimit";
                case 3:
                        return "deflimit";
                case 4:
                        return "matlimit";
                case 5:
                        return "mdflimit";
                case 6:
                        return "agilimit";
                case 7:
                        return "luklimit";                                        
        }
}
 
 
//This function will return an array with the ids of the used stats
getUsedStats = function() {
        var re = /\d+/g;
        return usedStats.match(re) || [];        
}
 
//This function will return an array with the ids of the used extra stats
getUsedXStats = function() {
        var re = /\d+/g;
        return usedXStats.match(re) || [];        
}
 
//This function will return the name of the extra param with given index
getXParamName = function(id) {
        var names = eval(xParamNames);
        return names[id];
}
 
//Game batlerbase
 
Game_BattlerBase.prototype.xparam = function(xparamId) {
        var value = this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId) + this._gainedxparams[xparamId];
    return value;
};
 
_GameBattlerBaseInitialize = Game_BattlerBase.prototype.initialize;
Game_BattlerBase.prototype.initialize = function() {
    _GameBattlerBaseInitialize.call(this);
        this._gainedxparams = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
};
 
 
Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId == 0) {
        return 999999;  // MHP
    } else if (paramId == 1) {
        return 9999;    // MMP
    } else {
        return 999;
    }
};
 
 
//---Game Actor
 
_GameActorInitialize = Game_Actor.prototype.initialize;
Game_Actor.prototype.initialize = function(actorId) {
    _GameActorInitialize.call(this, actorId);
        this._statPoints = 0;
        this.resetUsedPoints();
};
 
Game_Actor.prototype.resetUsedPoints = function() {
        this._usedPoints = [0, 0, 0, 0, 0, 0, 0, 0];
        this._usedxPoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}
 
Game_Actor.prototype.increasePointLimit = function() {
        for (i=0; i<this._usedxPoints.length; i++) {
                if (i<this._usedPoints.length) {
                        this._usedPoints[i] -= this.maxPerLevel();
                }
                this._usedxPoints[i] -= this.maxPerLevel();
        }
}
 
Game_Actor.prototype.usePoints = function(paramid, points) {
        this._usedPoints[paramid] += points;
}
 
Game_Actor.prototype.usexPoints = function(paramid, points) {
        this._usedxPoints[paramid] += points;
}
 
Game_Actor.prototype.canIncrease = function(paramid, points, alreadyUsed) {
        var result = true;
        if (((this._usedPoints[paramid] + points) > this.maxPerLevel()) && (this.maxPerLevel() != 0)) {
                result = false;
        }
        if ((this.param(paramid) + alreadyUsed + points*this.statPerPoint(paramid)) > this.paramMax(paramid)) {
                result =false;
        }
        return result;
}
 
Game_Actor.prototype.canIncreasex = function(paramid, points, alreadyUsed) {
        var result = true;
        if (((this._usedxPoints[paramid] + points) > this.maxPerLevel()) && (this.maxPerLevel() != 0)) {
                result = false;
        }
        if ((this.xparam(paramid) + alreadyUsed + points*this.xstatPerPoint(paramid)) > this.xparamMax(paramid)) {
                result =false;
        }
        return result;
}
 
Game_Actor.prototype.paramMax = function(paramId) {
        var limit;
        var meta = "this.actor().meta." + getTag(paramId);
        meta = eval(meta);
        meta = meta ? meta : "$dataClasses[this.actor().id].meta." + getTag(paramId);
        meta = eval(meta);
        if (meta) {
                limit = Number(meta);
        } else {
                limit = getLimit(paramId);
        }
    return limit;
};
 
Game_Actor.prototype.xparamMax = function(paramId) {
        var limit = eval(defaultxLimits);
    return limit[paramId];
};
 
Game_Actor.prototype.maxPerLevel = function() {
        return eval(this.actor().meta.maxPerLevel) || Number(maxPointsPerLevel); 
}
 
//Stat increase per stat point
Game_Actor.prototype.statPerPoint = function(id) {
        var str;
        switch(id) {
                case 0:
                        str = "ihp";
                        break;
                case 1:
                        str = "imp";
                        break;
                case 2:
                        str = "iatk";
                        break;
                case 3:
                        str = "idef";
                        break;
                case 4:
                        str = "imat";
                        break;
                case 5:
                        str = "imdf";
                        break;
                case 6:
                        str = "iagi";
                        break;
                case 7:
                        str = "iluk";
                        break;                        
        }
        var met = "$dataClasses[this._classId].meta." + str;
        met = eval(met);
        met = met ? met : "this.actor().meta." + str;
        met = eval(met);
        return met ? eval(met) : 1;
}
 
//Xstat increase per stat point
Game_Actor.prototype.xstatPerPoint = function(id) {
        var str;
        switch(id) {
                case 0:
                        str = "ihit";
                        break;
                case 1:
                        str = "ieva";
                        break;
                case 2:
                        str = "icri";
                        break;
                case 3:
                        str = "icev";
                        break;
                case 4:
                        str = "imev";
                        break;
                case 5:
                        str = "imrf";
                        break;
                case 6:
                        str = "icnt";
                        break;
                case 7:
                        str = "ihrg";
                        break;
                case 8:
                        str = "imrg";
                        break;
                case 9:
                        str = "itrg";
        }
        var met = "$dataClasses[this._classId].meta." + str;
        met = eval(met);
        met = met ? met : "this.actor().meta." + str;
        met = eval(met);
        return eval(met) ? eval(met) : 1;
}
 
//-New function gainStats to call on level ups etc
Game_Actor.prototype.gainStats = function(amount) {
        this._statPoints += amount;
}
 
//-Gain stats on level up
_GameActorLevelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
        _GameActorLevelUp.call(this);
        this.gainStats(eval(levelUpPoints));
        this.increasePointLimit();
};
 
//-Actor current stats        
Game_Actor.prototype.statPoints = function() {
        return this._statPoints;
}        
 
//-----New windows
 
//****************************************************
//
//---Window Points, to display stat points.
//
//****************************************************
 
 
function Window_Points() {
    this.initialize.apply(this, arguments);
}
 
Window_Points.prototype = Object.create(Window_Base.prototype);
Window_Points.prototype.constructor = Window_Points;
 
Window_Points.prototype.initialize = function(x, y, actor) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        this._actor = actor;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
};
 
Window_Points.prototype.windowWidth = function() {
    return 300;
};
 
Window_Points.prototype.actor = function () {
        return this._actor;
}
 
Window_Points.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};
 
Window_Points.prototype.refresh = function(newActor) {
        if (!newActor) {
                newActor = this.actor();
        }
        this._actor = newActor;
    var x = this.textPadding();
    var width = this.contents.width - this.textPadding() * 2;
    this.contents.clear();
    this.drawThings();
};
 
Window_Points.prototype.drawThings = function() {
        var x = 1;
        var y = 1;
        var mWidth = Math.round(this.windowWidth()/2.5);
        var value = this._actor.statPoints();
        this.changeTextColor(this.textColor(statNameColor));
    this.drawText(pointsName, x, y, mWidth);
    this.changeTextColor(this.textColor(statValueColor));
    this.drawText(value, x + mWidth + 10, y, mWidth);        
}
 
Window_Points.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};
 
 
//****************************************************
//
//---Window Selecting, to increase stats or leave scene
//
//****************************************************
 
 
Window_Selecting.prototype = Object.create(Window_Command.prototype);
Window_Selecting.prototype.constructor = Window_Selecting;
 
function Window_Selecting() {
    this.initialize.apply(this, arguments);
}
 
Window_Selecting.prototype.initialize = function (x, y, mode) {
        this._mode = mode;
        Window_Command.prototype.initialize.call(this, x, y);
}
 
Window_Selecting.prototype.windowWidth = function() {
    return 350;
};
 
Window_Selecting.prototype.numVisibleRows = function() {
    return 9;
};
 
Window_Selecting.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    }
};
 
Window_Selecting.prototype.activate = function(index) {
    Window_Base.prototype.activate.call(this);
        index2 = index ? index : this._index;
    this.select(index2);
};
 
Window_Selecting.prototype.makeCommandList = function() {
        var name;
        var used = getUsedStats();
        var usedx = getUsedXStats();
        var k;
        var mode = this._mode;
        for(i=0;i<used.length;i++) {
                k = Number(used[i]);
                name = mode + " " + TextManager.param(k);
                this.addCommand(name, 'param' + k.toString());
        }
        for(i=0;i<usedx.length;i++) {
                k = Number(usedx[i]);
                y = k + 10;
                name = mode + " " + getXParamName(k);
                this.addCommand(name, 'param' + y.toString());
        }
        this.addCommand("Exit", 'exit');
}
 
 
//****************************************************
//
//---Window xParams, display character especial parameters
//
//****************************************************
 
function Window_xParams() {
        this.initialize.apply(this, arguments);
}
 
Window_xParams.prototype = Object.create(Window_Base.prototype);
Window_xParams.prototype.constructor = Window_xParams;
 
Window_xParams.prototype.initialize = function (x, y, actor, increased) {
        this._increased = increased;
        this._width = Graphics.boxWidth - x;
    var height = Graphics.boxHeight - y;
        Window_Base.prototype.initialize.call(this, x, y, this._width, height);
        this._actor = actor;
    this.refresh();
};
 
Window_xParams.prototype.actor = function() {
        return this._actor;
};
 
Window_xParams.prototype.baseDraw = function(name, value, x, y) {
        var mWidth = Math.round(this._width/1.5);
        var x2 = x + mWidth + 5;
    this.changeTextColor(this.textColor(statNameColor));
    this.drawText(name, x, y, mWidth);
    this.changeTextColor(this.textColor(statValueColor));
    this.drawText(value, x2, y, mWidth);
}
 
Window_xParams.prototype.drawActorStat = function(x, y, id) {
        var pName = getXParamName(id);
        var pValue = this.actor().xparam(id) + this._increased[id];
        this.baseDraw(pName, pValue.toFixed(2), x, y);
};
 
Window_xParams.prototype.drawParameters = function() {
        var x = 1;
        var y = 1;
        var usedx = getUsedXStats();
        var lineHeight = this.lineHeight();
        for(i=0;i<usedx.length;i++) {
                this.drawActorStat(x, y + lineHeight * i, Number(usedx[i]));                
        }
}
 
Window_xParams.prototype.refresh = function(newActor) {
        if (!newActor) {
                newActor = this.actor();
        }
        this._actor = newActor;
        if (this.contents) {
                this.contents.clear();
                this.drawParameters();
        }
}
 
 
//****************************************************
//
//---Window Char, display character image and current stats
//
//****************************************************
 
 
function Window_Char() {
        this.initialize.apply(this, arguments);
}
 
Window_Char.prototype = Object.create(Window_Base.prototype);
Window_Char.prototype.constructor = Window_Char;
 
 
Window_Char.prototype.initialize = function (x, y, actor, increased) {
        var width = this.windowWidth();
    var height = this.windowHeight();
        this._increased = increased;
        this._actor = actor;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
        this.loadImages();
    this.refresh();
};
 
Window_Char.prototype.actor = function() {
        return this._actor;
};
 
Window_Char.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};
 
Window_Char.prototype.windowHeight = function() {
    return Math.round(Graphics.boxHeight / 3) - 20;
};
 
Window_Char.prototype.loadImages = function() {
        for (i=0; i<$gameParty.members().length;i++){
            ImageManager.loadFace($gameParty.members()[i].faceName());
    }
};
 
Window_Char.prototype.drawItem = function() {
        this.drawItemImage();
        this.drawItemStatus();
    this.drawParameters();
};
 
Window_Char.prototype.drawItemImage = function() {
        this.drawActorFace(this.actor(), 1, 1, 144, 144);
};
 
Window_Char.prototype.drawItemStatus = function() {
        var x = 160;
        var actor = this.actor();
        var y = 1;
        var lineHeight = this.lineHeight();
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorClass(actor, x, y + lineHeight * 2);
        this.drawActorExp(actor, x, y + lineHeight * 3);
};
 
Window_Char.prototype.drawParameters = function() {
        var x = 390;
        var y = 1;
        var used = getUsedStats();
        var lineHeight = this.lineHeight();
        var k;
        for(i=0;i<used.length;i++) {
                if (i < 4) {
                        this.drawActorStat(x, y + lineHeight * i, used[i]);
                } else {
                        k = i-4;        
                        this.drawActorStat(x + 220, y + lineHeight * k, used[i]);
                }        
        }
}
 
Window_Char.prototype.baseDraw = function(name, value, x, y) {
        var mWidth = Math.round(this.windowWidth()/8);
        var x2 = x + mWidth + 10;
    this.changeTextColor(this.textColor(statNameColor));
    this.drawText(name, x, y, mWidth);
    this.changeTextColor(this.textColor(statValueColor));
    this.drawText(value, x2, y, mWidth);
}
 
Window_Char.prototype.drawActorExp = function(actor, x, y) {
        this.baseDraw(expName, actor.currentExp(), x, y);
}
 
Window_Char.prototype.drawActorClass = function(actor, x, y) {
        this.baseDraw(className, actor.currentClass().name, x, y);
}
 
Window_Char.prototype.drawActorName = function(actor, x, y) {
    this.baseDraw(actorName, actor.name(), x, y);
};
 
Window_Char.prototype.drawActorLevel = function(actor, x, y) {
        this.baseDraw(TextManager.level, actor.level, x, y);
};
 
 
Window_Char.prototype.drawActorStat = function(x, y, id) {
        var pName = TextManager.param(id);
        var pValue = this.actor().param(id) + this._increased[id];
        this.baseDraw(pName, pValue.toFixed(0), x, y);
};
 
Window_Char.prototype.refresh = function(newActor) {
        if (!newActor) {
                newActor = this.actor();
        }
        this._actor = newActor;
        if (this.contents) {
                this.contents.clear();
                this.drawItem();
        }
}
 
 
 
//****************************************************
//
//---Scene Distribution, the main scene
//
//****************************************************
 
 
function Scene_Distribution() {
    this.initialize.apply(this, arguments);
}
 
Scene_Distribution.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Distribution.prototype.constructor = Scene_Distribution;
 
 
Scene_Distribution.prototype.initialize = function(actor, party) {
        this._actorr = actor;
        this._party = party;
        this._params = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        this._xparams = [0,0,0,0,0,0,0,0,0,0,0,0,0];
        this._usedStats = 0;
    Scene_MenuBase.prototype.initialize.call(this);
};
 
Scene_Distribution.prototype.actor = function() {
        return this._actorr;
}
 
Scene_Distribution.prototype.inPartyMode = function() {
        return this._party;
}
 
Scene_Distribution.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCharWindow(this.actor());
        this.createXParamWindow(this.actor());
        this.createDecreaseWindow();
        this.createSelectingWindow();
        this.createPointWindow(this.actor());
}
 
 
Scene_Distribution.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._charWindow.refresh();
};
 
 
Scene_Distribution.prototype.createCharWindow = function(actor) {
        this._charWindow = new Window_Char(0, 0, actor, this._params);
        this.addWindow(this._charWindow);
}
 
Scene_Distribution.prototype.createXParamWindow = function(actor) {
        var usedx = getUsedXStats();
        if (usedx) {
                if (usedx.length >= 1) {
                        this._xParamWindow = new Window_xParams(500, this._charWindow.windowHeight(), actor, this._xparams);
                        this.addWindow(this._xParamWindow);
                }                
        }        
}
 
Scene_Distribution.prototype.createSelectingWindow = function() {
        this._selectingWindow = new Window_Selecting(0, this._charWindow.windowHeight(), increaseName);
        var used = getUsedStats();
        var usedx = getUsedXStats();
        var k;
        for(i=0;i<used.length;i++) {
                k = Number(used[i]);
                this._selectingWindow.setHandler('param' + k.toString(), this.increaseParam.bind(this, k));
        }
        for(i=0;i<usedx.length;i++) {
                k = Number(usedx[i]);
                y = k + 10;
                this._selectingWindow.setHandler('param' + y.toString(), this.increaseExParam.bind(this, k));
        }
        if (this.inPartyMode()) {
                this._selectingWindow.setHandler('pageup', this.nextActor.bind(this, false));
                this._selectingWindow.setHandler('pagedown', this.nextActor.bind(this, true));
        }
        this._selectingWindow.setHandler('exit', this.exit.bind(this));
        this._selectingWindow.setHandler('cancel', this.swapWindows.bind(this, "decrease"));
        this.addWindow(this._selectingWindow);
        this._selectingWindow.activate();
}
 
Scene_Distribution.prototype.createDecreaseWindow = function() {
        this._decreaseWindow = new Window_Selecting(0, this._charWindow.windowHeight(), decreaseName);
        var used = getUsedStats();
        var usedx = getUsedXStats();
        var k;
        for(i=0;i<used.length;i++) {
                k = Number(used[i]);
                this._decreaseWindow.setHandler('param' + k.toString(), this.decreaseParam.bind(this, k));
        }
        for(i=0;i<usedx.length;i++) {
                k = Number(usedx[i]);
                y = k + 10;
                this._decreaseWindow.setHandler('param' + y.toString(), this.decreaseExParam.bind(this, k));
        }
        if (this.inPartyMode()) {
                this._decreaseWindow.setHandler('pageup', this.nextActor.bind(this, false));
                this._decreaseWindow.setHandler('pagedown', this.nextActor.bind(this, true));
        }
        this._decreaseWindow.setHandler('exit', this.exit.bind(this));
        this._decreaseWindow.setHandler('cancel', this.swapWindows.bind(this, "increase"));
        this.addWindow(this._decreaseWindow);
        this._decreaseWindow.hide();
        this._decreaseWindow.deactivate();
}
 
Scene_Distribution.prototype.nextActor = function(mode) {
        SoundManager.playEvasion;
        var j = $gameParty.members().indexOf(this.actor());
        var l = $gameParty.members().length;
        if (mode) {
                j = (j+1)==l ? 0 : (j+1);
        } else {
                j = (j-1)<0 ? (l-1) : (j-1);
        }
        this.addParameters();
        this._actorr = $gameParty.members()[j];
        this._charWindow.refresh(this.actor());
        if (this._xParamWindow) {
                this._xParamWindow.refresh(this.actor());
        }
        this._pointWindow.refresh(this.actor());
        this.swapWindows("increase");
}
 
Scene_Distribution.prototype.swapWindows = function(mode) {
        SoundManager.playEvasion;
        switch (mode) {
                case "increase":
                        this._decreaseWindow.deactivate();
                        this._decreaseWindow.hide();
                        this._selectingWindow.show();
                        this._selectingWindow.activate(this._decreaseWindow._index);
                        break;
                case "decrease":
                        this._selectingWindow.deactivate();
                        this._selectingWindow.hide();
                        this._decreaseWindow.show();
                        this._decreaseWindow.activate(this._selectingWindow._index);
                        break;                        
        }
}
 
Scene_Distribution.prototype.addParameters = function() {
        for (i=0;i<8;i++) {
                this.actor().addParam(i, Number(this._params[i].toFixed()));
        }
        for (i=0;i<10;i++) {
                this.actor()._gainedxparams[i] += Number(this._xparams[i].toFixed(2));
        }
        for (i=0;i<13;i++){
                this._params[i] = 0;
                this._xparams[i] = 0;
        }
        this._usedStats = 0;
}
 
Scene_Distribution.prototype.exit = function() {
        SoundManager.playCancel();
        this.addParameters();
        SceneManager.pop();
}
 
Scene_Distribution.prototype.createPointWindow = function(actor) {
        var y = this._charWindow.windowHeight() + this._selectingWindow.windowHeight();
        this._pointWindow = new Window_Points(0, y, actor);
        this.addWindow(this._pointWindow);
}
 
Scene_Distribution.prototype.increaseParam = function(id) {
        var x = Input.isPressed('shift') ? shiftIncrease : 1;
        var amount;
        var condition = this.actor().canIncrease(id, x, this._params[id]);
        if ((this.actor().statPoints() >= x) && condition) {
                amount = this.actor().statPerPoint(id)*x;
                this._params[id] += amount;
                this._selectingWindow.playOkSound();
                this._usedStats += x;
                this.actor().gainStats(-x);
                this.actor().usePoints(id, x);
        } else {
                this._selectingWindow.playBuzzerSound();
        }
        this._charWindow.refresh();
        this._pointWindow.refresh();
        if (this._xParamWindow) {
                this._xParamWindow.refresh();
        }
        this._selectingWindow.activate();
}
 
Scene_Distribution.prototype.increaseExParam = function(id) {
        var x = Input.isPressed('shift') ? shiftIncrease : 1;
        var amount;
        var condition = this.actor().canIncreasex(id, x, this._xparams[id]);
        if ((this.actor().statPoints() >= x) && condition) {
                amount = this.actor().xstatPerPoint(id)*x;
                this._xparams[id] += amount;
                this._selectingWindow.playOkSound();
                this._usedStats += x;
                this.actor().gainStats(-x);
                this.actor().usexPoints(id, x);
        } else {
                this._selectingWindow.playBuzzerSound();
        }
        this._charWindow.refresh();
        this._pointWindow.refresh();
        if (this._xParamWindow) {
                this._xParamWindow.refresh();
        }
        this._selectingWindow.activate();
}
 
Scene_Distribution.prototype.decreaseParam = function(id) {
        var x = Input.isPressed('shift') ? shiftIncrease : 1;
        var amount = this.actor().statPerPoint(id)*x;;
        if ((this._usedStats >= x) && (this._params[id] >= amount)) {
                this._params[id] -= amount;
                SceneManager.playCancel;
                this._usedStats -= x;
                this.actor().gainStats(x);
                this.actor().usePoints(id, -x);
        } else {
                this._decreaseWindow.playBuzzerSound();
        }
        this._charWindow.refresh();
        this._pointWindow.refresh();
        if (this._xParamWindow) {
                this._xParamWindow.refresh();
        }
        this._decreaseWindow.activate();
}
 
Scene_Distribution.prototype.decreaseExParam = function(id) {
        var x = Input.isPressed('shift') ? shiftIncrease : 1;
        var amount = this.actor().xstatPerPoint(id)*x;;
        if ((this._usedStats >= x) && (this._xparams[id] >= amount)) {
                this._xparams[id] -= amount;
                SceneManager.playCancel;
                this._usedStats -= x;
                this.actor().gainStats(x);
                this.actor().usePoints(id, -x);
        } else {
                this._decreaseWindow.playBuzzerSound();
        }
        this._charWindow.refresh();
        this._pointWindow.refresh();
        if (this._xParamWindow) {
                this._xParamWindow.refresh();
        }
        this._decreaseWindow.activate();
}
 
 
 
SceneManager.sceneDistribution = function(actor, party) {
        if (typeof(party) === 'undefined') {
                party = false;
        }
        this._stack.push(this._scene.constructor);
        if (Scene_Distribution) {
        this._nextScene = new Scene_Distribution(actor, party);
    }
    if (this._scene) {
        this._scene.stop();
    }
}
 
SceneManager.partyDistribution = function(index) {
        if (typeof(index) === 'undefined') {
                index = 0;
        }
        var actor = $gameParty.members()[index];
        this.sceneDistribution(actor, true);
}
 
})();
