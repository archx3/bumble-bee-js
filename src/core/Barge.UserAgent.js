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
 *     \ (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   /-(____)-\
 *  /          \
 */

// Bee.require('Bee.Array');
// Bee.require('Bee.Object');
// Bee.require('Bee.string');

var Bee = Bee || {};

//region util
/**
 * @fileoverview Utilities used by Bee.uLabs.userAgent tools.
 * These functions should not be used outside of Bee.uLabs.userAgent.*.
 * @author nnaze@Bargele.com (Nathan Naze)
 */

Bee.uLabs = Bee.uLabs || {};
Bee.uLabs.userAgent = Bee.uLabs.userAgent || {};

Bee.uLabs.userAgent.util = Bee.uLabs.userAgent.util || {};

/**
 * Gets the native userAgent string from navigator if it exists.
 * If navigator or navigator.userAgent string is missing, returns an empty
 * string.
 * @return {string}
 * @private
 */
Bee.uLabs.userAgent.util._getNativeUserAgentString = function ()
{
   var navigator = Bee.uLabs.userAgent.util._getNavigator();
   if (navigator)
   {
      var userAgent = navigator.userAgent;
      if (userAgent)
      {
         return userAgent;
      }
   }
   return '';
};

/**
 * Getter for the native navigator.
 * This is a separate function so it can be stubbed out in testing.
 * @return {Navigator}
 * @private
 */
Bee.uLabs.userAgent.util._getNavigator = function ()
{
   return Bee.global.navigator;
};

/**
 * A possible override for applications which wish to not check
 * navigator.userAgent but use a specified value for detection instead.
 * @private {string}
 */
Bee.uLabs.userAgent.util.userAgent_ =
   Bee.uLabs.userAgent.util._getNativeUserAgentString();

/**
 * Applications may override browser detection on the built in
 * navigator.userAgent object by setting this string. Set to null to use the
 * browser object instead.
 * @param {?string=} opt_userAgent The User-Agent override.
 */
Bee.uLabs.userAgent.util.setUserAgent = function (opt_userAgent)
{
   Bee.uLabs.userAgent.util.userAgent_ =
      opt_userAgent || Bee.uLabs.userAgent.util._getNativeUserAgentString();
};

/**
 * @return {string} The user agent string.
 */
Bee.uLabs.userAgent.util.getUserAgent = function ()
{
   return Bee.uLabs.userAgent.util.userAgent_;
};

/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string, ignoring
 *     case.
 */
Bee.uLabs.userAgent.util.matchUserAgent = function (str)
{
   var userAgent = Bee.uLabs.userAgent.util.getUserAgent();
   return Bee.String.contains(userAgent, str);
};

/**
 * @param {string} str
 * @return {boolean} Whether the user agent contains the given string.
 */
Bee.uLabs.userAgent.util.matchUserAgentIgnoreCase = function (str)
{
   var userAgent = Bee.uLabs.userAgent.util.getUserAgent();
   return Bee.String.caseInsensitiveContains(userAgent, str);
};

/**
 * Parses the user agent into tuples for each section.
 * @param {string} userAgent
 * @return {!Array<!Array<string>>} Tuples of key, version, and the contents
 *     of the parenthetical.
 */
Bee.uLabs.userAgent.util.extractVersionTuples = function (userAgent)
{
   // Matches each section of a user agent string.
   // Example UA:
   // Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us)
   // AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405
   // This has three version tuples: Mozilla, AppleWebKit, and Mobile.

   var versionRegExp = new RegExp(
      // Key. Note that a key may have a space.
      // (i.e. 'Mobile Safari' in 'Mobile Safari/5.0')
      '(\\w[\\w ]+)' +

      '/' +                // slash
      '([^\\s]+)' +        // version (i.e. '5.0b')
      '\\s*' +             // whitespace
      '(?:\\((.*?)\\))?',  // parenthetical info. parentheses not matched.
      'g');

   var data = [];
   var match;

   // Iterate and collect the version tuples.  Each iteration will be the
   // next regex match.
   while (match = versionRegExp.exec(userAgent))
   {
      data.push([
                   match[1],  // key
                   match[2],  // value
                   // || undefined as this is not undefined in IE7 and IE8
                   match[3] || undefined  // info
                ]);
   }

   return data;
};
// endregion

//region platform

/**
 * @fileoverview Closure user agent platform detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 */
Bee.uLabs.userAgent.platform = Bee.uLabs.userAgent.platform || {};

/**
 * @return {boolean} Whether the platform is Android.
 */
Bee.uLabs.userAgent.platform.isAndroid = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Android');
};

/**
 * @return {boolean} Whether the platform is iPod.
 */
Bee.uLabs.userAgent.platform.isIpod = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('iPod');
};

/**
 * @return {boolean} Whether the platform is iPhone.
 */
Bee.uLabs.userAgent.platform.isIphone = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('iPhone') && !Bee.uLabs.userAgent.util.matchUserAgent('iPod') && !Bee.uLabs.userAgent.util.matchUserAgent('iPad');
};

/**
 * @return {boolean} Whether the platform is iPad.
 */
Bee.uLabs.userAgent.platform.isIpad = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('iPad');
};

/**
 * @return {boolean} Whether the platform is iOS.
 */
Bee.uLabs.userAgent.platform.isIos = function ()
{
   return Bee.uLabs.userAgent.platform.isIphone() ||
          Bee.uLabs.userAgent.platform.isIpad() ||
          Bee.uLabs.userAgent.platform.isIpod();
};

/**
 * @return {boolean} Whether the platform is Mac.
 */
Bee.uLabs.userAgent.platform.isMacintosh = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Macintosh');
};

/**
 * Note: ChromeOS is not considered to be Linux as it does not report itself
 * as Linux in the user agent string.
 * @return {boolean} Whether the platform is Linux.
 */
Bee.uLabs.userAgent.platform.isLinux = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Linux');
};

/**
 * @return {boolean} Whether the platform is Windows.
 */
Bee.uLabs.userAgent.platform.isWindows = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Windows');
};

/**
 * @return {boolean} Whether the platform is ChromeOS.
 */
Bee.uLabs.userAgent.platform.isChromeOS = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('CrOS');
};

/**
 * The version of the platform. We only determine the version for Windows,
 * Mac, and Chrome OS. It doesn't make much sense on Linux. For Windows, we only
 * look at the NT version. Non-NT-based versions (e.g. 95, 98, etc.) are given
 * version 0.0.
 *
 * @return {string} The platform version or empty string if version cannot be
 *     determined.
 */
Bee.uLabs.userAgent.platform.getVersion = function ()
{
   var userAgentString = Bee.uLabs.userAgent.util.getUserAgent();
   var version = '', re, match;
   if (Bee.uLabs.userAgent.platform.isWindows())
   {
      re = /Windows (?:NT|Phone) ([0-9.]+)/;
      match = re.exec(userAgentString);
      if (match)
      {
         version = match[1];
      }
      else
      {
         version = '0.0';
      }
   }
   else if (Bee.uLabs.userAgent.platform.isIos())
   {
      re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
      match = re.exec(userAgentString);

      // Report the version as x.y.z and not x_y_z
      version = match && match[1].replace(/_/g, '.');
   }
   else if (Bee.uLabs.userAgent.platform.isMacintosh())
   {
      re = /Mac OS X ([0-9_.]+)/;
      match = re.exec(userAgentString);
      // Note: some old versions of Camino do not report an OSX version.
      // Default to 10.
      version = match ? match[1].replace(/_/g, '.') : '10';
   }
   else if (Bee.uLabs.userAgent.platform.isAndroid())
   {
      re = /Android\s+([^\);]+)(\)|;)/;
      match = re.exec(userAgentString);
      version = match && match[1];
   }
   else if (Bee.uLabs.userAgent.platform.isChromeOS())
   {
      re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
      match = re.exec(userAgentString);
      version = match && match[1];
   }
   return version || '';
};

/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
Bee.uLabs.userAgent.platform.isVersionOrHigher = function (version)
{
   return Bee.String.compareVersions(
      Bee.uLabs.userAgent.platform.getVersion(), version) >= 0;
};
//endregion

/*region browser*/
/**
 * @fileoverview user agent detection (Browser).
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For more information on rendering engine, platform, or device see the other
 * sub-namespaces in Bee.uLabs.userAgent, Bee.uLabs.userAgent.platform,
 * Bee.uLabs.userAgent.device respectively.)
 *
 * @author (Andy Martone)
 */



Bee.uLabs.userAgent.browser = Bee.uLabs.userAgent.browser || {};

//TODO msg (user): Refactor to remove excessive exclusion logic in matching
// functions.

/**
 * @return {boolean} Whether the user's browser is Opera.  Note: Chromium
 *     based Opera (Opera 15+) is detected as Chrome to avoid unnecessary
 *     special casing.
 * @private
 */
Bee.uLabs.userAgent.browser.matchOpera_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Opera');
};

/**
 * @return {boolean} Whether the user's browser is IE.
 * @private
 */
Bee.uLabs.userAgent.browser.matchIE_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Trident') ||
          Bee.uLabs.userAgent.util.matchUserAgent('MSIE');
};

/**
 * @return {boolean} Whether the user's browser is Edge.
 * @private
 */
Bee.uLabs.userAgent.browser.matchEdge_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Edge');
};

/**
 * @return {boolean} Whether the user's browser is Firefox.
 * @private
 */
Bee.uLabs.userAgent.browser.matchFirefox_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Firefox');
};

/**
 * @return {boolean} Whether the user's browser is Safari.
 * @private
 */
Bee.uLabs.userAgent.browser.matchSafari_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Safari') && !(Bee.uLabs.userAgent.browser.matchChrome_() ||
                                                                 Bee.uLabs.userAgent.browser.matchCoast_() ||
                                                                 Bee.uLabs.userAgent.browser.matchOpera_() ||
                                                                 Bee.uLabs.userAgent.browser.matchEdge_() ||
                                                                 Bee.uLabs.userAgent.browser.isSilk() ||
                                                                 Bee.uLabs.userAgent.util.matchUserAgent('Android'));
};

/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 * @private
 */
Bee.uLabs.userAgent.browser.matchCoast_ = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Coast');
};

/**
 * @return {boolean} Whether the user's browser is iOS Webview.
 * @private
 */
Bee.uLabs.userAgent.browser.matchIosWebview_ = function ()
{
   // iOS Webview does not show up as Chrome or Safari. Also check for Opera's
   // WebKit-based iOS browser, Coast.
   return (Bee.uLabs.userAgent.util.matchUserAgent('iPad') ||
           Bee.uLabs.userAgent.util.matchUserAgent('iPhone')) && !Bee.uLabs.userAgent.browser.matchSafari_() && !Bee.uLabs.userAgent.browser.matchChrome_() && !Bee.uLabs.userAgent.browser.matchCoast_() &&
          Bee.uLabs.userAgent.util.matchUserAgent('AppleWebKit');
};

/**
 * @return {boolean} Whether the user's browser is Chrome.
 * @private
 */
Bee.uLabs.userAgent.browser.matchChrome_ = function ()
{
   return (Bee.uLabs.userAgent.util.matchUserAgent('Chrome') ||
           Bee.uLabs.userAgent.util.matchUserAgent('CriOS')) && !Bee.uLabs.userAgent.browser.matchEdge_();
};

/**
 * @return {boolean} Whether the user's browser is the Android browser.
 * @private
 */
Bee.uLabs.userAgent.browser.matchAndroidBrowser_ = function ()
{
   // Android can appear in the user agent string for Chrome on Android.
   // This is not the Android standalone browser if it does.
   return Bee.uLabs.userAgent.util.matchUserAgent('Android') && !(Bee.uLabs.userAgent.browser.isChrome() ||
                                                                  Bee.uLabs.userAgent.browser.isFirefox() ||
                                                                  Bee.uLabs.userAgent.browser.isOpera() ||
                                                                  Bee.uLabs.userAgent.browser.isSilk());
};

/**
 * @return {boolean} Whether the user's browser is Opera.
 */
Bee.uLabs.userAgent.browser.isOpera = Bee.uLabs.userAgent.browser.matchOpera_;

/**
 * @return {boolean} Whether the user's browser is IE.
 */
Bee.uLabs.userAgent.browser.isIE = Bee.uLabs.userAgent.browser.matchIE_;

/**
 * @return {boolean} Whether the user's browser is Edge.
 */
Bee.uLabs.userAgent.browser.isEdge = Bee.uLabs.userAgent.browser.matchEdge_;

/**
 * @return {boolean} Whether the user's browser is Firefox.
 */
Bee.uLabs.userAgent.browser.isFirefox = Bee.uLabs.userAgent.browser.matchFirefox_;

/**
 * @return {boolean} Whether the user's browser is Safari.
 */
Bee.uLabs.userAgent.browser.isSafari = Bee.uLabs.userAgent.browser.matchSafari_;

/**
 * @return {boolean} Whether the user's browser is Coast (Opera's Webkit-based
 *     iOS browser).
 */
Bee.uLabs.userAgent.browser.isCoast = Bee.uLabs.userAgent.browser.matchCoast_;

/**
 * @return {boolean} Whether the user's browser is iOS Webview.
 */
Bee.uLabs.userAgent.browser.isIosWebview = Bee.uLabs.userAgent.browser.matchIosWebview_;

/**
 * @return {boolean} Whether the user's browser is Chrome.
 */
Bee.uLabs.userAgent.browser.isChrome = Bee.uLabs.userAgent.browser.matchChrome_;

/**
 * @return {boolean} Whether the user's browser is the Android browser.
 */
Bee.uLabs.userAgent.browser.isAndroidBrowser = Bee.uLabs.userAgent.browser.matchAndroidBrowser_;

/**
 * For more information, see:
 * http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html
 * @return {boolean} Whether the user's browser is Silk.
 */
Bee.uLabs.userAgent.browser.isSilk = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Silk');
};

/**
 * @return {string} The browser version or empty string if version cannot be
 *     determined. Note that for Internet Explorer, this returns the version of
 *     the browser, not the version of the rendering engine. (IE 8 in
 *     compatibility mode will return 8.0 rather than 7.0. To determine the
 *     rendering engine version, look at document.documentMode instead. See
 *     http://msdn.microsoft.com/en-us/library/cc196988(v=vs.85).aspx for more
 *     details.)
 */
Bee.uLabs.userAgent.browser.getVersion = function ()
{
   var userAgentString = Bee.uLabs.userAgent.util.getUserAgent();
   // Special case IE since IE's version is inside the parenthesis and
   // without the '/'.
   if (Bee.uLabs.userAgent.browser.isIE())
   {
      return Bee.uLabs.userAgent.browser.getIEVersion_(userAgentString);
   }

   var versionTuples =
          Bee.uLabs.userAgent.util.extractVersionTuples(userAgentString);

   // Construct a map for easy lookup.
   var versionMap = {};

   Bee.Array.forEach(versionTuples, function (tuple)
   {
      // Note that the tuple is of length three, but we only care about the
      // first two.
      var key = tuple[0];
      var value = tuple[1];
      versionMap[key] = value;
   });

   var versionMapHasKey = Bee.partial(Bee.Object.containsKey, versionMap);

   // Gives the value with the first key it finds, otherwise empty string.
   function lookUpValueWithKeys(keys)
   {
      var key = Bee.Array.find(keys, versionMapHasKey);
      return versionMap[key] || '';
   }

   // Check Opera before Chrome since Opera 15+ has "Chrome" in the string.
   // See
   // http://my.opera.com/ODIN/blog/2013/07/15/opera-user-agent-strings-opera-15-and-beyond
   if (Bee.uLabs.userAgent.browser.isOpera())
   {
      // Opera 10 has Version/10.0 but Opera/9.8, so look for "Version" first.
      // Opera uses 'OPR' for more recent UAs.
      return lookUpValueWithKeys(['Version', 'Opera']);
   }

   // Check Edge before Chrome since it has Chrome in the string.
   if (Bee.uLabs.userAgent.browser.isEdge())
   {
      return lookUpValueWithKeys(['Edge']);
   }

   if (Bee.uLabs.userAgent.browser.isChrome())
   {
      return lookUpValueWithKeys(['Chrome', 'CriOS']);
   }

   // Usually products browser versions are in the third tuple after "Mozilla"
   // and the engine.
   var tuple = versionTuples[2];
   return tuple && tuple[1] || '';
};

/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
Bee.uLabs.userAgent.browser.isVersionOrHigher = function (version)
{
   return Bee.String.compareVersions(Bee.uLabs.userAgent.browser.getVersion(), version) >= 0;
};

/**
 * Determines IE version. More information:
 * http://msdn.microsoft.com/en-us/library/ie/bg182625(v=vs.85).aspx#uaString
 * http://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
 * http://blogs.msdn.com/b/ie/archive/2010/03/23/introducing-ie9-s-user-agent-string.aspx
 * http://blogs.msdn.com/b/ie/archive/2009/01/09/the-internet-explorer-8-user-agent-string-updated-edition.aspx
 *
 * @param {string} userAgent the User-Agent.
 * @return {string}
 * @private
 */
Bee.uLabs.userAgent.browser.getIEVersion_ = function (userAgent)
{
   // IE11 may identify itself as MSIE 9.0 or MSIE 10.0 due to an IE 11 upgrade
   // bug. Example UA:
   // Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; rv:11.0)
   // like Gecko.
   // See http://www.whatismybrowser.com/developers/unknown-user-agent-fragments.
   var rv = /rv: *([\d\.]*)/.exec(userAgent);
   if (rv && rv[1])
   {
      return rv[1];
   }

   var version = '';
   var msie = /MSIE +([\d\.]+)/.exec(userAgent);
   if (msie && msie[1])
   {
      // IE in compatibility mode usually identifies itself as MSIE 7.0; in this
      // case, use the Trident version to determine the version of IE. For more
      // details, see the links above.
      var tridentVersion = /Trident\/(\d.\d)/.exec(userAgent);
      if (msie[1] == '7.0')
      {
         if (tridentVersion && tridentVersion[1])
         {
            switch (tridentVersion[1])
            {
               case '4.0':
                  version = '8.0';
                  break;
               case '5.0':
                  version = '9.0';
                  break;
               case '6.0':
                  version = '10.0';
                  break;
               case '7.0':
                  version = '11.0';
                  break;
            }
         }
         else
         {
            version = '7.0';
         }
      }
      else
      {
         version = msie[1];
      }
   }
   return version;
};
/*endregion*/


// region engine

/**
 * @fileoverview Closure user agent detection.
 * @see http://en.wikipedia.org/wiki/User_agent
 * For more information on browser brand, platform, or device see the other
 * sub-namespaces in Bee.uLabs.userAgent (browser, platform, and device).
 */

Bee.uLabs.userAgent.engine = Bee.uLabs.userAgent.engine || {};

/**
 * @return {boolean} Whether the rendering engine is Presto.
 */
Bee.uLabs.userAgent.engine.isPresto = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Presto');
};

/**
 * @return {boolean} Whether the rendering engine is Trident.
 */
Bee.uLabs.userAgent.engine.isTrident = function ()
{
   // IE only started including the Trident token in IE8.
   return Bee.uLabs.userAgent.util.matchUserAgent('Trident') ||
          Bee.uLabs.userAgent.util.matchUserAgent('MSIE');
};

/**
 * @return {boolean} Whether the rendering engine is Edge.
 */
Bee.uLabs.userAgent.engine.isEdge = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Edge');
};

/**
 * @return {boolean} Whether the rendering engine is WebKit.
 */
Bee.uLabs.userAgent.engine.isWebKit = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgentIgnoreCase('WebKit') && !Bee.uLabs.userAgent.engine.isEdge();
};

/**
 * @return {boolean} Whether the rendering engine is Gecko.
 */
Bee.uLabs.userAgent.engine.isGecko = function ()
{
   return Bee.uLabs.userAgent.util.matchUserAgent('Gecko') && !Bee.uLabs.userAgent.engine.isWebKit() && !Bee.uLabs.userAgent.engine.isTrident() && !Bee.uLabs.userAgent.engine.isEdge();
};

/**
 * @return {string} The rendering engine's version or empty string if version
 *     can't be determined.
 */
Bee.uLabs.userAgent.engine.getVersion = function ()
{
   var userAgentString = Bee.uLabs.userAgent.util.getUserAgent();
   if (userAgentString)
   {
      var tuples = Bee.uLabs.userAgent.util.extractVersionTuples(userAgentString);

      var engineTuple = Bee.uLabs.userAgent.engine.getEngineTuple_(tuples);
      if (engineTuple)
      {
         // In Gecko, the version string is either in the browser info or the
         // Firefox version.  See Gecko user agent string reference:
         // http://goo.gl/mULqa
         if (engineTuple[0] == 'Gecko')
         {
            return Bee.uLabs.userAgent.engine.getVersionForKey_(tuples, 'Firefox');
         }

         return engineTuple[1];
      }

      // MSIE has only one version identifier, and the Trident version is
      // specified in the parenthetical. IE Edge is covered in the engine tuple
      // detection.
      var browserTuple = tuples[0];
      var info;
      if (browserTuple && (info = browserTuple[2]))
      {
         var match = /Trident\/([^\s;]+)/.exec(info);
         if (match)
         {
            return match[1];
         }
      }
   }
   return '';
};

/**
 * @param {!Array<!Array<string>>} tuples Extracted version tuples.
 * @return {!Array<string>|undefined} The engine tuple or undefined if not
 *     found.
 * @private
 */
Bee.uLabs.userAgent.engine.getEngineTuple_ = function (tuples)
{
   if (!Bee.uLabs.userAgent.engine.isEdge())
   {
      return tuples[1];
   }
   for (var i = 0; i < tuples.length; i++)
   {
      var tuple = tuples[i];
      if (tuple[0] == 'Edge')
      {
         return tuple;
      }
   }
};

/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the rendering engine version is higher or the same
 *     as the given version.
 */
Bee.uLabs.userAgent.engine.isVersionOrHigher = function (version)
{
   return Bee.String.compareVersions(
      Bee.uLabs.userAgent.engine.getVersion(), version) >= 0;
};

/**
 * @param {!Array<!Array<string>>} tuples Version tuples.
 * @param {string} key The key to look for.
 * @return {string} The version string of the given key, if present.
 *     Otherwise, the empty string.
 * @private
 */
Bee.uLabs.userAgent.engine.getVersionForKey_ = function (tuples, key)
{
   // TODO(nnaze): Move to util if useful elsewhere.

   var pair = Bee.Array.find(tuples, function (pair)
   {
      return key == pair[0];
   });

   return pair && pair[1] || '';
};
//endregion

//region userAgent Constants
/**
 * @fileoverview Rendering engine detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For information on the browser brand (such as Safari versus Chrome), see
 * Bee.userAgent.product.
 * @author arv@Bargele.com (Erik Arvidsson)
 * @see testUserAgent.html
 */

Bee.userAgent = Bee.userAgent || {};

/**
 * @define {boolean} Whether we know at compile-time that the browser is IE.
 */
Bee.utils.define('Barge.userAgent.ASSUME_IE', false);

/**
 * @define {boolean} Whether we know at compile-time that the browser is EDGE.
 */
Bee.utils.define('Barge.userAgent.ASSUME_EDGE', false);

/**
 * @define {boolean} Whether we know at compile-time that the browser is GECKO.
 */
Bee.utils.define('Barge.userAgent.ASSUME_GECKO', false);

/**
 * @define {boolean} Whether we know at compile-time that the browser is WEBKIT.
 */
Bee.utils.define('Barge.userAgent.ASSUME_WEBKIT', false);

/**
 * @define {boolean} Whether we know at compile-time that the browser is a
 *     mobile device running WebKit e.g. iPhone or Android.
 */
Bee.utils.define('Barge.userAgent.ASSUME_MOBILE_WEBKIT', false);

/**
 * @define {boolean} Whether we know at compile-time that the browser is OPERA.
 */
Bee.utils.define('Barge.userAgent.ASSUME_OPERA', false);

/**
 * @define {boolean} Whether the
 *     {@code Bee.userAgent.isVersionOrHigher}
 *     function will return true for any version.
 */
Bee.utils.define('Barge.userAgent.ASSUME_ANY_VERSION', false);

/**
 * Whether we know the browser engine at compile-time.
 * @type {boolean}
 * @private
 */
Bee.userAgent.BROWSER_KNOWN_ = Bee.userAgent.ASSUME_IE ||
                               Bee.userAgent.ASSUME_EDGE || Bee.userAgent.ASSUME_GECKO ||
                               Bee.userAgent.ASSUME_MOBILE_WEBKIT || Bee.userAgent.ASSUME_WEBKIT ||
                               Bee.userAgent.ASSUME_OPERA;

/**
 * Returns the userAgent string for the current browser.
 * @return {string} The userAgent string.
 */
Bee.userAgent.getUserAgentString = function ()
{
   return Bee.uLabs.userAgent.util.getUserAgent();
};

/**
 * TODO(nnaze): Change type to "Navigator" and update compilation targets.
 * @return {Object} The native navigator object.
 */
Bee.userAgent.getNavigator = function ()
{
   // Need a local navigator reference instead of using the global one,
   // to avoid the rare case where they reference different objects.
   // (in a WorkerPool, for example).
   return Bee.global['navigator'] || null;
};

/**
 * Whether the user agent is Opera.
 * @type {boolean}
 */
Bee.userAgent.OPERA = Bee.userAgent.BROWSER_KNOWN_ ? Bee.userAgent.ASSUME_OPERA : Bee.uLabs.userAgent.browser.isOpera();

/**
 * Whether the user agent is Internet Explorer.
 * @type {boolean}
 */
Bee.userAgent.IE = Bee.userAgent.BROWSER_KNOWN_ ? Bee.userAgent.ASSUME_IE : Bee.uLabs.userAgent.browser.isIE();

/**
 * Whether the user agent is Microsoft Edge.
 * @type {boolean}
 */
Bee.userAgent.EDGE = Bee.userAgent.BROWSER_KNOWN_ ? Bee.userAgent.ASSUME_EDGE : Bee.uLabs.userAgent.engine.isEdge();

/**
 * Whether the user agent is MS Internet Explorer or MS Edge.
 * @type {boolean}
 */
Bee.userAgent.EDGE_OR_IE = Bee.userAgent.EDGE || Bee.userAgent.IE;

/**
 * Whether the user agent is Gecko. Gecko is the rendering engine used by
 * Mozilla, Firefox, and others.
 * @type {boolean}
 */
Bee.userAgent.GECKO = Bee.userAgent.BROWSER_KNOWN_ ? Bee.userAgent.ASSUME_GECKO : Bee.uLabs.userAgent.engine.isGecko();

/**
 * Whether the user agent is WebKit. WebKit is the rendering engine that
 * Safari, Android and others use.
 * @type {boolean}
 */
Bee.userAgent.WEBKIT = Bee.userAgent.BROWSER_KNOWN_ ?
                       Bee.userAgent.ASSUME_WEBKIT || Bee.userAgent.ASSUME_MOBILE_WEBKIT :
                       Bee.uLabs.userAgent.engine.isWebKit();

/**
 * Whether the user agent is running on a mobile device.
 *
 * This is a separate function so that the logic can be tested.
 *
 * TODO(nnaze): Investigate swapping in Bee.uLabs.userAgent.device.isMobile().
 *
 * @return {boolean} Whether the user agent is running on a mobile device.
 * @private
 */
Bee.userAgent._isMobile = function ()
{
   return Bee.userAgent.WEBKIT &&
          Bee.uLabs.userAgent.util.matchUserAgent('Mobile');
};

/**
 * Whether the user agent is running on a mobile device.
 *
 * TODO(nnaze): Consider deprecating MOBILE when labs.userAgent
 *   is promoted as the gecko/webkit logic is likely inaccurate.
 *
 * @type {boolean}
 */
Bee.userAgent.MOBILE =
   Bee.userAgent.ASSUME_MOBILE_WEBKIT || Bee.userAgent._isMobile();

/**
 * Used while transitioning code to use WEBKIT instead.
 * @type {boolean}
 * @deprecated Use {@link Barge.userAgent.product.SAFARI} instead.
 * TODO(nicksantos): Delete this from Bee.userAgent.
 */
Bee.userAgent.SAFARI = Bee.userAgent.WEBKIT;

/**
 * @return {string} the platform (operating system) the user agent is running
 *     on. Default to empty string because navigator.platform may not be defined
 *     (on Rhino, for example).
 * @private
 */
Bee.userAgent._determinePlatform = function ()
{
   var navigator = Bee.userAgent.getNavigator();
   return navigator && navigator.platform || '';
};

/**
 * The platform (operating system) the user agent is running on. Default to
 * empty string because navigator.platform may not be defined (on Rhino, for
 * example).
 * @type {string}
 */
Bee.userAgent.PLATFORM = Bee.userAgent._determinePlatform();

/**
 * @define {boolean} Whether the user agent is running on a Macintosh operating
 *     system.
 */
Bee.utils.define('Barge.userAgent.ASSUME_MAC', false);

/**
 * @define {boolean} Whether the user agent is running on a Windows operating
 *     system.
 */
Bee.utils.define('Barge.userAgent.ASSUME_WINDOWS', false);

/**
 * @define {boolean} Whether the user agent is running on a Linux operating
 *     system.
 */
Bee.utils.define('Barge.userAgent.ASSUME_LINUX', false);

/**
 * @define {boolean} Whether the user agent is running on a X11 windowing
 *     system.
 */
Bee.utils.define('Barge.userAgent.ASSUME_X11', false);

/**
 * @define {boolean} Whether the user agent is running on Android.
 */
Bee.utils.define('Barge.userAgent.ASSUME_ANDROID', false);

/**
 * @define {boolean} Whether the user agent is running on an iPhone.
 */
Bee.utils.define('Barge.userAgent.ASSUME_IPHONE', false);

/**
 * @define {boolean} Whether the user agent is running on an iPad.
 */
Bee.utils.define('Barge.userAgent.ASSUME_IPAD', false);

/**
 * @define {boolean} Whether the user agent is running on an iPod.
 */
Bee.utils.define('Barge.userAgent.ASSUME_IPOD', false);

/**
 * @type {boolean}
 * @private
 */
Bee.userAgent.PLATFORM_KNOWN_ = Bee.userAgent.ASSUME_MAC ||
                                Bee.userAgent.ASSUME_WINDOWS || Bee.userAgent.ASSUME_LINUX ||
                                Bee.userAgent.ASSUME_X11 || Bee.userAgent.ASSUME_ANDROID ||
                                Bee.userAgent.ASSUME_IPHONE || Bee.userAgent.ASSUME_IPAD ||
                                Bee.userAgent.ASSUME_IPOD;

/**
 * Whether the user agent is running on a Macintosh operating system.
 * @type {boolean}
 */
Bee.userAgent.MAC = Bee.userAgent.PLATFORM_KNOWN_ ?
                    Bee.userAgent.ASSUME_MAC :
                    Bee.uLabs.userAgent.platform.isMacintosh();

/**
 * Whether the user agent is running on a Windows operating system.
 * @type {boolean}
 */
Bee.userAgent.WINDOWS = Bee.userAgent.PLATFORM_KNOWN_ ?
                        Bee.userAgent.ASSUME_WINDOWS :
                        Bee.uLabs.userAgent.platform.isWindows();

/**
 * Whether the user agent is Linux per the legacy behavior of
 * Bee.userAgent.LINUX, which considered ChromeOS to also be
 * Linux.
 * @return {boolean}
 * @private
 */
Bee.userAgent._isLegacyLinux = function ()
{
   return Bee.uLabs.userAgent.platform.isLinux() ||
          Bee.uLabs.userAgent.platform.isChromeOS();
};

/**
 * Whether the user agent is running on a Linux operating system.
 *
 * Note that Bee.userAgent.LINUX considers ChromeOS to be Linux,
 * while Bee.uLabs.userAgent.platform considers ChromeOS and
 * Linux to be different OSes.
 *
 * @type {boolean}
 */
Bee.userAgent.LINUX = Bee.userAgent.PLATFORM_KNOWN_ ? Bee.userAgent.ASSUME_LINUX : Bee.userAgent._isLegacyLinux();

/**
 * @return {boolean} Whether the user agent is an X11 windowing system.
 * @private
 */
Bee.userAgent._isX11 = function ()
{
   var navigator = Bee.userAgent.getNavigator();
   return !!navigator &&
          Bee.String.contains(navigator['appVersion'] || '', 'X11');
};

/**
 * Whether the user agent is running on a X11 windowing system.
 * @type {boolean}
 */
Bee.userAgent.X11 = Bee.userAgent.PLATFORM_KNOWN_ ?
                    Bee.userAgent.ASSUME_X11 :
                    Bee.userAgent._isX11();

/**
 * Whether the user agent is running on Android.
 * @type {boolean}
 */
Bee.userAgent.ANDROID = Bee.userAgent.PLATFORM_KNOWN_ ?
                        Bee.userAgent.ASSUME_ANDROID :
                        Bee.uLabs.userAgent.platform.isAndroid();

/**
 * Whether the user agent is running on an iPhone.
 * @type {boolean}
 */
Bee.userAgent.IPHONE = Bee.userAgent.PLATFORM_KNOWN_ ?
                       Bee.userAgent.ASSUME_IPHONE :
                       Bee.uLabs.userAgent.platform.isIphone();

/**
 * Whether the user agent is running on an iPad.
 * @type {boolean}
 */
Bee.userAgent.IPAD = Bee.userAgent.PLATFORM_KNOWN_ ?
                     Bee.userAgent.ASSUME_IPAD :
                     Bee.uLabs.userAgent.platform.isIpad();

/**
 * Whether the user agent is running on an iPod.
 * @type {boolean}
 */
Bee.userAgent.IPOD = Bee.userAgent.PLATFORM_KNOWN_ ?
                     Bee.userAgent.ASSUME_IPOD :
                     Bee.uLabs.userAgent.platform.isIpod();

/**
 * @return {string} The string that describes the version number of the user
 *     agent.
 * @private
 */
Bee.userAgent._determineVersion = function ()
{
   // All browsers have different ways to detect the version and they all have
   // different naming schemes.
   // version is a string rather than a number because it may contain 'b', 'a',
   // and so on.
   var version = '';
   var arr = Bee.userAgent._getVersionRegexResult();
   if (arr)
   {
      version = arr ? arr[1] : '';
   }

   if (Bee.userAgent.IE)
   {
      // IE9 can be in document mode 9 but be reporting an inconsistent user agent
      // version.  If it is identifying as a version lower than 9 we take the
      // documentMode as the version instead.  IE8 has similar behavior.
      // It is recommended to set the X-UA-Compatible header to ensure that IE9
      // uses documentMode 9.
      var docMode = Bee.userAgent._getDocumentMode();
      if (docMode != null && docMode > parseFloat(version))
      {
         return String(docMode);
      }
   }

   return version;
};

/**
 * @return {?Array|undefined} The version regex matches from parsing the user
 *     agent string. These regex statements must be executed inline so they can
 *     be compiled out by the closure compiler with the rest of the useragent
 *     detection logic when ASSUME_* is specified.
 * @private
 */
Bee.userAgent._getVersionRegexResult = function ()
{
   var userAgent = Bee.userAgent.getUserAgentString();
   if (Bee.userAgent.GECKO)
   {
      return /rv\:([^\);]+)(\)|;)/.exec(userAgent);
   }
   if (Bee.userAgent.EDGE)
   {
      return /Edge\/([\d\.]+)/.exec(userAgent);
   }
   if (Bee.userAgent.IE)
   {
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(userAgent);
   }
   if (Bee.userAgent.WEBKIT)
   {
      // WebKit/125.4
      return /WebKit\/(\S+)/.exec(userAgent);
   }
   if (Bee.userAgent.OPERA)
   {
      // If none of the above browsers were detected but the browser is Opera, the
      // only string that is of interest is 'Version/<number>'.
      return /(?:Version)[ \/]?(\S+)/.exec(userAgent);
   }
   return undefined;
};

/**
 * @return {number|undefined} Returns the document mode (for testing).
 * @private
 */
Bee.userAgent._getDocumentMode = function ()
{
   // NOTE(user): Bee.userAgent may be used in context where there is no DOM.
   var doc = Bee.global['document'];
   return doc ? doc['documentMode'] : undefined;
};

/**
 * The version of the user agent. This is a string because it might contain
 * 'b' (as in beta) as well as multiple dots.
 * @type {string}
 */
Bee.userAgent.VERSION = Bee.userAgent._determineVersion();

/**
 * Compares two version numbers.
 *
 * @param {string} v1 Version of first item.
 * @param {string} v2 Version of second item.
 *
 * @return {number}  1 if first argument is higher
 *                   0 if arguments are equal
 *                  -1 if second argument is higher.
 * @deprecated Use Bee.String.compareVersions.
 */
Bee.userAgent.compare = function (v1, v2)
{
   return Bee.String.compareVersions(v1, v2);
};

/**
 * Cache for {@link Barge.userAgent.isVersionOrHigher}.
 * Calls to compareVersions are surprisingly expensive and, as a browser's
 * version number is unlikely to change during a session, we cache the results.
 * @const
 * @private
 */
Bee.userAgent.isVersionOrHigherCache_ = {};

/**
 * Whether the user agent version is higher or the same as the given version.
 * NOTE: When checking the version numbers for Firefox and Safari, be sure to
 * use the engine's version, not the browser's version number.  For example,
 * Firefox 3.0 corresponds to Gecko 1.9 and Safari 3.0 to Webkit 522.11.
 * Opera and Internet Explorer versions match the product release number.<br>
 * @see <a href="http://en.wikipedia.org/wiki/Safari_version_history">
 *     Webkit</a>
 * @see <a href="http://en.wikipedia.org/wiki/Gecko_engine">Gecko</a>
 *
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 */
Bee.userAgent.isVersionOrHigher = function (version)
{
   return Bee.userAgent.ASSUME_ANY_VERSION ||
          Bee.userAgent.isVersionOrHigherCache_[version] ||
          (Bee.userAgent.isVersionOrHigherCache_[version] =
             Bee.String.compareVersions(Bee.userAgent.VERSION, version) >= 0);
};

/**
 * Deprecated alias to {@code Bee.userAgent.isVersionOrHigher}.
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the user agent version is higher or the same as
 *     the given version.
 * @deprecated Use Bee.userAgent.isVersionOrHigher().
 */
Bee.userAgent.isVersion = Bee.userAgent.isVersionOrHigher;

/**
 * Whether the IE effective document mode is higher or the same as the given
 * document mode version.
 * NOTE: Only for IE, return false for another browser.
 *
 * @param {number} documentMode The document mode version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *     same as the given version.
 */
Bee.userAgent.isDocumentModeOrHigher = function (documentMode)
{
   return Number(Bee.userAgent.DOCUMENT_MODE) >= documentMode;
};

/**
 * Deprecated alias to {@code Bee.userAgent.isDocumentModeOrHigher}.
 * @param {number} version The version to check.
 * @return {boolean} Whether the IE effective document mode is higher or the
 *      same as the given version.
 * @deprecated Use Bee.userAgent.isDocumentModeOrHigher().
 */
Bee.userAgent.isDocumentMode = Bee.userAgent.isDocumentModeOrHigher;

/**
 * For IE version < 7, documentMode is undefined, so attempt to use the
 * CSS1Compat property to see if we are in standards mode. If we are in
 * standards mode, treat the browser version as the document mode. Otherwise,
 * IE is emulating version 5.
 * @type {number|undefined}
 * @const
 */
Bee.userAgent.DOCUMENT_MODE = (function ()
{
   var doc = Bee.global['document'];
   var mode = Bee.userAgent._getDocumentMode();
   if (!doc || !Bee.userAgent.IE)
   {
      return undefined;
   }
   return mode || (doc['compatMode'] == 'CSS1Compat' ? parseInt(Bee.userAgent.VERSION, 10) : 5);
})();
//endregion

