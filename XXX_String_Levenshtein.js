var XXX_String_Levenshtein =
{
	// The character difference in a string
	getDistance: function (a, b)
	{
		var cost;
		
		var m = a.length;			
		var n = b.length;
		
		var c;
		
		if (m < n)
		{
			c = a; a = b; b = c;
			var o = m; m = n; n = o;
		}
		
		var r = [];
		r[0] = [];
		
		var cEnd = n + 1;
		for (c = 0; c < cEnd; ++c)
		{
			r[0][c] = c;
		}
		
		for (var i = 1, iEnd = m+1; i < iEnd; ++i)
		{
			r[i] = [];
			r[i][0] = i;
			
			for (var j = 1, jEnd = n+1; j < jEnd; ++j)
			{
				cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0: 1;
				r[i][j] = XXX_Number.lowest(r[i - 1][j] + 1, r[i][j - 1] + 1, r[i - 1][j - 1] + cost);
			}
		}
		
		return r[m][n];
	},
	
	getInformation: function (a, b)
	{
		var levenshteinDistance = XXX_String_Levenshtein.getDistance(a, b);
		
		var identical = levenshteinDistance === 0;
		
		var longestCharacterLength = XXX_Number.highest(XXX_String.getCharacterLength(a), XXX_String.getCharacterLength(b));
		
		// Percentage identical
		var percentage = (1 - (levenshteinDistance / longestCharacterLength)) * 100;
		
		var result =
		{
			identical: identical,
			distance: levenshteinDistance,
			percentage: percentage			
		};
		
		return result;
	}
};