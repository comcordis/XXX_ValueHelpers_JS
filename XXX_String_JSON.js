Date.prototype.toJSON = function (key)
{
	var result = null;
	
	if (isFinite(this.valueOf()))
	{
		result = '';
		
		result += this.getUTCFullYear();		
		result += '-';		
		result += XXX_String.padLeft(this.getUTCMonth() + 1, '0');		
		result += '-';		
		result += XXX_String.padLeft(this.getUTCDate(), '0');		
		result += 'T';		
		result += XXX_String.padLeft(this.getUTCHours(), '0');		
		result += ':';		
		result += XXX_String.padLeft(this.getUTCMinutes(), '0');		
		result += ':';		
		result += XXX_String.padLeft(this.getUTCSeconds(), '0');		
		result += 'Z';
	}
	
	return result;
};

String.prototype.toJSON =
Number.prototype.toJSON =
Boolean.prototype.toJSON = function (key)
{
	var result = this.valueOf();
	
	return result;
};
















var XXX_String_JSON =
{
	
	
	/*
	
	When parsing JSON, check if it contains certain Unicode characters and replace them with escape sequences.
	JavaScript handles many characters incorrectly, either silently deleting them, or treating them as line endings.
	
	[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]
	
	Unicode code point: 0 (u0000)
	Unicode code point: 173 (u00ad)
	Unicode code point: 1536 - 1540 (u0600 - u0604)
	Unicode code point: 1807 (u070f)
	Unicode code point: 6068 (u17b4)
	Unicode code point: 6069 (u17b5)
	Unicode code point: 8204 - 8207 (u200c - u200f)
	Unicode code point: 8232 - 8239 (u2028 - u202f)
	Unicode code point: 8288 - 8303 (u2060 - u206f)
	Unicode code point: 65279 (ufeff)
	Unicode code point: 65520 - 65535 (ufff0 - uffff)	
	
	*/
	
    incorrectlyHandledCharacters: ['[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', ''],
	
	/*
	
	When composing JSON, check if it contains  control characters, quote characters and backslash characters and replace them before quoting them.
	
	[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]
	
	\
	"
	ASCII code point: 0 - 31 (x00 - x1f)
	ASCII code point: 127 - 159 (x7f - x9f)
	
	Unicode code point: 173 (u00ad)
	Unicode code point: 1536 - 1540 (u0600 - u0604)
	Unicode code point: 1807 (u070f)
	Unicode code point: 6068 (u17b4)
	Unicode code point: 6069 (u17b5)
	Unicode code point: 8204 - 8207 (u200c - u200f)
	Unicode code point: 8232 - 8239 (u2028 - u202f)
	Unicode code point: 8288 - 8303 (u2060 - u206f)
	Unicode code point: 65279 (ufeff)
	Unicode code point: 65520 - 65535 (ufff0 - uffff)
	
	*/
	
	escapableCharacters: ['[\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]', ''],
	
	// Literal substitutions
	characterSubstitutions:
	{
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},
	
	
	quote: function (string)
	{
		var result = '';
		
		if (XXX_String_Pattern.hasMatch(string, this.escapableCharacters[0], this.escapableCharacters[1]))
		{
			var callback = function (a)
			{
				var result = '';
				
				var c = XXX_String_JSON.characterSubstitutions[a];
				
				if (XXX_Type.isString(c))
				{
					result = c;
				}
				else
				{
					result = '\\u' + XXX_String.getPart('0000' + XXX_Number.convertBase(XXX_String.characterToCodePoint(a), 10, 16), -4);
				}					  
								
				return result;
			};
			
			string = XXX_String_Pattern.replaceWithCallback(string, this.escapableCharacters[0], this.escapableCharacters[1], callback, true);
			
			result = '"' + string + '"';
		}
		else
		{
			result = '"' + string + '"';
		}
		
		return result;
	},
	
	fixIncorrectlyHandledCharacters: function (string)
	{
		var result = '';
		
		if (XXX_String_Pattern.hasMatch(string, this.incorrectlyHandledCharacters[0], this.incorrectlyHandledCharacters[1]))
		{
			var callback = function (a)
			{
				var result = '';
				
				result = '\\u' + XXX_String.getPart('0000' + XXX_Number.convertBase(XXX_String.characterToCodePoint(a), 10, 16), -4);
				
				return result;
			};
			
			string = XXX_String_Pattern.replaceWithCallback(string, this.incorrectlyHandledCharacters[0], this.incorrectlyHandledCharacters[1], callback, true);
		}		
		else
		{
			result = string;
		}
		
		return result;
	},
	
	walkStructure: function (structure, key, reviver)
	{
		var value = structure[key];
		
		if (value && XXX_Type.isArray(value))
		{
			var k, v;
			
			for (k in value)
			{
				if (Object.hasOwnProperty.call(value, k))
				{
					v = this.walkStructure(value, k);
					
					if (v !== undefined)
					{
						value[k] = v;
					}
					else
					{
						delete value[k];
					}
				}
			}
		}
		
		return reviver.call(structure, key, value);
	},
	
	decode: function (string, reviver)
	{
		var result = '';
				
		string = this.fixIncorrectlyHandledCharacters(string);
		
		var tempString = string;
		
		
		// 1. Replace the JSON backslash pairs with '@' (a non-JSON character).
		tempString = XXX_String_Pattern.replace(tempString, '\\\\(?:["\\\\\\/bfnrt]|u[0-9a-fA-F]{4})', '', '@');
		
		
		// 2. Replace all simple value tokens with ']' characters.
		tempString = XXX_String_Pattern.replace(tempString, '"[^"\\\\\\n\\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?', '', ']');
						
		// 3. Delete all open brackets that follow a colon or comma or that begin the text.
		tempString = XXX_String_Pattern.replace(tempString, '(?:^|:|,)(?:\\s*\\[)+', '', '');
		
		// 4. See that the remaining characters are only whitespace or ']' or ',' or ':' or '{' or '}'.
		if (XXX_String_Pattern.hasMatch(tempString, '^[\\],:{}\\s]*$', ''))
		{		
			// Text is safe for eval
			
			// The '{' operator is subject to a syntactic ambiguity in JavaScript: it can begin a block or an object literal.
			// We wrap the text in parens to eliminate the ambiguity.
		
			var structure = eval('(' + string + ')');
						
			if (reviver)
			{
				// Pass each name/value pair to the reviver function for possible transformation
				result = this.walkStructure({'': structure}, '', reviver);
			}
			else
			{
				result = structure;
			}
			
		}
		
		return result;
	},
	
	gap: null,
	indent: null,
	
	stringify: function (key, structure, replacer)
	{
		var result = ''
		
		var i, iEnd;
		var k, v;
		
		var mind = this.gap;
		
		var value = structure[key];
		
		// If the value has a toJSON method, call it
		if (value.toJSON)
		{
			value = value.toJSON(key);
		}
		
		// If there's a replacer
		if (replacer)
		{
			value = replacer.call(structure, key, value);
		}
		
		switch (typeof value)
		{
			case 'string':
				result = this.quote(value);
				break;
			case 'number':
				// JSON numbers must be finite. Encode non-finite numbers as null.
				result = isFinite(value) ? String(value) : 'null';
				break;
			case 'boolean':
			case 'null': // Note: typeof null does not produce 'null'. The case is included here in the remote chance that this gets fixed someday.	 See bug below.			
				result = String(value);
				break;
			case 'object':
				if (!value) // Due to a specification blunder in ECMAScript, typeof null is 'object', so watch out for that case.
				{
					result = 'null';
				}
				else
				{
					this.gap += this.indent;
					var partial = []; // Make an array to hold the partial results of stringifying this object value.
					
					if (Object.prototype.toString.apply(value) === '[object Array]')
					{
						// Stringify every element. Use null as a placeholder for non-JSON values.
						for (i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(value); i < iEnd; ++i)
						{
							partial[i] = this.stringify(i, value, replacer) || 'null';
						}
						
						// Join all of the elements together, separated with commas, and wrap them in brackets.
						v = partial.length === 0 ? '[]' : this.gap ? '[\n' + this.gap + partial.join(',\n' + this.gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
						this.gap = mind;
						
						result = v;
					}
					else
					{
						// If the replacer is an array, use it to select the members to be stringified.
						if (replacer && typeof replacer === 'object')
						{
							for (i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(replacer); i < iEnd; ++i)
							{
								k = replacer[i];
								
								if (typeof k === 'string')
								{
									v = this.stringify(k, value, replacer);
									
									if (v)
									{
										partial.push(this.quote(k) + (this.gap ? ': ' : ':') + v);
									}
								}
							}
						}
						else
						{
							// Otherwise, iterate through all of the keys in the object.
							for (k in value)
							{
								if (Object.hasOwnProperty.call(value, k))
								{
									v = this.stringify(k, value, replacer);
									
									if (v)
									{
										partial.push(this.quote(k) + (this.gap ? ': ' : ':') + v);
									}
								}
							}
						}
			
						// Join all of the member texts together, separated with commas, and wrap them in braces.
						v = partial.length === 0 ? '{}' : this.gap ? '{\n' + this.gap + partial.join(',\n' + this.gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
						this.gap = mind;
						
						result = v;
					}
				}				
				break;
		}
		
		return result;
	},
		
	
	
	
	
	
	
	encode: function (string, replacer, space)
	{
		// The replacer can be a function that can replace values, or an array of strings that will select the keys.
				
		this.gap = '';		
		this.indent = '';
		
		if (XXX_Type.isNumber(space)) // If the space parameter is a number, make an indent string containing that many spaces.
		{
			for (var i = 0, iEnd = space; i < iEnd; ++i)
			{
				this.indent += ' ';
			}
		}
		else if (XXX_Type.isString(space)) // If the space parameter is a string, it will be used as the indent string.
		{
			this.indent = space;
		}

		// Make a fake root object containing our value under the key of ''. Return the result of stringifying the value.
		return this.stringify('', {'': string}, replacer);
	}
};











/*
See http://www.JSON.org/js.html

This code should be minified before deployment.

This file creates a global JSON object containing two methods: stringify and parse.

JSON.stringify(value, replacer, space)
	value       any JavaScript value, usually an object or array.

	replacer    an optional parameter that determines how object values are stringified for objects.
				It can be a function or an array of strings.

	space       an optional parameter that specifies the indentation of nested structures.
				If it is omitted, the text will be packed without extra whitespace.
				If it is a number, it will specify the number of spaces to indent at each level.
				If it is a string (such as '\t' or '&nbsp;'), it contains the characters used to indent at each level.

	This method produces a JSON text from a JavaScript value.

	When an object value is found, if the object contains a toJSON method, its toJSON method will be called and the result will be stringified.
	A toJSON method does not serialize: it returns the value represented by the name/value pair that should be serialized, or undefined if nothing should be serialized.
	The toJSON method will be passed the key associated with the value, and this will be bound to the value

	For example, this would serialize Dates as ISO strings.

		Date.prototype.toJSON = function (key)
		{
			function f (n)
			{
				// Format integers to have at least two digits.
				return n < 10 ? '0' + n : n;
			}

			return this.getUTCFullYear()   + '-' +
				 f(this.getUTCMonth() + 1) + '-' +
				 f(this.getUTCDate())      + 'T' +
				 f(this.getUTCHours())     + ':' +
				 f(this.getUTCMinutes())   + ':' +
				 f(this.getUTCSeconds())   + 'Z';
		};

	You can provide an optional replacer method.
	It will be passed the key and value of each member, with this bound to the containing object.
	The value that is returned from your method will be serialized.
	If your method returns undefined, then the member will be excluded from the serialization.

	If the replacer parameter is an array of strings, then it will be used to select the members to be serialized.
	It filters the results such that only members with keys listed in the replacer array are stringified.

	Values that do not have JSON representations, such as undefined or functions, will not be serialized.
	Such values in objects will be dropped; in arrays they will be replaced with null.
	You can use a replacer function to replace those with JSON values.
	JSON.stringify(undefined) returns undefined.

	The optional space parameter produces a stringification of the value that is filled with line breaks and indentation to make it easier to read.

	If the space parameter is a non-empty string, then that string will be used for indentation.
	If the space parameter is a number, then the indentation will be that many spaces.

	Example:

		text = JSON.stringify(['e', {pluribus: 'unum'}]);
		// text is '["e",{"pluribus":"unum"}]'

		text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
		// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

		text = JSON.stringify([new Date()], function (key, value)
		{
			return this[key] instanceof Date ? 'Date(' + this[key] + ')' : value;
		});
		// text is '["Date(---current time---)"]'


JSON.parse(text, reviver)
	This method parses a JSON text to produce an object or array.
	It can throw a SyntaxError exception.

	The optional reviver parameter is a function that can filter and transform the results.
	It receives each of the keys and values, and its return value is used instead of the original value.
	If it returns what it received, then the structure is not modified.
	If it returns undefined then the member is deleted.

	Example:

		// Parse the text. Values that look like ISO date strings will be converted to Date objects.
	
		myData = JSON.parse(text, function (key, value)
		{
			var a;
			if (typeof value === 'string')
			{
				a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
				if (a)
				{
					return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
				}
			}
			
			return value;
		});
	
		myData = JSON.parse('["Date(09/09/2001)"]', function (key, value)
		{
			var d;
			if (typeof value === 'string' && value.slice(0, 5) === 'Date(' && value.slice(-1) === ')')
			{
				d = new Date(value.slice(5, -1));
				
				if (d)
				{
					return d;
				}
			}
			
			return value;
		});
*/
