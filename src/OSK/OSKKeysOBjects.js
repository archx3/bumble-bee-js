/**
 * Created by arch on 10/26/16.
 */

var numRowKeys = ['`|~','1|!','2|@','3|#','4|$','5|%','6|^','7|&','8|*','9|(','0|)','-|_','=|+'];
var metaKeys = {
  set1: { set1Key1 : 'tabKey,48,,Tab,smallFont'},

   set2: { set2Key1 : 'capsLock,60,,Caps Lock,light smallFont iconKey',
      set2Key2 :
      'enterKey,77,187,,smallFont iconKey lastKey'},

   set3: {set3Key1 : ',70,284,,shiftKey smallFont iconKey',
      set3Key2 : ',70,284,,shiftKey smallFont iconKey',
      set3Key3 : 'upKey,,74,,metaKey smallFont iconKey lastKey'},

   set4: { set4Key1 : ',48,,Ctrl,ctrlKey smallFont disabled',
      set4Key2 : ',48,,Alt,altKey smallFont disabled',
      set4Key3 : 'spaceBar,260,,,metaKey',
       set4Key4 : ',48,,Alt,altKey smallFont disabled',
       set4Key5 : ',48,,Ctrl,ctrlKey smallFont disabled',
       set4Key6 : 'backKey,,43,,metaKey smallFont iconKey',
       set4Key7 : 'downKey,,9,,metaKey smallFont iconKey',
       set4Key8 : 'fwdKey,,110,,metaKey smallFont iconKey lastKey'}
};



var latinQwerty = {
   row1 : { row1Key1 : 'q|Q', row1Key2 : 'w|W',
      row1Key3 : 'e|E', row1Key4 : 'r|R',
       row1Key5: 't|T',  row1Key6 : 'y|Y',
       row1Key7 : 'u|U',  row1Key8 : 'i|I',
       row1Key9 : 'o|O', row1Key10 : 'p|P'},

   row2 :{  row2Key1 : 'a|A', row2Key : 's|S',
       row2Key3 : 'd|D', row2Key4 : 'f|F', row2Key5 : 'g|G',
       row2Key6 : 'h|H', row2Key7 : 'j|J', row2Key8 : 'k|K', row2Key9 : 'l|L'},

   row3 : { row3Key1 : 'z|Z', row3Key2 : 'x|X',
       row3Key3 : 'c|C', row3Key4 : 'v|V',
       row3Key5 : 'b|B', row3Key6 : 'n|N',
       row3Key7 : 'm|M', row3Key8 : 'k|K', row3Key9 : 'l|L'}
};

var akanQwerty = {
   row1 : { row1Key2 : 'w|W',
      row1Key3 : 'e|E', row1Key4 : 'r|R',
       row1Key5: 't|T',  row1Key6 : 'y|Y',
         row1Key8 : 'i|I',
       row1Key9 : 'o|O', row1Key10 : 'p|P'},

   row2 :{  row2Key1 : 'a|A', row2Key : 's|S',
       row2Key3 : 'd|D', row2Key4 : 'f|F', row2Key5 : 'g|G',
       row2Key6 : 'h|H',  row2Key8 : 'k|K', row2Key9 : 'l|L'},

   row3 : { row3Key1 : 'u|U', row3Key2 : 'ɔ|Ɔ',
       row3Key3 : 'ɛ|Ɛ', row3Key5 : 'b|B',
      row3Key6 : 'n|N', row3Key7 : 'm|M',
      row3Key8 : 'k|K', row3Key9 : 'l|L'}
};