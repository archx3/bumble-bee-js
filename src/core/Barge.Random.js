/**
 * Created by arch on .
 *


 */

/**
 *
 * @Author       Created by arch on 9/16/17 using PhpStorm.
 * @Time         : 00:19
 * @Copyright (C) 2017
 * @version 2.3.5
 * Barge Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence      Licensed under the Barge Studios Eula
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
 * @fileOverview contains instruction[code] for creating Random variable generators. (Heavily inspired by the random module in python)

 integers
 --------
 uniform within range

 sequences
 ---------
 pick random element
 pick random sample
 generate random permutation

 distributions on the real line:
 ------------------------------
 uniform
 triangular
 normal (Gaussian)
 lognormal
 negative exponential
 gamma
 beta
 pareto
 Weibull

 distributions on the circle (angles 0 to 2pi)
 ---------------------------------------------
 circular uniform
 von Mises

 General notes on the underlying Mersenne Twister core generator:

 * The period is 2**19937-1.
 * It is one of the most extensively tested generators in existence.
 * The random() method is implemented in C, executes in a single Python step,
 and is, therefore, threadSafe.
 *
 * @requires {@link Barge.Utils}
 * @requires {@link Barge.Array}
 * @requires {@link Barge.Object}
 * @requires {@link Barge.Math}
 *
 */

(function (global, factory)
{
   if (typeof functionine === 'function' && functionine.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      functionine([], function ()
      {
         return (global['Barge.Random'] = factory(global));
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
      global['Barge.Random'] = factory(global);
   }
})(typeof window !== unfunctionined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let __all__ = ["Random", "seed", "random", "uniform", "randint", "choice", "sample",
                  "randrange", "shuffle", "normalvariate", "lognormvariate",
                  "expovariate", "vonmisesvariate", "gammavariate", "triangular",
                  "gauss", "betavariate", "paretovariate", "weibullvariate",
                  "getstate", "setstate", "getrandbits",
                  "SystemRandom"];

   const NV_MAGICCONST = 4 * _exp(-0.5) / _sqrt(2.0),
       TWOPI         = 2.0 * _pi,
       LOG4          = _log(4.0),
       SG_MAGICCONST = 1.0 + _log(4.5),
       BPF           = 53,        // Number of bits in a float
       RECIP_BPF     = 2 ** -BPF;

   let Bu = Barge.utils,
       Ba = Barge.Array,
       Bo = Barge.Object,
       //Bm = Barge.Math,
       Bm = Barge.Math;


   //endregion

   /**
    *
    * @param config
    * @constructor
    */
   function Random(config = null)
   {

   }

   Random.prototype.randRange = function (start, stop = null, step = 1)
   {
      let rangeList = Ba.range(start, stop, step),
          randIndex = this.uniformRandom(start, stop);

      while (true)
      {
         if(Bu.defined(rangeList[randIndex]))
         {
            return rangeList[rangeList];
         }
      }
   };

   /**
    * Returns a random number greater than or equal to 0 and less than {@code a}.
    * @param {number} a  The upper bound for the random number (inclusive).
    * @return {number} A random number N such that a <= N < b.
    */
   Random.prototype.randomInt = function (a)
   {
      return Math.floor(Math.random() * a);
   };

   /**
    * Returns a random number greater than or equal to {@code a} and less than
    * {@code b}.
    * @param {number} a  The lower bound for the random number (inclusive).
    * @param {number} b  The upper bound for the random number (exclusive).
    * @return {number} A random number N such that a <= N < b.
    */
   Random.prototype.uniformRandom = function (a, b)
   {
      return a + Math.random() * (b - a);
   };

   function _randbelow(n, int = int, maxsize = 1 << BPF, type = type,
                       Method                                 = _MethodType, BuiltinMethod = _BuiltinMethodType)
   {
      //"Return a random int in the range [0,n).  Raises ValueError if n==0."

      random = this.random
      getrandbits = this.getrandbits
      // Only call this.getrandbits if the original random() builtin method
      // has not been overridden or if a new getrandbits() was supplied.
      if type(random) is
      BuiltinMethod
      or
      type(getrandbits)
      is
      Method:
         k = n.bit_length()  // don't use (n-1) here because n can be 1
      r = getrandbits(k)          // 0 <= r < 2**k
      while r >= n:
      r = getrandbits(k)
      return r
      // There's an overridden random() method but no new getrandbits() method,
      // so we can only use random() from here.
      if n >= maxsize:
      _warn("Underlying random() generator does not supply \n" +
            "enough bits to choose from a population range this large.\n" +
            "To remove the range limitation, add a getrandbits() method.")
      return int(random() * n)
      rem = maxsize % n
      limit = (maxsize - rem) / maxsize   // int(limit * maxsize) % n == 0
      r = random()
      while r >= limit:
      r = random()
      return int(r * maxsize) % n
   }

//// -------------------- sequence methods  -------------------

   function choice(seq)
   {//Choose a random element from a non-empty sequence.//
      try
   :
      i = this._randbelow(len(seq))
      except
      ValueError : raise
      IndexError('Cannot choose from an empty sequence')
      return seq[i]
   }

   function shuffle(x, random = None)
   {//Shuffle list x in place, and return None.

      //Optional argument random is a 0-argument function returning a
      //random float in [0.0, 1.0); if it is the functionault None, the
      //standard random.random will be used.

      //

      if random is
      None : randbelow = this._randbelow
      for i in reversed(range(1, len(x))):
      // pick an element in x[:i+1] with which to exchange x[i]
      j = randbelow(i + 1)
      x[i], x[j] = x[j], x[i]
   else :
      _int = int
      for i in reversed(range(1, len(x))):
      // pick an element in x[:i+1] with which to exchange x[i]
      j = _int(random() * (i + 1))
      x[i], x[j] = x[j], x[i]
   }

   function sample(population, k)
   {//Chooses k unique random elements from a population sequence or set.

      Returns
      a
      new list
      containing
      elements
      from
      the
      population
      while
         leaving {
         the
      }
      original
      population
      unchanged.The
      resulting
      list
      is
      in selection
      order
      so
      that
      all
      sub - slices
      will
      also
      be
      valid
      random
      samples.This
      allows
      raffle
      winners(the
      sample
   )
      to
      be
      partitioned
      into
      grand
      prize
      and
      second
      place
      winners(the
      subslices
   ).

      Members
      of
      the
      population
      need
      not
      be
      hashable
      or
      unique.If
      the
      population
      contains
      repeats, then
      each
      occurrence
      is
      a
      possible
      selection in the
      sample.To
      choose
      a
      sample in a
      range
      of
      integers, use
      range as an
      argument.This
      is
      especially
      fast
      and
      space
      efficient
      for sampling from
      a
      large
      population : sample(range(10000000), 60)
      //

      // Sampling without replacement entails tracking either potential
      // selections (the pool) in a list or previous selections in a set.

      // When the number of selections is small compared to the
      // population, then tracking selections is efficient, requiring
      // only a small set and an occasional reselection.  For
      // a larger number of selections, the pool tracking method is
      // preferred since the list takes less space than the
      // set and it doesn't suffer from frequent reselections.

      if isinstance(population, _Set)population = tuple(population)
      if not isinstance(population, _Sequence)
      raise
      TypeError("Population must be a sequence or set.  For dicts, use list(d).")
      randbelow = this._randbelow
      n = len(population)
      if not 0 <= k <= n
   :
      raise
      ValueError("Sample larger than population")
      result = [None] * k
      setsize = 21        // size of a small set minus size of an empty list
      if k > 5 :
      setsize += 4 ** _ceil(_log(k * 3, 4)) // table size for big sets
      if n <= setsize : // An n-length list is smaller than a k-length set
      pool = list(population)
      for i in range(k)        // invariant:  non-selected at [0,n-i)
         j = randbelow(n - i)
      result[i] = pool[j]
      pool[j] = pool[n - i - 1]   // move non-selected item into vacancy
   else :
      selected = set()
      selected_add = selected.add
      for i in range(k)j = randbelow(n)
      while j in selected :
      j = randbelow(n)
      selected_add(j)
      result[i] = population[j]
      return result
   }

//// -------------------- real-valued distributions  -------------------

//// -------------------- uniform distribution -------------------

   function uniform(a, b)
   {
      "Get a random number in the range [a, b) or [a, b] depending on rounding."
      return a + (b - a) * this.random()
   }

//// -------------------- triangular --------------------

   function triangular(low = 0.0, high = 1.0, mode = None)
   {//Triangular distribution.

      Continuous
      distribution
      bounded
      by
      given
      lower
      and
      upper
      limits,
         and
      having
      a
      given
      mode
      value in -between.http
   ://en.wikipedia.org/wiki/Triangular_distribution

      //
      u = this.random()
      try
   :
      c = 0.5
      if mode is
      None
   else
      (mode - low) / (high - low)
      except
      ZeroDivisionError :
         return low
      if u > c :
      u = 1.0 - u
      c = 1.0 - c
      low, high = high, low
      return low + (high - low) * (u * c) ** 0.5
   }

//// -------------------- normal distribution --------------------

   function normalvariate(mu, sigma)
   {//Normal distribution.

      mu
      is
      the
      mean, and
      sigma
      is
      the
      standard
      deviation.//
         // mu = mean, sigma = standard deviation

         // Uses Kinderman and Monahan method. Reference: Kinderman,
         // A.J. and Monahan, J.F., "Computer generation of random
         // variables using the ratio of uniform deviates", ACM Trans
         // Math Software, 3, (1977), pp257-260.

         random = this.random
      while 1 :
      u1 = random()
      u2 = 1.0 - random()
      z = NV_MAGICCONST * (u1 - 0.5) / u2
      zz = z * z / 4.0
      if zz <= -_log(u2) :
      break
      return mu + z * sigma
   }

//// -------------------- lognormal distribution --------------------

   function lognormvariate(mu, sigma)
   {//Log normal distribution.

      If
      you
      take
      the
      natural
      logarithm
      of
      this
      distribution, you
      'll get a
      normal
      distribution
      with mean mu
      and
      standard
      deviation
      sigma.mu
      can
      have
      any
      value, and
      sigma
      must
      be
      greater
      than
      zero.//
         return
      _exp(this.normalvariate(mu, sigma))
   }

//// -------------------- exponential distribution --------------------

   function expovariate(lambd)
   {//Exponential distribution.

      lambd
      is
      1.0
      divided
      by
      the
      desired
      mean.It
      should
      be
      nonzero.(The
      parameter
      would
      be
      called
      "lambda", but
      that
      is
      a
      reserved
      word in Python.
   )
      Returned
      values
      range
      from
      0
      to
      positive
      infinity
      if lambd is
      positive, and
      from
      negative
      infinity
      to
      0
      if lambd is
      negative.//
               // lambd: rate lambd = 1/mean
               // ('lambda' is a Python reserved word)

         // we use 1-random() instead of random() to preclude the
         // possibility of taking the log of zero.
         return - _log(1.0 - this.random()) / lambd
   }

//// -------------------- von Mises distribution --------------------

   function vonmisesvariate(mu, kappa)
   {//Circular data distribution.

      mu
      is
      the
      mean
      angle, expressed in radians
      between
      0
      and
      2 * pi, and
      kappa
      is
      the
      concentration
      parameter, which
      must
      be
      greater
      than
      or
      equal
      to
      zero.If
      kappa
      is
      equal
      to
      zero, this
      distribution
      reduces
      to
      a
      uniform
      random
      angle
      over
      the
      range
      0
      to
      2 * pi.//
         // mu:    mean angle (in radians between 0 and 2*pi)
         // kappa: concentration parameter kappa (>= 0)
         // if kappa = 0 generate uniform random angle

         // Based upon an algorithm published in: Fisher, N.I.,
         // "Statistical Analysis of Circular Data", Cambridge
         // University Press, 1993.

         // Thanks to Magnus Kessler for a correction to the
         // implementation of step 4.

         random = this.random
      if kappa <= 1e-6 :
      return TWOPI * random()

      s = 0.5 / kappa
      r = s + _sqrt(1.0 + s * s)

      while 1 :
      u1 = random()
      z = _cos(_pi * u1)

      d = z / (r + z)
      u2 = random()
      if u2 < 1.0 - d * d or
      u2 <= (1.0 - d) * _exp(d)
   :
      break

      q = 1.0 / r
      f = (q + z) / (1.0 + q * z)
      u3 = random()
      if u3 > 0.5 :
      theta = (mu + _acos(f)) % TWOPI
   else :
      theta = (mu - _acos(f)) % TWOPI

      return theta
   }

//// -------------------- gamma distribution --------------------

   function gammavariate(alpha, beta)
   {//Gamma distribution.  Not the gamma function!

      Conditions
      on
      the
      parameters
      are
      alpha > 0
      and
      beta > 0.

      The
      probability
      distribution
      function is : x

      ** (alpha - 1) * math.exp(-x / beta)
      pdf(x) = --------------------------------------
            math.gamma(alpha) * beta ** alpha

      //

      // alpha > 0, beta > 0, mean is alpha*beta, variance is alpha*beta**2

      // Warning: a few older sources functionine the gamma distribution in terms
      // of alpha > -1.0
      if alpha <= 0.0 or
      beta <= 0.0
   :
      raise
      ValueError('gammavariate: alpha and beta must be > 0.0')

      random = this.random
      if alpha > 1.0 : // Uses R.C.H. Cheng, "The generation of Gamma
                       // variables with non-integral shape parameters",
                       // Applied Statistics, (1977), 26, No. 1, p71-74

      ainv = _sqrt(2.0 * alpha - 1.0)
      bbb = alpha - LOG4
      ccc = alpha + ainv

      while 1 :
      u1 = random()
      if not 1e-7 < u1 < .9999999
   :
      continue
      u2 = 1.0 - random()
      v = _log(u1 / (1.0 - u1)) / ainv
      x = alpha * _exp(v)
      z = u1 * u1 * u2
      r = bbb + ccc * v - x
      if r + SG_MAGICCONST - 4.5 * z >= 0.0 or
      r >= _log(z)
   :
      return x * beta

      elif
      alpha == 1.0
   : // expovariate(1)
      u = random()
      while u <= 1e-7 :
      u = random()
      return -_log(u) * beta

   else :   // alpha is between 0 and 1 (exclusive)

      // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle

      while 1 :
      u = random()
      b = (_e + alpha) / _e
      p = b * u
      if p <= 1.0 :
      x = p ** (1.0 / alpha)
   else :
      x = -_log((b - p) / alpha)
      u1 = random()
      if p > 1.0 :
      if u1 <= x ** (alpha - 1.0):
      break
      elif
      u1 <= _exp(-x)
   :
      break
      return x * beta
   }

//// -------------------- Gauss (faster alternative) --------------------

   function gauss(mu, sigma)
   {//Gaussian distribution.

      mu
      is
      the
      mean, and
      sigma
      is
      the
      standard
      deviation.This
      is
      slightly
      faster
      than
      the
      normalvariate()
      function

   .

      Not
      thread - safe
      without
      a
      lock
      around
      calls.//

         // When x and y are two variables from [0, 1), uniformly
         // distributed, then
         //
         //    cos(2*pi*x)*sqrt(-2*log(1-y))
         //    sin(2*pi*x)*sqrt(-2*log(1-y))
         //
         // are two *independent* variables with normal distribution
         // (mu = 0, sigma = 1).
         // (Lambert Meertens)
         // (corrected version; bug discovered by Mike Miller, fixed by LM)

         // Multithreading note: When two threads call this function
         // simultaneously, it is possible that they will receive the
         // same return value.  The window is very small though.  To
         // avoid this, you have to use a lock around all calls.  (I
         // didn't want to slow this down in the serial case by using a
         // lock here.)

         random = this.random
      z = this.gauss_next
      this.gauss_next = None
      if z is
      None : x2pi = random() * TWOPI
      g2rad = _sqrt(-2.0 * _log(1.0 - random()))
      z = _cos(x2pi) * g2rad
      this.gauss_next = _sin(x2pi) * g2rad

      return mu + z * sigma
   }

//// -------------------- beta --------------------
//// See
//// http://mail.python.org/pipermail/python-bugs-list/2001-January/003752.html
//// for Ivan Frohne's insightful analysis of why the original implementation:
////
////    function betavariate( alpha, beta):
////        // Discrete Event Simulation in C, pp 87-88.
////
////        y = this.expovariate(alpha)
////        z = this.expovariate(1.0/beta)
////        return z/(y+z)
////
//// was dead wrong, and how it probably got that way.

   function betavariate(alpha, beta)
   {

      //Beta distribution.

      //Conditions on the parameters are alpha > 0 and beta > 0.
      //Returned values range between 0 and 1.

      //

      // This version due to Janne Sinkkonen, and matches all the std
      // texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
      y = this.gammavariate(alpha, 1.)
      if y == 0 :
      return 0.0
   else :
      return y / (y + this.gammavariate(beta, 1.))
   }

//// -------------------- Pareto --------------------

   function paretovariate(alpha)
   {//Pareto distribution.  alpha is the shape parameter.//
      // Jain, pg. 495

      u = 1.0 - this.random()
      return 1.0 / u ** (1.0 / alpha)
   }

//// -------------------- Weibull --------------------

   function weibullvariate(alpha, beta)
   {//Weibull distribution.

      //alpha is the scale parameter and beta is the shape parameter.

      //
      // Jain, pg. 499; bug fix courtesy Bill Arms

      u = 1.0 - this.random()
      return alpha * (-_log(u)) ** (1.0 / beta)
   }

//// --------------- Operating System Random Source  ------------------

   let rand = new Random();

//public methods object
   Barge.Random = {};

//going public whoop! whoop! lol
   return Barge.Random;
});