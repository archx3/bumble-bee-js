zen-parser
==========

Zen notation
-------------

Zen notation (aka [Emmet notation](http://emmet.io/)) improved by [Sergey Chikuyonok](https://github.com/sergeche). It's abbreviation syntax inspired by CSS selectors. Thanks to this syntax we can code much faster and when we get familiar with it we can read abbreviations much faster than "sloppy" HTML.

Zen Syntax
-----------

Zen syntax uses some special characters to generate html code. It specifies special characters that indicates attributes, elements relations or manipulations on elements. This implementation is ignores white spaces between the operators and modifiers.

Each element description must start with tag name. New elements starts after each relation specifier.

For example:
```html
    div#header > span#site_title.large ^
    div#content >
    	div#menu > ul > li.menu_elem*5 ^^
    	div.site ^
    div#footer
```
	
will be interpreted as

```html
 <div id="header" >
    <span id="site_title" class="large" ></span>
</div>
<div id="content" >
    <div id="menu" >
        <ul>
            <li class="menu_elem" ></li>
            <li class="menu_elem" ></li>
            <li class="menu_elem" ></li>
            <li class="menu_elem" ></li>
            <li class="menu_elem" ></li>
        </ul>
    </div>
    <div class="site" ></div>
</div>
<div id="footer" ></div>
```

As u can see it is as simple as CSS and we can create large HTML snippets with much less code.

###Attrubutes modifiers

  - **#**  - element id
  - **.**  - element class
  - **[]** - element custom attributes
  - **$**  - Internal element id (description below the example)
  
For example:
    div $my_id #some_id .some_class [data-some_data="some data value"]

will be interpreted as
```html
	<div id="some_id" class="some_class" data-some_data="some data value" ></div>
```
	
As u can see we got all of our attributes besides "my_id" generated from $ operator. This is because this special operator has been invented to internal javascript use. If we want to create element id for each instance ("id" attribute is unique in document scope) of an object we can use "$" operator to create special field that will be returned with the result of parse operation. Thanks to that we can generate gallery that will create associative table of elements to easy manipulate of them. Note that zen_parser just return internal id as a field of result objects and it has to be used manually.
	
###Relation operators

  - **>**  - Next element will be child of the previous one.
  - **+**  - Next element will be sibling of the previous one.
  - **^**  - Next element will be sibling of the parent element (can be used multiply)
  - **()** - Group of elements. 
	
For example

	(div#grandpa>span#father>b#son) + div#grandpas_brother + div#grandpas_sister
	
will be interpreted as

```html
	<div id="grandpa" >
    	<span id="father" >
    		<b id="son" ></b>
    	</span>
    </div>
    <div id="grandpas_brother" ></div>
    <div id="grandpas_sister" ></div>
```
	
we can get the same result using **^** operator:

	div#grandpa>span#father>b#son ^^ div#grandpas_brother + div#grandpas_sister
	
Note that groups children will be in fact children of the each topmost element of group.	

### Manipulators

  - **{}** - element text
  - *  - element multiplier
    - **%**  - counter of multiplied elements

For example

```
ul>(li>span{element number %})*3
```
	
will be interpreted as

```html
<ul>
    <li>
        <span>element number 1</span>
    </li>
    <li>
        <span>element number 2</span>
    </li>
    <li>
        <span>element number 3</span>
    </li>
</ul>
```

	
Usage
------

Zen parser provides just few public function accessible trough the global **zen** object.

```javascript
zen.parse( abbreviation_string );
```
This function returns with zen.ElemStack object containing tree generated from zen abbreviation provided.
	
	
```javascript
 zen.toHTML( abbreviation_string );
```
This function returns with string containing HTML code created from abbreviation provided. It ignores **$** operator.
	
```javascript
 zen.toDOM( abbreviation_string, [id_field_name] [string]);
```

This function returns with DocumentFragment containing HTML elements prepared to be placed in DOM. If id_field_name is specified each element will have stored in internal id ($ operator) in field named as a value of this argument. Otherwise internal id won't be stored.

We can modify zen_parser behaviour trough the zen.options object. For now we have only one option:

	options.multiply_by_reference
    Default value: false

If this flag is set to true all multiplied elements will be single object instance referenced multiple times. Otherwise zen_parser will create instance for each multiplied object. **Note** that multiply referenced objects are in fact the same object so they cannot be enumerated. In other words "%" operator will be disabled for them.


###Short Example
```javascript
	window.addEventListener('load', onLoad, false )

    function onLoad() {
		var body_content = "\
			div#header > span#site_title.large ^ \
			div#content > \
				div#menu > ul > li.menu_elem*5 ^^ \
				div.site ^ \
			div#footer";
			
		try {
			document.body.appendChild( zen.toDOM(body_content) );
		}
		catch( e ) {
			alert( e.message );
		}
	}
```
Objects
--------

###ElemArray

```javascript
 ElemArray
 {
    elems - elements in array
}
```
	
ElemArray is a wrapper to array object providing special function to manage on all elements. (ECMA Script 5 doesn't not allow to subclass an array). It provides some of Elem methods which are automaticly applied to all children elements.
	
    ElemArray.addAttribute( name, value )

Adds [name=value] attibute to each child element.
	
	ElemArray.removeAttribute( name )
	
Removes attribute from each child element by its name.
	
	ElemArray.addChild( child )
	
Add child to each element in array where child is Elem object..
	
	ElemArray.push( Elem/ElemArray/Array of Elem, ... )
	
This function takes multiple Elem, ElemArray, Array of Elem or Array of ElemArray type arguments and place them at the end of the array.
	
	ElemArray.toHTML()
	
Returns string containing HTML code of all elements in array.
	
	ElemArray.toDOM( [id_field_name] )
	
Returns DocumentFragment containing all elements in array. If id_field_name is speciefed all elements would have internal id stored in id_field_name value named field.
	
###Elem

    Elem {
		tag 		- HTML element tag
		is_void 	- Can element have children?
		$			- Internal ID
		text		- Element text
		attr		- Element attributes in format {name: value}
		children	- Array of children
	}
	
	Elem is basic HTML element descriptor. 
	
	Elem.addAttribute( name, value )

Adds [name=value] attibute to element.
	
	Elem.removeAttribute( name )
	
Removes attribute from element by its name.
	
	Elem.addChild( child )
	
Add child to element where child is Elem object.
	
	Elem.toHTML()
	
Returns string containing HTML code of element.
	
	Elem.toDOM( [id_field_name] )
	
Returns Element object created from the descriptor.

Error Handling
---------------

All errors are thrown so if we try to parse something we have to remember to use try-catch block for proper error handling.
