
var XXX_Type =
{
	////////////////////
	// Boolean
	////////////////////
	
	isBoolean: function (value)
	{
		return typeof value === 'boolean';
	},
	
	isTrue: function (value)
	{
		return value === true;
	},
	
	isFalse: function (value)
	{
		return value === false;
	},
	
	makeBoolean: function (value)
	{
		return value ? true : false;
	},
	
	////////////////////
	// Integer
	////////////////////
	
	isInteger: function (value)
	{
		return this.isNumber(value) && parseInt(value, 10) === value;
	},
	
	isPositiveInteger: function (value)
	{
		return this.isInteger(value) && value >= 0;
	},
	
	isNegativeInteger: function (value)
	{
		return this.isInteger(value) && value <= 0;
	},
	
	isEvenInteger: function (value)
	{
		return this.isInteger(value) && (value % 2 === 0);
	},
	
	isUnevenInteger: function (value)
	{
		return this.isInteger(value) && !(value % 2 === 0);
	},
	
	makeInteger: function (value, base)
	{
		base = base ? base : 10;
		
		var result = parseInt(value, base);
		
		if (isNaN(result))
		{
			result = 0;
		}
		
		return result;
	},
	
	////////////////////
	// Float
	////////////////////
	
	isFloat: function (value)
	{
		return this.isNumber(value) && parseFloat(value) === value;
	},
	
	isPositiveFloat: function (value)
	{
		return this.isFloat(value) && value >= 0;
	},
	
	isNegativeFloat: function (value)
	{
		return this.isFloat(value) && value <= 0;
	},
	
	makeFloat: function (value)
	{
		var result = parseFloat(value);
		
		if (isNaN(result))
		{
			result = 0;
		}
		
		return result;
	},
	
	////////////////////
	// Number (Integer | Float)
	////////////////////
	
	isNumber: function (value)
	{
		return typeof value === 'number' && isFinite(value);
	},
	
	isPositiveNumber: function (value)
	{
		return this.isNumber(value) && value >= 0;
	},
	
	isNegativeNumber: function (value)
	{
		return this.isNumber(value) && value <= 0;
	},
	
	isEvenNumber: function (value)
	{
		return this.isNumber(value) && (value % 2 === 0);
	},
	
	isUnevenNumber: function (value)
	{
		return this.isNumber(value) && !(value % 2 === 0);
	},
	
	makeNumber: function (value)
	{
		if (!this.isNumber(value))
		{
			if (!this.isNumeric(value))
			{
				value = 0;
			}
			else
			{
				if (this.makeInteger(value, 10) == value)
				{
					value = this.makeInteger(value, 10);
				}
				else if (this.makeFloat(value, 10) == value)
				{
					value = this.makeFloat(value);
				}
				else
				{
					value = this.makeInteger(value, 10);	
				}
			}			
		}
		
		return value;
	},
	
	////////////////////
	// Numeric (Integer | Float | String)
	////////////////////
	
	isNumeric: function (value)
	{
		return this.makeInteger(value, 10) == value || this.makeFloat(value) == value;
	},
	
	isPositiveNumeric: function (value)
	{
		return this.isNumeric(value) && this.makeNumber(value) >= 0;
	},
	
	isNegativeNumeric: function (value)
	{
		return this.isNumeric(value) && this.makeNumber(value) <= 0;
	},
	
	isEvenNumeric: function (value)
	{
		return this.isNumeric(value) && (this.makeNumber(value) % 2 === 0);
	},
	
	isUnevenNumeric: function (value)
	{
		return this.isNumeric(value) && !(this.makeNumber(value) % 2 === 0);
	},
	
	////////////////////
	// String
	////////////////////
	
	isString: function (value)
	{
		return typeof value === 'string';
	},
	
	isEmpty: function (value)
	{
		return (this.isNull(value) || this.isVariableUndefined(value) || value === '' || value === []);
	},
	
	isValue: function (value)
	{
		return this.isEmpty(value) === false;
	},
	
	makeString: function (value)
	{
		return ('' + value);
	},
	
	////////////////////
	// Array
	////////////////////
	
	isArray: function (value)
	{
		return (this.isNumericArray(value) || this.isAssociativeArray(value));
	},
	
	isEmptyArray: function (value)
	{
		return this.isArray(value) && XXX_Array.getFirstLevelItemTotal(value) === 0;	
	},
	
	isFilledArray: function (value)
	{
		return this.isArray(value) && XXX_Array.getFirstLevelItemTotal(value) > 0;
	},
	
	isNumericArray: function (value)
	{
		return (value && (value.constructor === Array || value instanceof Array));
	},
	
	isAssociativeArray: function (value)
	{
		return this.isObject(value);
	},
	
	////////////////////
	// Object
	////////////////////
	
	isObject: function (value) 
	{
		return (value instanceof Object || typeof value === 'object');
	},
	
	////////////////////
	// Function
	////////////////////
	
	isFunction: function (value)
	{
		return typeof value == 'function';
	},
	
	////////////////////
	// Null
	////////////////////
	
	isNull: function (value)
	{
		return value === null || value == 'null';
	},
	
	////////////////////
	// Timestamp
	////////////////////
	
	isTimestamp: function (value)
	{
		return value instanceof XXX_Timestamp;
	},
			
	////////////////////
	// DOM
	////////////////////
	
	isElement: function (value)
	{
		return this.isElementNode(value);
	},
	
	isElementNode: function (value)
	{
		return value && value.nodeType == 1;
	},
	
	isAttributeNode: function (value)
	{
		return value && value.nodeType == 2;
	},
	
	isTextNode: function (value)
	{
		return value && value.nodeType == 3;
	},
	
	isCdataNode: function (value)
	{
		return value && value.nodeType == 4;
	},
	
	////////////////////
	// Variable
	////////////////////
	
	isVariable: function (value)
	{
		return !this.isVariableUndefined(value);
	},
	
	isVariableDefined: function (value)
	{
		return !this.isVariableUndefined(value);
	},
	
	isVariableUndefined: function (value)
	{
		return typeof value === 'undefined' || value === undefined;
	}
};
