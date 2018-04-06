/** Copyright (c) 2014 WaY **/

let ZenParser = (function ()
{
   //Elements to be made public and reachable from out of this namespace
   let _public = {};

   let indentation = {
      TWO_SPACES   : "  ",
      THREE_SPACES : "   ",
      TAB          : "\t",
   };

   _public.options = {
      //if true multiplied objects will be single-instance
      //referenced many times. This option should be turned of
      //if we want to set different field values for multiplied
      //elements we have to set this option to false.
      // NOTICE!!
      //If you enable this option multipled elements enumeration by '%' sign will be disabled!
      indentChar            : indentation.THREE_SPACES,
      multiply_by_reference : false,
   };

   /* ******************************************
    * Definition of characters with special meaning in script.
    *   special_chars - characters that are used to signify
    *					 attributes or relations.
    *	 white_spaces  - characters to be ignored by script.
    *					 They can break words.
    *	 word_chars	   - characters that could be part of word.
   *********************************************/
   let special_chars = "$#.[]+>(){}^%";
   let white_spaces = " \t\r\v\n\f";
   let word_chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890%_-\\";
   let digits = "1234567890";
   let number_negation = "-";
   let enum_char = "%";
   let special_char_indicator = "\\";

   /* ******************************************
    * Void HTML elements are elements that do not have end tag.
    * every void element has opening tag but CANNOT (since HTML5)
    * have ending tag
   *********************************************/
   let void_tags = [
      "area", "base", "br", "col", "command",
      "embed", "hr", "img", "input", "keygen",
      "link", "meta", "param", "source", "track", "wbr"
   ];

   //This is result of parsing zen syntax. Array of this elements will be returned as a result.
   //Each script using zen parser can decide how to use/create parsed elements.
   //<br/> is also an element!
   let Elem = _public.Elem = function (tag)
   {

      //Element tag like "body", "a", "b", "br". Custom tags are acceptable!
      this.tag = tag;

      //If true element is void what means it's unclosing element (like input or br)
      this.is_void = is_void_element(this.tag);

      // Name of element - content after $ sign without '$'.
      // This should be intuitive name for easy usage. Can be ignored in some implementations.
      // This is for internal use in some implementations. Look at HTML generator example for
      // great opportunity this operator creates. It's used in Component Base Application to
      // make easy element references. It's not taken from element id because it could repeat in
      // multiple object instances (every  photo in gallery could have "FRAME" $ name).
      this.$ = "";

      // The text inside an element a[href=#]{This is element text!}
      // <br/> will be parsed as part of an text if we write:
      //   span{first line<br/>second line}
      // the text value will be exactly EQUAL to:
      //   "first line<br/>second line"
      // NOT:
      //  "first line\nsecond line"
      // this is because html apply \n only between <pre> tags.
      // check out element.insertAdjacentHTML to proper insert text containing html tags
      // but please do not use it to other adjustments than text modifiers.
      this.text = "";

      //Attributes of element written as: {name: value}.
      //id and class are attributes and will be placed in here.
      this.attr = {};

      //Array of Elem instances.
      this.children = [];

      return this;
   };

   Elem.prototype.addAttribute =
      function (name, value)
      {
         if (is_array(name))
         {
            if (name.length !== value.length) //if value isn't array value.length isn't defined
            {
               throw new Error("Invalid values passed to Elem.addAttribute! arguments!");
            }

            let n = name.length;
            while (n--)
            {
               this.attr[name[n]] = value[n] || "";
            }

            return;
         }

         if (typeof name !== "string")
         {
            throw new Error("Invalid name delivered to Elem.addAttribute method!");
         }

         if (typeof value !== "string")
         {
            throw new Error("Invalid value delivered to Elem.addAttribute method!");
         }

         this.attr[name] = value || "";

      };

   Elem.prototype.removeAttribute =
      function (name)
      {
         if (is_array(name))
         {
            for (let n in name)
            {
               delete this.attr[name[n]];
            }

            return;
         }

         if (typeof name !== "string")
         {
            throw new Error("Invalid values passed to Elem.removeAttribute! arguments: " + JSON.stringify(arguments));
         }

         delete this.attr[name];
      };

   Elem.prototype.addChild =
      function (child)
      {
         if (child instanceof ElemArray)
         {
            child = child.elems;
         }

         if (this.is_void)
         {
            throw new Error("Cannot add child to the void element!");
         }

         if (!is_array(child))
         {
            child = [child];
         }

         for (let i in child)
         {
            this.children.push(child[i]);
         }
      };

   /**
    *
    * @param skip_children if true any of children will be proceeded to html
    * @param indent
    * @returns {string}
    */
   Elem.prototype.toHTML = function (skip_children, indent)
   {
      let result = "";

      if (!indent)
      {
         indent = 0;
      }

      //Firstly we have to indent our code as in param given
      for (let i = 0; i < indent; ++i)
      {
         //result += "\t";
         result += _public.options.indentChar;
      }

      //Add html element with attributes like "<body bgcolor="#afafaf">
      result += "<" + this.tag + " ";
      result += html_attr_list(this.attr);

      //We have to remember to close void elements for XHTML compatibility
      if (this.is_void)
      {
         result += "/";
      }

      result += ">";

      //Print internal javascript identifier for debugging purposes
      if (this.$)
      {
         result += "<!-- identified as: " + this.$ + " -->";
      }

      //Add element text before the children for easy read
      if (this.text)
      {
         result += this.text;
      }

      //Not that void element cannot have children so the part inside this
      //condition have no sense for them. The void elements children containment
      //is tested in parse phase.
      if (!this.is_void)
      {
         if (!skip_children)
         {
            let children = this.children;
            let n = children.length;

            //Start new line for first child. While current element isn't closed
            //we didn't start new line yet.
            if (n)
            {
               result += "\n";
            }

            //Now we have to parse every child like an element using current function.
            //Note that we have to increase indent couse our child need additional tab
            //for beauty alignment.
            for (let i = 0; i < n; ++i)
            {
               result += children[i].toHTML(false, indent + 1);
            }

            //If we had some children our ending tag is placed in another line
            //so we have to indent it.
            if (n)
            {
               for (let i = 0; i < indent; ++i)
               {
                  //result += "\t";
                  result += _public.options.indentChar;
               }
            }
         }

         //At the end we have to print ending tag.
         //Note that it's placed inside of void element condition
         //but outside of skip_children condition.
         //This is because we don't want to close void elements.
         //but not void elements with child parse disabled still
         //have to be closed.
         result += "</" + this.tag + ">\n";
      }

      return result;
   };

   /**
    *
    * @param skip_childs if true any of children will be proceeded to html
    * @param id_field_name  name of field that will store element id
    * (the value of $ element field). Any other value than string will be ignored
    * @returns {HTMLAnchorElement | HTMLAppletElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLBaseFontElement |
    *    HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement |
    *    HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDirectoryElement | HTMLDivElement |
    *    HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFontElement | HTMLFormElement | HTMLFrameElement |
    *    HTMLFrameSetElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement |
    *    HTMLImageElement | HTMLInputElement | HTMLUnknownElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement |
    *    HTMLLinkElement | HTMLPreElement | HTMLMapElement | HTMLMarqueeElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement
    *    | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement |
    *    HTMLParamElement | HTMLPictureElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSourceElement |
    *    HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableDataCellElement |
    *    HTMLTemplateElement | HTMLTextAreaElement | HTMLTableHeaderCellElement | HTMLTimeElement | HTMLTitleElement |
    *    HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement | MSHTMLWebViewElement}
    */
   Elem.prototype.toDOM = function (skip_childs, id_field_name)
   {
      let result = document.createElement(this.tag);

      if (this.text)
      {
         result.appendChild(document.createTextNode(this.text));
      }

      for (let name in this.attr)
      {
         result[(name === "class" ? "className" : name)] = this.attr[name];
      }

      if (typeof id_field_name === "string")
      {
         result[id_field_name] = this.$;
      }

      if (!skip_childs && this.children.length)
      {
         let n = this.children.length;
         for (let i = 0; i < n; ++i)
         {
            result.appendChild(this.children[i].toDOM(skip_childs, id_field_name));
         }
      }

      return result;
   };

   //All ElemArray methods (except push) are applied to all of the elems on the stack.
   let ElemArray = _public.ElemArray = function ()
   {
      this.elems = [];

      this.pop = this.elems.pop.bind(this.elems);

      return this;
   };

   ElemArray.prototype.addAttribute = function (name, value)
   {
      if (typeof name !== "string")
      {
         throw new Error("Invalid name delivered to ElemArray.addAttribute method!");
      }

      if (typeof value !== "string")
      {
         throw new Error("Invalid value delivered to ElemArray.addAttribute method!");
      }

      for (let i in this.elems)
      {
         this.elems[i].addAttribute(name, value);
      } //validation in there
   };

   ElemArray.prototype.removeAttribute = function (name)
   {
      if (typeof name !== "string")
      {
         throw new Error("Invalid name delivered to ElemArray.removeAttribute method!");
      }

      for (let i in this.elems)
      {
         this.elems[i].removeAttribute(name);
      } //validation in there
   };

   ElemArray.prototype.addChild = function (child)
   {
      if (!(child instanceof Elem || child instanceof ElemArray))
      {
         throw new Error("Invalid argument delivered to ElemArray.addChild method!");
      }

      for (let i in this.elems)
      {
         this.elems[i].addChild(child);
      } //validation in there
   };

   ElemArray.prototype.push = ElemArray.prototype.push_array = function ()
   {
      for (let i in arguments)
      {
         if (arguments[i] instanceof Elem)
         {
            this.elems.push(arguments[i]);
         }
         else if (arguments[i] instanceof ElemArray)
         {
            this.elems.push.apply(this.elems, arguments[i].elems);
         }
         else if (is_array(arguments[i]))
         {
            this.elems.push.apply(this.elems, arguments[i]);
         }
         else
         {
            throw new Error("Invalid value delivered to ElemArray.push method!");
         }
      }
   };

   ElemArray.prototype.toHTML =
      function (skip_childs)
      {
         let n = this.elems.length;
         let html = "";

         for (let i = 0; i < n; ++i)
         {
            html += this.elems[i].toHTML(skip_childs);
         }

         return html;
      };

   ElemArray.prototype.toDOM =
      function (id_field_name /*name of field that will store element id (the value of $ element field).*/)
      {
         let result = document.createDocumentFragment();
         let elems = this.elems;

         let n = elems.length;
         for (let i = 0; i < n; ++i)
         {
            result.appendChild(elems[i].toDOM(false, id_field_name));
         }

         return result;
      };

   _public.parse =
      function (abbr /*abbreviation in zen syntax*/)
      {
         let result = parse_group(abbr, 0, 0);
         return result.result;
      };

   _public.toHTML =
      function (abbr /*abbreviation in zen syntax*/)
      {
         return parse_group(abbr, 0, 0).result.toHTML();
      };

   /**
    *
    * @param abbr
    * @param id_field_name
    * @returns {DocumentFragment}
    */
   _public.toDOM = function (abbr /*abbreviation in zen syntax*/, id_field_name /*name of field that will store element id (the value of $ element field).*/)
      {
         return parse_group(abbr, 0, 0).result.toDOM(false, id_field_name);
      };

   /**
    *
    * @param abbr
    * @param index
    * @param nest
    * @returns {*}
    */
   function parse_group(abbr, index, nest)
   {
      let result = new ElemArray(); //topmost elements
      let enumerated = null;
      let elem_stack = new ElemArray();
      let last_elem = null; //this is easy reference to last elem on the stack
      let curr_elem = null;
      let group = false;
      let readed_text = "";
      let readed_word = {};
      let readed_number = {};
      let attributes = {};

      let n = abbr.length;
      let i = index;
      while (i < n)
      {
         if (!curr_elem && abbr[i] !== "(")
         {
            //skip whitespace and read tag. throws error if tag is empty
            let readed_word = read_word(abbr, i);

            if (!readed_word.result)
            {
               throw new Error("Cannot read tag! Expected a word! At " + i + " in \"" + abbr + "\"!");
            }

            curr_elem = new Elem(readed_word.result);

            i = readed_word.end_index;

            //If abbreviation ends with tag
            if (i >= n)
            {
               break;
            }
         }
         else
         {
            i = skip_whitespaces(abbr, i);
         }

         switch (abbr[i])
         {
            //ATTRIBUTES
            case '$':
            {  //READ MORE!
               //  This sign indicates special element id. In HTML id has to be unique in
               //whole document. This id has to be unique in single code snippet so
               //each gallery could have frame id object.
               //  In case of component based application $ sign is
               //special component internal identifier. Elements with
               //internal identifier can be accessed from elems object.
               //
               //  element:
               //    div.container $content
               //  can be accessed from:
               //    elems["content"]

               ++i;
               readed_word = read_word(abbr, i);

               if (!readed_word.result)
               {
                  throw new Error("Cannot read internal identifier! Expected a word! At " + i + " in \"" + abbr + "\"!");
               }

               curr_elem.$ = readed_word.result;
               i = readed_word.end_index;
            }
               break;

            case '#':
            { //ID
               ++i;
               readed_word = read_word(abbr, i);

               if (!readed_word.result)
               {
                  throw new Error("Cannot read id! Expected a word! At " + i + " in \"" + abbr + "\"!");
               }

               curr_elem.addAttribute("id", readed_word.result);
               i = readed_word.end_index;
            }
               break;

            case '.':
            { //Class
               ++i;
               readed_word = read_word(abbr, i);

               if (!readed_word.result)
               {
                  throw new Error("Cannot read internal identifier! Expected a word! At " + i + " in \"" + abbr + "\"!");
               }

               curr_elem.addAttribute("class", readed_word.result);
               i = readed_word.end_index;
            }
               break;

            case '[':
            { //Custom attributes
               ++i;
               attributes = parse_attrs(abbr, i);
               for (let attr in attributes.result)
               {
                  curr_elem.addAttribute(attr, attributes.result[attr]);
               }

               i = attributes.end_index;
            }
               break;

            case ']':
            { //End of custom attributes
               // ']' should be skipped by parse_attrs called just after '['
               throw new Error("Parser error! Reached ']' without opening one! At " + i + " in \"" + abbr + "\"!");
            }
            //msg unreachable code
            //break;

            //RELATIONS
            case '+':
            { //Sibling
               //Current element was a child of last element on the stack or should be placed in top_most array
               //the next elem is sibling so we don't place current elem on the array!

               if (last_elem)
               {
                  last_elem.addChild(curr_elem);
               }
               else
               {
                  result.push_array(curr_elem);
               }

               curr_elem = null;
               ++i; //skip '+' sign
            }
               break;

            case '>':
            { //Child
               //save current elem and put it on the stack
               if (last_elem)
               {
                  last_elem.addChild(curr_elem);
               }
               else
               {
                  result.push_array(curr_elem);
               }

               if (curr_elem.is_void)
               {
                  throw new Error("Void HTML element cannot have children! At " + i + " in \"" + abbr + "\"!");
               }

               elem_stack.push(last_elem = curr_elem);
               curr_elem = null;

               ++i; //skip '>' sign
            }
               break;

            case '^':
            { //Level up
               //Curr element parsed
               if (last_elem)
               {
                  last_elem.addChild(curr_elem);
               }
               else
               {
                  result.push_array(curr_elem);
               }

               curr_elem = null;

               //Pop last elements from the stack till the last occurence of '^'. Ignore all whitespaces
               while (abbr[i] === '^' || is_white_space(abbr[i]))
               {
                  if (abbr[i] === '^')
                  {
                     elem_stack.pop();
                     last_elem = elem_stack.pop();

                     //if( !last_elem )
                     //	throw new Error("Unexpected climb-up operator! Cannot climb-up while on top level! At "+i+" in
                     // \""+abbr+"\"!");

                     if (last_elem)
                     {
                        elem_stack.push(last_elem);
                     } //get last elem
                  }

                  ++i;
               }
            }
               break;

            case '(':
            { //Group
               //if curr_elem exists that's mean that abbreviation didn't specified
               //how to place group: div.id( => ERROR!

               if (curr_elem)
               {
                  throw new Error("Unexpected '(' at " + i + " in \"" + abbr + "\"!");
               }

               ++i; //skip '(' sign
               let group = parse_group(abbr, i, nest + 1);
               i = group.end_index;

               curr_elem = group.result;
               group = true; //block adding childs
            }
               break;

            case ')':
            { //End of group
               if (nest === 0)
               {
                  throw new Error("Unexpected ')' at " + i + " in \"" + abbr + "\"!");
               }

               if (curr_elem)
               {
                  if (last_elem)
                  {
                     last_elem.addChild(curr_elem);
                  }
                  else
                  {
                     result.push_array(curr_elem);
                  }
               }

               ++i; //skip ')' sign.
               return { end_index : i, result : result };
            }
            //break;

            //MANIPULATORS
            case '{':
            { //Text
               ++i;
               let readed_text = parse_text(abbr, i);
               curr_elem.text = readed_text.result;

               i = readed_text.end_index;
            }
               break;

            case '}':
            { //End of text
               // ']' should be skipped by read_text called just after '{'
               throw new Error("Parser error! Reached '}' without opening one! At " + i + " in \"" + abbr + "\"!");
            }

            case '*':
            { //Multiplier
               ++i; //skip '*' sign

               readed_number = read_number(abbr, i);
               if (readed_number.result <= 0)
               {
                  throw new Error("Expected a positive number at " + i + " in \"" + abbr + "\"!");
               }

               i = readed_number.end_index;

               enumerated = new ElemArray();

               if (_public.options.multiply_by_reference)
               {
                  for (let k = 0; k < readed_number.result; ++k)
                  {
                     enumerated.push_array(curr_elem);
                  }
               }
               else
               {
                  for (let k = 0; k < readed_number.result; ++k)
                  {
                     enumerated.push_array(enumerate(curr_elem, k));
                  }
               }

               curr_elem = enumerated;
            }
               break;

            default:
            {
               throw new Error("Unexpected zen identifier at " + i + " in \"" + abbr + "\"!");
            }
         }
      }

      if (nest !== 0)
      {
         throw new Error("Unexpected end of abbreviation in \"" + abbr + "\"!");
      }

      if (curr_elem)
      {
         if (last_elem)
         {
            last_elem.addChild(curr_elem);
         }
         else
         {
            result.push_array(curr_elem);
         }
      }

      return { end_index : -1, result : result };
   }

   //Swap '%' signs with enumeration number
   /**
    *
    * @param elem
    * @param index
    * @returns {zen.ElemArray}
    */
   function enumerate(elem, index)
   {
      let regex = /([^%])%([^%])/g;
      let regex_end = /([^%])%$/g; //To match % at the end of the string
      let regex_begin = /^%([^%])/g; //To match % at the begin of the string
      let copy = null;
      let result = new ElemArray();

      if (elem instanceof ElemArray)
      {
         elem = elem.elems;
      }

      if (!is_array(elem))
      {
         elem = [elem];
      }

      for (let i in elem)
      {
         copy = new Elem(elem[i].tag);
         copy.$ = swap_non_special_chars(elem[i].$, enum_char, "" + (index + 1));
         copy.text = swap_non_special_chars(elem[i].text, enum_char, "" + (index + 1));

         if (elem[i].children.length)
         {
            copy.children = enumerate(elem[i].children, index).elems;
         }

         for (let j in elem[i].attr)
         {
            copy.attr[j] = swap_non_special_chars(elem[i].attr[j], enum_char, "" + (index + 1));
         }

         result.push(copy);
      }

      return result;
   }

   /**
    * swaps every character non-proceded by special character (by default '\')
    *with new character or string.
    * e.g.swap_non_special_chars( "Vodka contains %\% of alcohol", "%", "40")
    * will result with
    * "Vodka contains 40% of alcohol"
    * @param string
    * @param source_char
    * @param new_char
    * @returns {string}
    */
   function swap_non_special_chars(string, source_char, new_char)
   {
      let n = string.length;
      let result = "";

      for (let i = 0; i < n; ++i)
      {
         switch (string[i])
         {
            case special_char_indicator:
            {
               if (i < (n - 1) && string[i + 1] === source_char)
               {
                  result += source_char;
                  ++i;
               }
               else
               {
                  result += special_char_indicator;
               }
            }
               break;
            case source_char:
            {
               result += new_char;
            }
               break;
            default:
            {
               result += string[i];
            }
         }
      }

      return result;
   }

   //
   /**
    * @WARNING: This automatically skips whitespaces before and after the word!
    * @param abbr
    * @param index
    * @param allow_quotes
    * @returns {{result, end_index}}
    */
   function read_word(abbr, index, allow_quotes/*=false*/)
   {
      if (allow_quotes)
      {
         return _read_word_with_quotes(abbr, index);
      }
      else
      {
         return _read_word_no_quote(abbr, index);
      }
   }

   /**
    *
    * @param abbr
    * @param index
    * @returns {{result : number, end_index : *}}
    */
   function read_number(abbr, index)
   {
      let number = "";
      let negated = false;
      let n = abbr.length;
      let ch;

      index = skip_whitespaces(abbr, index);

      if (abbr[index] === number_negation)
      {
         negated = true;
         ++index;
      }

      //while character exists and is digit, number variable is extended by character
      while (index < n && is_digit(ch = abbr[index]))
      {
         number += ch;
         ++index;
      }

      index = skip_whitespaces(abbr, index);
      number = parseInt(number);

      if (isNaN(number))
      {
         throw new Error("Invalid number value at " + index + " in \"" + abbr + "\"!");
      }

      if (negated)
      {
         number = -number;
      }

      return { result : parseInt(number), end_index : index };
   }

   /**
    *those functions can be accessed only from read_word function
    *It was split into two functions to simplify usage and make
    *clear all the situations when we ignore quotes.
    * @param abbr
    * @param index
    * @returns {{result : string, end_index : *}}
    * @private
    */
   function _read_word_no_quote(abbr, index)
   {
      let word = "";
      let n = abbr.length;
      let ch;

      index = skip_whitespaces(abbr, index);

      //while character exists and is part of word, word variable is extended by character
      while (index < n && is_word_char(ch = abbr[index]))
      {
         word += ch;
         ++index;
      }

      index = skip_whitespaces(abbr, index);
      return { result : word, end_index : index };
   }

   /**
    *
    * @param abbr
    * @param index
    * @returns {{result : string, end_index : *}}
    * @private
    */
   function _read_word_with_quotes(abbr, index)
   {
      let word = "";
      let n = abbr.length;
      let quoted = false; //did we met '
      let dquoted = false; //did we met "
      let ch;

      index = skip_whitespaces(abbr, index);

      ch = abbr[index];
      //while character exists and is part of word, word variable is extended by character
      while (index < n && (quoted || dquoted || is_word_char(ch) || is_quote(ch)))
      {
         if (!quoted && abbr[index] === '"')
         {
            dquoted = !dquoted;
         }
         else if (!dquoted && abbr[index] === '\'')
         {
            quoted = !quoted;
         }
         else
         {
            word += ch;
         }

         ch = abbr[++index];
      }

      index = skip_whitespaces(abbr, index);
      return { result : word, end_index : index };
   }

   /**
    *
    * @param abbr
    * @param index
    * @returns {{result : {}, end_index : *}}
    */
   function parse_attrs(abbr, index)
   {
      let n = abbr.length;
      let result = {};
      let attr = "";
      let val = "";
      let readed_word = {};

      index = skip_whitespaces(abbr, index);

      //Single loop attempt to read whole pair attribute=value and skipes whitespaces
      while (index < n && abbr[index] !== ']')
      {
         readed_word = read_word(abbr, index, true);
         if (!(attr = readed_word.result))
         {
            throw new Error("Invalid attributes list! Expected an attribute name at " + index + " in \"" + abbr + "\"!");
         }

         index = readed_word.end_index;

         if (abbr[index] !== '=')
         { //if there is no value
            result[attr] = "";
            continue;
         }
         ++index; //skip '=' sign

         readed_word = read_word(abbr, index, true);
         if (!(val = readed_word.result))
         {
            throw new Error("Invalid attributes list! Expected an attribute value at " + index + " in \"" + abbr + "\"!");
         }

         index = readed_word.end_index;
         result[attr] = val;
      }

      //skip ']' sign
      if (abbr[index] !== ']')
      {
         throw new Error("Invalid attributes list! \']\' Cannot be found at " + index + " in \"" + abbr + "\"!");
      }

      ++index;

      return { result : result, end_index : index };
   }

   /**
    *
    * @param abbr
    * @param index
    * @returns {{end_index : *, result : string}}
    */
   function parse_text(abbr, index)
   {
      let result = "";
      let n = abbr.length;

      while (index < n)
      {
         if (abbr[index] === "}" && (index === 0 || abbr[index - 1] !== "\\"))
         {
            break;
         }

         result += abbr[index];
         ++index;
      }

      if (abbr[index] !== "}")
      {
         throw new Error("End of text ('}') cannot be found at " + index + " in \"" + abbr + "\"!");
      }

      ++index; //skip '}' sign

      return { end_index : index, result : result };
   }

   /**
    * Results with index after all whitespaces in a row
    * @param abbr
    * @param index
    * @returns {*}
    */
   function skip_whitespaces(abbr, index)
   {
      let n = abbr.length;
      while (index < n && is_white_space(abbr[index]))
      {
         ++index;
      }

      return index;
   }

   /**
    *
    * @param ch
    * @returns {boolean}
    */
   function is_special_char(ch)
   {
      return (special_chars.indexOf(ch) !== -1);
   }

   /**
    *
    * @param ch
    * @returns {boolean}
    */
   function is_white_space(ch)
   {
      return (white_spaces.indexOf(ch) !== -1);
   }

   /**
    *
    * @param ch
    * @returns {boolean}
    */
   function is_word_char(ch)
   {
      return (word_chars.indexOf(ch) !== -1);
   }

   /**
    *
    * @param ch
    * @returns {boolean}
    */
   function is_quote(ch)
   {
      return (ch === "'" || ch === "\"");
   }

   /**
    *
    * @param ch
    * @returns {boolean}
    */
   function is_digit(ch)
   {
      return (digits.indexOf(ch) !== -1);
   }

   /**
    *
    * @param tag
    * @returns {boolean}
    */
   function is_void_element(tag)
   {
      let n = void_tags.length;

      for (let i = 0; i < n; ++i)
      {
         if (tag === void_tags[i])
         {
            return true;
         }
      }

      return false;
   }

   /**
    *
    * @param target
    * @returns {boolean}
    */
   function is_array(target)
   {
      return (Object.prototype.toString.call(target) === '[object Array]');
   }

   /**
    *
    * @param attrs
    * @returns {string}
    */
   function html_attr_list(attrs)
   {
      let result = "";
      let first = true;

      for (let name in attrs)
      {
         if (first)
         {
            result += " ";
            first = false;
         }

         result += name + "=" + "\"" + attrs[name] + "\" ";
      }

      return result;
   }

   return _public;
})();
