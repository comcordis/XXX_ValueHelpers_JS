
var XXX_String =
{
	lineSeparator: "\r\n",
	
	tab: "\t",
	
	space: ' ',
	
	singleQuote: "'",
	doubleQuotes: '"',
	
	variableDelimiter: 
	{
		start: '%',
		end: '%'
	},
	
	notationPattern: ['(?:-(?:[a-z]){1})|(?:[A-Z])|(?:_(?:[a-z]){1})|(?:\\.(?:[a-z]){1})|(?: +(?:[a-zA-Z]){1})', ''],
	
	////////////////////
	// Length / Size / Count
	////////////////////
	
	// Character length
	getCharacterLength: function (string)
	{
		return string.length;
	},
	
	// Byte size
	getByteSize: function (string)
	{
		// TODO! Doesn't work if some are unencoded and others are....
        var escapedString = encodeURI(string);
		
        if (escapedString.indexOf('%') != -1)
		{
            var count = escapedString.split('%').length - 1;
			
            if (count === 0)
			{
				++count;
			}
			
            count += escapedString.length - (count * 3);
        }
		else
		{
            count = escapedString.length;
        }
		
		return count;
	},
	
	// Word count	
	getWordCount: function (value)
	{
		var result = 0;
		
		var temp;
		
		// Normalize line separators
		value = this.normalizeLineSeparators(value);
		
		// Normalize line separators to spaces
		value = XXX_String_Pattern.replace(value, this.lineSeparator, '', ' ');
		
		// Normalize tabs to spaces
		value = XXX_String_Pattern.replace(value, '\\t+', '', ' ');
		
		// Normalize multiple spaces
		value = XXX_String_Pattern.replace(value, '\\s+', '', ' ');
				
		value = value.split(' ');
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(value); i < iEnd; ++i)
		{
			// If it matches a word character
			if (XXX_String_Pattern.hasMatch(value[i], '[\\w]', ''))
			{
				++result;	
			}
		}
		
		return result;
	},
	
	////////////////////
	// Occurence
	////////////////////
	
	// Find position of first occurrence in string
	findFirstPosition: function (hayStack, needle, offset)
	{
		offset = XXX_Type.isInteger(offset) ? offset : 0;
		
		var result = false;
		
		result = hayStack.indexOf(needle, offset);
		
		if (result === -1)
		{
			result = false;
		}
		
		return result;
	},
	
	// Find position of last occurrence in string
	findLastPosition: function (hayStack, needle, offset)
	{
		offset = XXX_Type.isInteger(offset) ? offset : 0;
		
		var result = false;
		
		result = hayStack.lastIndexOf(needle, offset);
		
		if (result === -1)
		{
			result = false;
		}
		
		return result;
	},
	
	////////////////////
	// Part
	////////////////////
	
	// Part of a string
	getPart: function (string, offset, length)
	{
		string = XXX_Type.makeString(string);
		
		offset = XXX_Type.isInteger(offset) ? offset : 0;
		
		if (offset < 0)
		{
			offset = string.length - (offset * -1);
		}
		
		if (length < 0)
		{
			length = (string.length - offset) - (length * -1);
		}
		
		length = XXX_Type.isPositiveInteger(length) ? length : string.length;
		
		var result = '';
		
		result = string.substr(offset, length);
		
		return result;
	},
	
	////////////////////
	// Case
	////////////////////
	
	// Convert to upper case
	convertToUpperCase: function (string)
	{
		return new String(string).toUpperCase();
	},
	
	// Convert to lower case
	convertToLowerCase: function (string)
	{
		return new String(string).toLowerCase();
	},
	
	////////////////////
	// Replacement
	////////////////////
	
	// Replace variable delimited strings
	replaceVariables: function (subject, variables, values)
	{
		var result = false;
		
		if (XXX_Type.isArray(variables) && XXX_Type.isArray(values) && (XXX_Array.getFirstLevelItemTotal(variables) === XXX_Array.getFirstLevelItemTotal(values)))
		{
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(variables); i < iEnd; ++i)
			{
				variables[i] = this.variableDelimiter.start + variables[i] + this.variableDelimiter.end;
			}
			
			result = this.replace(subject, variables, values);
		}
		else if (!XXX_Type.isArray(variables) && !XXX_Type.isArray(values))
		{
			variables = this.variableDelimiter.start + variables + this.variableDelimiter.end;
			
			result = this.replace(subject, variables, values);
		}
		
		return result;
	},
	
	// Replace strings
	replace: function (subject, variables, values)
	{
		var result = subject;
		
		if (XXX_Type.isArray(variables) && XXX_Type.isArray(values) && (XXX_Array.getFirstLevelItemTotal(variables) === XXX_Array.getFirstLevelItemTotal(values)))
		{
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(variables); i < iEnd; ++i)
			{
				result = result.split(variables[i]).join(values[i]);
			}
		}
		else if (!XXX_Type.isArray(variables) && !XXX_Type.isArray(values))
		{
			result = result.split(variables).join(values);
		}
		
		return result;
	},
	
	clearVariables: function (subject)
	{
		return XXX_String_Pattern.replace(subject, this.variableDelimiter.start + '[\\w]*' + this.variableDelimiter.end, 'i', '');
	},
	
	////////////////////
	// Code point
	////////////////////
	
	codePointToCharacter: function (decimal)
	{
		return String.fromCharCode(decimal);
	},
	
	characterToCodePoint: function (character)
	{
		return character.charCodeAt(0);
	},
	
	////////////////////
	// Character at index
	////////////////////
	
	getCharacterAtIndex: function (string, index)
	{
		return string.charAt(index);
	},
	
	////////////////////
	// Encoded HexaDecimal
	////////////////////
		
	hexaDecimalCharacters: '0123456789ABCDEFabcdef',
	
	codePointToEncodedHexaDecimal: function (decimal)
	{
		// Right shift the bits 4 steps
		var firstHexaDecimal = this.hexaDecimalCharacters.charAt(decimal >> 4);
		
		// Mask out only the utmost right 4 bits
		var secondHexaDecimal = this.hexaDecimalCharacters.charAt(decimal & 0xF);
		
		// Return the result with a % prefix
		return '%' + firstHexaDecimal + secondHexaDecimal;
	},
			
	encodedHexaDecimalToCodePoint: function (encodedHexaDecimal)
	{
		// Check if the hexaDecimal is 3 characters long (%XX)
		if (encodedHexaDecimal.length == 3)
		{
			// Check if the first character is %
			if (encodedHexaDecimal.charAt(0) == '%')
			{
				// Check if the hexaDecimal numbers are valid
				if (this.hexaDecimalCharacters.indexOf(encodedHexaDecimal.charAt(1)) != -1 && this.hexaDecimalCharacters.indexOf(encodedHexaDecimal.charAt(2)) != -1)
				{
					// Return a decimal value representing the code point
					return parseInt(encodedHexaDecimal.substr(1, 2), 16);
				}
			}
		}
		
		// If it reaches this point it means it was an invalid hex encoding
		return 256;
	},	
	
	////////////////////
	// Random
	////////////////////
	
	// Random 32 character hash string
	getRandomHash: function ()
	{
		var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		
		var result = '';
		
		for (var i = 0, iEnd = 32; i < iEnd; ++i)
		{
			var j = Math.floor(Math.random() * 62);
			
			result += characters.charAt(j);
		}
		
		return result;
	},
	
	////////////////////
	// Default value
	////////////////////
	
	// Check if the string is empty, otherwise set the default
	setDefaultValue: function (string, defaultValue)
	{
		return XXX_Type.isValue(string) ? string : defaultValue;
	},
	
	////////////////////
	// Normalizing
	////////////////////
	
	// Convert all line separators to the canonical form
	normalizeLineSeparators: function (string)
	{
		string = this.replace(string, "\r\n", "\n");
		string = this.replace(string, "\r", "\n");
		string = this.replace(string, "\n", this.lineSeparator);
		
		return string;
	},
	
	////////////////////
	// Removing
	////////////////////
	
	// Remove all line separators
	removeLineSeparators: function (string)
	{
		string = this.normalizeLineSeparators(string);
		string = this.replace(string, this.lineSeparator, '');
	},
	
	////////////////////
	// Removing
	////////////////////
	
	quoteEncapsulationPattern: ['^(\'[^\']*\')|("[^"]*")$', ''],
	
	hasQuotes: function (string)
	{
		return XXX_String_Pattern.hasMatch(string, this.quoteEncapsulationPattern[0], this.quoteEncapsulationPattern[1]);
	},
	
	addQuotes: function (string)
	{
		return this.hasQuotes(string) ? string : '\'' + string + '\'';
	},
	
	removeQuotes: function (string)
	{
		return this.hasQuotes(string) ? string.slice(1, -1) : string;
	},
		
	////////////////////
	// Formatting notation
	////////////////////
	
	formatNotationConversions: [],
		
	// runtime cache...
	formatToNotation: function (notation, value)
	{
		var formattedValue = false;
		
		for (var i in this.formatNotationConversions)
		{
			var formatNotationConversion = this.formatNotationConversions[i];
			
			if (formatNotationConversion.original == value && formatNotationConversion.notation == notation)
			{
				formattedValue = formatNotationConversion.value;
			}
		}
		
		if (!formattedValue)
		{
			switch (notation)
			{
				case 'dash':
					formattedValue = XXX_String.formatToDashNotation(value);
					break;
				case 'underscore':
					formattedValue = XXX_String.formatToUnderscoreNotation(value);
					break;
				case 'space':
					formattedValue = XXX_String.formatToSpaceNotation(value);
					break;
				case 'dot':
					formattedValue = XXX_String.formatToDotNotation(value);
					break;
				case 'camel':
				default:
					formattedValue = XXX_String.formatToCamelNotation(value);
					break;
			}
			
			this.formatNotationConversions.push({original: value, value: formattedValue, notation: notation});
		}
		
		return formattedValue;
	},
		
	formatToCamelNotation: function (value)
	{
		value = XXX_Type.makeString(value);
				
		return value.replace(new RegExp(this.notationPattern[0], this.notationPattern[1]), function (a)
		{
			if (a.length == 2)
			{
				a = a.substr(1, 1);
			}
			
			return a.toUpperCase();
		});
	},
	formatToDashNotation: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.replace(new RegExp(this.notationPattern[0], this.notationPattern[1]), function (a)
		{
			if (a.length == 2)
			{
				a = a.substr(1, 1);
			}
			
			return '-' + a.toLowerCase();
		});		
	},
	formatToUnderscoreNotation: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.replace(new RegExp(this.notationPattern[0], this.notationPattern[1]), function (a)
		{
			if (a.length == 2)
			{
				a = a.substr(1, 1);
			}
			
			return '_' + a.toLowerCase();
		});
	},
	formatToSpaceNotation: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.replace(new RegExp(this.notationPattern[0], this.notationPattern[1]), function (a)
		{
			if (a.length == 2)
			{
				a = a.substr(1, 1);
			}
			
			return ' ' + a.toLowerCase();
		});
	},
	formatToDotNotation: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.replace(new RegExp(this.notationPattern[0], this.notationPattern[1]), function (a)
		{
			if (a.length == 2)
			{
				a = a.substr(1, 1);
			}
			
			return '.' + a.toLowerCase();
		});
	},
	
	////////////////////
	// Begin & End matching
	////////////////////
	
	beginsWith: function (value, begin, ignoreCase)
	{
		ignoreCase = XXX_Type.isBoolean(ignoreCase) ? ignoreCase : false;
		
		value = XXX_Type.makeString(value);
		
		if (!ignoreCase)
		{
			return (begin == value.substring(0, begin.length));
		}
		else
		{
			return (begin.toLowerCase() == value.substring(0, begin.length).toLowerCase());
		}
	},	
	endsWith: function (value, end, ignoreCase)
	{
		ignoreCase = XXX_Type.isBoolean(ignoreCase) ? ignoreCase : false;
		
		value = XXX_Type.makeString(value);
		
		if (!ignoreCase)
		{
			return (end == value.substring(value.length - end.length));
		}
		else
		{
			return (end.toLowerCase() == value.substring(value.length - end.length).toLowerCase());
		}
	},
	
	////////////////////
	// Begin & End chopping
	////////////////////
	
	getBegin: function (string, characterTotal)
	{
		return string.substr(0, characterTotal);
	},
	getEnd: function (string, characterTotal)
	{		
		return string.substr(string.length - characterTotal, characterTotal);
	},
	
	////////////////////
	// Cut Off
	////////////////////
	
	cutOffCharacters: function (value, characterLengthMaximum)
	{
		var characterLength = XXX_String.getCharacterLength(value);
		
		if (characterLength > characterLengthMaximum - 3)
		{
			value = XXX_String.getPart(value, 0, characterLengthMaximum - 3) + '...';
		}
		
		return value;
	},
		
	////////////////////
	// Trimming
	////////////////////
	
	trim: function (value)
	{
		return XXX_Type.makeString(value).replace(/^\s+/, '').replace(/\s+$/, '');	
	},
	trimLeft: function (value)
	{
		return XXX_Type.makeString(value).replace(/^\s+/, '');
	},
	trimRight: function (value)
	{
		return XXX_Type.makeString(value).replace(/\s+$/, '');
	},
		
	////////////////////
	// Slashes
	////////////////////
	
	addSlashes: function (string)
	{
		string = XXX_String_Pattern.replace(string, '\\', '', '\\\\');
		string = XXX_String_Pattern.replace(string, '\'', '', '\\\'');
		string = XXX_String_Pattern.replace(string, '"', '', '\\"');
		string = XXX_String_Pattern.replace(string, '\0', '', '\\0');
		
		return string;
	},
	
	removeSlashes: function (string)
	{
		string = XXX_String_Pattern.replace(string, '\\\'', '', '\'');
		string = XXX_String_Pattern.replace(string, '\\"', '', '"');
		string = XXX_String_Pattern.replace(string, '\\\\', '', '\\');
		string = XXX_String_Pattern.replace(string, '\\0', '', '\0');
		
		return string;
	},
	
	////////////////////
	// Split
	////////////////////
	
	splitToArray: function (string, delimiter)
	{
		delimiter = XXX_Type.isValue(delimiter) ? delimiter : '|||';
		
		return string.split(delimiter);
	},
	
	////////////////////
	// URI
	////////////////////
	
	// Don't use escape, encodeURI or encodeURIComponent (They don't support unicode/utf-8 properly) - http://xkr.us/articles/javascript/encode-compare/
	
	encodeURIValue: function (string)
	{
		return XXX_String_Unicode.encodeURIValue(string);
	},
	
	decodeURIValue: function (string)
	{
		return XXX_String_Unicode.decodeURIValue(string);
	},
			
	////////////////////
	// Padding
	////////////////////
	
	padLeft: function (string, paddingCharacter, length)
	{
		string = XXX_Type.makeString(string);
		
		paddingCharacter = XXX_Type.isValue(paddingCharacter) ? paddingCharacter : '0';
		length = XXX_Type.isPositiveInteger(length) ? length : 1;
		
		var padding = '';
		
		for (var i = 0, iEnd = length - string.length; i < iEnd; ++i)
		{
			padding += paddingCharacter;	
		}
		
		var result = padding + string;
		
		return result;
	},
	
	padRight: function (string, paddingCharacter, length)
	{
		string = XXX_Type.makeString(string);
		
		paddingCharacter = XXX_Type.isValue(paddingCharacter) ? paddingCharacter : '0';
		length = XXX_Type.isPositiveInteger(length) ? length : 1;
		
		var padding = '';
		
		for (var i = 0, iEnd = length - string.length; i < iEnd; ++i)
		{
			padding += paddingCharacter;	
		}
		
		var result = string + padding;
		
		return result;
	},
	
	////////////////////
	// Capitals
	////////////////////
	
	capitalize: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
	},
	decapitalize: function (value)
	{
		value = XXX_Type.makeString(value);
		
		return value.substr(0, 1).toLowerCase() + value.substr(1, value.length);
	},
		
	////////////////////
	// Adding & Removing characters
	////////////////////
	
	addCharacterAt: function (value, index, character)
	{
		value = XXX_Type.makeString(value);
		
		var firstPart = value.slice(0, index);
		var secondPart = value.slice(index, value.length);
		
		return firstPart.concat(character, secondPart);
	},
	removeCharacterAt: function (value, index)
	{
		value = XXX_Type.makeString(value);
		
		var firstPart = value.slice(0, index);
		var secondPart = value.slice(index + 1, value.length);
		
		return firstPart.concat(secondPart);
	},
	
	////////////////////
	// HTML
	////////////////////
	
	disableHTMLTags: function (value)
	{
		value = XXX_String.replace(value, ['<', '>'], ['&lt;', '&gt;']);
		
		return value;
	},
			
	////////////////////
	// Elastic
	////////////////////
	
	processForElasticMeasuring: function (value)
	{		
		value = XXX_String.normalizeLineSeparators(value);
				
		value = XXX_String.replace(value, '&', '&amp;');
		value = XXX_String.replace(value, '  ', '&nbsp;');
		value = XXX_String.replace(value, '<', '&lt;');
		value = XXX_String.replace(value, '>', '&gt;');
		
		value += '&nbsp';
		
		return value;
	},
			
	////////////////////
	// Zero Fill
	////////////////////
	
	zeroFill: function (value, length)
	{
		var zeros = '';
		
		for (var i = 0, iEnd = length; i < iEnd; ++i)
		{
			zeros += '0';
		}
		
		var result = zeros + value;
		
		return result.substring((result.length - length));
	},
		
	dump: function (x, l)
	{
		l = l || 0;
		var max = 5;
		var sep = ' ';
		
		if (l > max)
		{ 
			return "[WARNING: Too much recursion]\n"; 
		} 
		
		var i; 
		var r = '';
		var t = typeof x;
		var tab = ''; 
		
		if (x === null)
		{ 
			r += "(null)\n"; 
		}
		else if (t == 'object')
		{
			l++; 
			
			for (i = 0; i < l; i++)
			{
				tab += sep;
			}
			
			if (x && x.length)
			{
				t = 'array';
			}
			
			r += '(' + t + ") :\n";
			
			for (i in x)
			{
				if (x[i] || x[i] === false || x[i] === '' || x[i] === 0)
				{
					try
					{
						r += tab + '[' + i + '] : ' + XXX_String.dump(x[i], (l + 1));
					}
					catch (nativeException)
					{
						return "[ERROR: " + nativeException + "]\n";
					}
				}
			}
		}
		else
		{
			if (t == 'string')
			{
				if (x === '')
				{
					x = '(empty)';
				}
			}
			
			r += '(' + t + ') ' + x + "\n";
		} 
		
		return r;
	},
	
	getPassSecurityRating: function (value)
	{
		var valueCharacterLength = XXX_String.getCharacterLength(value);
		
		var hasLowerCaseLetter = XXX_String_Pattern.hasMatch(value, '[a-z]', '');
		var hasUpperCaseLetter = XXX_String_Pattern.hasMatch(value, '[A-Z]', '');
		var hasDigit = XXX_String_Pattern.hasMatch(value, '[0-9]', '');
		var hasSpecialCharacter = XXX_String_Pattern.hasMatch(value, '\\W', '');
		
		var rating = 0;
		
		rating += valueCharacterLength * 3;
		
		if (hasLowerCaseLetter)
		{
			rating += 20;
		}
		
		if (hasUpperCaseLetter)
		{
			rating += 20;
		}
		
		if (hasDigit)
		{
			rating += 20;
		}
		
		if (hasSpecialCharacter)
		{
			rating += 25;
		}
		
		rating = XXX_Number.lowest(100, rating);
		
		return rating;
	},
			
	////////////////////
	// Parts
	////////////////////
	
	getLastSeparatedPart: function (value, separator)
	{
		var parts = XXX_String.splitToArray(value, separator);
				
		return parts.pop();
	},
	
	getFirstSeparatedPart: function (value, separator)
	{
		var parts = XXX_String.splitToArray(value, separator);
		
		return parts.shift();
	},
	
	getSeparatedPart: function (value, separator, index)
	{
		var parts = XXX_String.splitToArray(value, separator);
		
		return parts[index];
	},
	
	
	filterSuggestion: function (suggestion)
	{
		suggestion = XXX_String_Pattern.replace(suggestion, '\\s{2,}', '', ' ');
		suggestion = XXX_String.trimLeft(suggestion);
		
		return suggestion;
	}
};