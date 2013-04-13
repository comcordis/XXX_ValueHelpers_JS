var XXX_String_Search =
{
	////////////////////
	// Terms (Split by , ( ) or space)
	////////////////////
	
	splitToTerms: function (sentence)
	{
		sentence = XXX_Type.makeString(sentence);
		
		var terms = XXX_String_Pattern.splitToArray(sentence, '\\s*(?:,|\\(|\\)|\\s|-)\\s*', '');
		
		terms = XXX_Array.filterOutEmpty(terms);
		
		// From longest to shortest
		terms.sort(function (a, b)
		{
			return XXX_String.getCharacterLength(b) - XXX_String.getCharacterLength(a);
		});
		
		return terms;
	},
	
	getTermInformation: function (subject)
	{
		var termsPattern = '(.*?)(\\s*[,\\-()\\s]\\s*)|(.+)';
		var termsPatternModifiers = 'm';
		
		var matches = XXX_String_Pattern.getMatches(subject, termsPattern, termsPatternModifiers);
		
		var terms = [];
		
		var offset = 0;
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(matches[0]); i < iEnd; ++i)
		{
			for (var j = 1, jEnd = 4; j < jEnd; ++j)
			{
				if (XXX_Type.isVariableDefined(matches[j][i]) && matches[j][i] !== '')
				{
					var characterLength = XXX_String.getCharacterLength(matches[j][i]);
					
					terms.push({offset: offset, characterLength: characterLength, value: matches[j][i], type: ((j == 2) ? 'separator' : 'term')});
						
					offset += XXX_String.getCharacterLength(matches[j][i]);
				}
			}
		}
		
		var result = [];
		var rawCharacterOffset = 0;
		var simplifiedCharacterOffset = 0;
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(terms); i < iEnd; ++i)
		{
			var term = terms[i];
			
			switch (term.type)
			{
				case 'separator':
					temp = {};
					temp.type = 'separator';
					
					temp.value = term.value;
					temp.characterLength = term.characterLength;
					temp.rawOffset = rawCharacterOffset;
					temp.simplifiedOffset = simplifiedCharacterOffset;
					
					result.push(temp);
					
					if (temp.rawCharacterLength > 0)
					{
						rawCharacterOffset += temp.rawCharacterLength;
					}
					if (temp.rawCharacterLength > 0)
					{
						simplifiedCharacterOffset += temp.rawCharacterLength;
					}
					break;
				case 'term':
					var temp = {};
					temp.type = 'term';
					
					temp.rawTerm = term.value;
					temp.rawCharacterLength = XXX_String.getCharacterLength(temp.rawTerm);
					temp.rawOffset = rawCharacterOffset;
					
					temp.simplifiedTerm = '';
					temp.simplifiedCharacterLength = 0;
					temp.simplifiedOffset = simplifiedCharacterOffset;
					
					// TODO only if characterLength is not the same
					temp.simplifiedToRawMapping = [];
					
					temp.rawCharacterSwitches = [];
					temp.simplifiedCharacterSwitches = [];
					
					var tempSimplifiedExtraOffset = 0;
					
					for (var j = 0, jEnd = XXX_String.getCharacterLength(temp.rawTerm); j < jEnd; ++j)
					{
						var rawCharacter = XXX_String.getPart(temp.rawTerm, j, 1);
						
						
						temp.rawCharacterSwitches.push(false);
						
						var rawCharacterSimplified = XXX_String.simplifyCharacters(rawCharacter);
						
						var rawCharacterSimplifiedCharacterLength = XXX_String.getCharacterLength(rawCharacterSimplified);
						
						if (rawCharacterSimplifiedCharacterLength > 1)
						{
							for (var k = 0, kEnd = rawCharacterSimplifiedCharacterLength; k < kEnd; ++k)
							{
								temp.simplifiedTerm += XXX_String.getPart(rawCharacterSimplified, k, 1);
								
								temp.simplifiedToRawMapping.push(j);
								
								temp.simplifiedCharacterSwitches.push(false);
								
								++temp.simplifiedCharacterLength;
								++tempSimplifiedExtraOffset;
							}
						}
						else
						{
							temp.simplifiedTerm += rawCharacterSimplified;
							
							temp.simplifiedToRawMapping.push(j);
							
							temp.simplifiedCharacterSwitches.push(false);
							
							++temp.simplifiedCharacterLength;
							++tempSimplifiedExtraOffset;
						}
					}
					
					result.push(temp);
					
					if (temp.rawCharacterLength > 0)
					{
						rawCharacterOffset += temp.rawCharacterLength;
					}
					if (temp.simplifiedCharacterLength > 0)
					{
						simplifiedCharacterOffset += temp.simplifiedCharacterLength;
					}
					break;
			}
		}
		
		return result;
	},
	
	resetCharacterSwitchesForSourceTermInformation: function (sourceTermInformation)
	{
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sourceTermInformation); i < iEnd; ++i)
		{
			var sourceTerm = sourceTermInformation[i];
			
			sourceTerm.rawCharacterSwitches = [];
			
			for (var j = 0, jEnd = sourceTerm.rawCharacterLength; j < jEnd; ++j)
			{
				sourceTerm.rawCharacterSwitches.push(false);
			}
			
			sourceTerm.simplifiedCharacterSwitches = [];
			
			for (var j = 0, jEnd = sourceTerm.simplifiedCharacterLength; j < jEnd; ++j)
			{
				sourceTerm.simplifiedCharacterSwitches.push(false);
			}
			
			sourceTermInformation[i] = sourceTerm;
		}
		
		return sourceTermInformation;
	},
	
	matchSourceTermInformationWithQueryTermInformation: function (sourceTermInformation, queryTermInformation)
	{
		var minimumLevenshteinPercentage = 50;
		
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sourceTermInformation); i < iEnd; ++i)
		{
			var sourceTerm = sourceTermInformation[i];
			
			if (sourceTerm.type == 'term')
			{
				for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(queryTermInformation); j < jEnd; ++j)
				{
					var queryTerm = queryTermInformation[j];
					
					if (queryTerm.type == 'term')
					{
						var matchAtCharacterPosition = XXX_String.findFirstPosition(sourceTerm.simplifiedTerm, queryTerm.simplifiedTerm);
						
						var matchType = false;
						var matchOffset = 0;
						var matchCharacterLength = 0;						
						
						if (matchAtCharacterPosition === 0)
						{
							matchType = 'literalFromBeginning';
							matchCharacterLength = queryTerm.simplifiedCharacterLength;
							
						}
						else if (matchAtCharacterPosition > 0)
						{
							matchType = 'literalAnywhereWithin';
							matchOffset = matchAtCharacterPosition;
							matchCharacterLength = queryTerm.simplifiedCharacterLength;
						}
						else
						{
							if (queryTerm.simplifiedCharacterLength < sourceTerm.simplifiedCharacterLength)
							{
								var characterLengthDifference = sourceTerm.simplifiedCharacterLength - queryTerm.simplifiedCharacterLength;
								
								var tempOffsetPercentages = [];
								
								for (var k = 0, kEnd = characterLengthDifference; k < kEnd; ++k)
								{
									var simplifiedSourceTermPart = XXX_String.getPart(sourceTerm.simplifiedTerm, k, queryTerm.simplifiedCharacterLength);
									
									var levenshteinInformation = XXX_String_Levenshtein.getInformation(queryTerm.simplifiedTerm, simplifiedSourceTermPart);
									
									XXX_JS.errorNotification(1, simplifiedSourceTermPart + '|' + queryTerm.simplifiedTerm + '|' + levenshteinInformation.percentage + '%');
									
									if (levenshteinInformation.percentage >= minimumLevenshteinPercentage)
									{
										tempOffsetPercentages.push([k, levenshteinInformation.percentage]);
									}
								}
								
								if (XXX_Array.getFirstLevelItemTotal(tempOffsetPercentages))
								{
									tempOffsetPercentages.sort(function (a, b)
									{
										return b[1] - a[1];
									});
									
									var tempOffset = tempOffsetPercentages[0][0];
									var tempPercentage = tempOffsetPercentages[0][1];
									
									if (tempOffset == 0)
									{
										matchType = 'levenshteinFromBeginning';
										matchOffset = 0;
										matchCharacterLength = queryTerm.simplifiedCharacterLength;
									}
									else
									{
										matchType = 'levenshteinAnywhereWithin';
										matchOffset = tempOffset;
										matchCharacterLength = queryTerm.simplifiedCharacterLength;
									}
								}
							}
							else
							{
								var sourceIsAtLeatHalfAsLongAsQuery = true;
							
								if (queryTerm.simplifiedCharacterLength > sourceTerm.simplifiedCharacterLength)
								{
									var halfQueryCharacterLength = XXX_Number.round(queryTerm.simplifiedCharacterLength / 2);
									
									if (sourceTerm.simplifiedCharacterLength < halfQueryCharacterLength)
									{
										sourceIsAtLeatHalfAsLongAsQuery = false;
									}
								}
								
								if (sourceIsAtLeatHalfAsLongAsQuery)
								{							
									var a = sourceTerm.simplifiedTerm;
									var b = queryTerm.simplifiedTerm;
									var characterLength = sourceTerm.simplifiedCharacterLength;
									
									var levenshteinInformation = XXX_String_Levenshtein.getInformation(sourceTerm.simplifiedTerm, queryTerm.simplifiedTerm);
									
									if (levenshteinInformation.percentage >= minimumLevenshteinPercentage)
									{
										matchType = 'levenshteinFromBeginning';
										matchCharacterLength = queryTerm.simplifiedCharacterLength;
									}
								}
								
								
							}
							
							
							
						}
						
						if (matchType !== false)
						{
							for (var k = matchOffset, kEnd = matchOffset + matchCharacterLength; k < kEnd; ++k)
							{
								// Simplified
								
								var previousSimplifiedCharacterSwitch = sourceTerm.simplifiedCharacterSwitches[k];
								
								switch (previousSimplifiedCharacterSwitch)
								{
									case 'literalFromBeginning':
										
										break;
									case 'literalAnywhereWithin':
										if (matchType == 'literalFromBeginning')
										{
											sourceTerm.simplifiedCharacterSwitches[k] = matchType;
										}
										break;
									case 'levenshteinFromBeginning':
										if (matchType == 'literalFromBeginning' || matchType == 'literalAnywhereWithin')
										{
											sourceTerm.simplifiedCharacterSwitches[k] = matchType;
										}
										break;
									case 'levenshteinAnywhereWithin':
										if (matchType == 'literalFromBeginning' || matchType == 'literalAnywhereWithin' || matchType == 'levenshteinFromBeginning')
										{
											sourceTerm.simplifiedCharacterSwitches[k] = matchType;
										}
										break;
									case false:
										sourceTerm.simplifiedCharacterSwitches[k] = matchType;
										break;
								}
								
								// Raw
								
								var rawCharacterIndex = sourceTerm.simplifiedToRawMapping[k];
								
								var previousRawCharacterSwitch = sourceTerm.rawCharacterSwitches[rawCharacterIndex];
								
								switch (previousRawCharacterSwitch)
								{
									case 'literalFromBeginning':
										
										break;
									case 'literalAnywhereWithin':
										if (matchType == 'literalFromBeginning')
										{
											sourceTerm.rawCharacterSwitches[rawCharacterIndex] = matchType;
										}
										break;
									case 'levenshteinFromBeginning':
										if (matchType == 'literalFromBeginning' || matchType == 'literalAnywhereWithin')
										{
											sourceTerm.rawCharacterSwitches[rawCharacterIndex] = matchType;
										}
										break;
									case 'levenshteinAnywhereWithin':
										if (matchType == 'literalFromBeginning' || matchType == 'literalAnywhereWithin' || matchType == 'levenshteinFromBeginning')
										{
											sourceTerm.rawCharacterSwitches[rawCharacterIndex] = matchType;
										}
										break;
									case false:
										sourceTerm.rawCharacterSwitches[rawCharacterIndex] = matchType;
										break;
								}
							}
						}
						
						sourceTermInformation[i] = sourceTerm;
					}
				}
			}
		}
		
		return sourceTermInformation;
	},
	
	composeLabelFromSourceTermInformation: function (sourceTermInformation)
	{
		var result = '';
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sourceTermInformation); i < iEnd; ++i)
		{
			var sourceTerm = sourceTermInformation[i];
			
			switch (sourceTerm.type)
			{
				case 'separator':
					result += sourceTerm.value;
					break;
				case 'term':
					for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(sourceTerm.rawCharacterSwitches); j < jEnd; ++j)
					{
						var characterSwitch = sourceTerm.rawCharacterSwitches[j];
						
						// Simplified to raw mapping
						
						switch (characterSwitch)
						{
							case 'literalFromBeginning':
								result += '<b>' + XXX_String.getPart(sourceTerm.rawTerm, j, 1) + '</b>';
								break;
							case 'literalAnywhereWithin':
								result += '<u>' + XXX_String.getPart(sourceTerm.rawTerm, j, 1) + '</u>';
								break;
							case 'levenshteinFromBeginning':
								result += '<i><b>' + XXX_String.getPart(sourceTerm.rawTerm, j, 1) + '</b></i>';
								break;
							case 'levenshteinAnywhereWithin':
								result += '<i><b>' + XXX_String.getPart(sourceTerm.rawTerm, j, 1) + '</b></i>';
								break;
							case false:
								result += XXX_String.getPart(sourceTerm.rawTerm, j, 1);
								break;
						}
					}
					break;
			}
		}
		
		return result;
	},
	
	
	
	
	/*
	
	
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
		- <b> Literal from beginning
		- <u> Literal anywhere within
		- <i> Levenshtein from beginning
		- <i> Levenshtein anwywhere within
	
	precedence:
		- full
			- Literal from beginning
			- Literal anywhere within
			- Levenshtein from beginning
			- Levenshtein anywhere within
		- split
			- Literal from beginning
			- Literal anywhere within
			- Levenshtein from beginning
			- Levenshtein anywhere within
	
	Problems:
		- matching (character switches) and result presentation difference
		- if special character is formed back to multiple base characters
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
	
	getSourceSwitchBoard: function (source)
	{
		
		var characterLength = XXX_String.getCharacterLength(source);
		
		var result =
		{
			source: source,
			sourceLowerCase: XXX_String.convertToLowerCase(source),
			characterLength: characterLength,
			characterSwitches: [],
			characterHitPercentage: 0,
			characterHitPercentageStep: 100 / characterLength,
			termHits: 0
		};
		
		if (characterLength > 0)
		{
			for (var i = 0, iEnd = characterLength; i < iEnd; ++i)
			{
				result.characterSwitches.push({character: XXX_String.getPart(source, i, 1), characterSwitch: false});
			}
		}
		
		return result;
	},
	
	
	
	/*
	
	Inverted index:
		
		
		- Read in all options, give them an index
			- Parse all the words from it
			- Make an index of the words with an array to all options
    		
    		termFrequencyInDocument:
    			Differentiate documents by determining how many times the term is within it.
    			To limit the impact of e.g. a message like 'java java java java java java', do termFrequncyInDocument = lowest(termFrequncyInDocument, 3) - A higher entropy is more important for these messages.
    		termFrequencyInAllDocuments:
    			Gives terms an importance ranking. E.g. determine in how many documents the term shows up. The more the lower the importance, the less the higher.
    		
			// This function is adapted from David Mertz's public domain Gnosis Utils for Python
			// with some extra gymnastics since jsfiles uses the more compact js array instead of object/dicts
			function localfind (wordlist)
			{
				var entries = {};
				var hits = {}
				
				for (var idx = 0; idx < jsfiles.length; idx++)
				{
					// copy of the fileids index
					hits[idx] = jsfiles[idx]; 
				}
				
				for (var idx in wordlist)
				{
					var word = wordlist[idx];
					word = word.toUpperCase();
					
					if (!jswords[word])
					{
						// Nothing for this one word (fail)
						return {};
					}
					
					var entry = {};
					
					// For each word, get index
					for (var idx=0; idx < jswords[word].length; idx++) 
					{
						// of matching files
						entry[jswords[word][idx]] = "hit"; 
					}
					
					// Eliminate hits for every non-match
					for (var fileid in hits) 
					{
						if (!entry[fileid])
						{
							delete hits[fileid];
						}
					}
				}
				
				return hits;
			}
	
	*/
	
	composeInvertedIndex: function ()
	{
		this.sources = [];
		this.terms = [];
	}
};

/*

Source:
	- terms
		- term
		- frequency
		- limitedFrequency (e.g. to avoid having a tweet with 20 times the same term ranking higher)
	- term entropy (how many different terms)
	
Terms:
	- frequency: The total)
	- sourceFrequency (How many of the sources have it at least once, the less the more distinctive the term is)
	
*/

XXX_Search_InvertedIndex = function ()
{
	
};

XXX_Search_InvertedIndex.prototype.addSource = function (source)
{
	var index = XXX_Array.getFirstLevelItemTotal(this.sources);
	
	this.sources.push(source);
	
	var terms = this.splitToTerms();
};

XXX_Search_InvertedIndex.prototype.find = function ()
{

};