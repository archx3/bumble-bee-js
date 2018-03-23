/**
 * Created by ARCH on 25/08/2016.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
 *  you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *       \___/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 *@fileOverview Static and constructor methods for managing keyboard events
 */

var Barge = Bee || {};
(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Keyboard'] = factory(global));
      });
   }
   else if (typeof exports === 'object')
   {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory(global);
   }
   else
   {
      global['Barge.Keyboard'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   let Bu  = Bee.Utils,
       Ba  = Bee.Array,
       Boa = Bee.ObservableArray,
       Bo  = Bee.Object,
       Bs  = Bee.String,
       Bd  = Bee.Dom;

      Bee.Keyboard = Bee.Keyboard || {};

      //region
      /**
       * Key names for common characters. These should be used with keyup/keydown
       * events, since the .keyCode property on those is meant to indicate the
       * physical key the user held down on the keyboard. Hence the mapping uses
       * only the unshifted version of each key (e.g. no '#', since that's shift+3).
       * Keypress events on the other hand generate (mostly) ASCII codes since they
       * correspond to *characters* the user typed.
       *
       * For further reference: http://unixpapa.com/js/key.html
       *
       * This list is not localized and therefore some of the key codes are not
       * correct for non-US keyboard layouts.
       *
       * @see Barge.Keyboard.KeyCodes
       * @enum {string}
       */
      Bee.Keyboard.KeyNames = {
         8   : 'backspace',
         9   : 'tab',
         13  : 'enter',
         16  : 'shift',
         17  : 'ctrl',
         18  : 'alt',
         19  : 'pause',
         20  : 'caps-lock',
         27  : 'esc',
         32  : 'space',
         33  : 'pg-up',
         34  : 'pg-down',
         35  : 'end',
         36  : 'home',
         37  : 'left',
         38  : 'up',
         39  : 'right',
         40  : 'down',
         45  : 'insert',
         46  : 'delete',
         48  : '0',
         49  : '1',
         50  : '2',
         51  : '3',
         52  : '4',
         53  : '5',
         54  : '6',
         55  : '7',
         56  : '8',
         57  : '9',
         59  : 'semicolon',
         61  : 'equals',
         65  : 'a',
         66  : 'b',
         67  : 'c',
         68  : 'd',
         69  : 'e',
         70  : 'f',
         71  : 'g',
         72  : 'h',
         73  : 'i',
         74  : 'j',
         75  : 'k',
         76  : 'l',
         77  : 'm',
         78  : 'n',
         79  : 'o',
         80  : 'p',
         81  : 'q',
         82  : 'r',
         83  : 's',
         84  : 't',
         85  : 'u',
         86  : 'v',
         87  : 'w',
         88  : 'x',
         89  : 'y',
         90  : 'z',
         93  : 'context',
         96  : 'num-0',
         97  : 'num-1',
         98  : 'num-2',
         99  : 'num-3',
         100 : 'num-4',
         101 : 'num-5',
         102 : 'num-6',
         103 : 'num-7',
         104 : 'num-8',
         105 : 'num-9',
         106 : 'num-multiply',
         107 : 'num-plus',
         109 : 'num-minus',
         110 : 'num-period',
         111 : 'num-division',
         112 : 'f1',
         113 : 'f2',
         114 : 'f3',
         115 : 'f4',
         116 : 'f5',
         117 : 'f6',
         118 : 'f7',
         119 : 'f8',
         120 : 'f9',
         121 : 'f10',
         122 : 'f11',
         123 : 'f12',
         186 : 'semicolon',
         187 : 'equals',
         189 : 'dash',
         188 : ',',
         190 : '.',
         191 : '/',
         192 : '`',
         219 : 'open-square-bracket',
         220 : '\\',
         221 : 'close-square-bracket',
         222 : 'single-quote',
         224 : 'win'
      };

      //endregion

      /**
       * shortcut form of {@link Barge.Keyboard.KeyCodes}
       * @enum {Number}
       */
      var kc = Bee.Keyboard.KeyCodes;

      Bee.Keyboard = {

         kc : Bee.Keyboard.KeyCodes,

         checkKey : function (e)
         {
            let event = window.event ? window.event : e;
            return event.keyCode
         },

         insertKeyBoardValue : function (input, gcp)
         {  //console.log("i have been called");
            Bu.setCaretPosition(input, gcp);
            input.focus();
         },

         isTextModifyingKeyEvent : function (e)
         {
            if (e.altKey && !e.ctrlKey || e.metaKey ||
                // Function keys don't generate text
                e.keyCode >= Bee.Keyboard.KeyCodes.F1 &&
                e.keyCode <= Bee.Keyboard.KeyCodes.F12)
            {
               return false;
            }
            // The following keys are quite harmless, even in combination with
            // CTRL, ALT or SHIFT.
            switch (e.keyCode)
            {
               case Bee.Keyboard.KeyCodes.ALT:
               case Bee.Keyboard.KeyCodes.CAPS_LOCK:
               case Bee.Keyboard.KeyCodes.CONTEXT_MENU:
               case Bee.Keyboard.KeyCodes.CTRL:
               case Bee.Keyboard.KeyCodes.DOWN:
               case Bee.Keyboard.KeyCodes.END:
               case Bee.Keyboard.KeyCodes.ESC:
               case Bee.Keyboard.KeyCodes.HOME:
               case Bee.Keyboard.KeyCodes.INSERT:
               case Bee.Keyboard.KeyCodes.LEFT:
               case Bee.Keyboard.KeyCodes.MAC_FF_META:
               case Bee.Keyboard.KeyCodes.META:
               case Bee.Keyboard.KeyCodes.NUMLOCK:
               case Bee.Keyboard.KeyCodes.NUM_CENTER:
               case Bee.Keyboard.KeyCodes.PAGE_DOWN:
               case Bee.Keyboard.KeyCodes.PAGE_UP:
               case Bee.Keyboard.KeyCodes.PAUSE:
               case Bee.Keyboard.KeyCodes.PHANTOM:
               case Bee.Keyboard.KeyCodes.PRINT_SCREEN:
               case Bee.Keyboard.KeyCodes.RIGHT:
               case Bee.Keyboard.KeyCodes.SCROLL_LOCK:
               case Bee.Keyboard.KeyCodes.SHIFT:
               case Bee.Keyboard.KeyCodes.UP:
               case Bee.Keyboard.KeyCodes.VK_NONAME:
               case Bee.Keyboard.KeyCodes.WIN_KEY:
               case Bee.Keyboard.KeyCodes.WIN_KEY_RIGHT:
                  return false;
               case Bee.Keyboard.KeyCodes.WIN_KEY_FF_LINUX:
                  return !Bee.userAgent.GECKO;
               default:
                  return e.keyCode < Bee.Keyboard.KeyCodes.FIRST_MEDIA_KEY ||
                         e.keyCode > Bee.Keyboard.KeyCodes.LAST_MEDIA_KEY;
            }
         },

         isBackSpaceKey : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.BACKSPACE;
         },

         /**
          *
          * @param e {Event}
          * @returns {boolean}
          */
         isModifierKey           : function (e)
         {
            return e.shiftKey || e.ctrlKey || e.altKey;
         },
         /**
          *
          * @param key {Event}
          * @returns {boolean}
          */
         isAlphaKey              : function (key)
         {
            return key.keyCode >= 65 && key.keyCode <= 90;
         },
         /**
          *
          * @param key {Event}
          * @returns {boolean}
          */
         isNumericKey            : function (key)
         {
            return key.keyCode >= 48 && key.keyCode <= 57;
         },
         /**
          *
          * @param key {Event}
          * @returns {boolean}
          */
         isArrowKey              : function (key)
         {
            return key.keyCode >= 37 && key.keyCode <= 40;
         },

         isLeftArrowKey : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.LEFT;
         },

         isRightArrowKey : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.RIGHT ;
         },

         isLeftOrRightArrowKey : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.RIGHT || key.keyCode === Bee.Keyboard.KeyCodes.LEFT;
         },

         isUpKey             : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.UP;
         },

         isDownKey             : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.DOWN;
         },

         isUpOrDownKey             : function (key)
         {
            return key.keyCode === Bee.Keyboard.KeyCodes.UP || key.keyCode === Bee.Keyboard.KeyCodes.DOWN;
         },
         /**
          * Returns true if the key produces a character.
          * This does not cover characters on non-US keyboards (Russian, Hebrew, etc.).
          *
          * @param {number} keyCode A key code.
          * @return {boolean} Whether it's a character key.
          */
         isCharacterKey            : function (keyCode)
         {
            if (keyCode >= Bee.Keyboard.KeyCodes.ZERO &&
                keyCode <= Bee.Keyboard.KeyCodes.NINE)
            {
               return true;
            }

            if (keyCode >= Bee.Keyboard.KeyCodes.NUM_ZERO &&
                keyCode <= Bee.Keyboard.KeyCodes.NUM_MULTIPLY)
            {
               return true;
            }

            if (keyCode >= Bee.Keyboard.KeyCodes.A && keyCode <= Bee.Keyboard.KeyCodes.Z)
            {
               return true;
            }

            // Safari sends zero key code for non-latin characters.
            if ((Bee.userAgent.WEBKIT || Bee.userAgent.EDGE) && keyCode === 0)
            {
               return true;
            }

            switch (keyCode)
            {
               case Bee.Keyboard.KeyCodes.SPACE:
               case Bee.Keyboard.KeyCodes.PLUS_SIGN:
               case Bee.Keyboard.KeyCodes.QUESTION_MARK:
               case Bee.Keyboard.KeyCodes.AT_SIGN:
               case Bee.Keyboard.KeyCodes.NUM_PLUS:
               case Bee.Keyboard.KeyCodes.NUM_MINUS:
               case Bee.Keyboard.KeyCodes.NUM_DOT:
               case Bee.Keyboard.KeyCodes.NUM_DIVISION:
               case Bee.Keyboard.KeyCodes.SEMICOLON:
               case Bee.Keyboard.KeyCodes.FF_SEMICOLON:
               case Bee.Keyboard.KeyCodes.DASH:
               case Bee.Keyboard.KeyCodes.EQUALS:
               case Bee.Keyboard.KeyCodes.FF_EQUALS:
               case Bee.Keyboard.KeyCodes.COMMA:
               case Bee.Keyboard.KeyCodes.DOT:
               case Bee.Keyboard.KeyCodes.SLASH:
               case Bee.Keyboard.KeyCodes.APOSTROPHE:
               case Bee.Keyboard.KeyCodes.SINGLE_QUOTE:
               case Bee.Keyboard.KeyCodes.OPEN_SQUARE_BRACKET:
               case Bee.Keyboard.KeyCodes.BACKSLASH:
               case Bee.Keyboard.KeyCodes.CLOSE_SQUARE_BRACKET:
                  return true;
               default:
                  return false;
            }
         },
         /**
          * Returns true if the key fires a keypress event in the current browser.
          *
          * Accoridng to MSDN [1] IE only fires keypress events for the following keys:
          * - Letters: A - Z (uppercase and lowercase)
          * - Numerals: 0 - 9
          * - Symbols: ! @ # $ % ^ & * ( ) _ - + = < [ ] { } , . / ? \ | ' ` " ~
          * - System: ESC, SPACEBAR, ENTER
          *
          * That's not entirely correct though, for instance there's no distinction
          * between upper and lower case letters.
          *
          * [1] http://msdn2.microsoft.com/en-us/library/ms536939(VS.85).aspx)
          *
          * Safari is similar to IE, but does not fire keypress for ESC.
          *
          * Additionally, IE6 does not fire keydown or keypress events for letters when
          * the control or alt keys are held down and the shift key is not. IE7 does
          * fire keydown in these cases, though, but not keypress.
          *
          * @param {number} keyCode A key code.
          * @param {number=} opt_heldKeyCode Key code of a currently-held key.
          * @param {boolean=} opt_shiftKey Whether the shift key is held down.
          * @param {boolean=} opt_ctrlKey Whether the control key is held down.
          * @param {boolean=} opt_altKey Whether the alt key is held down.
          * @return {boolean} Whether it's a key that fires a keypress event.
          */
         firesKeyPressEvent        : function (keyCode, opt_heldKeyCode, opt_shiftKey, opt_ctrlKey, opt_altKey)
         {
            if (!Bee.userAgent.IE && !Bee.userAgent.EDGE && !(Bee.userAgent.WEBKIT && Bee.userAgent.isVersionOrHigher('525')))
            {
               return true;
            }

            if (Bee.userAgent.MAC && opt_altKey)
            {
               return Bee.Keyboard.isCharacterKey(keyCode);
            }

            // Alt but not AltGr which is represented as Alt+Ctrl.
            if (opt_altKey && !opt_ctrlKey)
            {
               return false;
            }

            // Saves Ctrl or Alt + key for IE and WebKit 525+, which won't fire keypress.
            // Non-IE browsers and WebKit prior to 525 won't get this far so no need to
            // check the user agent.
            if (Bee.Utils.isNumber(opt_heldKeyCode))
            {
               opt_heldKeyCode = Bee.Keyboard.normalizeKeyCode(opt_heldKeyCode);
            }
            if (!opt_shiftKey && (opt_heldKeyCode === Bee.Keyboard.KeyCodes.CTRL ||
                                  opt_heldKeyCode === Bee.Keyboard.ALT || Bee.userAgent.MAC &&
                                  opt_heldKeyCode === Bee.Keyboard.KeyCodes.META))
            {
               return false;
            }

            // Some keys with Ctrl/Shift do not Issue keypress in WEBKIT.
            if ((Bee.userAgent.WEBKIT || Bee.userAgent.EDGE) && opt_ctrlKey && opt_shiftKey)
            {
               switch (keyCode)
               {
                  case Bee.Keyboard.KeyCodes.BACKSLASH:
                  case Bee.Keyboard.KeyCodes.OPEN_SQUARE_BRACKET:
                  case Bee.Keyboard.KeyCodes.CLOSE_SQUARE_BRACKET:
                  case Bee.Keyboard.KeyCodes.TILDE:
                  case Bee.Keyboard.KeyCodes.SEMICOLON:
                  case Bee.Keyboard.KeyCodes.DASH:
                  case Bee.Keyboard.KeyCodes.EQUALS:
                  case Bee.Keyboard.KeyCodes.COMMA:
                  case Bee.Keyboard.KeyCodes.DOT:
                  case Bee.Keyboard.KeyCodes.SLASH:
                  case Bee.Keyboard.KeyCodes.APOSTROPHE:
                  case Bee.Keyboard.KeyCodes.SINGLE_QUOTE:
                     return false;
               }
            }

            // When Ctrl+<somekey> is held in IE, it only fires a keypress once, but it
            // continues to fire keydown events as the event repeats.
            if (Bee.userAgent.IE && opt_ctrlKey && opt_heldKeyCode === keyCode)
            {
               return false;
            }

            switch (keyCode)
            {
               case Bee.Keyboard.KeyCodes.ENTER:
                  return true;
               case Bee.Keyboard.KeyCodes.ESC:
                  return !(Bee.userAgent.WEBKIT || Bee.userAgent.EDGE);
            }

            return Bee.Keyboard.isCharacterKey(keyCode);
         },
         /**
          * Normalizes key codes from OS/Browser-specific value to the general one.
          * @param {number} keyCode The native key code.
          * @return {number} The normalized key code.
          */
         normalizeKeyCode          : function (keyCode)
         {
            if (Bee.userAgent.GECKO)
            {
               return Bee.Keyboard.normalizeGeckoKeyCode(keyCode);
            }
            else if (Bee.userAgent.MAC && Bee.userAgent.WEBKIT)
            {
               return Bee.Keyboard.normalizeMacWebKitKeyCode(keyCode);
            }
            else
            {
               return keyCode;
            }
         },
         /**
          * Normalizes key codes from their Mac WebKit-specific value to the general one.
          * @param {number} keyCode The native key code.
          * @return {number} The normalized key code.
          */
         normalizeMacWebKitKeyCode : function (keyCode)
         {
            switch (keyCode)
            {
               case Bee.Keyboard.KeyCodes.MAC_WK_CMD_RIGHT:  // 93
                  return Bee.Keyboard.KeyCodes.META;          // 91
               default:
                  return keyCode;
            }
         },
         /**
          * Normalizes key codes from their Gecko-specific value to the general one.
          * @param {number} keyCode The native key code.
          * @return {number} The normalized key code.
          */
         normalizeGeckoKeyCode     : function (keyCode)
         {
            switch (keyCode)
            {
               case Bee.Keyboard.KeyCodes.FF_EQUALS:
                  return Bee.Keyboard.KeyCodes.EQUALS;

               case Bee.Keyboard.KeyCodes.FF_SEMICOLON:
                  return Bee.Keyboard.KeyCodes.SEMICOLON;

               case Bee.Keyboard.KeyCodes.FF_DASH:
                  return Bee.Keyboard.KeyCodes.DASH;

               case Bee.Keyboard.KeyCodes.MAC_FF_META:
                  return Bee.Keyboard.KeyCodes.META;

               case Bee.Keyboard.KeyCodes.WIN_KEY_FF_LINUX:
                  return Bee.Keyboard.KeyCodes.WIN_KEY;

               default:
                  return keyCode;
            }
         }

      };


      Bee.Keyboard.shortcut = function ()
      {
         //console.log("called");


         var allButtons = Bd.getElementsByAttribute("data-shortcut");//all items with shortcut attr

         //console.log(allButtons);
         function _isSaveButton(button)
         {
            return button.getAttribute("data-shortcut").toString() === "ctrl,s";
         }

         var saveButtonExists = allButtons.some(_isSaveButton);
         //console.log(saveButtonExists);

         for (var alB = 0; alB < allButtons.length; alB++)
         {
            (function (j)
            {
               window.addEventListener("keydown", function (evt)
               {
                  let e           = evt ? evt : window.event,
                      shortCutStr = allButtons[j].getAttribute("data-shortcut");
                  let keys = !Bs.isEmpty(shortCutStr) ? shortCutStr.split(",") : "";

                  var keyChar = String.fromCharCode(e.keyCode).toLowerCase();

                  var keyChar1 = Bu.defined(keys[1]) ? keys[1] : null;
                  var keyChar2 = Bu.defined(keys[2]) ? keys[2] : null;

                  if (!saveButtonExists)
                  {
                     //console.log( "no save Button");
                     if (e.ctrlKey && keyChar == "s" && !e.shiftKey && !e.altKey)
                     {
                        ///console.log(keyChar);
                        e.preventDefault();
                     }
                  }

                  let length = keys.length;

                  function clickMe()
                  {
                     e.preventDefault();
                     allButtons[j].click();
                  }

                  if (length === 1)
                  {
                     if (!e.shiftKey && !e.ctrlKey && !e.altKey)
                     {

                        if (keys[0] === keyChar)
                        {
                           clickMe();
                        }
                     }
                     if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.keyCode === 27)
                     {
                        if (keys[0] === 'esc' || keys[0] === 'escape')
                        {
                           clickMe();
                        }
                     }
                     else if (!e.shiftKey && !e.ctrlKey && !e.altKey && e.keyCode === 13)
                     {
                        if (keys[0] === 'return' || keys[0] === 'enter')
                        {
                           clickMe();
                        }
                     }
                  }
                  else if (length === 2)
                  {
                     if (keys[0] === "ctrl")
                     {
                        if (e.ctrlKey && keys[1] === keyChar && !e.shiftKey && !e.altKey)
                        {
                           clickMe();
                        }
                     }
                     else if (keys[0] === "shift")
                     {
                        if (e.shiftKey && keys[1] === keyChar && !e.ctrlKey && e.altKey)
                        {
                           clickMe();
                        }
                     }
                     else if (keys[0] === "alt")
                     {
                        if (e.altKey && keys[1] === keyChar && !e.ctrlKey && !e.shiftKey)
                        {
                           clickMe();
                        }
                     }
                  }
                  if (length === 3)
                  {
                     /*if(keys.indexOf("ctrl") > -1 && keys.indexOf("alt") < 0 && keys.indexOf("shift") < 0)
                      {
                      if((e.ctrlKey && keys[1] == keyChar1  && keys[2] == keyChar2))
                      {
                      e.preventDefault();
                      allButtons[j].click();
                      }
                      }
                      else */
                     if (keys.indexOf("ctrl") > -1 && keys.indexOf("alt") > -1)
                     {
                        if (e.ctrlKey && e.altKey && !e.shiftKey && keys[2] === keyChar)
                        {
                           clickMe();
                        }
                     }
                     else if (keys.indexOf("ctrl") > -1 && keys.indexOf("shift") > -1)
                     {
                        if (e.ctrlKey && e.shiftKey && !e.altKey && keys[2] === keyChar)
                        {
                           clickMe();
                        }
                     }
                     else if (keys.indexOf("shift") > -1 && keys.indexOf("alt") > -1)
                     {
                        if (e.shiftKey && e.altKey && !e.ctrlKey && keys[2] === keyChar)
                        {
                           clickMe();
                        }
                     }
                  }
                  if (length === 4)
                  {
                     //console.log(allButtons[j] + " has 4 keys");
                     if (keys.indexOf("ctrl") > -1 && keys.indexOf("shift") > -1 && keys.indexOf("alt") > -1)
                     {  //console.log(allButtons[j] + " has 3 meta keys");
                        //console.log(allButtons[j] + " " + keys[3]);
                        if (e.ctrlKey && e.altKey && e.shiftKey && keys[3] === keyChar)
                        {  //console.log(allButtons[j] + " all 3 meta keys pressed meta keys");
                           clickMe();
                        }
                     }
                  }
               });
            })(alB);
         }
      };


      if(Bd.getElementsByAttribute("data-shortcut", false, true) !== undefined)
      {
         let myVar = new Bee.Keyboard.shortcut();
      }

   //going public whoop! whoop! lol
   return Bee.Keyboard;
});

/**
 @Author Created by ARCH on 05/01/2017
 @fileoverview Constant declarations for common key codes.
 */
//Bee.Utils.provide('Barge.Keyboard.KeyCodes');
/**
 * Key codes for common characters.
 *
 * This list is not localized and therefore some of the key codes are not
 * correct for non US keyboard layouts. See comments below.
 *
 * @enum {number}
 */
Bee.Keyboard.KeyCodes = {
   WIN_KEY_FF_LINUX : 0,
   MAC_ENTER        : 3,
   BACKSPACE        : 8,
   TAB              : 9,
   NUM_CENTER       : 12,  // NUMLOCK on FF/Safari Mac
   ENTER            : 13,
   SHIFT            : 16,
   CTRL             : 17,
   ALT              : 18,
   PAUSE            : 19,
   CAPS_LOCK        : 20,
   ESC              : 27,
   SPACE            : 32,
   PAGE_UP          : 33,    // also NUM_NORTH_EAST
   PAGE_DOWN        : 34,  // also NUM_SOUTH_EAST
   END              : 35,        // also NUM_SOUTH_WEST
   HOME             : 36,       // also NUM_NORTH_WEST
   LEFT             : 37,       // also NUM_WEST
   UP               : 38,         // also NUM_NORTH
   RIGHT            : 39,      // also NUM_EAST
   DOWN             : 40,       // also NUM_SOUTH
   PLUS_SIGN        : 43,  // NOT numpad plus
   PRINT_SCREEN     : 44,
   INSERT           : 45,  // also NUM_INSERT
   DELETE           : 46,  // also NUM_DELETE
   ZERO             : 48,
   ONE              : 49,
   TWO              : 50,
   THREE            : 51,
   FOUR             : 52,
   FIVE             : 53,
   SIX              : 54,
   SEVEN            : 55,
   EIGHT            : 56,
   NINE             : 57,
   FF_SEMICOLON     : 59,   // Firefox (Gecko) fires this for semicolon instead of 186
   FF_EQUALS        : 61,      // Firefox (Gecko) fires this for equals instead of 187
   FF_DASH          : 173,       // Firefox (Gecko) fires this for dash instead of 189
   QUESTION_MARK    : 63,  // needs localization
   AT_SIGN          : 64,
   A                : 65,
   B                : 66,
   C                : 67,
   D                : 68,
   E                : 69,
   F                : 70,
   G                : 71,
   H                : 72,
   I                : 73,
   J                : 74,
   K                : 75,
   L                : 76,
   M                : 77,
   N                : 78,
   O                : 79,
   P                : 80,
   Q                : 81,
   R                : 82,
   S                : 83,
   T                : 84,
   U                : 85,
   V                : 86,
   W                : 87,
   X                : 88,
   Y                : 89,
   Z                : 90,
   META             : 91,  // WIN_KEY_LEFT
   WIN_KEY_RIGHT    : 92,
   CONTEXT_MENU     : 93,
   NUM_ZERO         : 96,
   NUM_ONE          : 97,
   NUM_TWO          : 98,
   NUM_THREE        : 99,
   NUM_FOUR         : 100,
   NUM_FIVE         : 101,
   NUM_SIX          : 102,
   NUM_SEVEN        : 103,
   NUM_EIGHT        : 104,
   NUM_NINE         : 105,
   NUM_MULTIPLY     : 106,
   NUM_PLUS         : 107,
   NUM_MINUS        : 109,
   NUM_DOT          : 110,
   NUM_DIVISION     : 111,
   F1               : 112,
   F2               : 113,
   F3               : 114,
   F4               : 115,
   F5               : 116,
   F6               : 117,
   F7               : 118,
   F8               : 119,
   F9               : 120,
   F10              : 121,
   F11              : 122,
   F12              : 123,
   NUMLOCK          : 144,
   SCROLL_LOCK      : 145,

   // OS-specific media keys like volume controls and browser controls.
   FIRST_MEDIA_KEY : 166,
   LAST_MEDIA_KEY  : 183,

   SEMICOLON            : 186,             // needs localization
   DASH                 : 189,                  // needs localization
   EQUALS               : 187,                // needs localization
   COMMA                : 188,                 // needs localization
   DOT                  : 190,                // needs localization
   SLASH                : 191,                 // needs localization
   APOSTROPHE           : 192,            // needs localization
   TILDE                : 192,                 // needs localization
   SINGLE_QUOTE         : 222,          // needs localization
   OPEN_SQUARE_BRACKET  : 219,   // needs localization
   BACKSLASH            : 220,             // needs localization
   CLOSE_SQUARE_BRACKET : 221,  // needs localization
   WIN_KEY              : 224,
   MAC_FF_META          : 224,  // Firefox (Gecko) fires this for the meta key instead of 91
   MAC_WK_CMD_LEFT      : 91,   // WebKit Left Command key fired, same as META
   MAC_WK_CMD_RIGHT     : 93,  // WebKit Right Command key fired, different from META
   WIN_IME              : 229,

   // "Reserved for future use". Some programs (e.g. the SlingPlayer 2.4 ActiveX
   // control) fire this as a hacky way to disable screensavers.
   VK_NONAME : 252,

   // We've seen users whose machines fire this keycode at regular one
   // second intervals. The common thread among these users is that
   // they're all using Dell Inspiron laptops, so we suspect that this
   // indicates a hardware/bios problem.
   // http://en.community.dell.com/support-forums/laptop/f/3518/p/19285957/19523128.aspx
   PHANTOM : 255
};

/**
 *@Change-Log
 *@since V.1.0
 *@Date  08-09-16 : Added Old Internet explorer support
 *@Date  09-09-16 : fixed issues with two keys only shortcut
 *@Date  09-09-16 : fixed issues with three keys only shortcut
 *@Date  09-09-16 : fixed issues with three keys only shortcut ctrl shift bug
 *@Date  09-09-16 : Added page saving restriction even if no button has been assigned the save page shortcut
 *@Date  09-09-16 : Added 4 key shortcut support
 *@Date  09-09-16 : Added 4 key shortcut support
 *@Date  026-09-16 : Wrapped class in an IIFE
 * Finished by Arch on 09/09/16.
 *@Date  05-01-17 : Added {@link Barge.Keyboard.KeyCodes and @link  Barge.Keyboard.KeyNames}
 *@Date  05-01-17 : Extended functionality for key checking
 */

/*
 * TODO In future it will be profitable to change reading the keyChar to reading the keyCode for shortCuts
 * TODO Implement one meta Key and two letters
 * TODO ADD Mac Keyboard Support (cmd Key)
 * TODO ADD OSK to keyboard class
 * */

