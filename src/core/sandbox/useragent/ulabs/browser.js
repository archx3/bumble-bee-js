// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Closure user agent detection (Browser).
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For more information on rendering engine, platform, or device see the other
 * sub-namespaces in Bee.uLabs.userAgent, Bee.uLabs.userAgent.platform,
 * Bee.uLabs.userAgent.device respectively.)
 *
 * @author martone@Bargele.com (Andy Martone)
 */

// Bee.provide('Bee.uLabs.userAgent.browser');
//
// Bee.require('Bee.array');
// Bee.require('Bee.uLabs.userAgent.util');
// Bee.require('Bee.object');
// Bee.require('Bee.string');

Bee.uLabs = Bee.uLabs || {};
Bee.uLabs.userAgent = Bee.uLabs.userAgent || {};
Bee.uLabs.userAgent.browser = Bee.uLabs.userAgent.browser || {};

// TODO(nnaze): Refactor to remove excessive exclusion logic in matching
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
Bee.uLabs.userAgent.browser.isFirefox =
   Bee.uLabs.userAgent.browser.matchFirefox_;

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
Bee.uLabs.userAgent.browser.isIosWebview =
   Bee.uLabs.userAgent.browser.matchIosWebview_;

/**
 * @return {boolean} Whether the user's browser is Chrome.
 */
Bee.uLabs.userAgent.browser.isChrome = Bee.uLabs.userAgent.browser.matchChrome_;

/**
 * @return {boolean} Whether the user's browser is the Android browser.
 */
Bee.uLabs.userAgent.browser.isAndroidBrowser =
   Bee.uLabs.userAgent.browser.matchAndroidBrowser_;

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
   Bee.array.forEach(versionTuples, function (tuple)
   {
      // Note that the tuple is of length three, but we only care about the
      // first two.
      var key = tuple[0];
      var value = tuple[1];
      versionMap[key] = value;
   });

   var versionMapHasKey = Bee.partial(Bee.object.containsKey, versionMap);

   // Gives the value with the first key it finds, otherwise empty string.
   function lookUpValueWithKeys(keys)
   {
      var key = Bee.array.find(keys, versionMapHasKey);
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
   return Bee.string.compareVersions(
      Bee.uLabs.userAgent.browser.getVersion(), version) >= 0;
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
