(function ()
{

   // Cache some selectors
   let Bu = Bee.Utils,
       Ba = Bee.Array,
       Bs = Bee.String,
       Bm = Bee.Math,
       Bd = Bee.Widget;

   var clock       = Bd.getEl('#clock'),
       alarm       = clock.querySelector('.alarm'),
       ampm        = clock.querySelector('.ampm'),
       dialog      = Bd.getEl('#alarm-dialog').parentElement,
       alarm_set   = Bd.getEl('#alarm-set'),
       alarm_clear = Bd.getEl('#alarm-clear'),
       time_is_up  = Bd.getEl('#time-is-up').parentElement;

   // This will hold the number of seconds left
   // until the alarm should go off
   var alarm_counter = -1;

   // Map digits to their names (this will be an array)
   var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

   // This object will hold the digit elements
   var digits = {};

   // Positions for the hours, minutes, and seconds
   var positions = [
      'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
   ];

   // Generate the digits with the needed markup,
   // and add them to the clock

   var digit_holder = clock.querySelector('.digits');

   Ba.forEach(positions, function (position, j)
   {

      if (position === ':')
      {
         digit_holder.appendChild(Bd.createEl('div', { className : "dots" }));
      }
      else
      {

         var pos = Bd.createEl('<div>');

         for (var i = 1; i < 8; i++)
         {
            pos.append(Bd.createEl('span', { className : "d" + i }));
         }

         // Set the digits as key:value pairs in the digits object
         digits[position] = pos;

         // Add the digit elements to the page
         digit_holder.appendChild(pos);
      }

   });

   // Add the weekday names

   var weekday_names  = 'MON TUE WED THU FRI SAT SUN'.split(' '),
       weekday_holder = clock.querySelector('.weekdays');

   Ba.forEach(weekday_names, function (day)
   {
      weekday_holder.appendChild(Bd.createEl('span', { innerHTML : day }));
   });

   var weekdays = clock.querySelectorAll('.weekdays span');

   // Run a timer every second and update the clock

   let snoozer = null;

   function moment()
   {
      let now  = new Date(),
          h    = now.getHours(),
          m    = now.getMinutes(),
          s    = now.getSeconds(),
          d    = now.getDay(),
          amPm = h >= 12 ? 'pm' : 'am';

      h = Bs.addLeadingZeros(h, 2);
      m = Bs.addLeadingZeros(m, 2);
      s = Bs.addLeadingZeros(s, 2);

      //console.log(time);
      return h + m + s + d + amPm
   }

   (function update_time()
   {

      // Use moment.js to output the current time as a string
      // hh is for the hours in 12-hour format,
      // mm - minutes, ss-seconds (all with leading zeroes),
      // d is for day of week and A is for AM/PM

      var now = moment();

      //console.log(now);
      digits.h1.className = digit_to_name[now[0]];

      digits.h2.className = digit_to_name[now[1]];

      digits.m1.className = digit_to_name[now[2]];
      digits.m2.className = digit_to_name[now[3]];
      digits.s1.className = digit_to_name[now[4]];
      digits.s2.className = digit_to_name[now[5]];

      //console.log(digits);
      // The library returns Sunday as the first day of the week.
      // Stupid, I know. Lets shift all the days one position down,
      // and make Sunday last

      var dow = now[6];
      dow--;

      // Sunday!
      //if (dow < 0)
      //{
      //   // Make it last
      //   dow = 6;
      //}

      // Mark the active day of the week
      //Bd.removeClass(weekdays, 'active');

      //var e= document.getElementsByClassName('menu');
      //alert(eq.call(Bd.addClass(weekdays, 'active'),1));

      Bd.addClass(weekdays[dow], 'active');

      //eq(dow);

      // Set the am/pm text:
      ampm.innerHTML = now[7] + now[8];

      // Is there an alarm set?

      if (alarm_counter > 0)
      {

         // Decrement the counter with one second
         alarm_counter--;

         // Activate the alarm icon
         Bd.addClass(alarm, 'active');
      }
      else if (alarm_counter === 0)
      {

         //time_is_up.fadeIn();
         //Bd.openWin(time_is_up);
         Bee.DiceyDialog.alert({
                                    t        : "Time is up",
                                    onAffirm : function ()
                                    {
                                       clearInterval(snoozer);
                                    }
                                 });

         // Play the alarm sound. This will fail
         // in browsers which don't support HTML5 audio

         //var ringer = Bd.getEl('#alarm-ring').children[1];

         try
         {
            var ringer = Bd.getEl('#alarm-ring');
            //console.log(ringer);

            ringer.play();

            snoozer = setInterval(function ()
                                  {
                                     ringer.play();
                                  }, 100)
            //Bd.getEl('#alarm-ring').play();
         }
         catch (e)
         {}

         alarm_counter--;
         Bd.removeClass(alarm, 'active');
      }
      else
      {
         // The alarm has been cleared
         Bd.removeClass(alarm, 'active');
      }

      // Schedule this function to be run again in 1 sec
      setTimeout(update_time, 1000);

   })();

   // Switch the theme
   Bd.getEl('#switch-theme').onclick = function ()
   {
      //console.log(clock);
      Bd.toggleClass(clock, 'light', 'dark');
   };

   // Handle setting and clearing alamrs

   Bd.getEl('.alarm-button').onclick = function ()
   {

      // Show the dialog
      //dialog.trigger('show');
      //Bd.openWin(dialog);
      openDialog()
      //Bee.DiceyDialog.alert({
      //                           t        : "Time is up",
      //                           onAffirm : function ()
      //                           {
      //
      //                           }
      //                        });

   };

   //dialog.querySelector('.close').onclick = function ()
   //                            {
   //                               //dialog.trigger('hide')
   //                               Bd.closeWin(dialog);
   //                            };

   //dialog.click(function (e)
   //             {
   //
   //                // When the overlay is clicked,
   //                // hide the dialog.
   //
   //                if ($(e.target).is('.overlay'))
   //                {
   //                   // This check is need to prevent
   //                   // bubbled up events from hiding the dialog
   //                   dialog.trigger('hide');
   //                }
   //             });
   let inputs = dialog.querySelectorAll("input");

   alarm_set.onclick = function ()
   {

      var valid = true, after = 0,
          to_seconds          = [3600, 60, 1];



      dialog.querySelector('input');

      Ba.forEach(inputs, function (input, i)
      {
         // Using the validity property in HTML5-enabled browsers:

         if (this.validity && !this.validity.valid)
         {
            // The input field contains something other than a digit,
            // or a number less than the min value

            valid = false;
            this.focus();

            return false;
         }

         after += to_seconds[i] * (Bu.pInt(input.value));
      });

      if (!valid)
      {
         alert('Please enter a valid number!');
         return;
      }

      if (after < 1)
      {
         alert('Please choose a time in the future!');
         return;
      }

      alarm_counter = after;
      //dialog.trigger('hide');
      Bd.closeWin(dialog);
   };

   alarm_clear.onclick = function ()
   {
      alarm_counter = -1;

      //dialog.trigger('hide');
      Bd.closeWin(dialog);
   };

   // Custom events to keep the code clean
   //dialog.on('hide', function ()
   //{
   //
   //   dialog.fadeOut();
   //
   //})
   //dialog.on('show', function ()
   //{
   //
   //   openDialog()
   //
   //});

   time_is_up.onclick = function ()
   {
      //time_is_up.fadeOut();

      clearInterval(snoozer);
      Bd.closeWin(time_is_up);

   };

   function openDialog()
   {
      // Calculate how much time is left for the alarm to go off.

      var hours = 0, minutes = 0, seconds = 0, tmp = 0;
      if (alarm_counter > 0)
      {

         // There is an alarm set, calculate the remaining time

         tmp = alarm_counter;

         hours = Math.floor(tmp / 3600);
         tmp = tmp % 3600;

         minutes = Math.floor(tmp / 60);
         tmp = tmp % 60;

         seconds = tmp;
      }

      // Update the input fields
      //dialog.find('input').eq(0).val().end().eq(1).val(minutes).end().eq(2).val(seconds);

      inputs[0].vaue = hours;
      inputs[1].vaue = minutes;
      inputs[2].vaue = seconds;

      Bd.openWin(dialog);
   }

}());