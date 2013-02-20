/*

http://www.javascriptkit.com/javatutors/redev3.shtml

String.match - Searches for a match between a regular expression and a string, and returns the matches
String.replace - Searches for a match between a substring (or regular expression) and a string, and replaces the matched substring with a new substring

Pattern.exec - Tests for a match in a string. Returns the first match
Pattern.test - Tests for a match in a string. Returns true or false

Pattern modifiers:
g - global, not just the first match but all

*/

var XXX_String_Pattern =
{
	DELIMITER: '`',
	
	// Use u pattern modifier for additional unicode support like character classes etc.
		
	// Check if a string matches a pattern
	hasMatch: function (string, pattern, patternModifiers)
	{
		var tempPattern = new RegExp(pattern, patternModifiers);
		
		return tempPattern.test(string) ? true : false;
	},
	
	// can't have a g modifier
	replaceReturnInformation: function (string, pattern, patternModifiers, replacement)
	{
		var tempPattern = new RegExp(pattern, patternModifiers);	
		var tempValue, newValue;		
		tempValue = newValue = string;
				
		var matched = true;			
		var replaced = false;
		
		while (matched)
		{
			newValue = tempValue.replace(tempPattern, replacement);
			
			if (newValue === tempValue)
			{
				matched = false;
			}
			else
			{
				matched = true;
				replaced = true;
				tempValue = newValue;
			}
		}
		
		var result = 
		{
			newValue: newValue,
			replaced: replaced
		};
		
		return result;
	},
	
	// Replace a pattern within a string (Gets caught in a loop if the replacement contains something that is in the original pattern)
	replace: function (string, pattern, patternModifiers, replacement, disableGlobalPatternModifier)
	{
		var tempPattern = new RegExp(pattern, patternModifiers + (disableGlobalPatternModifier ? '' : 'g'));	
		var tempValue, newValue;		
		tempValue = newValue = string;
		
		newValue = tempValue.replace(tempPattern, replacement);
				
		return newValue;
	},
	
	// Replace a pattern with a callback function within a string	
	replaceWithCallback: function (string, pattern, patternModifiers, callback, disableGlobalPatternModifier)
	{
		return this.replace(string, pattern, patternModifiers, callback, disableGlobalPatternModifier);
	},
	
	getMatch: function (string, pattern, patternModifiers)
	{
		var tempPattern = new RegExp(pattern, patternModifiers);
		
		return tempPattern.exec(string);
	},
	
	// Get all matches found by a pattern within a string (including capture groups) [0] = full pattern matches [1] = first capture group matches 
	getMatches: function (string, pattern, patternModifiers, disableGlobalPatternModifier)
	{
		var tempPattern = new RegExp(pattern, patternModifiers + (disableGlobalPatternModifier ? '' : 'g'));
		
		var result = [];
		
		var matches = tempPattern.exec(string);
		
		var i = 0;
		
		while (matches)
		{
			if (XXX_Array.getFirstLevelItemTotal(result) === 0)
			{
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(matches); i < iEnd; ++i)
				{
					result.push([matches[i]]);
				}
			}
			else
			{
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(matches); i < iEnd; ++i)
				{
					result[i].push(matches[i]);
				}
			}
			
			matches = tempPattern.exec(string)
		}
		
		return result;
	},
	
	// Split by a pattern within a string
	splitToArray: function (string, pattern, patternModifiers)
	{
		var tempPattern = new RegExp(pattern, patternModifiers);
		
		var result = string.split(tempPattern);
		
		return result;
	}
};