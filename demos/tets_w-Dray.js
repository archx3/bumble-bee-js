

x = ["ama", 1, {}, function foo(){}, false, null, undefined];

var myArr = [];
var myArr2 = ["sth", "2nd thing"];

var myCOnsArr = new Array();
var myConsArr2 = new Array(3);
var myConsArr2 = new Array("3", "lucius", "onnegbu");

//console.log(x);

console.log(x);

var myFunc = function ()
{
   var data = "there's some data in me";
   return data;
};



function myFunc2()
{
   data2 = "there's 2's data in me";
   return data2;
}

//console.log(data2);



//console.log("1" == 1);
//
//console.log("1" === 1);

var fact = function (num)
{
  var i = 1, result;
   console.log("num", num);

  while(num > 1)
  {
     console.log( "i =", i, " num =", num);

     num = num * i;
     num -= 1;
     i++;
  }
  return result;
};

//console.log(fact(5));


var fact = function(num)
{
   var i = 1, result = 1;
   while(num >= 1)
   {
      result = result * num;
      console.log(num, i);

      num = num - 1;
      i++;
   }
   return result;
};

console.log(fact(5));