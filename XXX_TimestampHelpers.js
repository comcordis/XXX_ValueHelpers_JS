
var XXX_TimestampHelpers =
{
	// January 1st 2012 midnight NYE, seconds since unix epoch (Used as the XXX Epoch)
	unixEpochRelativeTimestampOffset: 1325376000,
	
	// 4.398.046.511.103 (~ 139 Years) (42 bits)
	maximumRelativeMillisecondTimestamp: 4398046511103,
	// See above
	maximumRelativeTimestamp: 4398046511,
	
	// Absolute
	
		getCurrentTimestamp: function ()
		{
			return this.getCurrentSecondTimestamp();
		},
	
		getCurrentSecondTimestamp: function ()
		{
			return Math.round((new Date()).getTime() / 1000);
		},
		
		getCurrentMillisecondTimestamp: function ()
		{
			return (new Date()).getTime();
		},
		
		getCurrentYear: function ()
		{
			return XXX_Type.makeInteger((new Date()).getUTCFullYear());
		},
		
		getCurrentMonth: function ()
		{
			return XXX_Type.makeInteger((new Date()).getUTCMonth());
		},
		
		getCurrentDate: function ()
		{
			return XXX_Type.makeInteger((new Date()).getUTCDate());
		},
				
		getCurrentDayOfTheWeek: function ()
		{
			var result = XXX_Type.makeInteger((new Date()).getUTCDay());
			
			if (result === 0)
			{
				result = 7;
			}
			
			return result;
		},
		
	getYearAndMonthByMonthOffset: function (year, month, monthOffset)
	{
		var result =
		{
			year: year,
			month: month
		};
		
		if (monthOffset == 1)
		{
			if (month == 12)
			{
				result =
				{
					year: year + 1,
					month: 1
				};
			}
			else
			{
				result =
				{
					year: year,
					month: month + 1
				};
			}
		}
		else if (monthOffset == -1)
		{
			if (month == 1)
			{
				result =
				{
					year: year - 1,
					month: 12
				};
			}
			else
			{
				result =
				{
					year: year,
					month: month - 1
				};
			}
		}
		else
		{
			// TODO
		}
		
		return result;
	},
	
	/*
	
	1. Offset by 1 month forward
	2. Reset the date (day of the month) to 0 (Which is a trick, and actually sets it to the last date in the month before)
	3. Read out the current date 
	
	*/
	
	// 28 - 31
	getDayTotalInMonth: function (year, month)
	{
		var offsetYearAndMonth = this.getYearAndMonthByMonthOffset(year, month, 1);
		
		var tempDate = new Date();
		tempDate.setTime(Date.UTC(offsetYearAndMonth.year, offsetYearAndMonth.month - 1, 1, 1, 1, 1, 1));
		
		// Use 0th day of the month
		tempDate.setUTCDate(0);
		
		var result = tempDate.getUTCDate();
		
		return result;		
	},
	
	/*
	
	http://en.wikipedia.org/wiki/Leap_year
	
	*/
	
	isLeapYear: function (year)
	{
		var result = false;
		
		if (year % 4 === 0)
		{
			if (year % 100 === 0)
			{
				if (year % 400 === 0)
				{
					result = true;
				}
				else
				{
					result = false;
				}
			}
			else
			{
				result = true;
			}
		}
		else
		{
			result = false;
		}
		
		return result;
	},
	
	// 365 - 366
	getDayTotalInYear: function (year)
	{
		var daysTotal = 365;
		
		if (this.isLeapYear(year))
		{
			++daysTotal;
		}
		
		return daysTotal;
	},
	
	// NOT according to ISO 8601, but from January 1st
	
	// 1 - 366
	getDayOfTheYear: function (year, month, date)
	{
		/*
		
		January 31
		February 28/29
		March 31
		April 30
		May 31
		June 30
		July 31
		August 31
		September 30
		October 31
		November 30
		December 31
				 
		*/
		
		var dayOffsetInMonths = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
		
		var dayOfTheYear = date + dayOffsetInMonths[month - 1];
   
		if (this.isLeapYear(year))
		{
			if (month > 2)
			{
				++dayOfTheYear;
			}
		}
	   
		return dayOfTheYear;
	},
	
	// Exists
	
		isExistingDate: function (year, month, date)
		{
			var result = false;
			
			var dayTotalInMonth = this.getDayTotalInMonth(year, month);
						
			if ((month >= 1 && month <= 12) && (date <= dayTotalInMonth))
			{
				result = true;	
			}
			
			return result;
		},
		
		isExistingTime: function (hour, minute)
		{
			var result = false;
			
			if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59)
			{
				result = true;
			}
			
			return result;
		},
	
	// ISO 8601 - http://www.personal.ecu.edu/mccartyr/isowdcal.html
	
	
	// 1. Weeks start on monday
	// 2. The first week of the year is the week with the first thursday in it.
	
		iso8601_getFirstMondayOfTheYear: function (year)
		{
			var result = {};
			
			// January 1st in that year
			var tempTimestamp = new XXX_Timestamp({year: year, month: 1, date: 1});
			
			var parts = tempTimestamp.parse();
			
			// January 1st is a:
			switch (parts.dayOfTheWeek)
			{
				// Monday (Week 1 starts on Monday January 1st that year)
				case 1:
					result =
					{
						year: year,
						month: 1,
						date: 1
					};
					break;
				// Tuesday (Week 1 starts on Monday December 31st the previous year)
				case 2:
					result =
					{
						year: year - 1,
						month: 12,
						date: 31
					};
					break;
				// Wednesday (Week 1 starts on Monday December 30th the previous year)
				case 3:
					result =
					{
						year: year - 1,
						month: 12,
						date: 30
					};
					break;
				// Thursday (Week 1 starts on Monday December 29th the previous year)
				case 4:
					result =
					{
						year: year - 1,
						month: 12,
						date: 29
					};
					break;
				// Friday (Week 1 starts on Monday January 4th that year)
				case 5:
					result =
					{
						year: year,
						month: 1,
						date: 4
					};
					break;
				// Saturday (Week 1 starts on Monday January 3rd that year)
				case 6:
					result =
					{
						year: year,
						month: 1,
						date: 3
					};
					break;
				// Sunday (Week 1 starts on Monday January 2nd that year)
				case 7:
					result =
					{
						year: year,
						month: 1,
						date: 2
					};
					break;
			}
			
			return result;
		},
		
		iso8601_getLastMondayOfTheYear: function (year)
		{
			var firstMondayOfTheNextYear = this.iso8601_getFirstMondayOfTheYear(year + 1);
			
			var result = {};
			
			// January 1st in that year
			var tempTimestamp = new XXX_Timestamp({year: firstMondayOfTheNextYear.year, month: firstMondayOfTheNextYear.month, date: firstMondayOfTheNextYear.date});
			
			var parts = tempTimestamp.parse();
			
			// All back 1 week
			switch (parts.date)
			{
				case 29:
					result =
					{
						year: firstMondayOfTheNextYear.year,
						month: 12,
						date: 22
					};
					break;
				case 30:
					result =
					{
						year: firstMondayOfTheNextYear.year,
						month: 12,
						date: 23
					};
					break;
				case 31:
					result =
					{
						year: firstMondayOfTheNextYear.year,
						month: 12,
						date: 24
					};
					break;
				case 1:
					result =
					{
						year: firstMondayOfTheNextYear.year - 1,
						month: 12,
						date: 25
					};
					break;
				case 2:
					result =
					{
						year: firstMondayOfTheNextYear.year - 1,
						month: 12,
						date: 26
					};
					break;
				case 3:
					result =
					{
						year: firstMondayOfTheNextYear.year - 1,
						month: 12,
						date: 27
					};
					break;
				case 4:
					result =
					{
						year: firstMondayOfTheNextYear.year - 1,
						month: 12,
						date: 28
					};
					break;
			}
			
			return result;
		},
		
		// 1 - 52 / 53
		iso8601_getWeekOfTheYear: function (year, month, date)
		{
			var firstMondayOfTheYear = this.iso8601_getFirstMondayOfTheYear(year);
			var lastMondayOfThePreviousYear = this.iso8601_getLastMondayOfTheYear(year - 1);
			var firstMondayOfTheNextYear = this.iso8601_getFirstMondayOfTheYear(year + 1);
			
			var weekOfTheYear = 0;
			
			// Given date is before first monday of the year
			if (year == firstMondayOfTheYear.year && month == firstMondayOfTheYear.month && date < firstMondayOfTheYear.date)
			{
				// Last week of the previous year
					
					weekOfTheYear = this.iso8601_getWeekOfTheYear(lastMondayOfThePreviousYear.year, lastMondayOfThePreviousYear.month, lastMondayOfThePreviousYear.date);
			}
			// Given date is after or equal to first monday of the next year
			else if (year == firstMondayOfTheNextYear.year && month == firstMondayOfTheNextYear.month && date >= firstMondayOfTheNextYear.date)
			{
				// Week 1 of the next year
				
					weekOfTheYear = 1;
			}
			else
			{
				var dayOfTheYear = XXX_TimestampHelpers.getDayOfTheYear(year, month, date);
				
				var daysSinceFirstMondayOfTheYear = dayOfTheYear - 1;
				
				if (firstMondayOfTheYear.year < year)
				{
					// In relation to December which always has 31 days
					daysSinceFirstMondayOfTheYear += (32 - firstMondayOfTheYear.date);
				}
				else
				{
					daysSinceFirstMondayOfTheYear -= (firstMondayOfTheYear.date - 1);
				}
				
				weekOfTheYear = XXX_Number.floor(daysSinceFirstMondayOfTheYear / 7) + 1;
			}
						
			return weekOfTheYear;
		},
		
		// 52 / 53
		iso8601_getWeekTotalInYear: function (year)
		{
			var lastMondayOfTheYear = this.iso8601_getLastMondayOfTheYear(year);
			
			var weekOfTheYear = this.iso8601_getWeekOfTheYear(lastMondayOfTheYear.year, lastMondayOfTheYear.month, lastMondayOfTheYear.date);
			
			var result = weekOfTheYear;
			
			return result;
		},
	
	
	////////////////////
	// TimeZone & DST
	////////////////////
	
		getLocalSecondOffset: function (timeZoneSecondOffset, daylightSavingTime)
		{
			var localSecondOffset = 0;
			
			if (XXX_Type.isInteger(timeZoneSecondOffset))
			{
				localSecondOffset += timeZoneSecondOffset;
				
				if (daylightSavingTime)
				{
					localSecondOffset += 3600;
				}
			}
			// Detect live
			else
			{
				var timeZoneInformation = this.getTimeZoneInformation();
				
				localSecondOffset += timeZoneInformation.secondOffset.current;
				
				if (timeZoneInformation.regionWithDaylightSavingTime)
				{
					if (timeZoneInformation.daylightSavingTime)
					{
						localSecondOffset += 3600;
					}
				}
			}
			
			return localSecondOffset;
		},
		
		/*
		
		Winter time (standard): original timeZone offset
		Summer time (Daylight Saving Time): the clock is moved one hour forward
		
		*/
		
		getTimeZoneInformation: function ()
		{
			var tempDate = new Date((new Date()).getFullYear(), 0, 1);
			
			// use extreme offsets as defaults so they get overwritten with real values
			var lowestOffset = 100000;		
			var highestOffset = -100000;
			var currentOffset = (new Date()).getTimezoneOffset() * -1;
			
			// go trough each month to find the lowest and highest offset to account for DST
			for (var i = 0, iEnd = 12; i < iEnd; ++i)
			{
				// go to the next month
				tempDate.setMonth(tempDate.getMonth() + 1);
				
				var tempOffset = tempDate.getTimezoneOffset() * -1;
							
				// to ignore DST look for the lowest offset, since during DST, the clock moves forward
				if (lowestOffset > tempOffset)
				{
					lowestOffset = tempOffset;
				}
				if (highestOffset < tempOffset)
				{
					highestOffset = tempOffset;
				}			
			}	
			
			var result = 
			{
				secondOffset:
				{
					lowest: lowestOffset * 60,
					highest: highestOffset * 60,
					current: currentOffset * 60
				},
				parsedOffset:
				{
					lowest: this.parseNativeTimeZoneOffset(lowestOffset),
					highest: this.parseNativeTimeZoneOffset(highestOffset),
					current: this.parseNativeTimeZoneOffset(currentOffset)
				},
				
				regionWithDaylightSavingTime: (lowestOffset === highestOffset ? false : true),
				
				daylightSavingTime: (lowestOffset != highestOffset && currentOffset === highestOffset)
			};
			
			return result;
		},
		
		parseNativeTimeZoneOffset: function (minutes)
		{
			var result =
			{
				hours:  XXX_Number.floor(minutes / 60),
				minutes: minutes % 60,
				seconds: 0
			};
			
			return result;
		},
	
	
	////////////////////
	// Month array
	////////////////////
	
	getMonthArray: function (year, month, weekStart)
	{
		if (!(weekStart == 'monday' || weekStart == 'sunday'))
		{
			weekStart = 'monday';
		}
		
		var currentMonth =
		{
			year: year,
			month: month
		};		
		var previousMonth = this.getYearAndMonthByMonthOffset(year, month, -1);
		var nextMonth = this.getYearAndMonthByMonthOffset(year, month, 1);
		
		var currentMonthDayTotalInMonth = this.getDayTotalInMonth(currentMonth.year, currentMonth.month);
		var previousMonthDayTotalInMonth = this.getDayTotalInMonth(previousMonth.year, previousMonth.month);
				
		var firstDayOfTheMonthTimestamp = new XXX_Timestamp({year: currentMonth.year, month: currentMonth.month, date: 1});
		var lastDayOfTheMonthTimestamp = new XXX_Timestamp({year: currentMonth.year, month: currentMonth.month, date: currentMonthDayTotalInMonth});
		
		var firstDayOfTheMonthDateParts = firstDayOfTheMonthTimestamp.parse();
		var lastDayOfTheMonthDateParts = lastDayOfTheMonthTimestamp.parse();
		
		var paddingDaysInPreviousMonth = 0;
		var paddingDaysInNextMonth = 0;
		
		if (weekStart == 'monday')
		{
			paddingDaysInPreviousMonth = firstDayOfTheMonthDateParts.dayOfTheWeek - 1;
			paddingDaysInNextMonth = 7 - lastDayOfTheMonthDateParts.dayOfTheWeek;
			
			switch (firstDayOfTheMonthDateParts.dayOfTheWeek)
			{
				// Sunday
				case 7:
					paddingDaysInPreviousMonth = 6;
					break;
				// Saturday
				case 6:
					paddingDaysInPreviousMonth = 5;
					break;
				// Friday
				case 5:
					paddingDaysInPreviousMonth = 4;
					break;
				// Thursday
				case 4:
					paddingDaysInPreviousMonth = 3;
					break;
				// Wednesday
				case 3:
					paddingDaysInPreviousMonth = 2;
					break;
				// Tuestday
				case 2:
					paddingDaysInPreviousMonth = 1;
					break;
				// Monday
				case 1:
					paddingDaysInPreviousMonth = 7;
					break;
			}
						
			switch (lastDayOfTheMonthDateParts.dayOfTheWeek)
			{
				// Sunday
				case 7:
					paddingDaysInNextMonth = 7;
					break;
				// Saturday
				case 6:
					paddingDaysInNextMonth = 1;
					break;
				// Friday
				case 5:
					paddingDaysInNextMonth = 2;
					break;
				// Thursday
				case 4:
					paddingDaysInNextMonth = 3;
					break;
				// Wednesday
				case 3:
					paddingDaysInNextMonth = 4;
					break;
				// Tuesday
				case 2:
					paddingDaysInNextMonth = 5;
					break;
				// Monday
				case 1:
					paddingDaysInNextMonth = 6;
					break;
			}
		}
		else if (weekStart == 'sunday')
		{
			switch (firstDayOfTheMonthDateParts.dayOfTheWeek)
			{
				// Sunday
				case 7:
					paddingDaysInPreviousMonth = 7;
					break;
				// Saturday
				case 6:
					paddingDaysInPreviousMonth = 6;
					break;
				// Friday
				case 5:
					paddingDaysInPreviousMonth = 5;
					break;
				// Thursday
				case 4:
					paddingDaysInPreviousMonth = 4;
					break;
				// Wednesday
				case 3:
					paddingDaysInPreviousMonth = 3;
					break;
				// Tuestday
				case 2:
					paddingDaysInPreviousMonth = 2;
					break;
				// Monday
				case 1:
					paddingDaysInPreviousMonth = 1;
					break;
			}
						
			switch (lastDayOfTheMonthDateParts.dayOfTheWeek)
			{
				// Sunday
				case 7:
					paddingDaysInNextMonth = 6;
					break;
				// Saturday
				case 6:
					paddingDaysInNextMonth = 7;
					break;
				// Friday
				case 5:
					paddingDaysInNextMonth = 1;
					break;
				// Thursday
				case 4:
					paddingDaysInNextMonth = 2;
					break;
				// Wednesday
				case 3:
					paddingDaysInNextMonth = 3;
					break;
				// Tuesday
				case 2:
					paddingDaysInNextMonth = 4;
					break;
				// Monday
				case 1:
					paddingDaysInNextMonth = 5;
					break;
			}
		}
				
		var result = [];
		
		// Days in the previous month
		for (var dayInPreviousMonth = ((previousMonthDayTotalInMonth + 1) - paddingDaysInPreviousMonth); dayInPreviousMonth <= previousMonthDayTotalInMonth; ++dayInPreviousMonth)
		{			
			result.push({type: 'previous', year: previousMonth.year, month: previousMonth.month, date: dayInPreviousMonth});
		}
		// Days in the month
		for (var day = 1; day <= currentMonthDayTotalInMonth; ++day)
		{
			result.push({type: 'current', year: year, month: month, date: day});
		}
		
		// Days in the next month
		for (var dayInNextMonth = 1; dayInNextMonth <= paddingDaysInNextMonth; ++dayInNextMonth)
		{
			result.push({type: 'next', year: nextMonth.year, month: nextMonth.month, date: dayInNextMonth});
		}
		
		// Prefix a row with daysOfTheWeek
		
			var newResult = [];
		
			newResult.push('w');
			
			if (weekStart == 'monday')
			{
				newResult.push(1);
				newResult.push(2);
				newResult.push(3);
				newResult.push(4);
				newResult.push(5);
				newResult.push(6);
				newResult.push(7);
			}
			else if (weekStart == 'sunday')
			{
				newResult.push(7);
				newResult.push(1);
				newResult.push(2);
				newResult.push(3);
				newResult.push(4);
				newResult.push(5);
				newResult.push(6);
			}
			
		// Prefix the weekOfTheYear
		
			// It's always 7 or a multiple of 7
			var rows = XXX_Array.getFirstLevelItemTotal(result) / 7;
						
			for (var i = 0, iEnd = rows; i < iEnd; ++i)
			{
				var k = i * 7;
				
				var tempRecord = result[k + 1];
				
				var weekOfTheYear = XXX_TimestampHelpers.iso8601_getWeekOfTheYear(tempRecord.year, tempRecord.month, tempRecord.date);
				
				newResult.push({type: 'weekOfTheYear', weekOfTheYear: weekOfTheYear});
				
				for (var j = 0, jEnd = 7; j < jEnd; ++j)
				{
					var tempRecord = result[k + j];
					
					newResult.push(tempRecord);
				}
			}
			
			result = newResult;		
						
		return result;
	},
	
	////////////////////
	// Difference
	////////////////////
	
	getDifference: function (firstTime, secondTime)
	{		
		var difference = 0;
		
		var positive = true;
		
		if (firstTime < secondTime)
		{
			difference = secondTime - firstTime;
			positive = true;
		}
		else
		{
			difference = firstTime - secondTime;
			positive = false;
		}
		
		var dayDifferenceTotal = difference / 86400;
		var hourDifferenceTotal = difference / 3600;
		var minuteDifferenceTotal = difference / 60;
		var secondDifferenceTotal = difference
		
		var dayDifferenceByRemainder = Math.floor(difference / 86400);
		difference -= (dayDifferenceByRemainder * 86400);
		
		var hourDifferenceByRemainder = Math.floor(difference / 3600);
		difference -= (hourDifferenceByRemainder * 3600);
		
		var minuteDifferenceByRemainder = Math.floor(difference / 60);
		difference -= (minuteDifferenceByRemainder * 60);
		
		var secondDifferenceByRemainder = difference;
		
		difference =
		{
			positive: positive,
			total:
			{
				day: dayDifferenceTotal,
				hour: hourDifferenceTotal,
				minute: minuteDifferenceTotal,
				second: secondDifferenceTotal
			},
			remainder:
			{
				day: dayDifferenceByRemainder,
				hour: hourDifferenceByRemainder,
				minute: minuteDifferenceByRemainder,
				second: secondDifferenceByRemainder
			}
		};
		
		return difference;
	},
	
	////////////////////
	// Age
	////////////////////
	
	// Years
	getDateOfBirthYearAge: function (year, month, date)
	{
		var result = 0;
		
		if (this.isExistingDate(year, month, date))
		{
			var timestamp = new XXX_Timestamp(XXX_TimestampHelpers.getCurrentSecondTimestamp());
			var parts = timestamp.parse();
						
			var yearNow = parts.year;
			var monthNow = parts.month;
			var dateNow = parts.date;
			
			var yearDifference = yearNow - year;
			var monthDifference = monthNow - month;
			var dateDifference = dateNow - date;
			
			if (monthDifference < 0)
			{
				--yearDifference;
			}	
			else if (monthDifference === 0 && dateDifference < 0)
			{
				--yearDifference;
			}
			
			yearDifference = XXX_Default.toPositiveInteger(yearDifference, 0);
			
			result = yearDifference;
		}
		
		return result;
	},
	
	////////////////////
	// date
	////////////////////
	
	dateOneYearEarlier: function (date)
	{
		var newYear = date.year - 1;
		var newMonth = date.month;
		var newDate = date.date;
		
		var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
		
		// Compensate leap years
		if (newDate > dayTotalInMonth)
		{
			newDate = dayTotalInMonth;
		} 
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	dateOneYearLater: function (date)
	{
		var newYear = date.year + 1;
		var newMonth = date.month;
		var newDate = date.date;
		
		var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
		
		// Compensate leap years
		if (newDate > dayTotalInMonth)
		{
			newDate = dayTotalInMonth;
		} 
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	dateOneMonthEarlier: function (date)
	{
		var newYear = date.year;
		var newMonth = date.month;
		
		if (newMonth == 1)
		{
			--newYear;
			newMonth = 12;
		}
		else
		{
			--newMonth;
		}
		
		var newDate = date.date;
		
		var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
		
		// Compensate leap years
		if (newDate > dayTotalInMonth)
		{
			newDate = dayTotalInMonth;
		} 
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	dateOneMonthLater: function (date)
	{
		var newYear = date.year;
		var newMonth = date.month;
		
		if (newMonth == 12)
		{
			++newYear;
			newMonth = 1;
		}
		else
		{
			++newMonth;
		}
		
		var newDate = date.date;
		
		var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
		
		// Compensate leap years
		if (newDate > dayTotalInMonth)
		{
			newDate = dayTotalInMonth;
		} 
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	dateOneDayEarlier: function (date)
	{
		var newYear = date.year;
		var newMonth = date.month;		
		var newDate = date.date;
		
		if (newDate == 1)
		{
			if (newMonth == 1)
			{
				--newYear;
				newMonth = 12;
			}
			else
			{
				--newMonth;
			}
						
			var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
			
			newDate = dayTotalInMonth;
		}
		else
		{
			--newDate;
		}
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	dateOneDayLater: function (date)
	{
		var newYear = date.year;
		var newMonth = date.month;
		var newDate = date.date;
		
		var dayTotalInMonth = this.getDayTotalInMonth(newYear, newMonth);
		
		if (newDate == dayTotalInMonth)
		{
			if (newMonth == 12)
			{
				++newYear;
				newMonth = 1;
			}
			else
			{
				++newMonth;
			}
			
			newDate = 1;
		}
		else
		{
			++newDate;
		}
		
		var result =
		{
			year: newYear,
			month: newMonth,
			date: newDate
		};
		
		return result;
	},
	
	composeTimeValue: function (timestamp, clockType)
	{
		clockType = XXX_Default.toOption(clockType, ['12', '24'], '24');
		
		var timeValue = '';
		
		var timestampParts = timestamp.parse();
		
		var hour = timestampParts.hour;
		var minute = timestampParts.minute;
		var meridiem = '';
		
		if (clockType == '12')
		{
			if (hour < 12)
			{
				meridiem = 'am';
				
				if (hour == 0)
				{
					hour = 12;
				}
			}
			else
			{				
				meridiem = 'pm';
				
				hour -= 12;
				
				if (hour == 0)
				{
					hour = 12;
				}
			}
		}
				
		var composedHour = XXX_String.padLeft(hour, '0', 2);
		
		var composedMinute = XXX_String.padLeft(minute, '0', 2);
				
		var composedMeridiem = '';
		
		var meridiemNames = XXX_I18n_Translation.get('dateTime', 'meridiems', 'abbreviations');
		
		if (meridiem == 'am')
		{
			composedMeridiem = meridiemNames[0];
		}
		else
		{
			composedMeridiem = meridiemNames[1];
		}
		
		switch (clockType)
		{
			case '12':
				timeValue = composedHour + ':' + composedMinute + ' ' + composedMeridiem;
				break;
			case '24':
				timeValue = composedHour + ':' + composedMinute;
				break;
		}
		
		return timeValue;
	},
	
	composeDateValue: function (timestamp, dateFormat)
	{
		dateFormat = XXX_Default.toOption(dateFormat, ['dateMonthYear', 'monthDateYear', 'yearMonthDate'], 'dateMonthYear');
		
		var dateValue = '';
		
		var timestampParts = timestamp.parse();
		
		var composedYear = XXX_String.padLeft(timestampParts.year, '0', 4);
		var composedMonth = XXX_String.padLeft(timestampParts.month, '0', 2);
		var composedDate = XXX_String.padLeft(timestampParts.date, '0', 2);
		
		var composedMonthName = '';
		
		var monthNames = XXX_I18n_Translation.get('dateTime', 'months', 'abbreviations');
		composedMonthName = monthNames[timestampParts.month - 1];
		
		var composedDayOfTheWeekName = '';
		var dayOfTheWeekNames = XXX_I18n_Translation.get('dateTime', 'daysOfTheWeek', 'abbreviations');
		composedDayOfTheWeekName = dayOfTheWeekNames[timestampParts.dayOfTheWeek - 1];
		
		switch (dateFormat)
		{
			case 'dateMonthYear':
				dateValue = composedDayOfTheWeekName + ' ' + composedDate + ' / ' + composedMonthName + ' / ' + composedYear;
				break;
			case 'monthDateYear':
				dateValue = composedMonthName + ' / ' + composedDayOfTheWeekName + ' ' + composedDate + ' / ' + composedYear;
				break;
			case 'yearMonthDate':
				dateValue = composedYear + ' / ' + composedMonthName + ' / ' + composedDayOfTheWeekName + ' ' + composedDate;
				break;
		}
		
		return dateValue;
	},
	
	// TODO
	parseTimeValue: function (timeValue, clockType)
	{
		clockType = XXX_Default.toOption(clockType, ['12', '24'], '24');
		
		var original = timeValue;
		
		//XXX_JS.errorNotification(1, 'Parsing time value ' + timeValue);
		
		clockType = XXX_Default.toOption(clockType, ['12', '24'], '24');
		
		var hour = 12;
		var minute = 0;
		var meridiem = 'pm';
		
		var newHour = hour;
		var newMinute = minute;
		var newMeridiem = false;
		
		if (timeValue != '')
		{
			timeValue = XXX_String.convertToLowerCase(timeValue);
			
			var matches = XXX_String_Pattern.getMatches(timeValue, '([0-9]{1,2})(?:[/\\-. :,\'"]*([0-9]{1,2}))?[/\\-. :,\'"]*([apm. ]{2,})?', 'i');
			
			if (XXX_Array.getFirstLevelItemTotal(matches) == 2)
			{
				XXX_JS.errorNotification(1, '1 part');
				newHour = XXX_Type.makeInteger(matches[1][0]);
			}
			else if (XXX_Array.getFirstLevelItemTotal(matches) == 3)
			{
				XXX_JS.errorNotification(1, '2 parts');
				newHour = XXX_Type.makeInteger(matches[1][0]);
				newMinute = XXX_Type.makeInteger(matches[2][0]);
			}
			else if (XXX_Array.getFirstLevelItemTotal(matches) == 4)
			{
				newHour = XXX_Type.makeInteger(matches[1][0]);
				newMinute = XXX_Type.makeInteger(matches[2][0]);
				
				var temp = XXX_String.trim(matches[3][0]);
				
				if (XXX_String.findFirstPosition(temp, 'a') !== false)
				{
					newMeridiem = 'am';
				}
				else if (XXX_String.findFirstPosition(temp, 'p') !== false)
				{
					newMeridiem = 'pm';
				}
			}
			
			newHour = XXX_Number.absolute(newHour);
			newMinute = XXX_Number.absolute(newMinute);
			newMinute %= 60;
			
			//XXX_JS.errorNotification(1, 'Pre Corrected values ' + newHour + ' ' + newMinute + ' ' + newMeridiem);
			
			switch (clockType)
			{
				case '12':
					
					newHour %= 24;
					
					if (newMeridiem == false)
					{
						if (newHour == 12)
						{
							newHour = 0;
						}
					}
					else if (newMeridiem == 'pm')
					{
						if (newHour < 12)
						{
							newHour += 12;
						}
					}
					
					break;
				case '24':
					newHour %= 24;					
					break;
			}
			
			if (!(newHour >= 0 && newHour < 24 && newMinute >= 0 && newMinute < 60))
			{
				newHour = hour;
				newMinute = minute;
			}
					
			if (newHour < 12)
			{
				newMeridiem = 'am';
			}
			else
			{
				newMeridiem = 'pm';
			}
			
			//XXX_JS.errorNotification(1, 'Corrected values ' + newHour + ' ' + newMinute + ' ' + newMeridiem);
		}
		
		var result =
		{
			original: original,
			hour: newHour,
			minute: newMinute,
			meridiem: newMeridiem
		};
		
		return result;
	},
	
	parseDateValue: function (dateValue, dateFormat)
	{
		var original = dateValue;
		
		XXX_JS.errorNotification(1, 'Parsing date value ' + dateValue);
		
		dateFormat = XXX_Default.toOption(dateFormat, ['dateMonthYear', 'monthDateYear', 'yearMonthDate'], 'dateMonthYear');
		
		var todaysDate = new XXX_Timestamp();
		var todaysDateParts = todaysDate.parse();
				
		var year = todaysDateParts.year;
		var month = todaysDateParts.month;
		var date = todaysDateParts.date;
		
		var newYear = year;
		var newMonth = month;
		var newDate = date;
		
		if (dateValue != '')
		{
			dateValue = XXX_String.convertToLowerCase(dateValue);
			
			var parts = XXX_String_Pattern.splitToArray(dateValue, '[/\\-., :\'"]+', '');
			
				//XXX_JS.errorNotification(1, 'Parsed date parts ' + XXX_String_JSON.encode(parts));
				
			var filteredParts = [];
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(parts); i < iEnd; ++i)
			{
				var filteredPart = XXX_String.trim(parts[i]);
				
				
				var monthNames = XXX_I18n_Translation.get('dateTime', 'months', 'names');
				var monthAbbreviations = XXX_I18n_Translation.get('dateTime', 'months', 'abbreviations');
			
				var isMonth = false;
				
				for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(monthNames); j < jEnd; ++j)
				{
					if (XXX_String.convertToLowerCase(monthNames[j]) == XXX_String.convertToLowerCase(filteredPart))
					{
						filteredPart = j + 1;
						
						isMonth = true;
						
						break;
					}
				}
				
				if (!isMonth)
				{
					for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(monthAbbreviations); j < jEnd; ++j)
					{
						if (XXX_String.convertToLowerCase(monthAbbreviations[j]) == XXX_String.convertToLowerCase(filteredPart))
						{
							filteredPart = j + 1;
						
							isMonth = true;
							
							break;
						}
					}
				}
				
				
				var isDayOfTheWeek = false;
			
				var dayOfTheWeekNames = XXX_I18n_Translation.get('dateTime', 'daysOfTheWeek', 'names');
				var dayOfTheWeekAbbreviations = XXX_I18n_Translation.get('dateTime', 'daysOfTheWeek', 'abbreviations');
				
				for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(dayOfTheWeekNames); j < jEnd; ++j)
				{
					if (XXX_String.convertToLowerCase(dayOfTheWeekNames[j]) == XXX_String.convertToLowerCase(filteredPart))
					{
						isDayOfTheWeek = true;
						
						break;
					}
				}
				
				if (!isDayOfTheWeek)
				{
					for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(dayOfTheWeekAbbreviations); j < jEnd; ++j)
					{
						if (XXX_String.convertToLowerCase(dayOfTheWeekAbbreviations[j]) == XXX_String.convertToLowerCase(filteredPart))
						{
							isDayOfTheWeek = true;
							
							break;
						}
					}
				}
				
				if (!isDayOfTheWeek)
				{
						
					filteredParts.push(filteredPart);
				}
			}
			
			parts = filteredParts;
			
			if (XXX_Array.getFirstLevelItemTotal(parts) == 0)
			{			
			}
			else if (XXX_Array.getFirstLevelItemTotal(parts) == 1)
			{
				switch (dateFormat)
				{
					case 'dateMonthYear':
						newDate = XXX_Type.makeInteger(parts[0]);
						break;
					case 'monthDateYear':
						newMonth = XXX_Type.makeInteger(parts[0]);
						break;
					case 'yearMonthDate':
						newYear = XXX_Type.makeInteger(parts[0]);
						break;
				}
			}
			else if (XXX_Array.getFirstLevelItemTotal(parts) == 2)
			{
				switch (dateFormat)
				{
					case 'dateMonthYear':
						newDate = XXX_Type.makeInteger(parts[0]);
						if (parts[1] != '')
						{
							newMonth = XXX_Type.makeInteger(parts[1]);
						}
						break;
					case 'monthDateYear':
						newMonth = XXX_Type.makeInteger(parts[0]);
						if (parts[1] != '')
						{
							newDate = XXX_Type.makeInteger(parts[1]);
						}
						break;
					case 'yearMonthDate':
						newYear = XXX_Type.makeInteger(parts[0]);
						if (parts[1] != '')
						{
							newMonth = XXX_Type.makeInteger(parts[1]);
						}
						break;
				}
			}
			else if (XXX_Array.getFirstLevelItemTotal(parts) >= 3)
			{
				switch (dateFormat)
				{
					case 'dateMonthYear':
						newDate = XXX_Type.makeInteger(parts[0]);
						newMonth = XXX_Type.makeInteger(parts[1]);
						if (parts[2] != '')
						{
							newYear = XXX_Type.makeInteger(parts[2]);
						}
						break;
					case 'monthDateYear':
						newMonth = XXX_Type.makeInteger(parts[0]);
						newDate = XXX_Type.makeInteger(parts[1]);
						if (parts[2] != '')
						{
							newYear = XXX_Type.makeInteger(parts[2]);
						}
						break;
					case 'yearMonthDate':
						newYear = XXX_Type.makeInteger(parts[0]);
						newMonth = XXX_Type.makeInteger(parts[1]);
						if (parts[2] != '')
						{
							newDate = XXX_Type.makeInteger(parts[2]);
						}
						break;
				}
			}
			
			newMonth = XXX_Number.absolute(newMonth);			
			newMonth %= 12;
			if (newMonth == 0)
			{
				newMonth = 12;
			}
			
			newDate = XXX_Number.absolute(newDate);
			newDate %= 31;
			if (newDate == 0)
			{
				newDate = 31;
			}
			
			if (newYear >= 0 && newYear <= 100)
			{
				var currentYear = XXX_TimestampHelpers.getCurrentYear();
				var tempFutureYear = 2000 + newYear;
				var tempPastYear = 1900 + newYear;
				
				if (tempFutureYear <= currentYear + 10)
				{
					newYear = tempFutureYear;
				}
				else
				{
					newYear = tempPastYear;
				}
			}
			
			if (!XXX_TimestampHelpers.isExistingDate(newYear, newMonth, newDate))
			{
				//XXX_JS.errorNotification(1, 'Defaulting back ' + newYear + '-' + newMonth + '-' + newDate + ' to now');
				
				newDate = date;
				newMonth = month;
				newYear = year;
			}
			
			//XXX_JS.errorNotification(1, 'Defaulting back ' + newYear + '-' + newMonth + '-' + newDate + ' to now');
		}
				
		var result =
		{
			original: original,
			date: newDate,
			month: newMonth,
			year: newYear
		};
		
		return result;
	}
};