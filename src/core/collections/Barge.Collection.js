/**
 * Created by ARCH on 14/10/2016.
 */
var Bee = Bee || {};
Bee.Collection = Bee.Collection || {};

Bee.Collection.Dictionary = {
   dataStore : new Array(),
   /**
    * @param key
    * @param value
    */
   add : function (key, value)
   {
      this.dataStore[key] = value;
   },
   /**
    * @param key
    * @returns {*}
    */
   find : function (key)
   {
      return this.dataStore[key];
   },
   /**
    * @param key
    */
   remove : function (key)
   {
      delete this.dataStore[key];
   },
   /**
    *
    */
   showAll : function ()
   {
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            console.log(key + " -> " + this.dataStore[key] + " "  );
         }
      }
   },
   /**
    * @returns {number}
    */
   count : function () {
      var n = 0;
      for (var key in Object.keys(this.dataStore))
      {
         ++n;
      }
      return n;
   },
   /**
    *
    * @returns {Array}
    */
   getKeysAndVals : function ()
   {
      var keyVals = [];
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            keyVals.push(key + "|" + this.dataStore[key]);
         }
      }
      return keyVals;
   },
   /**
    *
    * @returns {Array}
    */
   getVals : function ()
   {
      var Vals = [];
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            Vals.push(this.dataStore[key]);
         }
      }
      return Vals;
   },
   /**
    *
    * @returns {Array}
    */
   getKeys : function ()
   {
      var keys = [];
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            keys.push(key);
         }
      }
      return keys;
   },
   /**
    * @param val {Iterable}
    * @returns {string}
    */
   getKeyFromVal : function (val)
   {
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            if(val == this.dataStore[key])
            {
               return key;
            }
         }
      }
   },

   /**
    *@Param vals {Array|String|Iterable}
    *@returns {Array}
    */
   getKeysFromVals : function (vals)
   {
      var keyVals = [];

      if(typeof vals === "string")
      {
         vals = vals.split(",");
      }
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            for( var i = 0; i < vals.length; i++)
            {
               if(vals[i] == this.dataStore[key])
               {
                  keyVals.push(key);
               }
            }
         }
      }
      return keyVals;
   },

   /**
    * returns the total value of a dictionary
    *@returns {*}
    */
   getAggregate : function ()
   {
      var total = 0;
      for(var key in this.dataStore)
      {
         /*if(typeof this.dataStore[key] != "function")
         {
            total += this.dataStore[key];
         }*/
         if(this.dataStore.hasOwnProperty(key) )
         {
            total += this.dataStore[key];
         }
      }
      return total;
   }

};

Bee.Collection.DictionaryM = {
   dataStore : new Map(),

   /**
    * @param key
    * @param value
    */
   add : function (key, value)
   {
      this.dataStore.set(key, value);
   },
   /**
    * @param key
    * @returns {*}
    */
   find : function (key)
   {
      return this.dataStore.get(key);
   },
   /**
    * @param key
    */
   remove : function (key)
   {
      return this.dataStore.delete(key);
   },
   /**
    *
    */
   showAll : function ()
   {
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            console.log(key + " -> " + this.dataStore[key] + " "  );
         }
      }
   },
   /**
    *
    * @returns {number}
    */
   count : function ()
   {
      /*var n = 0;
      for (var key in Object.keys(this.dataStore))
      {
         ++n;
      }
      return n;*/
      return this.dataStore.size;
   },
   /**
    *
    * @returns {Iterator.<*>|Array}
    */
   getKeysAndVals : function ()
   {
      /*var keyVals = [];
      for(var key in this.dataStore)
      {
         if(this.dataStore.hasOwnProperty(key))
         {
            keyVals.push(key + "|" + this.dataStore[key]);
         }
      }
      return keyVals;*/

      return this.dataStore.entries();
   },
   /**
    *
    * @returns {Iterator.<V>|Array}
    */
   getVals : function ()
   {
      return this.dataStore.values();
   },
   /**
    *
    * @returns {Array}
    */
   getKeys : function ()
   {
      return this.dataStore.keys();
   },
   /**
    *
    * @param val
    * @returns {*}
    */
   getKeyFromVal : function (val)
   {
      for (let [key, value] of this.dataStore)
      {
         if (value === val)
         {
            return key;
         }
      }
   },

   /**
    *@Param vals {Array|String|Iterable}
    *@returns {Array}
    */
   getKeysFromVal : function (val)
   {
      var keyVals = [];

      for (let [key, value] of this.dataStore)
      {
         if (value === val)
         {
            keyVals.push(key);
         }
      }
      return keyVals;
   },

   /**
    * returns the total value of a dictionary
    *@returns {*}
    */
   getAggregate : function ()
   {
      var total = 0;
      for(var key in this.dataStore)
      {
         /*if(typeof this.dataStore[key] != "function")
          {
          total += this.dataStore[key];
          }*/
         if(this.dataStore.hasOwnProperty(key) )
         {
            total += this.dataStore[key];
         }
      }
      return total;
   }

};

var myDat = Bee.Collection.Dictionary;

myDat.add("name", "KOfi");
myDat.add("Age", "23");
myDat.add("area", "Ta");
myDat.add("School", "Ica");


/*console.log(myDat.getAggregate());
console.log(myDat.getKeyFromVal("Ica"));
console.log(myDat.getKeys());
console.log(myDat.getKeysAndVals());
console.log(myDat.showAll());*/

