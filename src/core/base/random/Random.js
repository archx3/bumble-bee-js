/*
A fairly direct port of the Python `random` module to JavaScript
*/
let BaseRandom, BuiltinRandom, HighQualityRandom,
    LOG2E, NotImplementedError, POW_32,
    POW_NEG_32, Random, acos,
    bind, cos, exp,
    exports, extend, floor,
    lg, log, mod, pow, sqrt,
    indexOf          = [].indexOf,
    boundMethodCheck = function (instance, Constructor)
    {
       if (!(instance instanceof Constructor))
       { throw new Error('Bound instance method accessed before binding'); }
    };

({ log, sqrt, cos, acos, floor, pow, LOG2E, exp } = Math);

POW_32 = pow(2, 32);

POW_NEG_32 = pow(2, -32);

lg = function (x)
{
   // The log base 2, rounded down to the integer below
   return (LOG2E * log(x + 1e-10)) >> 0;
};

mod = function (x, y)
{
   let jsmod;
   if (!((jsmod = x % y) && (x > 0 ^ y > 0)))
   {
      return jsmod;
   }
   else
   {
      return jsmod + y;
   }
};

extend = function (target, ...sources)
{
   let l, len, method, name, obj;
   for (l = 0, len = sources.length; l < len; l++)
   {
      obj = sources[l];
      for (name in obj)
      {
         method = obj[name];
         target[name] = method;
      }
   }
   return target;
};

bind = function (fn, obj)
{
   return function ()
   {
      return fn.apply(obj, arguments);
   };
};

NotImplementedError = class NotImplementedError extends Error {};

BaseRandom = (function ()
{
   let E, LOG4, POW_NEG_26, POW_NEG_27, SG_MAGIC_CONST, TAU, _bits;

   class BaseRandom {
      //# Override these first four methods in a custom Random class.
      _randInt32()
      {
         // Override this method to generate a pseudorandom number
         throw new NotImplementedError;
      }

      _getState()
      {
         // Override this method to fetch the internal PRNG state. Should
         // return an Array.
         throw new NotImplementedError;
      }

      _setState(state)
      {
         // Override this method to set the internal PRNG state from the
         // argument `state`, an Array.
         throw new NotImplementedError;
      }

      _seed(...args)
      {
         // Override this method to seed the PRNG
         throw new NotImplementedError;
      }

      //# Generally no need to override the methods below in a custom class.
      //# (Under some circumstances it might make sense to implement a custom
      //# version of the `random` method or add to the constructor.)
      constructor()
      {
         this.seed = this.seed.bind(this);
         this.random = this.random.bind(this);
         this.setState = this.setState.bind(this);
         this.getState = this.getState.bind(this);
         this.uniform = this.uniform.bind(this);
         this.randRange = this.randRange.bind(this);
         this.randInt = this.randInt.bind(this);
         this.choice = this.choice.bind(this);
         this.sample = this.sample.bind(this);
         this.shuffle = this.shuffle.bind(this);
         this.gauss = this.gauss.bind(this);
         this.triangular = this.triangular.bind(this);
         this.lognormvariate = this.lognormvariate.bind(this);
         this.expovariate = this.expovariate.bind(this);
         this.vonmisesvariate = this.vonmisesvariate.bind(this);
         this.gammavariate = this.gammavariate.bind(this);
         this.betavariate = this.betavariate.bind(this);
         this.paretovariate = this.paretovariate.bind(this);
         this.weibullvariate = this.weibullvariate.bind(this);
         // bind `normalvariate` (def. below as a `gauss` alias) to the instance
         this.normalvariate = bind(this.normalvariate, this);
         // By default, just seed the PRNG with the date. Some PRNGs
         // can take longer and more complex seeds.
         this._next_gauss = null;
         this.seed(+(new Date));
      }

      seed(...args)
      {
         // Seed the PRNG.
         return this._seed(...args);
      }

      random()
      {
         let high_bits, low_bits;
         // Return a random float in the range [0, 1), with a full 53
         // bits of entropy.
         low_bits = this._randInt32() >>> 6;
         high_bits = this._randInt32() >>> 5;
         return (high_bits + low_bits * POW_NEG_26) * POW_NEG_27;
      }

      setState([_next_gauss, ...state])
      {
         this._next_gauss = _next_gauss;
         // Set the state of the PRNG. Should accept the output of `@getState`
         // as its only argument.
         return this._setState(state);
      }

      getState()
      {
         // Get the internal state of the PRNG. Returns an array of state
         // information suitable for passing into `@setState`.
         return [this._next_gauss, ...this._getState()];
      }

      _randBelow(n)
      {
         let bits, r;
         // Return a random int in the range [0,n).
         // If n > 2^32, then use floating point math
         if (n <= 0x100000000)
         {
            bits = _bits[n] || (_bits[n] = (lg(n - 1)) + 1); // memoize values for `bits`
            while (true)
            {
               r = this._randInt32() >>> (32 - bits);
               if (r < 0)
               {
                  r += POW_32;
               }
               if (r < n)
               {
                  break;
               }
            }
            return r;
         }
         else
         {
            return floor(this.random() * n);
         }
      }

      uniform(a, b)
      {
         // Return a random floating point number N such that a <= N <= b for
         // a <= b and b <= N <= a for b < a.
         return a + this.random() * (b - a);
      }

      randRange(start, stop, step)
      {
         // Return a random integer N in range `[start...stop] by step`
         if (stop === null)
         {
            return this._randBelow(start);
         }
         else if (!step)
         {
            return start + this._randBelow(stop - start);
         }
         else
         {
            return start + step * this._randBelow(floor((stop - start) / step));
         }
      }

      randInt(a, b)
      {
         // Return a random integer N in range `[a..b]`
         return a + this._randBelow(1 + b - a);
      }

      choice(seq)
      {
         // Return a random element from the non-empty sequence `seq`.
         return seq[this._randBelow(seq.length)];
      }

      sample(population, k = 1)
      {
         let i, j, l, m, n, pool, ref, ref1, ref2, ref3, results, results1, selected, val;
         // Return a `k` length list of unique elements chosen from the
         // `population` sequence. Used for random sampling without replacement.
         n = population.length;
         if (k > n)
         {
            throw new Error("can't take a sample bigger than the population");
         }
         if (k * 3 > n)
         { // for large samples, copy the
            pool = [...population]; // population as a new array
            results = [];
            for (i = l = ref = n, ref1 = n - k; -1 !== 0 &&
                                                (ref <= ref1 ? ref <= l && l < ref1 : ref >= l && l > ref1); i = l += -1)
            {
               j = this._randBelow(i);
               val = pool[j];
               pool[j] = pool[i - 1];
               results.push(val); // for small samples, treat an Array
            }
            return results;
         }
         else
         {
            selected = []; // as a set to keep track of selection
            results1 = [];
            for (i = m = 0, ref2 = k; 1 !== 0 && (0 <= ref2 ? 0 <= m && m < ref2 : 0 >= m && m > ref2); i = m += 1)
            {
               while (true)
               {
                  if (ref3 = (j = this._randBelow(n)), indexOf.call(selected, ref3) < 0)
                  {
                     break;
                  }
               }
               selected.push(j);
               results1.push(population[j]);
            }
            return results1;
         }
      }

      shuffle(x)
      {
         let i, j, l, ref, tmp;
// Shuffle the sequence x in place.
         for (i = l = ref = x.length - 1; -1 !== 0 && (ref <= 1 ? ref <= l && l <= 1 : ref >= l && l >= 1); i = l += -1)
         {
            j = this._randBelow(i + 1);
            tmp = x[i];
            x[i] = x[j];
            x[j] = tmp; // swap x[i], x[j]
         }
         return x;
      }

      gauss(mu = 0, sigma = 1)
      {
         let s, u, v, w, z;
         // Gaussian distribution. `mu` is the mean, and `sigma` is the standard
         // deviation. Notes:
         //   * uses the "polar method"
         //   * we generate pairs; keep one in a cache for next time
         if ((z = this._next_gauss) !== null)
         {
            this._next_gauss = null;
         }
         else
         {
            while (!(s && s < 1))
            {
               u = 2 * this.random() - 1;
               v = 2 * this.random() - 1;
               s = u * u + v * v;
            }
            w = sqrt(-2 * (log(s)) / s);
            z = u * w;
            this._next_gauss = v * w;
         }
         return mu + z * sigma;
      }

      triangular(low, high, mode)
      {
         let c, u;
         // Triangular distribution. See wikipedia
         if (low === null)
         {
            high = 1;
            low = 0;
         }
         else if (high === null)
         {
            high = low;
            low = 0;
         }
         if (mode === null)
         {
            c = 0.5;
         }
         else
         {
            c = (mode - low) / (high - low);
         }
         u = this.random();
         if (u <= c)
         {
            return low + (high - low) * sqrt(u * c);
         }
         else
         {
            return high - (high - low) * sqrt((1 - u) * (1 - c));
         }
      }

      lognormvariate(mu, sigma)
      {
         // Log normal distribution.
         return exp(this.normalvariate(mu, sigma));
      }

      expovariate(lambda)
      {
         // Exponential distribution.

         // `lambda` is 1.0 divided by the desired mean.  It should be nonzero.
         // Returned values range from 0 to positive infinity if lambda is positive,
         // and from negative infinity to 0 if lambda is negative.

         // we use 1 - random() instead of random() to preclude the
         // possibility of taking the log of zero.
         return (-log(1 - this.random())) / lambda;
      }

      vonmisesvariate(mu, kappa)
      {
         let a, b, c, f, r, rand, u1, u2, u3, z;
         // Circular data distribution.

         // mu is the mean angle, expressed in radians between 0 and 2*pi, and
         // kappa is the concentration parameter, which must be greater than or
         // equal to zero.  If kappa is equal to zero, this distribution reduces
         // to a uniform random angle over the range 0 to 2*pi.

         // Based upon an algorithm published in: Fisher, N.I.,
         // "Statistical Analysis of Circular Data", Cambridge
         // University Press, 1993.
         rand = this.random;
         if (kappa <= 1e-6)
         {
            return TAU * rand();
         }
         a = 1 + sqrt(1 + 4 * kappa * kappa);
         b = (1 - sqrt(2)) * a / 2 / kappa;
         r = (1 + b * b) / 2 / b;
         while (true)
         {
            u1 = rand();
            z = cos(TAU * u1 / 2);
            f = (1 + r * z) / (r + z);
            c = kappa * (r - f);
            u2 = rand();
            if (u2 < c * (2 - c) || u2 <= c * exp(1 - c))
            {
               break;
            }
         }
         u3 = rand();
         return (mod(mu, TAU)) + (u3 > 0.5 ? acos(f) : -acos(f));
      }

      gammavariate(alpha, beta)
      {
         let ainv, b, bbb, ccc, p, r, rand, u, u1, u2, v, x, z;
         // Gamma distribution.  Not the gamma function!

         // Conditions on the parameters are alpha > 0 and beta > 0.

         // The probability distribution function is:

         //             x ** (alpha - 1) * exp( -x / beta)
         //   pdf(x) =  ----------------------------------
         //                gamma(alpha) * beta ** alpha

         // alpha > 0, beta > 0, mean is alpha * beta, variance is alpha * beta**2

         // Warning: a few older sources define the gamma distribution in terms
         // of alpha > -1
         rand = this.random;
         if (alpha > 1)
         {
            // Uses R.C.H. Cheng, "The generation of Gamma
            // variables with non-integral shape parameters",
            // Applied Statistics, (1977), 26, No. 1, p71-74
            ainv = sqrt(2 * alpha - 1);
            bbb = alpha - LOG4;
            ccc = alpha + ainv;
            while (true)
            {
               u1 = rand();
               if (!((1e-7 < u1 && u1 < 1 - 1e-7)))
               {
                  continue;
               }
               u2 = 1 - rand();
               v = (log(u1 / (1 - u1))) / ainv;
               x = alpha * exp(v);
               z = u1 * u1 * u2;
               r = bbb + ccc * v - x;
               if (r + SG_MAGIC_CONST - 4.5 * z >= 0.0 || r >= log(z))
               {
                  break;
               }
            }
            return beta * x;
         }
         else if (alpha === 1)
         {
            while (true)
            {
               // expovariate(1)
               u = rand();
               if (u > 1e-7)
               {
                  break;
               }
            }
            return -beta * log(u); // alpha is between 0 and 1 (exclusive)
         }
         else
         {
            while (true)
            {
               // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
               u1 = rand();
               b = (E + alpha) / E;
               p = b * u1;
               u2 = rand();
               if (p > 1)
               {
                  x = -log((b - p) / alpha);
                  if (u2 <= pow(x, alpha - 1))
                  {
                     break;
                  }
               }
               else
               {
                  x = pow(p, 1 / alpha);
                  if (u2 <= exp(-x))
                  {
                     break;
                  }
               }
            }
            return beta * x;
         }
      }

      betavariate(alpha, beta)
      {
         let y;
         // Beta distribution.

         // Conditions on the parameters are alpha > 0 and beta > 0.
         // Returned values range between 0 and 1.

         // This version due to Janne Sinkkonen, and matches all the std
         // texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
         y = this.gammavariate(alpha, 1);
         if (y === 0)
         {
            return 0;
         }
         else
         {
            return y / (y + this.gammavariate(beta, 1));
         }
      }

      paretovariate(alpha)
      {
         let u;
         // Pareto distribution.  alpha is the shape parameter.
         u = 1 - this.random();
         return 1 / (pow(u, 1 / alpha)); // Jain, pg. 495
      }

      weibullvariate(alpha, beta)
      {
         let u;
         // Weibull distribution.

         // alpha is the scale parameter and beta is the shape parameter.
         u = 1 - this.random();
         return alpha * (pow(-log(u, 1 / beta))); // Jain, pg. 499; bug fix by Bill Arms
      }

   };

   POW_NEG_26 = pow(2, -26);

   POW_NEG_27 = pow(2, -27);

   _bits = {};

   BaseRandom.prototype.normalvariate = BaseRandom.prototype.gauss; // Alias for the `gauss` function

   TAU = 2 * Math.PI;

   LOG4 = log(4);

   SG_MAGIC_CONST = 1 + log(4.5);

   E = { Math };

   return BaseRandom;

}).call(this);

Random = class Random extends BaseRandom {
   // Use a Multiply With Carry PRNG, with an XOR-shift successor
   // Both from Numerical Recipes, 3rd Edition [H1, G1]
   _randInt32()
   {
      let z;
      this.x = 62904 * (this.x & 0xffff) + (this.x >>> 16);
      this.y = 41874 * (this.y & 0xffff) + (this.y >>> 16);
      z = (this.x << 16) + this.y;
      z ^= z >>> 13;
      z ^= z << 17;
      z ^= z >>> 5;
      return z;
   }

   _seed(j)
   {
      // these two numbers were arbitrarily chosen
      this.x = 3395989511 ^ j;
      return this.y = 1716319410 ^ j;
   }

   _getState()
   {
      return [this.x, this.y];
   }

   _setState([x1, y1])
   {
      this.x = x1;
      this.y = y1;
   }

};

HighQualityRandom = class HighQualityRandom extends BaseRandom {
   // From Numerical Recipes, 3rd Edition
   _randInt32()
   {
      let v, x, y;
      x = this.u = this.u * 2891336453 + 1640531513;
      v = this.v;
      v ^= v >>> 13;
      v ^= v << 17;
      v ^= v >>> 5;
      this.v = v;
      y = this.w1 = 33378 * (this.w1 & 0xffff) + (this.w1 >>> 16);
      this.w2 = 57225 * (this.w2 & 0xffff) + (this.w2 >>> 16);
      x ^= x << 9;
      x ^= x >>> 17;
      x ^= x << 6;
      y ^= y << 17;
      y ^= y >>> 15;
      y ^= y << 5;
      return (x + v) ^ (y + this.w2);
   }

   _seed(j)
   {
      this.w1 = 521288629;
      this.w2 = 362436069;
      return this.v = this.u = j ^ 2244614371;
   }

   _getState()
   {
      return [this.u, this.v, this.w1, this.w2];
   }

   _setState([u4, v1, w1, w2])
   {
      this.u = u4;
      this.v = v1;
      this.w1 = w1;
      this.w2 = w2;
   }

};

BuiltinRandom = (function ()
{
   let _lowbits, _rand;

   class BuiltinRandom extends BaseRandom {
      constructor()
      {
         super(...arguments);
         // Use the built-in PRNG. Note that with the built-in
         // PRNG, which is implementation dependant, there is no
         // way to set the seed or save/restore state.
         this._seed = this._seed.bind(this);
      }

      _seed(j)
      { // ignore seed
         boundMethodCheck(this, BuiltinRandom);
      }

      _randInt32()
      {
         return (_rand() * POW_32) | 0;
      }

   };

   // Test to see if our JavaScript engine creates random numbers
   // with more than 32 bits of entropy. If so, just use it directly.
   // Otherwise, combine two calls to `random` into each invocation.
   _rand = Math.random;

   _lowbits = function ()
   {
      return (_rand() * pow(2, 64)) | 0; // `| 0` will chop out bits > 32
   };

   if (_lowbits() | _lowbits() | _lowbits())
   { // ~1e-18 chance of false negative
      BuiltinRandom.prototype.random = _rand;
   }
   else
   {
      BuiltinRandom.prototype.random = function ()
      {
         return _rand() * POW_NEG_32 + _rand();
      };
   }

   return BuiltinRandom;

}).call(this);

exports = exports || window || this;

extend(exports, { NotImplementedError, BaseRandom, Random, HighQualityRandom, BuiltinRandom });
