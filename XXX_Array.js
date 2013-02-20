// IE < 6
if (![].push) Array.prototype.push = function ()
{
	for (var i = 0, iEnd = arguments.length; i < iEnd; ++i)
	{
		this[this.length] = arguments[i];
	}
	
	return this.length;
};

var XXX_Array =
{
	createAssociativeArray: function ()
	{
		return {};
	},
	
	createNumericArray: function ()
	{
		return [];
	},

	////////////////////
	// Value & key existance
	////////////////////
	
	hasValue: function (hayStack, needle, recursive, strict)
	{
		recursive = XXX_Type.isBoolean(recursive) ? recursive : true;
		strict = XXX_Type.isBoolean(strict) ? strict : true;
		
		var exists = false;
		
		var possibleNeedle, i, iEnd;
		
		if (XXX_Type.isNumericArray(hayStack))
		{
			for (i = 0, iEnd = hayStack.length; i < iEnd; ++i)
			{
				possibleNeedle = hayStack[i];
				
				if (XXX_Type.isArray(possibleNeedle) && recursive)
				{
					exists = XXX_Array.hasValue(possibleNeedle, needle, true, strict);
				}
				else
				{
					exists = strict ? (needle === possibleNeedle) : (needle == possibleNeedle);
				}
				
				if (exists)
				{
					break;
				}
			}
		}
		else if (XXX_Type.isAssociativeArray(hayStack))
		{
			for (i in hayStack)
			{
				if (hayStack[i])
				{
					possibleNeedle = hayStack[i];
					
					if (XXX_Type.isArray(possibleNeedle) && recursive)
					{
						exists = XXX_Array.hasValue(possibleNeedle, needle, true, strict);
					}
					else
					{
						exists = strict ? (needle === possibleNeedle) : (needle == possibleNeedle);
					}
					
					if (exists)
					{
						break;
					}
				}
			}
		}
		
		return exists;	
	},
	
	hasKey: function (hayStack, needle, recursive, strict)
	{
		recursive = XXX_Type.isBoolean(recursive) ? recursive : true;
		strict = XXX_Type.isBoolean(strict) ? strict : true;
		
		var exists = false;
		
		var possibleNeedle, i, iEnd;
		
		if (XXX_Type.isNumericArray(hayStack))
		{
			for (i = 0, iEnd = hayStack.length; i < iEnd; ++i)
			{
				possibleNeedle = i;
				
				exists = strict ? (needle === possibleNeedle) : (needle == possibleNeedle);
				
				if (!exists && XXX_Type.isArray(hayStack[possibleNeedle]) && recursive)
				{
					exists = XXX_Array.hasValue(hayStack[possibleNeedle], needle, true, strict);
				}
				
				if (exists)
				{
					break;
				}
			}
		}
		else if (XXX_Type.isAssociativeArray(hayStack))
		{
			for (i in hayStack)
			{
				if (hayStack[i])
				{
					possibleNeedle = i;
					
					exists = strict ? (needle === possibleNeedle) : (needle == possibleNeedle);
					
					if (!exists && XXX_Type.isArray(hayStack[possibleNeedle]) && recursive)
					{
						exists = XXX_Array.hasValue(hayStack[possibleNeedle], needle, true, strict);
					}
					
					if (exists)
					{
						break;
					}
				}
			}
		}
		
		return exists;	
	},
		
	////////////////////
	// Matching
	////////////////////
	
	// Find a key (works only on root level)
	getKeyForValue: function (hayStack, value, strict)
	{
		strict = XXX_Type.isBoolean(strict) ? strict : true;
		
		var key = -1;
		
		var exists = false;
		
		var possibleValue, i, iEnd;
		
		if (XXX_Type.isNumericArray(hayStack))
		{
			for (i = 0, iEnd = hayStack.length; i < iEnd; ++i)
			{
				possibleValue = hayStack[i];
				
				exists = strict ? (value === possibleValue) : (value == possibleValue);
				
				if (exists)
				{
					key = i;
					break;
				}
			}
		}
		else if (XXX_Type.isAssociativeArray(hayStack))
		{
			for (i in hayStack)
			{
				
				if (hayStack[i])
				{
					possibleValue = hayStack[i];
				
					exists = strict ? (value === possibleValue) : (value == possibleValue);
					
					if (exists)
					{
						key = i;
						break;
					}
				}
			}
		}
		
		return key;
	},
	
	getKeys: function (array)
	{
		var result = [];
		
		var i, iEnd;
		
		if (XXX_Type.isNumericArray(array))
		{
			for (i = 0, iEnd = array.length; i < iEnd; ++i)
			{
				result.push(i);
			}
		}
		else if (XXX_Type.isAssociativeArray(array))
		{
			for (i in array)
			{
				if (array[i])
				{
					result.push(i);
				}
			}
		}
		
		return result;
	},
	
	////////////////////
	// Merging
	////////////////////
	
	merge: function (array1, array2, strict)
	{
		strict = XXX_Type.isBoolean(strict) ? strict : true;
				
		var i, iEnd, key, keyEnd;
		
		var newArray;
		
		var value;
		
		// Numeric goes before associative due to a numeric array always being a potential associative array etc.
		if (XXX_Type.isNumericArray(array1) && XXX_Type.isNumericArray(array2))
		{
			newArray = [];
			
			// array1 in newArray
			for (i = 0, iEnd = array1.length; i < iEnd; ++i)
			{
				newArray[i] = array1[i];
			}
			
			// array2 overwrite or add in newArray			
			for (key = 0, keyEnd = array2.length; key < keyEnd; ++key)
			{
				value = array2[key];
				
				// Key doesn't exist, so add it
				if (!this.hasValue(newArray, value, false, strict))
				{
					newArray.push(value);
				}
				// Key exists
				else
				{
					// If it is also an array, use recursion
					if (XXX_Type.isArray(newArray[key]) && XXX_Type.isArray(value))
					{
						newArray[key] = this.merge(newArray[key], value);
					}
					// It's a non-array value, override it
					else
					{
						newArray.push(value);
					}
				}
			}			
		}
		else if (XXX_Type.isAssociativeArray(array1) && XXX_Type.isAssociativeArray(array2))
		{
			newArray = {};
			
			// array1 in newArray
			for (i in array1)
			{
				if (array1[i])
				{
					newArray[i] = array1[i];
				}
			}
			
			// array2 overwrite or add in newArray			
			for (key in array2)
			{
				value = array2[key];
				
				// Key doesn't exist, so add it
				if (!this.hasKey(newArray, key, false, strict))
				{
					newArray[key] = value;
				}
				// Key exists
				else
				{
					// If it is also an array, use recursion
					if (XXX_Type.isArray(newArray[key]) && XXX_Type.isArray(value))
					{
						newArray[key] = this.merge(newArray[key], value);
					}
					// It's a non-array value, override it
					else
					{
						newArray[key] = value;
					}
				}
			}
			
		}
		else
		{
			newArray = array2;
		}
		
		return newArray;
	},
	
	////////////////////
	// First level item total
	////////////////////
	
	getFirstLevelItemTotal: function (array)
	{
		var arraySize = 0;
				
		if (XXX_Type.isNumericArray(array))
		{
			arraySize = array.length;
		}
		else if (XXX_Type.isAssociativeArray(array))
		{
			for (var i in array)
			{
				if (array[i])
				{
					++arraySize;
				}
			}
		}
		
		// TODO fix this...
		arraySize = array.length;
				
		return arraySize;
	},
	
	////////////////////
	// Split
	////////////////////
	
	splitOffLastItem: function (array)
	{
		var lastItem = array.pop();
		
		var result =
		{
			'lastItem': lastItem,
			'array': array
		};
		
		return result;
	},
	
	splitOffFirstItem: function (array)
	{
		var firstItem = array.shift();
		
		var result =
		{
			'firstItem': firstItem,
			'array': array
		};
		
		return result;
	},
	
	getPart: function (array, index, length)
	{
		if (XXX_Type.isPositiveInteger(length))
		{
			length = XXX_Array.getFirstLevelItemTotal(array) - index;
		}
		
		return array.slice(index, length);
	},
	
	deletePart: function (array, index, length)
	{
		index = XXX_Default.toPositiveInteger(index, 0);
				
		length = XXX_Default.toPositiveInteger(length, 1);
		
		array.splice(index, length);
		
		return array;
	},
	
		
	////////////////////
	// Deepest level
	////////////////////
	
	getDeepestLevel: function (array, depthCount)
	{
		depthCount = XXX_Type.isInteger(depthCount) ? depthCount : -1;
		
		++depthCount;
		
		var i, iEnd;
		
		var depthArray = [0];
			
		if (XXX_Type.isArray(array))
		{
			if (XXX_Type.isNumericArray(array))
			{
				for (i = 0, iEnd = array.length; i < iEnd; ++i)
				{
					depthArray.push(this.getDeepestLevel(array[i], depthCount));
				}
			}
			else if (XXX_Type.isAssociativeArray(array))
			{
				for (i in array)
				{
					if (array[i])
					{
						depthArray.push(this.getDeepestLevel(array[i], depthCount));
					}
				}
			}
		}
		
		for (i = 0, iEnd = depthArray.length; i < iEnd; ++i)
		{
			depthCount = XXX_Number.highest(depthArray[i], depthCount);
		}
		
		return depthCount;
	},
	
	////////////////////
	// Join
	////////////////////
	
	joinValuesToString: function (array, glue)
	{
		glue = XXX_Type.isValue(glue) ? glue : '';
		
		return array.join(glue);
	},
	
	////////////////////
	// Reverse
	////////////////////
	
	reverse: function (array)
	{
		array.reverse();
		
		return array;
	},
	
	////////////////////
	// Apqueued / Prequeued values
	////////////////////
	
	appendArray: function (array, array2)
	{	
		array = array.concat(array2);
		/*
		if (XXX_Type.isFilledArray(array2))
		{
			for (var i = 0, iEnd = array2.length; i < iEnd; ++i)
			{				
				array.push(array2[i]);	
			}
		}
		*/
		return array;
	},
	prependArray: function (array, array2)
	{
		array2 = array2.concat(array);
		/*
		if (XXX_Type.isFilledArray(array))
		{
			for (var i = 0, iEnd = array.length; i < iEnd; ++i)
			{
				array2.push(array[i]);	
			}
		}
		*/
		
		return array2;
	},
	
	appendValue: function (array, value)
	{
		return array.push(value) - 1;	
	},	
	prependValue: function (array, value)
	{
		return array.unshift(value) ? 0 : false;
	},
	
	////////////////////
	// Sorting
	////////////////////
	
	sortByNumericValue: function (array)
	{		
		return array.sort(function (a, b)
		{
			return a - b;
		});
	},
	
	sortByCharacterLength: function (array)
	{
		return array.sort(function (a, b)
		{
			return XXX_String.getCharacterLength(a) - XXX_String.getCharacterLength(b);
		});
	},
	
	// DateRange is an array consisting of 2 date objects, so [Date, Date]
	
	sortyByDateAndDateRanges: function (array)
	{
		return array.sort(function (a, b)
		{
			if (XXX_Type.isArray(a))
			{
				a = a[0];
			}
			
			if (XXX_Type.isArray(b))
			{
				b = b[0];
			}
			
			return a.getTime() - b.getTime();	
		});
	},
	
	sortyByDateRangeLength: function (array)
	{
		return array.sort(function (a, b)
		{
			var aDifference = 0;
			var bDifference = 0;
			
			if (XXX_Type.isArray(a))
			{
				if (a[0].getTime() <= a[1].getTime())
				{
					aDifference = a[1].getTime() - a[0].getTime();
				}
				else
				{
					aDifference = a[0].getTime() - a[1].getTime();
				}
			}
			
			if (XXX_Type.isArray(b))
			{
				if (b[0].getTime() <= b[1].getTime())
				{
					bDifference = b[1].getTime() - b[0].getTime();
				}
				else
				{
					bDifference = b[0].getTime() - b[1].getTime();
				}
			}
			
			return aDifference - bDifference;	
		});
	},
	
	////////////////////
	// Filtering
	////////////////////
	
	filterOutUndefined: function (array)
	{
		var cleanArray = [];
		
		for (var i = 0, iEnd = array.length; i < iEnd; ++i)
		{
			var tempValue = array[i];
			
			if (!XXX_Type.isVariableUndefined(tempValue))
			{
				cleanArray.push(tempValue);
			}
		}
			
		return cleanArray;
	},
	
	filterOutNull: function (array)
	{
		var cleanArray = [];
		
		for (var i = 0, iEnd = array.length; i < iEnd; ++i)
		{
			var tempValue = array[i];
			
			if (!XXX_Type.isNull(tempValue))
			{
				cleanArray.push(tempValue);
			}
		}
			
		return cleanArray;
	},
	
	filterOutEmpty: function (array)
	{
		var cleanArray = [];
		
		for (var i = 0, iEnd = array.length; i < iEnd; ++i)
		{
			var tempValue = array[i];
			
			if (!XXX_Type.isValue(tempValue))
			{
				cleanArray.push(tempValue);
			}
		}
			
		return cleanArray;
	},
	
	////////////////////
	// Copy
	////////////////////
	
	copy: function (array)
	{
		var newArray = false;
		
		if (XXX_Type.isNumericArray(array))
		{
			newArray = [];
			
			for (var i = 0, iEnd = array.length; i < iEnd; ++i)
			{
				var tempValue = array[i];
				
				if (XXX_Type.isArray(tempValue))
				{
					newArray.push(XXX_Array.copy(tempValue));
				}
				else
				{
					newArray.push(tempValue);
				}
			}
		}
		else if (XXX_Type.isAssociativeArray(array))
		{
			newArray = {};
			
			for (var key in array)
			{
				var tempValue = array[key];
				
				if (XXX_Type.isArray(tempValue))
				{
					newArray[key] = XXX_Array.copy(tempValue);
				}
				else
				{
					newArray[key] = tempValue;
				}
			}
		}
			
		return newArray;
	},
	
	////////////////////
	// Shuffle
	////////////////////
	
	shuffle: function (array)
	{
		for (var j, x, i = array.length; i; j = parseInt(Math.random() * i, 10), x = array[--i], array[i] = array[j], array[j] = x)
		{	
		}
		
		return array;
	},
	
	// E.g. Path_To_doSomething
	
	traverseKeyPath: function (array, keyPath)
	{
		var keyPathParts = XXX_String.splitToArray(keyPath, '>');
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(keyPathParts); i < iEnd; ++i)
		{
			array = array[keyPathParts[i]];
		}
		
		return array;
	}
};
