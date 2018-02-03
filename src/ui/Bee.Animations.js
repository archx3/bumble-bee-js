/**
 * Created by ARCH on 1/15/17.
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
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 * @fileOverview a map of animations objects for use in
 * {@link Barge.Dom.animate} styles param
 * and methods for simpler animations
 * All of these depend on Velocity.js animation engine
 *
 * Almost all the animations are from {@see animations.css}
 *whose @ author is Justin Aguilar, www.justinaguilar.com/animations/
 *
 * Questions, comments, concerns, love letters:
 * justin@justinaguilar.com
 *
 * @user msg: Some lines in this file use constructs from es6 or later
 */

var Bee = Bee || {};
(function ()
{
   /**
    *
    * @type {Object}
    * @enum
    */
   Bee.Animations = {

      slideDown : {
         translateY : '100%'
         //translateY : '0%'
      },

      slideUp : {
         translateY : '-100%'
         //translateY : '0%'
      },

      slideLeft : {
         translateX : ('-150%')
         //translateY : '0%'
      },

      slideRight : {
         translateX : ('150%')
         //translateY : '0%'
      },

      slideExpandUp : {
         animName   : 'slideExpandUp',
         animStyles : {
            defaultDuration : 1000,

            //scale      : (1.5),
            calls : [
               [{ translateY : ('-100%'), scaleY : (2) }, '100%']]
         }
      },

      tada : {
         animName   : "tada",
         animStyles : {
            defaultDuration : 1000,
            calls           : [
               [{ scale : (0.2), opacity : 0.0 }, '0%'],
               [{ scale : (1.1) }, '60%'],
               [{ scale : (0.9), opacity : 1 }, '80%'],
               [{ scale : (1), opacity : 1 }, '100%']]
         }
      },

      pulse : {
         animName   : "pulse",
         animStyles : {
            defaultDuration : 1500,
            calls           : [
               [{ scale : (0.95), opacity: 0.7 }, '0%'],
               [{ scale : (1), opacity: 1 }, '50%'],
               [{ scale : (0.95), opacity: 0.7 }, '100%']]
         }

      },

      headShake : {
         animName   : "headShake",
         animStyles : {
            defaultDuration : 1500,
            calls           : [
               [{ translateX : (0)}, '0%'],
               [{ translateX : ('-6px'), rotateY : ('-9deg') }, '6.5%'],
               [{ translateX : ('5px'), rotateY : ('7deg')}, '18.5%'],
               [{  translateX : ('-3px'), rotateY : ('-5deg')}, '31.5%'],
               [{ translateX : ('2px'), rotateY : ('3deg')}, '43.5%'],
               [{  translateX : (0)}, '50%']]
         }

      }
   };

   /*Velocity.RegisterEffect( "tada", {
                               defaultDuration:	1000,
                               calls:	[
                                  [	{scale : (0), opacity: 0.0},	'0%']	,
                                  [	{scale : (1.1)},	'60%']	,
                                  [	{scale : (0.9), opacity: 1},	'80%']	,
                                  [	{scale : (1), opacity: 1},	'100%']
                               ],


                            }
   );*/

})();