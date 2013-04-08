
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
	},
	
	////////////////////
	// Unique characters / Entropy
	////////////////////
	
	getUniqueCharacterInformation: function (subject)
	{
		var characterLength = XXX_String.getCharacterLength(subject);
		
		var counts = [];
		
		for (var i = 0, iEnd = characterLength; i < iEnd; ++i)
		{
			var character = XXX_String.getCharacterAtPosition(subject, i);
			
			var alreadyHaveARecord = false;
			
			for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(counts); j < jEnd; ++j)
			{
				if (counts[j].character == character)
				{
					++counts[j].count;
				}
			}
			
			if (alreadyHaveARecord == false)
			{
				counts.push({character: character, count: 1});
			}
		}
		
		var uniqueCharacterTotal = XXX_Array.getFirstLevelItemTotal(temp);
		
		var averageCharacterFrequency = characterLength / uniqueCharacterTotal;
		
		// Sort from high to low
		counts.sort(function(a, b)
		{
			return b.count - a.count;
		});
		
		/*
		aaaa -> 0%
		aada -> 25%
		aadda -> 40%
		fadda -> 60%
		*/
		
		var percentage = 0;
		var otherCharacterTotal = 0;
		
		if (XXX_Array.getFirstLevelItemTotal(counts) > 1)
		{
			for (var i = 1, iEnd = XXX_Array.getFirstLevelItemTotal(counts); i < iEnd; ++i)
			{
				otherCharacterTotal += counts[i].count;
			}
			
			percentage = (otherCharacterTotal / characterLength) * 100;
		}
		
		var result =
		{
			characterLength: characterLength,
			uniqueCharacterTotal: uniqueCharacterTotal,
			otherCharacterTotal: otherCharacterTotal,
			averageCharacterFrequency: averageCharacterFrequency,
			percentage: percentage,
			counts: counts
		};
		
		return result;
	},
	
	/*
	Entropy: Number of bits H it would take to represent every combination of characterLength L with an alphabet of N different characters.
	The higher, the complexer (and thus better for for example a password)
	
	H = L log 2 N
		- H: entropy
		- L: characterLength
		- N: alphabetSize (Usually measured in bits)		
		
		function calculateAlphabetSize(password) {
		var alphabet = 0, lower = false, upper = false, numbers = false, symbols1 = false, symbols2 = false, other = '', c;
		
		for(var i = 0; i < password.length; i++) {
			c = password[i];
			if(!lower && 'abcdefghijklmnopqrstuvwxyz'.indexOf(c) >= 0) {
				alphabet += 26;
				lower = true;
			}
			else if(!upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0) {
				alphabet += 26;
				upper = true;
			}
			else if(!numbers && '0123456789'.indexOf(c) >= 0) {
				alphabet += 10;
				numbers = true;
			}
			else if(!symbols1 && '!@#$%^&*()'.indexOf(c) >= 0) {
				alphabet += 10;
				symbols1 = true;
			}
			else if(!symbols2 && '~`-_=+[]{}\\|;:\'",.<>?/'.indexOf(c) >= 0) {
				alphabet += 22;
				symbols2 = true;
			}
			else if(other.indexOf(c) === -1) {
				alphabet += 1;
				other += c;
			}
		}
		
		return alphabet;
	}
	*/
	getEntropy: function (subject)
	{
		var uniqueCharacterInformation = this.getUniqueCharacterInformation(subject);
		
		var characterLength = uniqueCharacterInformation.characterLength;
		var alphabetSize = uniqueCharacterInformation.uniqueCharacterTotal;
		
		var entropy = 0;
		
		if (characterLength > 0)
		{
			entropy = (characterLength * XXX_Number.log(alphabetSize)) / XXX_Number.log(2);
		}
		
		return entropy;
	},
	
	////////////////////
	// Accented characters
	////////////////////
	
	accentedCharacterBaseCharacters:
	{
		'Á': 'A',
		'Ă': 'A',
		'Ắ': 'A',
		'Ặ': 'A',
		'Ằ': 'A',
		'Ẳ': 'A',
		'Ẵ': 'A',
		'Ǎ': 'A',
		'Â': 'A',
		'Ấ': 'A',
		'Ậ': 'A',
		'Ầ': 'A',
		'Ẩ': 'A',
		'Ẫ': 'A',
		'Ä': 'A',
		'Ǟ': 'A',
		'Ȧ': 'A',
		'Ǡ': 'A',
		'Ạ': 'A',
		'Ȁ': 'A',
		'À': 'A',
		'Ả': 'A',
		'Ȃ': 'A',
		'Ā': 'A',
		'Ą': 'A',
		'Å': 'A',
		'Ǻ': 'A',
		'Ḁ': 'A',
		'Ⱥ': 'A',
		'Ã': 'A',
		'Ꜳ': 'AA',
		'Æ': 'AE',
		'Ǽ': 'AE',
		'Ǣ': 'AE',
		'Ꜵ': 'AO',
		'Ꜷ': 'AU',
		'Ꜹ': 'AV',
		'Ꜻ': 'AV',
		'Ꜽ': 'AY',
		'Ḃ': 'B',
		'Ḅ': 'B',
		'Ɓ': 'B',
		'Ḇ': 'B',
		'Ƀ': 'B',
		'Ƃ': 'B',
		'Ć': 'C',
		'Č': 'C',
		'Ç': 'C',
		'Ḉ': 'C',
		'Ĉ': 'C',
		'Ċ': 'C',
		'Ƈ': 'C',
		'Ȼ': 'C',
		'Ď': 'D',
		'Ḑ': 'D',
		'Ḓ': 'D',
		'Ḋ': 'D',
		'Ḍ': 'D',
		'Ɗ': 'D',
		'Ḏ': 'D',
		'ǲ': 'D',
		'ǅ': 'D',
		'Đ': 'D',
		'Ƌ': 'D',
		'Ǳ': 'DZ',
		'Ǆ': 'DZ',
		'É': 'E',
		'Ĕ': 'E',
		'Ě': 'E',
		'Ȩ': 'E',
		'Ḝ': 'E',
		'Ê': 'E',
		'Ế': 'E',
		'Ệ': 'E',
		'Ề': 'E',
		'Ể': 'E',
		'Ễ': 'E',
		'Ḙ': 'E',
		'Ë': 'E',
		'Ė': 'E',
		'Ẹ': 'E',
		'Ȅ': 'E',
		'È': 'E',
		'Ẻ': 'E',
		'Ȇ': 'E',
		'Ē': 'E',
		'Ḗ': 'E',
		'Ḕ': 'E',
		'Ę': 'E',
		'Ɇ': 'E',
		'Ẽ': 'E',
		'Ḛ': 'E',
		'Ꝫ': 'ET',
		'Ḟ': 'F',
		'Ƒ': 'F',
		'Ǵ': 'G',
		'Ğ': 'G',
		'Ǧ': 'G',
		'Ģ': 'G',
		'Ĝ': 'G',
		'Ġ': 'G',
		'Ɠ': 'G',
		'Ḡ': 'G',
		'Ǥ': 'G',
		'Ḫ': 'H',
		'Ȟ': 'H',
		'Ḩ': 'H',
		'Ĥ': 'H',
		'Ⱨ': 'H',
		'Ḧ': 'H',
		'Ḣ': 'H',
		'Ḥ': 'H',
		'Ħ': 'H',
		'Í': 'I',
		'Ĭ': 'I',
		'Ǐ': 'I',
		'Î': 'I',
		'Ï': 'I',
		'Ḯ': 'I',
		'İ': 'I',
		'Ị': 'I',
		'Ȉ': 'I',
		'Ì': 'I',
		'Ỉ': 'I',
		'Ȋ': 'I',
		'Ī': 'I',
		'Į': 'I',
		'Ɨ': 'I',
		'Ĩ': 'I',
		'Ḭ': 'I',
		'Ꝺ': 'D',
		'Ꝼ': 'F',
		'Ᵹ': 'G',
		'Ꞃ': 'R',
		'Ꞅ': 'S',
		'Ꞇ': 'T',
		'Ꝭ': 'IS',
		'Ĵ': 'J',
		'Ɉ': 'J',
		'Ḱ': 'K',
		'Ǩ': 'K',
		'Ķ': 'K',
		'Ⱪ': 'K',
		'Ꝃ': 'K',
		'Ḳ': 'K',
		'Ƙ': 'K',
		'Ḵ': 'K',
		'Ꝁ': 'K',
		'Ꝅ': 'K',
		'Ĺ': 'L',
		'Ƚ': 'L',
		'Ľ': 'L',
		'Ļ': 'L',
		'Ḽ': 'L',
		'Ḷ': 'L',
		'Ḹ': 'L',
		'Ⱡ': 'L',
		'Ꝉ': 'L',
		'Ḻ': 'L',
		'Ŀ': 'L',
		'Ɫ': 'L',
		'ǈ': 'L',
		'Ł': 'L',
		'Ǉ': 'LJ',
		'Ḿ': 'M',
		'Ṁ': 'M',
		'Ṃ': 'M',
		'Ɱ': 'M',
		'Ń': 'N',
		'Ň': 'N',
		'Ņ': 'N',
		'Ṋ': 'N',
		'Ṅ': 'N',
		'Ṇ': 'N',
		'Ǹ': 'N',
		'Ɲ': 'N',
		'Ṉ': 'N',
		'Ƞ': 'N',
		'ǋ': 'N',
		'Ñ': 'N',
		'Ǌ': 'NJ',
		'Ó': 'O',
		'Ŏ': 'O',
		'Ǒ': 'O',
		'Ô': 'O',
		'Ố': 'O',
		'Ộ': 'O',
		'Ồ': 'O',
		'Ổ': 'O',
		'Ỗ': 'O',
		'Ö': 'O',
		'Ȫ': 'O',
		'Ȯ': 'O',
		'Ȱ': 'O',
		'Ọ': 'O',
		'Ő': 'O',
		'Ȍ': 'O',
		'Ò': 'O',
		'Ỏ': 'O',
		'Ơ': 'O',
		'Ớ': 'O',
		'Ợ': 'O',
		'Ờ': 'O',
		'Ở': 'O',
		'Ỡ': 'O',
		'Ȏ': 'O',
		'Ꝋ': 'O',
		'Ꝍ': 'O',
		'Ō': 'O',
		'Ṓ': 'O',
		'Ṑ': 'O',
		'Ɵ': 'O',
		'Ǫ': 'O',
		'Ǭ': 'O',
		'Ø': 'O',
		'Ǿ': 'O',
		'Õ': 'O',
		'Ṍ': 'O',
		'Ṏ': 'O',
		'Ȭ': 'O',
		'Ƣ': 'OI',
		'Ꝏ': 'OO',
		'Ɛ': 'E',
		'Ɔ': 'O',
		'Ȣ': 'OU',
		'Ṕ': 'P',
		'Ṗ': 'P',
		'Ꝓ': 'P',
		'Ƥ': 'P',
		'Ꝕ': 'P',
		'Ᵽ': 'P',
		'Ꝑ': 'P',
		'Ꝙ': 'Q',
		'Ꝗ': 'Q',
		'Ŕ': 'R',
		'Ř': 'R',
		'Ŗ': 'R',
		'Ṙ': 'R',
		'Ṛ': 'R',
		'Ṝ': 'R',
		'Ȑ': 'R',
		'Ȓ': 'R',
		'Ṟ': 'R',
		'Ɍ': 'R',
		'Ɽ': 'R',
		'Ꜿ': 'C',
		'Ǝ': 'E',
		'Ś': 'S',
		'Ṥ': 'S',
		'Š': 'S',
		'Ṧ': 'S',
		'Ş': 'S',
		'Ŝ': 'S',
		'Ș': 'S',
		'Ṡ': 'S',
		'Ṣ': 'S',
		'Ṩ': 'S',
		'Ť': 'T',
		'Ţ': 'T',
		'Ṱ': 'T',
		'Ț': 'T',
		'Ⱦ': 'T',
		'Ṫ': 'T',
		'Ṭ': 'T',
		'Ƭ': 'T',
		'Ṯ': 'T',
		'Ʈ': 'T',
		'Ŧ': 'T',
		'Ɐ': 'A',
		'Ꞁ': 'L',
		'Ɯ': 'M',
		'Ʌ': 'V',
		'Ꜩ': 'TZ',
		'Ú': 'U',
		'Ŭ': 'U',
		'Ǔ': 'U',
		'Û': 'U',
		'Ṷ': 'U',
		'Ü': 'U',
		'Ǘ': 'U',
		'Ǚ': 'U',
		'Ǜ': 'U',
		'Ǖ': 'U',
		'Ṳ': 'U',
		'Ụ': 'U',
		'Ű': 'U',
		'Ȕ': 'U',
		'Ù': 'U',
		'Ủ': 'U',
		'Ư': 'U',
		'Ứ': 'U',
		'Ự': 'U',
		'Ừ': 'U',
		'Ử': 'U',
		'Ữ': 'U',
		'Ȗ': 'U',
		'Ū': 'U',
		'Ṻ': 'U',
		'Ų': 'U',
		'Ů': 'U',
		'Ũ': 'U',
		'Ṹ': 'U',
		'Ṵ': 'U',
		'Ꝟ': 'V',
		'Ṿ': 'V',
		'Ʋ': 'V',
		'Ṽ': 'V',
		'Ꝡ': 'VY',
		'Ẃ': 'W',
		'Ŵ': 'W',
		'Ẅ': 'W',
		'Ẇ': 'W',
		'Ẉ': 'W',
		'Ẁ': 'W',
		'Ⱳ': 'W',
		'Ẍ': 'X',
		'Ẋ': 'X',
		'Ý': 'Y',
		'Ŷ': 'Y',
		'Ÿ': 'Y',
		'Ẏ': 'Y',
		'Ỵ': 'Y',
		'Ỳ': 'Y',
		'Ƴ': 'Y',
		'Ỷ': 'Y',
		'Ỿ': 'Y',
		'Ȳ': 'Y',
		'Ɏ': 'Y',
		'Ỹ': 'Y',
		'Ź': 'Z',
		'Ž': 'Z',
		'Ẑ': 'Z',
		'Ⱬ': 'Z',
		'Ż': 'Z',
		'Ẓ': 'Z',
		'Ȥ': 'Z',
		'Ẕ': 'Z',
		'Ƶ': 'Z',
		'Ĳ': 'IJ',
		'Œ': 'OE',
		'ᴀ': 'A',
		'ᴁ': 'AE',
		'ʙ': 'B',
		'ᴃ': 'B',
		'ᴄ': 'C',
		'ᴅ': 'D',
		'ᴇ': 'E',
		'ꜰ': 'F',
		'ɢ': 'G',
		'ʛ': 'G',
		'ʜ': 'H',
		'ɪ': 'I',
		'ʁ': 'R',
		'ᴊ': 'J',
		'ᴋ': 'K',
		'ʟ': 'L',
		'ᴌ': 'L',
		'ᴍ': 'M',
		'ɴ': 'N',
		'ᴏ': 'O',
		'ɶ': 'OE',
		'ᴐ': 'O',
		'ᴕ': 'OU',
		'ᴘ': 'P',
		'ʀ': 'R',
		'ᴎ': 'N',
		'ᴙ': 'R',
		'ꜱ': 'S',
		'ᴛ': 'T',
		'ⱻ': 'E',
		'ᴚ': 'R',
		'ᴜ': 'U',
		'ᴠ': 'V',
		'ᴡ': 'W',
		'ʏ': 'Y',
		'ᴢ': 'Z',
		'á': 'a',
		'ă': 'a',
		'ắ': 'a',
		'ặ': 'a',
		'ằ': 'a',
		'ẳ': 'a',
		'ẵ': 'a',
		'ǎ': 'a',
		'â': 'a',
		'ấ': 'a',
		'ậ': 'a',
		'ầ': 'a',
		'ẩ': 'a',
		'ẫ': 'a',
		'ä': 'a',
		'ǟ': 'a',
		'ȧ': 'a',
		'ǡ': 'a',
		'ạ': 'a',
		'ȁ': 'a',
		'à': 'a',
		'ả': 'a',
		'ȃ': 'a',
		'ā': 'a',
		'ą': 'a',
		'ᶏ': 'a',
		'ẚ': 'a',
		'å': 'a',
		'ǻ': 'a',
		'ḁ': 'a',
		'ⱥ': 'a',
		'ã': 'a',
		'ꜳ': 'aa',
		'æ': 'ae',
		'ǽ': 'ae',
		'ǣ': 'ae',
		'ꜵ': 'ao',
		'ꜷ': 'au',
		'ꜹ': 'av',
		'ꜻ': 'av',
		'ꜽ': 'ay',
		'ḃ': 'b',
		'ḅ': 'b',
		'ɓ': 'b',
		'ḇ': 'b',
		'ᵬ': 'b',
		'ᶀ': 'b',
		'ƀ': 'b',
		'ƃ': 'b',
		'ɵ': 'o',
		'ć': 'c',
		'č': 'c',
		'ç': 'c',
		'ḉ': 'c',
		'ĉ': 'c',
		'ɕ': 'c',
		'ċ': 'c',
		'ƈ': 'c',
		'ȼ': 'c',
		'ď': 'd',
		'ḑ': 'd',
		'ḓ': 'd',
		'ȡ': 'd',
		'ḋ': 'd',
		'ḍ': 'd',
		'ɗ': 'd',
		'ᶑ': 'd',
		'ḏ': 'd',
		'ᵭ': 'd',
		'ᶁ': 'd',
		'đ': 'd',
		'ɖ': 'd',
		'ƌ': 'd',
		'ı': 'i',
		'ȷ': 'j',
		'ɟ': 'j',
		'ʄ': 'j',
		'ǳ': 'dz',
		'ǆ': 'dz',
		'é': 'e',
		'ĕ': 'e',
		'ě': 'e',
		'ȩ': 'e',
		'ḝ': 'e',
		'ê': 'e',
		'ế': 'e',
		'ệ': 'e',
		'ề': 'e',
		'ể': 'e',
		'ễ': 'e',
		'ḙ': 'e',
		'ë': 'e',
		'ė': 'e',
		'ẹ': 'e',
		'ȅ': 'e',
		'è': 'e',
		'ẻ': 'e',
		'ȇ': 'e',
		'ē': 'e',
		'ḗ': 'e',
		'ḕ': 'e',
		'ⱸ': 'e',
		'ę': 'e',
		'ᶒ': 'e',
		'ɇ': 'e',
		'ẽ': 'e',
		'ḛ': 'e',
		'ꝫ': 'et',
		'ḟ': 'f',
		'ƒ': 'f',
		'ᵮ': 'f',
		'ᶂ': 'f',
		'ǵ': 'g',
		'ğ': 'g',
		'ǧ': 'g',
		'ģ': 'g',
		'ĝ': 'g',
		'ġ': 'g',
		'ɠ': 'g',
		'ḡ': 'g',
		'ᶃ': 'g',
		'ǥ': 'g',
		'ḫ': 'h',
		'ȟ': 'h',
		'ḩ': 'h',
		'ĥ': 'h',
		'ⱨ': 'h',
		'ḧ': 'h',
		'ḣ': 'h',
		'ḥ': 'h',
		'ɦ': 'h',
		'ẖ': 'h',
		'ħ': 'h',
		'ƕ': 'hv',
		'í': 'i',
		'ĭ': 'i',
		'ǐ': 'i',
		'î': 'i',
		'ï': 'i',
		'ḯ': 'i',
		'ị': 'i',
		'ȉ': 'i',
		'ì': 'i',
		'ỉ': 'i',
		'ȋ': 'i',
		'ī': 'i',
		'į': 'i',
		'ᶖ': 'i',
		'ɨ': 'i',
		'ĩ': 'i',
		'ḭ': 'i',
		'ꝺ': 'd',
		'ꝼ': 'f',
		'ᵹ': 'g',
		'ꞃ': 'r',
		'ꞅ': 's',
		'ꞇ': 't',
		'ꝭ': 'is',
		'ǰ': 'j',
		'ĵ': 'j',
		'ʝ': 'j',
		'ɉ': 'j',
		'ḱ': 'k',
		'ǩ': 'k',
		'ķ': 'k',
		'ⱪ': 'k',
		'ꝃ': 'k',
		'ḳ': 'k',
		'ƙ': 'k',
		'ḵ': 'k',
		'ᶄ': 'k',
		'ꝁ': 'k',
		'ꝅ': 'k',
		'ĺ': 'l',
		'ƚ': 'l',
		'ɬ': 'l',
		'ľ': 'l',
		'ļ': 'l',
		'ḽ': 'l',
		'ȴ': 'l',
		'ḷ': 'l',
		'ḹ': 'l',
		'ⱡ': 'l',
		'ꝉ': 'l',
		'ḻ': 'l',
		'ŀ': 'l',
		'ɫ': 'l',
		'ᶅ': 'l',
		'ɭ': 'l',
		'ł': 'l',
		'ǉ': 'lj',
		'ſ': 's',
		'ẜ': 's',
		'ẛ': 's',
		'ẝ': 's',
		'ḿ': 'm',
		'ṁ': 'm',
		'ṃ': 'm',
		'ɱ': 'm',
		'ᵯ': 'm',
		'ᶆ': 'm',
		'ń': 'n',
		'ň': 'n',
		'ņ': 'n',
		'ṋ': 'n',
		'ȵ': 'n',
		'ṅ': 'n',
		'ṇ': 'n',
		'ǹ': 'n',
		'ɲ': 'n',
		'ṉ': 'n',
		'ƞ': 'n',
		'ᵰ': 'n',
		'ᶇ': 'n',
		'ɳ': 'n',
		'ñ': 'n',
		'ǌ': 'nj',
		'ó': 'o',
		'ŏ': 'o',
		'ǒ': 'o',
		'ô': 'o',
		'ố': 'o',
		'ộ': 'o',
		'ồ': 'o',
		'ổ': 'o',
		'ỗ': 'o',
		'ö': 'o',
		'ȫ': 'o',
		'ȯ': 'o',
		'ȱ': 'o',
		'ọ': 'o',
		'ő': 'o',
		'ȍ': 'o',
		'ò': 'o',
		'ỏ': 'o',
		'ơ': 'o',
		'ớ': 'o',
		'ợ': 'o',
		'ờ': 'o',
		'ở': 'o',
		'ỡ': 'o',
		'ȏ': 'o',
		'ꝋ': 'o',
		'ꝍ': 'o',
		'ⱺ': 'o',
		'ō': 'o',
		'ṓ': 'o',
		'ṑ': 'o',
		'ǫ': 'o',
		'ǭ': 'o',
		'ø': 'o',
		'ǿ': 'o',
		'õ': 'o',
		'ṍ': 'o',
		'ṏ': 'o',
		'ȭ': 'o',
		'ƣ': 'oi',
		'ꝏ': 'oo',
		'ɛ': 'e',
		'ᶓ': 'e',
		'ɔ': 'o',
		'ᶗ': 'o',
		'ȣ': 'ou',
		'ṕ': 'p',
		'ṗ': 'p',
		'ꝓ': 'p',
		'ƥ': 'p',
		'ᵱ': 'p',
		'ᶈ': 'p',
		'ꝕ': 'p',
		'ᵽ': 'p',
		'ꝑ': 'p',
		'ꝙ': 'q',
		'ʠ': 'q',
		'ɋ': 'q',
		'ꝗ': 'q',
		'ŕ': 'r',
		'ř': 'r',
		'ŗ': 'r',
		'ṙ': 'r',
		'ṛ': 'r',
		'ṝ': 'r',
		'ȑ': 'r',
		'ɾ': 'r',
		'ᵳ': 'r',
		'ȓ': 'r',
		'ṟ': 'r',
		'ɼ': 'r',
		'ᵲ': 'r',
		'ᶉ': 'r',
		'ɍ': 'r',
		'ɽ': 'r',
		'ↄ': 'c',
		'ꜿ': 'c',
		'ɘ': 'e',
		'ɿ': 'r',
		'ś': 's',
		'ṥ': 's',
		'š': 's',
		'ṧ': 's',
		'ş': 's',
		'ŝ': 's',
		'ș': 's',
		'ṡ': 's',
		'ṣ': 's',
		'ṩ': 's',
		'ʂ': 's',
		'ᵴ': 's',
		'ᶊ': 's',
		'ȿ': 's',
		'ɡ': 'g',
		'ᴑ': 'o',
		'ᴓ': 'o',
		'ᴝ': 'u',
		'ť': 't',
		'ţ': 't',
		'ṱ': 't',
		'ț': 't',
		'ȶ': 't',
		'ẗ': 't',
		'ⱦ': 't',
		'ṫ': 't',
		'ṭ': 't',
		'ƭ': 't',
		'ṯ': 't',
		'ᵵ': 't',
		'ƫ': 't',
		'ʈ': 't',
		'ŧ': 't',
		'ᵺ': 'th',
		'ɐ': 'a',
		'ᴂ': 'ae',
		'ǝ': 'e',
		'ᵷ': 'g',
		'ɥ': 'h',
		'ʮ': 'h',
		'ʯ': 'h',
		'ᴉ': 'i',
		'ʞ': 'k',
		'ꞁ': 'l',
		'ɯ': 'm',
		'ɰ': 'm',
		'ᴔ': 'oe',
		'ɹ': 'r',
		'ɻ': 'r',
		'ɺ': 'r',
		'ⱹ': 'r',
		'ʇ': 't',
		'ʌ': 'v',
		'ʍ': 'w',
		'ʎ': 'y',
		'ꜩ': 'tz',
		'ú': 'u',
		'ŭ': 'u',
		'ǔ': 'u',
		'û': 'u',
		'ṷ': 'u',
		'ü': 'u',
		'ǘ': 'u',
		'ǚ': 'u',
		'ǜ': 'u',
		'ǖ': 'u',
		'ṳ': 'u',
		'ụ': 'u',
		'ű': 'u',
		'ȕ': 'u',
		'ù': 'u',
		'ủ': 'u',
		'ư': 'u',
		'ứ': 'u',
		'ự': 'u',
		'ừ': 'u',
		'ử': 'u',
		'ữ': 'u',
		'ȗ': 'u',
		'ū': 'u',
		'ṻ': 'u',
		'ų': 'u',
		'ᶙ': 'u',
		'ů': 'u',
		'ũ': 'u',
		'ṹ': 'u',
		'ṵ': 'u',
		'ᵫ': 'ue',
		'ꝸ': 'um',
		'ⱴ': 'v',
		'ꝟ': 'v',
		'ṿ': 'v',
		'ʋ': 'v',
		'ᶌ': 'v',
		'ⱱ': 'v',
		'ṽ': 'v',
		'ꝡ': 'vy',
		'ẃ': 'w',
		'ŵ': 'w',
		'ẅ': 'w',
		'ẇ': 'w',
		'ẉ': 'w',
		'ẁ': 'w',
		'ⱳ': 'w',
		'ẘ': 'w',
		'ẍ': 'x',
		'ẋ': 'x',
		'ᶍ': 'x',
		'ý': 'y',
		'ŷ': 'y',
		'ÿ': 'y',
		'ẏ': 'y',
		'ỵ': 'y',
		'ỳ': 'y',
		'ƴ': 'y',
		'ỷ': 'y',
		'ỿ': 'y',
		'ȳ': 'y',
		'ẙ': 'y',
		'ɏ': 'y',
		'ỹ': 'y',
		'ź': 'z',
		'ž': 'z',
		'ẑ': 'z',
		'ʑ': 'z',
		'ⱬ': 'z',
		'ż': 'z',
		'ẓ': 'z',
		'ȥ': 'z',
		'ẕ': 'z',
		'ᵶ': 'z',
		'ᶎ': 'z',
		'ʐ': 'z',
		'ƶ': 'z',
		'ɀ': 'z',
		'ﬀ': 'ff',
		'ﬃ': 'ffi',
		'ﬄ': 'ffl',
		'ﬁ': 'fi',
		'ﬂ': 'fl',
		'ĳ': 'ij',
		'œ': 'oe',
		'ﬆ': 'st',
		'ₐ': 'a',
		'ₑ': 'e',
		'ᵢ': 'i',
		'ⱼ': 'j',
		'ₒ': 'o',
		'ᵣ': 'r',
		'ᵤ': 'u',
		'ᵥ': 'v',
		'ₓ': 'x',
		'ß': 'ss',
		'ẞ': 'SS'
	},
		
	convertAccentedCharactersToNormalCharacters: function (subject)
	{
		var result = '';
		
		var characterLength = XXX_String.getCharacterLength(subject);
		
		if (characterLength > 0)
		{
			for (var i = 0, iEnd = characterLength; i < iEnd; ++i)
			{
				var potentialAccentedCharacter = XXX_String.getPart(subject, i, 1);
				
				var replacement = this.accentedCharacterBaseCharacters[potentialAccentedCharacter];
				
				if (replacement)
				{
					result += replacement;
				}
				else
				{
					result += potentialAccentedCharacter;
				}
			}
		}
		
		return result;
	},
	
	simplifyCharacters: function (subject)
	{
		subject = XXX_String.convertAccentedCharactersToNormalCharacters(subject);
		subject = XXX_String.convertToLowerCase(subject);
		
		return subject;
	},
	
	// Without accents and case-insensitive
	isSimplifiedIdentical: function (a, b)
	{
		var result = (this.simplifyCharacters(a) == this.simplifyCharacters(b));
		
		return result;
	}
};