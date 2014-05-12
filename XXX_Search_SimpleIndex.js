


/*

Cache parsed information
From the search perspective?


collapse spacing into 1

result presentation:
	source (Default)
	query

comparison:
	- literal
	- simplified characters (without accents lower case etc.) (Default)
	
term modes:
	- full
	- split

highlighting:
	- <b> Identical from beginning
	- <u> Identical anywhere within
	- <i> Similar from beginning
	- <i> Similar anwywhere within

precedence:
	- full
		- Identical from beginning
		- Identical anywhere within
		- Similar from beginning
		- Similar anywhere within
	- split
		- Identical from beginning
		- Identical anywhere within
		- Similar from beginning
		- Similar anywhere within

problems:
	- matching (character switches) and result presentation difference
	- if special character is simplified to multiple base characters, how to highlight/match
		Dußeldorf -> Dusseldorf
		
		Duß has to highlight Duss as <b></b> and reversed
	
		Have a switchboard for from>to
			If ss -> ß, there should be a mapping for both s'es back to the single character
			
			source (Dußeldorf)
			comparisonSource (dusseldorf)
			
		Loop torugh each character
			- have an original switchboard
			- have a normalized switchboard
				- original character index
				- normalized characters
			
			get position of match
				
				loop from there for the original start, to original end

*/	

var XXX_Search_SimpleIndex = function (termMode, characterMatchingMode, dataType)
{
	this.termMode = XXX_Default.toOption(termMode, ['full', 'split'], 'split');
	this.characterMatchingMode = XXX_Default.toOption(characterMatchingMode, ['raw', 'simplified'], 'simplified');
	
	this.dataType = dataType;
	
	this.hasData = false;
	
	this.sourceValues = [];
	this.sourceValueInformations = [];
	this.sourceDatas = [];
	
	this.sourceMatchers = [];
	
	this.labels = [];
	
	this.query = false;
	this.queryValueInformation = false;
};

XXX_Search_SimpleIndex.prototype.addSource = function (source)
{
	
	var sourceValue = '';
	
	if (XXX_Type.isArray(source))
	{
		sourceValue = source.value;
		
		this.hasData = true;
	}
	else
	{
		sourceValue = source;
	}
	
	var sourceValueInformation = XXX_String_Search.composeValueInformation(sourceValue, this.termMode, this.characterMatchingMode);
	
	var index = XXX_Array.getFirstLevelItemTotal(this.sourceValueInformations);
	
	this.sourceValues.push(sourceValue);
	this.sourceValueInformations.push(sourceValueInformation);
	
	if (this.hasData)
	{
		this.sourceDatas.push(source);
	}
	
	return index;
};

XXX_Search_SimpleIndex.prototype.addSources = function (sources)
{
	for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sources); i < iEnd; ++i)
	{
		this.addSource(sources[i]);
	}
};

XXX_Search_SimpleIndex.prototype.executeQuery = function (query)
{
	this.query = query;
	this.queryValueInformation = XXX_String_Search.composeValueInformation(query, this.termMode, this.characterMatchingMode);
	
	this.sourceMatchers = [];
	
	for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.sourceValueInformations); i < iEnd; ++i)
	{
		var index = i;
		var sourceValueInformation = this.sourceValueInformations[i];
		
		var sourceMatcher = XXX_String_Search.composeMatcher(index, sourceValueInformation, this.termMode, this.characterMatchingMode);
		
		sourceMatcher = XXX_String_Search.processSourceWithQueryInMatcher(sourceValueInformation, this.queryValueInformation, sourceMatcher, this.termMode, this.characterMatchingMode);
		
		if (sourceMatcher)
		{
			this.sourceMatchers.push(sourceMatcher);
		}
	}
	this.sourceMatchers.sort(function(a, b)
	{
		return XXX_String_Search.compareMatchers(a, b);
	});
};

XXX_Search_SimpleIndex.prototype.getSuggestions = function ()
{
	var suggestions = [];
	
	for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.sourceMatchers); i < iEnd; ++i)
	{
		var sourceMatcher = this.sourceMatchers[i];
		var sourceValue = this.sourceValues[sourceMatcher.sourceIndex];
		var sourceValueInformation = this.sourceValueInformations[sourceMatcher.sourceIndex];
		if (this.hasData)
		{
			var sourceData = this.sourceDatas[sourceMatcher.sourceIndex];
		}
		
		var label = XXX_String_Search.composeLabelFromSourceValueInformationAndSourceMatcher(sourceValueInformation, sourceMatcher, this.termMode, this.characterMatchingMode);
		
		var suggestion =
		{
			valueAskingSuggestions: this.query,
			suggestedValue: sourceValue,
			complement: '',
			label: label,
			data: {}
		};
		
		if (this.hasData)
		{
			suggestion.data = sourceData;
		}
		
		if (this.dataType != '' && XXX_Type.isEmpty(suggestion.data.dataType))
		{
			suggestion.data.dataType = this.dataType;
		}
		
		suggestion.data.sourceMatcher =
		{
			bestMatchType: sourceMatcher.bestMatchType,
			fullyIdenticalCharacterHitTotal: sourceMatcher.fullyIdenticalCharacterHitTotal,
			partlyIdenticalCharacterHitTotal: sourceMatcher.partlyIdenticalCharacterHitTotal,
			partlySimilarCharacterHitTotal: sourceMatcher.partlySimilarCharacterHitTotal,
			levenshteinDistanceTotal: sourceMatcher.levenshteinDistanceTotal,
			fullTermHitTotal: sourceMatcher.fullTermHitTotal,
			partialTermHitTotal: sourceMatcher.partialTermHitTotal,
			termHitTotal: sourceMatcher.termHitTotal,
			lowestMatchOffset: sourceMatcher.lowestMatchOffset
		};
		
		suggestions.push(suggestion);
	}
	
	return suggestions;
};

XXX_Search_SimpleIndex.prototype.getSuggestionProviderSourceResponse = function ()
{
	var result =
	{
		type: 'processed',
		suggestions: this.getSuggestions()
	};
	
	return result;
};

XXX_Search_SimpleIndex.prototype.composeLabels = function ()
{
	var output = '';
	
	for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.sourceMatchers); i < iEnd; ++i)
	{
		var sourceMatcher = this.sourceMatchers[i];
		var sourceValueInformation = this.sourceValueInformations[sourceMatcher.sourceIndex];
		
		var label = XXX_String_Search.composeLabelFromSourceValueInformationAndSourceMatcher(sourceValueInformation, sourceMatcher, this.termMode, this.characterMatchingMode);
		
		output += '<br>' + label + '<br>';
	}
	
	return output;
};


