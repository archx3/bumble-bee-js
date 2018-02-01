//
//
//x = ["ama", 1, {}, function foo(){}, false, null, undefined];
//
//var myArr = [];
//var myArr2 = ["sth", "2nd thing"];
//
//var myCOnsArr = new Array();
//var myConsArr2 = new Array(3);
//var myConsArr2 = new Array("3", "lucius", "onnegbu");
//
////console.log(x);
//
//console.log(x);
//
//var myFunc = function ()
//{
//   var data = "there's some data in me";
//   return data;
//};
//
//
//
//function myFunc2()
//{
//   data2 = "there's 2's data in me";
//   return data2;
//}
//
////console.log(data2);
//
//
//
////console.log("1" == 1);
////
////console.log("1" === 1);
//
//var fact = function (num)
//{
//  var i = 1, result;
//   console.log("num", num);
//
//  while(num > 1)
//  {
//     console.log( "i =", i, " num =", num);
//
//     num = num * i;
//     num -= 1;
//     i++;
//  }
//  return result;
//};
//
////console.log(fact(5));
//
//
//var fact = function(num)
//{
//   var i = 1, result = 1;
//   while(num >= 1)
//   {
//      result = result * num;
//      console.log(num, i);
//
//      num = num - 1;
//      i++;
//   }
//   return result;
//};
//
//console.log(fact(5));
"use strict";


function swapArrVals(arr, index1, index2)
{
   var temp = arr[index2];
   arr[index2] = arr[index1];
   arr[index1] = temp;
   temp = null;
}

var myArr = [1, 5, 8, 3, 4, 2];

function sort(arr, sortingFn, asc = true)
{
   var len = arr.length;

   for (var i = 0; i < len; i++)
   {
      for (var j = 0; j < len; j++)
      {
         if (asc)
         {
            if (arr[j] > arr[j + 1])
            {swapArrVals(arr, j, j + 1);}
         }
         else
         {
            if (arr[j] < arr[j + 1])
            {swapArrVals(arr, j, j + 1);}
         }
      }
   }

   return arr;
}

//console.log(sort(myArr));

var arr = [1, 13, 24, 24, 5, 68, 34, 59,44];

var evenNums;
evenNums = arr.filter(function (val)
                      {
                         return val % 2 === 0
                      });

//console.log(evenNums);

function filter(arr, fn)
{
   var resultingArray = [];

   arr.forEach(function (val, i)
   {
      if (fn.call(null, val, i, arr))
      {
         resultingArray.push(val);
      }
   });
   return resultingArray
}


function map(arr, fn)
{
   var resultingArray = [];

   arr.forEach(function (val, i)
               {
                  resultingArray.push(fn.call(null, val, i, arr));
               });
   return resultingArray
}



//console.log(filter(arr, function (val)
//{
//   return val % 2 === 0
//}));
//
//var forecast = [
//   {day : "Monday", rain : false, humidity : 100},
//   {day : "Tuesday", rain : true, humidity : 100},
//   {day : "Wednesday", rain : true, humidity : 100},
//   {day : "Thursday", rain : false, humidity : 25},
//   {day : "Friday", rain : true, humidity : 100},
//   {day : "Saturday", rain : false, humidity : 15},
//   {day : "Sunday", rain : false, humidity : 100}
//];
//
//console.log(filter(forecast, function (val)
//{
//    return val.rain === true;
//}));
//
//console.log(forecast.map(function (val)
//                         {
//                            return val.humidity;
//                         }));
//
//console.log(map(forecast, function (val)
//{
//    return val.humidity;
//}));


//console.log([1, 2, 3, 4, 5].map(function (val) {return val * 2;}).map(function (val) {return val + 3;}));

var mDArr = [
   [
      [1, 4, 45, 6], ["tf"], [343]
   ],
   [
      [2, 7, 0, 10], ["homiee"],
      ["i hate shitty ass'ts, esp in a shithole country"], 45
   ],
   49
];

var farr = mDArr.reduce(function(acc, curr){return acc.concat(curr);}).reduce(function (acc, curr) {return acc.concat(curr);});
//console.log(farr);



var nums = [2, 52, 42, 8,  37, 11, 9, 22, 30];

console.log(nums.reduce(function (acc, curr)
                        {
                           if( curr > acc)
                           {
                              return acc = curr;
                           }
                           else{
                              return acc;
                           }
                        }, 0));

























