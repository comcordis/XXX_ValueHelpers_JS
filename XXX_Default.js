
var XXX_Default =
{
	toOption: function (value, options, defaultOption)
	{
		if (!XXX_Array.hasValue(options, value))
		{
			value = defaultOption;
		}
		
		return value;
	},
	
	toInteger: function (value, defaultInteger)
	{
		if (!XXX_Type.isInteger(value))
		{
			value = defaultInteger;
		}
		
		return value;
	},
	
	toIntegerRange: function (value, minimumInteger, maximumInteger, defaultInteger)
	{
		if (!XXX_Type.isInteger(value))
		{
			value = defaultInteger;
		}
		
		if (value < minimumInteger)
		{
			value = minimumInteger;
		}
		
		if (value > maximumInteger)
		{
			value = maximumInteger;
		}
		
		return value;
	},
	
	toMinimumInteger: function (value, minimumInteger)
	{
		if (!XXX_Type.isInteger(value))
		{
			value = minimumInteger;
		}
		
		if (value < minimumInteger)
		{
			value = minimumInteger;
		}
		
		return value;
	},
	
	toMaximumInteger: function (value, maximumInteger)
	{
		if (!XXX_Type.isInteger(value))
		{
			value = maximumInteger;
		}
		
		if (value > maximumInteger)
		{
			value = maximumInteger;
		}
		
		return value;
	},
	
	toPositiveInteger: function (value, defaultInteger)
	{
		if (!XXX_Type.isInteger(value))
		{
			value = defaultInteger;
		}
		
		if (value < 0)
		{
			value = defaultInteger;
		}
		
		return value;
	},
	
	toString: function (value, defaultString)
	{
		if (!XXX_Type.isString(value))
		{
			value = defaultString;
		}
		
		return value;
	},
	
	toBoolean: function (value, defaultBoolean)
	{
		if (!XXX_Type.isBoolean(value))
		{
			value = defaultBoolean ? true : false;
		}
		
		return value;
	}
};