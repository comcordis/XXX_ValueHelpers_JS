
var XXX_Number =
{
	////////////////////
	// Random
	////////////////////
	
	getRandomFraction: function ()
	{
		return Math.random();
	},
	
	getRandomNumber: function (minimum, maximum)
	{
		if (!XXX_Type.isNumber(minimum))
		{
			minimum = 0;
		}
		
		if (!XXX_Type.isNumber(maximum))
		{
			maximum = 1;
		}
		
		var result = (minimum + ((maximum - minimum) * this.getRandomFraction()));
		
		if (!(minimum === 0 && maximum === 1))
		{
			result = this.round(result, 0);
		}
		
		return result;
	},
	
	////////////////////
	// Base
	////////////////////
	
	convertBase: function (number, from, to)
	{
		from = XXX_Type.isInteger(from) ? from : 10;
		to = XXX_Type.isInteger(to) ? to : 0;
		
		number = XXX_Type.makeString(number);
		
		var baseCharacters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		
		// From base to decimal
		var decimal = 0;
		
		var fromBase = baseCharacters.substr(0, from);
		var fromBaseLength = fromBase.length;
		
		for (var x = 1; number.length > 0; x *= fromBaseLength)
		{
			decimal += fromBase.indexOf(number.charAt(number.length - 1)) * x;
			
			number = number.substr(0, number.length - 1);
		}
				
		// From decimal to base
		number = '';
		
		var toBase = baseCharacters.substr(0, to);
		var toBaseLength = toBase.length;
		
		if (decimal === 0)
		{
			number = toBase.charAt(decimal % toBaseLength) + number;
		}
		else
		{	
			while (decimal > 0)
			{
				number = toBase.charAt(decimal % toBaseLength) + number;
				
				decimal = Math.floor(decimal / toBaseLength);
			}
		}
		
		if (to == 10)
		{
			number = XXX_Type.makeInteger(number);	
		}
		
		return number;
	},
	
	////////////////////
	// Lowest & Highest
	////////////////////
	
	lowest: function ()
	{
		var lowest;
				
		if (XXX_Array.getFirstLevelItemTotal(arguments))
		{
			lowest = arguments[0];
			
			for (var i = 0, iEnd = arguments.length; i < iEnd; ++i)
			{
				lowest = Math.min(arguments[i], lowest);
			}
		}
		else
		{
			lowest = 0;
		}
		
		return lowest;
	},
	
	highest: function ()
	{
		var highest = 0;
		
		if (XXX_Array.getFirstLevelItemTotal(arguments))
		{
			highest = arguments[0];
			
			for (var i = 0, iEnd = arguments.length; i < iEnd; ++i)
			{
				highest = Math.max(arguments[i], highest);
			}
		}
		else
		{
			highest = 0;
		}
		
		return highest;
	},
	
	////////////////////
	// Force in range
	////////////////////
		
	forceInRange: function (number, minimum, maximum)
	{
		return Math.max(minimum, Math.min(number, maximum));
	},
	
	forceMinimum: function (number, minimum)
	{
		return Math.max(minimum, number);
	},
	
	forceMaximum: function (number, maximum)
	{
		return Math.min(number, maximum);
	},
	
	////////////////////
	// Rounding
	////////////////////
	
	floor: function (number)
	{
		return Math.floor(number);
	},
	
	ceil: function (number)
	{
		return Math.ceil(number);
	},
	
	round: function (number, decimals)
	{
		decimals = XXX_Type.isPositiveInteger(decimals) ? decimals : 0;
		
		var temp = Math.pow(10, decimals);
		
		return Math.round(number * temp) / temp;	
	},
	
	////////////////////
	// Math
	////////////////////
	
	power: function (number, power)
	{
		power = XXX_Type.isInteger(power) ? power : 1;
		
		return Math.pow(number, power);
	},
	
	squareRoot: function (number)
	{		
		return Math.sqrt(number);
	},
	
	absolute: function (number)
	{		
		return Math.abs(number);
	},
	
	pi: function ()
	{		
		return Math.PI;
	},
	
	sine: function (number)
	{		
		return Math.sin(number);
	},
	
	arcSine: function (number)
	{		
		return Math.asin(number);
	},
	
	cosine: function (number)
	{		
		return Math.cos(number);
	},
	
	arcCosine: function (number)
	{		
		return Math.acos(number);
	},
	
	tangent: function (number)
	{		
		return Math.tan(number);
	},
	
	arcTangent: function (number)
	{		
		return Math.atan(number);
	},
};
