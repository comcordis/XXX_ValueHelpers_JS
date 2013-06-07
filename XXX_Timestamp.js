

// UTC (Global) based - No timezones, DST etc.
var XXX_Timestamp = function (tempParameter)
{
	var tempDate = new Date();
	
	this.timestamp = (tempDate.getTime() / 1000);
	
	if (XXX_Type.isArray(tempParameter))
	{
		this.compose(tempParameter);
	}
	else if (XXX_Type.isInteger(tempParameter))
	{
		this.set(tempParameter);
	}
};

// Seconds
XXX_Timestamp.prototype.set = function (timestamp)
{
	if (XXX_Type.isNumber(timestamp))
	{
		this.timestamp = timestamp;
	}
};

// Seconds
XXX_Timestamp.prototype.get = function ()
{
	return this.timestamp;
};

XXX_Timestamp.prototype.makeLocal = function ()
{
	this.timestamp += XXX_TimestampHelpers.getLocalSecondOffset();
};

// Reversed of makeLocal
XXX_Timestamp.prototype.makeGlobal = function ()
{
	this.timestamp -= XXX_TimestampHelpers.getLocalSecondOffset();
};

XXX_Timestamp.prototype.parse = function (extended)
{
	var tempDate = new Date();
	
	tempDate.setTime((this.timestamp * 1000));
	
	var year = tempDate.getUTCFullYear();
	var yearShort = XXX_String.getPart(year, -2, 2);
	
	var dayOfTheWeek = tempDate.getUTCDay();
	
	// Convert Sunday to last day of the week
	if (dayOfTheWeek == 0)
	{
		dayOfTheWeek = 7;
	}
	
	var dayOfTheMonth = tempDate.getUTCDate();
	
	
	var monthOfTheYear = tempDate.getUTCMonth();
	
	// Convert 0 - 11 to 1 - 12
	++monthOfTheYear;
	
	var hour = tempDate.getUTCHours();
	var minute = tempDate.getUTCMinutes();
	var second = tempDate.getUTCSeconds();
	
	var meridiem = 'am';
	
	if (hour >= 12)
	{
		meridiem = 'pm';
	}
	
	var hourShort = hour;
	
	if (hourShort > 12)
	{
		hourShort -= 12;
	}
		
	if (hourShort == 0)
	{
		hourShort = 12;	
	}
	
	var parts =
	{
		timestamp: this.timestamp,
		year: XXX_Type.makeInteger(year),
		yearShort: XXX_Type.makeInteger(yearShort),
		month: XXX_Type.makeInteger(monthOfTheYear),
		monthOfTheYear: XXX_Type.makeInteger(monthOfTheYear),
		date: XXX_Type.makeInteger(dayOfTheMonth),
		dayOfTheMonth: XXX_Type.makeInteger(dayOfTheMonth),
		dayOfTheWeek: XXX_Type.makeInteger(dayOfTheWeek),
		hour: XXX_Type.makeInteger(hour),
		hourShort: XXX_Type.makeInteger(hourShort),
		minute: XXX_Type.makeInteger(minute),
		second: XXX_Type.makeInteger(second),
		meridiem: meridiem
	};
	
	if (extended)
	{
		parts.dayTotalInMonth = XXX_Type.makeInteger(XXX_TimestampHelpers.getDayTotalInMonth(year, monthOfTheYear));
		parts.dayTotalInYear = XXX_Type.makeInteger(XXX_TimestampHelpers.getDayTotalInYear(year));
		parts.dayOfTheYear = XXX_Type.makeInteger(XXX_TimestampHelpers.getDayOfTheYear(year, monthOfTheYear, dayOfTheMonth));
		parts.leapYear = XXX_TimestampHelpers.isLeapYear(year);
		parts.weekOfTheYear = XXX_Type.makeInteger(XXX_TimestampHelpers.iso8601_getWeekOfTheYear(year, monthOfTheYear, dayOfTheMonth));
	}	
	
	return parts;
};

XXX_Timestamp.prototype.compose = function (parts)
{
	var tempDate = new Date();
	
	// Year
	if (!XXX_Type.isInteger(parts.year))
	{
		parts.year = tempDate.getUTCFullYear();
	}
	
	// Month
	if (!(XXX_Type.isInteger(parts.month) && (parts.month >= 1 && parts.month <= 12)))
	{
		parts.month = tempDate.getUTCMonth() + 1;
	}
	
	// Date
	if (!(XXX_Type.isInteger(parts.date) && (parts.date >= 1 && parts.date <= 31)))
	{
		parts.date = tempDate.getUTCDate();
	}
	
	if (!XXX_TimestampHelpers.isExistingDate(parts.year, parts.month, parts.date))
	{
		var dayTotalInMonth = XXX_TimestampHelpers.getDayTotalInMonth(parts.year, parts.month);
	
		parts.date = dayTotalInMonth;
	}
	
	// Hour
	if (!(XXX_Type.isInteger(parts.hour) && (parts.hour >= 0 && parts.hour <= 23)))
	{
		parts.hour = tempDate.getUTCHours();
	}
	
	// Minute
	if (!(XXX_Type.isInteger(parts.minute) && (parts.minute >= 0 && parts.minute <= 59)))
	{
		parts.minute = tempDate.getUTCMinutes();
	}
	
	// Second
	if (!(XXX_Type.isInteger(parts.second) && (parts.second >= 0 && parts.second <= 59)))
	{
		parts.second = tempDate.getUTCSeconds();
	}
		
	this.timestamp = (Date.UTC(parts.year, parts.month - 1, parts.date, parts.hour, parts.minute, parts.second, 0) / 1000);
};
