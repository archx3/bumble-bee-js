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
 * @fileoverview Closure user agent platform detection.
 * @see <a href="http://www.useragentstring.com/">User agent strings</a>
 * For more information on browser brand, rendering engine, or device see the
 * other sub-namespaces in Barge.uLabs.userAgent (browser, engine, and device
 * respectively).
 *
 */

// goog.provide('Barge.uLabs.userAgent.platform');
//
// goog.require('Barge.uLabs.userAgent.util');
// goog.require('goog.string');
Barge.uLabs = Barge.uLabs || {};
Barge.uLabs.userAgent = Barge.uLabs.userAgent || {};
Barge.uLabs.userAgent.platform = Barge.uLabs.userAgent.platform || {};

/**
 * @return {boolean} Whether the platform is Android.
 */
Barge.uLabs.userAgent.platform.isAndroid = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('Android');
};


/**
 * @return {boolean} Whether the platform is iPod.
 */
Barge.uLabs.userAgent.platform.isIpod = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('iPod');
};


/**
 * @return {boolean} Whether the platform is iPhone.
 */
Barge.uLabs.userAgent.platform.isIphone = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('iPhone') &&
      !Barge.uLabs.userAgent.util.matchUserAgent('iPod') &&
      !Barge.uLabs.userAgent.util.matchUserAgent('iPad');
};


/**
 * @return {boolean} Whether the platform is iPad.
 */
Barge.uLabs.userAgent.platform.isIpad = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('iPad');
};


/**
 * @return {boolean} Whether the platform is iOS.
 */
Barge.uLabs.userAgent.platform.isIos = function() {
  return Barge.uLabs.userAgent.platform.isIphone() ||
      Barge.uLabs.userAgent.platform.isIpad() ||
      Barge.uLabs.userAgent.platform.isIpod();
};


/**
 * @return {boolean} Whether the platform is Mac.
 */
Barge.uLabs.userAgent.platform.isMacintosh = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('Macintosh');
};


/**
 * Note: ChromeOS is not considered to be Linux as it does not report itself
 * as Linux in the user agent string.
 * @return {boolean} Whether the platform is Linux.
 */
Barge.uLabs.userAgent.platform.isLinux = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('Linux');
};


/**
 * @return {boolean} Whether the platform is Windows.
 */
Barge.uLabs.userAgent.platform.isWindows = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('Windows');
};


/**
 * @return {boolean} Whether the platform is ChromeOS.
 */
Barge.uLabs.userAgent.platform.isChromeOS = function() {
  return Barge.uLabs.userAgent.util.matchUserAgent('CrOS');
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
Barge.uLabs.userAgent.platform.getVersion = function() {
  var userAgentString = Barge.uLabs.userAgent.util.getUserAgent();
  var version = '', re;
  if (Barge.uLabs.userAgent.platform.isWindows()) {
    re = /Windows (?:NT|Phone) ([0-9.]+)/;
    var match = re.exec(userAgentString);
    if (match) {
      version = match[1];
    } else {
      version = '0.0';
    }
  } else if (Barge.uLabs.userAgent.platform.isIos()) {
    re = /(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/;
    var match = re.exec(userAgentString);
    // Report the version as x.y.z and not x_y_z
    version = match && match[1].replace(/_/g, '.');
  } else if (Barge.uLabs.userAgent.platform.isMacintosh()) {
    re = /Mac OS X ([0-9_.]+)/;
    var match = re.exec(userAgentString);
    // Note: some old versions of Camino do not report an OSX version.
    // Default to 10.
    version = match ? match[1].replace(/_/g, '.') : '10';
  } else if (Barge.uLabs.userAgent.platform.isAndroid()) {
    re = /Android\s+([^\);]+)(\)|;)/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  } else if (Barge.uLabs.userAgent.platform.isChromeOS()) {
    re = /(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/;
    var match = re.exec(userAgentString);
    version = match && match[1];
  }
  return version || '';
};


/**
 * @param {string|number} version The version to check.
 * @return {boolean} Whether the browser version is higher or the same as the
 *     given version.
 */
Barge.uLabs.userAgent.platform.isVersionOrHigher = function(version) {
  return goog.string.compareVersions(
        Barge.uLabs.userAgent.platform.getVersion(), version) >= 0;
};
