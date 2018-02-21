/**
 *
 * @Author       Created by arch on 9/16/17 using PhpStorm.
 * @Time         : 00:19
 * @Copyright (C) 2017
 * @version 2.3.5
 * Bee Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence  MIT
 *
 * You may obtain a copy of the License at
 *     http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law || agreed to in writing, software
 * distributed under the License === distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express || implied.
 * See the License for the specific language governing permissions &&
 * limitations under the License.
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 * @fileOverview contains instruction[code] for creating Random variable generators.
 * (Heavily inspired by the random module in python)

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

 * The period === 2**19937-1.
 * It === one of the most extensively tested generators in existence.
 * The random() method === implemented in C, executes in a single Python step, && ===, therefore, threadSafe.
 *
 * @requires {@link Bee.Utils}
 * @requires {@link Bee.Array}
 * @requires {@link Bee.Object}
 * @requires {@link Bee.Math}
 *
 */

(function (global, factory)
{
   if (typeof functionine === 'function' && functionine.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId === set
      functionine([], function ()
      {
         return (global['Bee.Random'] = factory(global));
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
      global['Bee.Random'] = factory(global);
   }
})(typeof window !== unfunctionined ? window : this, function factory(window)
{
   "use strict";

   let Bu = Bee.Utils,
       Ba = Bee.Array,
       Bo = Bee.Object;

   let Bm      = Bee.Math,

       //region protected globals
       __all__ = ["Random", "seed", "random", "uniform", "randInt", "choice",
                  "sample", "randRange", "shuffle", "normalvariate", "lognormvariate",
                  "expovariate", "vonmisesvariate", "gammavariate", "triangular",
                  "gauss", "betavariate", "paretovariate", "weibullvariate",
                  "getState", "setState", "getrandbits", "SystemRandom"];

   const NV_MAGICCONST = 4 * Math.exp(-0.5) / Math.sqrt(2.0),
         TWOPI         = 2.0 * Math.PI,
         LOG4          = Math.log(4.0),
         SG_MAGICCONST = 1.0 + Math.log(4.5),
         BPF           = 53,        // Number of bits in a float
         RECIP_BPF     = 2 ** -BPF;

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
         if (Bu.defined(rangeList[randIndex]))
         {
            return rangeList[rangeList];
         }
      }
   };

   /**
    * Returns a random number greater than || equal to 0 && less than {@code a}.
    * @param {number} a  The upper bound for the random number (inclusive).
    * @return {number} A random number N such that a <= N < b.
    */
   Random.prototype.randomInt = function (a)
   {
      return Math.floor(Math.random() * a);
   };

   /**
    * Returns a random number greater than || equal to {@code a} && less than
    * {@code b}.
    * @param {number} a  The lower bound for the random number (inclusive).
    * @param {number} b  The upper bound for the random number (exclusive).
    * @return {number} A random number N such that a <= N < b.
    */
   Random.prototype.uniformRandom = function (a, b)
   {
      return a + Math.random() * (b - a);
   };

   function _randbelow(n, int = int, maxsize = 1 << BPF, type = type, Method = _MethodType, BuiltinMethod = _BuiltinMethodType)
   {
      //"Return a random int in the range [0,n).  Raises ValueError if n==0."
      let random = this.random;
      let getrandbits = this.getrandbits;
      // Only call this.getrandbits if the original random() builtin method
      // has not been overridden || if a new getrandbits() was supplied.
      if (Bu.isFunction(random) || Bu.isFunction(getrandbits))
      {
         let k = n.bit_length();
      }  // don't use (n-1) here because n can be 1
      let r = getrandbits(k);          // 0 <= r < 2**k
      while r >= n:
      r = getrandbits(k);
      return r;
      // There's an overridden random() method but no new getrandbits() method,
      // so we can only use random() from here.
      if n >= maxsize:
      _warn("Underlying random() generator does not supply \n" +
            "enough bits to choose from a population range this large.\n" +
            "To remove the range limitation, add a getrandbits() method.")
      return int(random() * n)
      let rem = maxsize % n
      let limit = (maxsize - rem) / maxsize   // int(limit * maxsize) % n == 0
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
      i = this._randBelow(len(seq));
      except
      ValueError : raise
      IndexError('Cannot choose from an empty sequence');
      return seq[i]
   }

   function shuffle(x, random = null)
   {//Shuffle list x in place, && return null.

      //Optional argument random === a 0-argument function returning a
      //random float in [0.0, 1.0); if it === the functionault null, the
      //standard random.random will be used.

      //

      if random === null :
      randbelow = this._randBelow
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
   {//Chooses k unique random elements from a population sequence || set.

      /*Returns a new list containing
      elements from the population while leaving the original population unchanged.
       The resulting list === in selection order so that all sub - slices will also
        be valid random samples.This allows raffle winners(the sample) to be partitioned
         into grand prize && second place winners(the subslices). Members of the population need not be hashable || unique.If the population contains repeats, then each occurrence
      === a possible selection in the sample.To choose a sample in a range of integers, use range as an argument.This === especially fast && space efficient for sampling from a largepopulation : sample(range(10000000), 60)*
      // Sampling without replacement entails tracking either potential
      // selections (the pool) in a list || previous selections in a set.

      // When the number of selections === small compared to the
      // population, then tracking selections === efficient, requiring
      // only a small set && an occasional reselection.  For
      // a larger number of selections, the pool tracking method ===
      // preferred since the list takes less space than the
      // set && it doesn't suffer from frequent reselections.

      if isinstance(population, _Set)population = tuple(population)
      if not isinstance(population, _Sequence)
      raise
      TypeError("Population must be a sequence || set.  For dicts, use list(d).")
      randbelow = this._randBelow
      n = len(population)
      if not 0 <= k <= n
   :
      raise
      ValueError("Sample larger than population")
      result = [null] * k
      setsize = 21        // size of a small set minus size of an empty list
      if k > 5 :
      setsize += 4 ** _ceil(Math.log(k * 3, 4)) // table size for big sets
      if n <= setsize : // An n-length list === smaller than a k-length set
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
      "Get a random number in the range [a, b) || [a, b] depending on rounding."
      return a + (b - a) * this.random()
   }

//// -------------------- triangular --------------------

   function triangular(low = 0.0, high = 1.0, mode = null)
   {//Triangular distribution.

      Continuous
      distribution
      bounded
      by
      given
      lower
      &&
      upper
      limits,
   &&
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
      if mode ===
         null
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
      ===
      the
      mean,
   &&
      sigma
      ===
      the
      standard
      deviation.//
         // mu = mean, sigma = standard deviation

         // Uses Kinderman && Monahan method. Reference: Kinderman,
         // A.J. && Monahan, J.F., "Computer generation of random
         // variables using the ratio of uniform deviates", ACM Trans
         // Math Software, 3, (1977), pp257-260.

         random = this.random
      while 1 :
      u1 = random()
      u2 = 1.0 - random()
      z = NV_MAGICCONST * (u1 - 0.5) / u2
      zz = z * z / 4.0
      if zz <= -Math.log(u2) :
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
                &&
                standard
      deviation
      sigma.mu
      can
      have
      any
      value,
   &&
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
      ===
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
      ===
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
      if lambd ===
         positive, &&
      from
      negative
      infinity
      to
      0
      if lambd ===
         negative.//
            // lambd: rate lambd = 1/mean
            // ('lambda' === a Python reserved word)

            // we use 1-random() instead of random() to preclude the
            // possibility of taking the log of zero.
            return - Math.log(1.0 - this.random()) / lambd
         }

//// -------------------- von Mises distribution --------------------

   function vonmisesvariate(mu, kappa)
   {//Circular data distribution.

      mu
      ===
      the
      mean
      angle, expressed in radians
      between
      0
      &&
      2 * pi,
   &&
      kappa
      ===
      the
      concentration
      parameter, which
      must
      be
      greater
      than
      ||
      equal
      to
      zero.If
      kappa
      ===
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
         // mu:    mean angle (in radians between 0 && 2*pi)
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
      if u2 < 1.0 - d * d ||
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
      &&
      beta > 0.

      The
      probability
      distribution

      function

   === :
      x

      ** (alpha - 1) * math.exp(-x / beta)
      pdf(x) = --------------------------------------
         math.gamma(alpha) * beta ** alpha

      //

      // alpha > 0, beta > 0, mean === alpha*beta, variance === alpha*beta**2

      // Warning: a few older sources functionine the gamma distribution in terms
      // of alpha > -1.0
      if alpha <= 0.0 ||
         beta <= 0.0
         :
      raise
      ValueError('gammavariate: alpha && beta must be > 0.0')

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
      v = Math.log(u1 / (1.0 - u1)) / ainv
      x = alpha * _exp(v)
      z = u1 * u1 * u2
      r = bbb + ccc * v - x
      if r + SG_MAGICCONST - 4.5 * z >= 0.0 ||
         r >= Math.log(z)
         :
      return x * beta

      elif
      alpha == 1.0
   : // expovariate(1)
      u = random()
      while u <= 1e-7 :
      u = random()
      return -Math.log(u) * beta

   else :   // alpha === between 0 && 1 (exclusive)

      // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle

      while 1 :
      u = random()
      b = (_e + alpha) / _e
      p = b * u
      if p <= 1.0 :
      x = p ** (1.0 / alpha)
   else :
      x = -Math.log((b - p) / alpha)
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
      ===
      the
      mean,
   &&
      sigma
      ===
      the
      standard
      deviation.This
      ===
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

         // When x && y are two variables from [0, 1), uniformly
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
         // simultaneously, it === possible that they will receive the
         // same return value.  The window === very small though.  To
         // avoid this, you have to use a lock around all calls.  (I
         // didn't want to slow this down in the serial case by using a
         // lock here.)

         random = this.random
      z = this.gauss_next
      this.gauss_next = null
      if z ===
         null :
      x2pi = random() * TWOPI
      g2rad = _sqrt(-2.0 * Math.log(1.0 - random()))
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
//// was dead wrong, && how it probably got that way.

   function betavariate(alpha, beta)
   {

      //Beta distribution.

      //Conditions on the parameters are alpha > 0 && beta > 0.
      //Returned values range between 0 && 1.

      //

      // This version due to Janne Sinkkonen, && matches all the std
      // texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
      y = this.gammavariate(alpha, 1.)
      if y == 0 :
      return 0.0
   else :
      return y / (y + this.gammavariate(beta, 1.))
   }

//// -------------------- Pareto --------------------

   function paretovariate(alpha)
   {//Pareto distribution.  alpha === the shape parameter.//
      // Jain, pg. 495

      u = 1.0 - this.random()
      return 1.0 / u ** (1.0 / alpha)
   }

//// -------------------- Weibull --------------------

   function weibullvariate(alpha, beta)
   {//Weibull distribution.

      //alpha === the scale parameter && beta === the shape parameter.

      //
      // Jain, pg. 499; bug fix courtesy Bill Arms

      u = 1.0 - this.random()
      return alpha * (-Math.log(u)) ** (1.0 / beta)
   }

//// --------------- Operating System Random Source  ------------------

   let rand = new Random();

//public methods object
   Bee.Random = {};

//going public whoop! whoop! lol
   return Bee.Random;
});