var XXX_String_Search =
{
	separatorPattern: ['\\s*[,\\-()\\s/]\\s*', 'm'],
	
	////////////////////
	// Terms (Split by , ( ) or space)
	////////////////////
	
	splitToTerms: function (sentence, sorted)
	{
		sentence = XXX_Type.makeString(sentence);
		
		var terms = XXX_String_Pattern.splitToArray(sentence, this.separatorPattern[0], this.separatorPattern[1]);
		
		terms = XXX_Array.filterOutEmpty(terms);
		
		if (sorted)
		{
			// From longest to shortest
			terms.sort(function (a, b)
			{
				return XXX_String.getCharacterLength(b) - XXX_String.getCharacterLength(a);
			});
		}
		
		return terms;
	},
	
	getRawParts: function (value)
	{
		var matches = XXX_String_Pattern.getMatches(value, '(.*?)(' + this.separatorPattern[0] + ')|(.+)', this.separatorPattern[1]);
			
		var result = [];
		
		var offset = 0;
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(matches[0]); i < iEnd; ++i)
		{
			for (var j = 1, jEnd = 4; j < jEnd; ++j)
			{
				if (XXX_Type.isVariableDefined(matches[j][i]) && matches[j][i] !== '')
				{
					var characterLength = XXX_String.getCharacterLength(matches[j][i]);
					
					result.push(
					{
						offset: offset,
						characterLength: characterLength,
						value: matches[j][i],
						partType: (j == 2) ? 'separator' : 'term'
					});
					
					offset += characterLength;
				}
			}
		}
		
		return result;
	},
	
	composeValueInformationSub: function (value, characterMatchingMode)
	{
		var result = {};
		
		result.rawValue = value;
		result.rawCharacterLength = XXX_String.getCharacterLength(value);
		
		if (characterMatchingMode == 'simplified')
		{
			result.simplifiedValue = '';
			result.simplifiedCharacterLength = 0;
			
			result.simplifiedToRawMapping = [];
			
			for (var i = 0, iEnd = result.rawCharacterLength; i < iEnd; ++i)
			{
				var rawCharacter = XXX_String.getPart(result.rawValue, i, 1);
				
				var simplifiedCharacter = XXX_String.simplifyCharacters(rawCharacter);
				var simplifiedCharacterCharacterLength = XXX_String.getCharacterLength(simplifiedCharacter);
				
				if (simplifiedCharacterCharacterLength > 1)
				{
					for (var j = 0, jEnd = simplifiedCharacterCharacterLength; j < jEnd; ++j)
					{
						result.simplifiedValue += XXX_String.getPart(simplifiedCharacter, j, 1);
						
						result.simplifiedToRawMapping.push(i);
						
						++result.simplifiedCharacterLength;
					}
				}
				else
				{
					result.simplifiedValue += simplifiedCharacter;
					
					result.simplifiedToRawMapping.push(i);
					
					++result.simplifiedCharacterLength;
				}
			}
		}
		
		return result;
	},
	
	composeValueInformation: function (value, termMode, characterMatchingMode)
	{
		var result = false;
		
		switch (termMode)
		{
			case 'split':
				var parts = this.getRawParts(value);
				var newParts = [];
				
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(parts); i < iEnd; ++i)
				{
					var part = parts[i];
				
					var newPart = false;
					
					switch (part.partType)
					{
						case 'separator':
							newPart = this.composeValueInformationSub(part.value);
							break;
						case 'term':
							newPart = this.composeValueInformationSub(part.value, characterMatchingMode);
							break;
					}
					
					newPart.partType = part.partType;
					newParts.push(newPart);
				}
				
				result = newParts;
				break;
			case 'full':
			default:
				result = this.composeValueInformationSub(value, characterMatchingMode);
				break;
		}
		
		return result;
	},
		
	composeMatcher: function (sourceIndex, valueInformation, termMode, characterMatchingMode)
	{
		var result = {};
		
		result.sourceIndex = sourceIndex;
		result.bestMatchType = false;
		
		result.fullyIdenticalCharacterHitTotal = 0;
		result.partlyIdenticalCharacterHitTotal = 0;
		result.partlySimilarCharacterHitTotal = 0;
		
		result.levenshteinDistanceTotal = 0;
		
		result.fullTermHitTotal = 0;
		result.partialTermHitTotal = 0;
		result.termHitTotal = 0;
		
		result.lowestMatchOffset = 10000;
		
		result.characterLength = 0;
				
		switch (termMode)
		{
			case 'split':
				result.parts = [];
				
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(valueInformation); i < iEnd; ++i)
				{
					var valueInformationSub = valueInformation[i];
				
					var matcherPart = {};
					matcherPart.partType = valueInformationSub.partType;
					
					matcherPart.rawCharacterLength = valueInformationSub.rawCharacterLength;
					
					if (characterMatchingMode == 'simplified')
					{
						matcherPart.simplifiedCharacterLength = valueInformationSub.simplifiedCharacterLength;
					}
					
					result.characterLength += valueInformationSub.rawCharacterLength;
					
					switch (matcherPart.partType)
					{
						case 'separator':
							break;
						case 'term':
							
							matcherPart.rawCharacterHits = [];
				
							for (var j = 0, jEnd = matcherPart.rawCharacterLength; j < jEnd; ++j)
							{
								matcherPart.rawCharacterHits.push(false);
							}
							
							if (characterMatchingMode == 'simplified')
							{
								matcherPart.simplifiedCharacterHits = [];
								
								for (var j = 0, jEnd = matcherPart.simplifiedCharacterLength; j < jEnd; ++j)
								{
									matcherPart.simplifiedCharacterHits.push(false);
								}
							}
							break;
					}
					
					result.parts.push(matcherPart);
				}
			break;
			case 'full':
			default:
				result.characterLength = valueInformation.rawCharacterLength;
				
				result.rawCharacterLength = valueInformation.rawCharacterLength;
				
				result.rawCharacterHits = [];
				
				for (var i = 0, iEnd = result.rawCharacterLength; i < iEnd; ++i)
				{
					result.rawCharacterHits.push(false);
				}
				
				if (characterMatchingMode == 'simplified')
				{
					result.simplifiedCharacterLength = valueInformation.simplifiedCharacterLength;
					
					result.simplifiedCharacterHits = [];
					
					for (var i = 0, iEnd = result.simplifiedCharacterLength; i < iEnd; ++i)
					{
						result.simplifiedCharacterHits.push(false);
					}
				}
				break;
		}
		
		return result;
	},
	
		getMatcherSortNumber: function (matcher)
		{
			var result = 0;
			
			if (!XXX_Type.isAssociativeArray(matcher))
			{
				result = 1;
			}
			
			return result;
		},
		
		getTermModeSortNumber: function (termMode)
		{
			var result = 0;
			
			switch (termMode)
			{
				case 'full':
					result = 1;
					break;
				case 'split':
					result = 2;
					break;
				case false:
				default:
					result = 3;
					break;
			}
			
			return result;
		},
		
		getMatchTypeSortNumber: function (matchType)
		{
			var result = 0;
			
			switch (matchType)
			{
				case 'fullyIdentical':
					result = 1;
					break;
				case 'partlyIdentical':
					result = 2;
					break;
				case 'partlySimilar':
					result = 3;
					break;
				case false:
				default:
					result = 4;
					break;
			}
			
			return result;
		},
				
	compareMatchers: function (a, b)
	{
		var result = 0;
		
		result = this.getMatcherSortNumber(a) - this.getMatcherSortNumber(b);
		
		if (result == 0)
		{
			result = this.getMatchTypeSortNumber(a.bestMatchType) - this.getMatchTypeSortNumber(b.bestMatchType);
			
			if (result == 0)
			{
				result = this.getTermModeSortNumber(a.termMode) - this.getTermModeSortNumber(b.termMode);
			
				if (result == 0)
				{
					result = b.fullTermHitTotal - a.fullTermHitTotal;
					
					if (result == 0)
					{
						result = b.partialTermHitTotal - a.partialTermHitTotal;
					
						if (result == 0)
						{
							result = b.fullyIdenticalCharacterHitTotal - a.fullyIdenticalCharacterHitTotal;
													
							if (result == 0)
							{
								result = b.partlyIdenticalCharacterHitTotal - a.partlyIdenticalCharacterHitTotal;
													
								if (result == 0)
								{
									result = b.partlySimilarCharacterHitTotal - a.partlySimilarCharacterHitTotal;
													
									if (result == 0)
									{						
										result = a.levenshteinDistanceTotal - b.levenshteinDistanceTotal;
										
										if (result == 0)
										{
											result = a.characterLength - b.characterLength;
											
											if (result == 0)
											{
												result = a.lowestMatchOffset - b.lowestMatchOffset;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		return result;
	},
	
	isBetterMatchType: function (oldMatchType, newMatchType)
	{
		var result = false;
		
		switch (oldMatchType)
		{
			case 'partlyIdentical':	
				if (newMatchType == 'fullyIdentical')
				{
					result = true;
				}										
				break;
			case 'partlySimilar':
				if (newMatchType == 'partlyIdentical' || newMatchType == 'fullyIdentical')
				{
					result = true;
				}
				break
			case false:
				result = true;
				break;
		}
		
		return result;
	},
	
	applyCharacterHitsToMatcher: function (matcher, valueInformationSub, characterMatchingMode, matchType, matchOffset, matchCharacterLength)
	{
		for (var i = matchOffset, iEnd = matchOffset + matchCharacterLength; i < iEnd; ++i)
		{
			switch (characterMatchingMode)
			{
				case 'raw':
					if (this.isBetterMatchType(matcher.rawCharacterHits[i], matchType))
					{
						matcher.rawCharacterHits[i] = matchType;
					}
					break;
				case 'simplified':
						if (this.isBetterMatchType(matcher.simplifiedCharacterHits[i], matchType))
						{
							matcher.simplifiedCharacterHits[i] = matchType;
						}
					
						var rawCharacterIndex = valueInformationSub.simplifiedToRawMapping[i];
						
						if (this.isBetterMatchType(matcher.rawCharacterHits[rawCharacterIndex], matchType))
						{
							matcher.rawCharacterHits[rawCharacterIndex] = matchType;
						}
					break;
			}
		}
		
		return matcher;
	},
	
	getMaximumLevenshteinDistanceForCharacterLength: function (characterLength)
	{
		var result = 0;
		
		if (characterLength > 2)
		{
			result = XXX_Number.floor(characterLength * 0.4);
			
			result = XXX_Number.lowest(result, 3);
		}
		
		return result;
	},
	
	compareTemporarySimilarMatches: function (a, b)
	{
		var result = 0;
		
		result = a[0] - b[0];
		
		if (result == 0)
		{		
			result = a[2] - b[2];
			
			if (result == 0)
			{
				result = a[1] - b[1];
			}
		}
		
		return result;
	},
	
	getMatchInformation: function (source, query, sourceCharacterLength, queryCharacterLength, similarWithinWord)
	{
		if (!sourceCharacterLength)
		{
			sourceCharacterLength = XXX_String.getCharacterLength(source);
		}
		
		if (!queryCharacterLength)
		{
			queryCharacterLength = XXX_String.getCharacterLength(query);
		}
			
		var result = false;
		
		var matchType = false;
		var matchOffset = 0;
		var matchCharacterLength = 0;
		var matchLevenshteinDistance = 0;
		
		// fullyIdentical
		if (source == query)
		{
			matchType = 'fullyIdentical';
			matchCharacterLength = sourceCharacterLength;
		}
		else
		{		
			var matchAtCharacterPosition = XXX_String.findFirstPosition(source, query);
			
			// partlyIdentical
			if (matchAtCharacterPosition !== false)
			{
				matchType = 'partlyIdentical';
				matchOffset = matchAtCharacterPosition;
				matchCharacterLength = queryCharacterLength;
			}
			// partlySimilar
			else
			{
				// Should be at least 3 characters
				if (queryCharacterLength > 2 && sourceCharacterLength > 2)
				{
					// See the maximum potential for mistakes
					var maximumLevenshteinDistance = this.getMaximumLevenshteinDistanceForCharacterLength(queryCharacterLength);
					
					if (maximumLevenshteinDistance > 0)
					{
						var characterLengthDifference = 0;
						
						if (queryCharacterLength > sourceCharacterLength)
						{
							characterLengthDifference = queryCharacterLength - sourceCharacterLength;
						}
						else if (queryCharacterLength < sourceCharacterLength)
						{
							characterLengthDifference = sourceCharacterLength - queryCharacterLength;
						}
						
						if (characterLengthDifference <= maximumLevenshteinDistance)
						{
							var levenshteinDistance = XXX_String_Levenshtein.getDistance(source, query);
							
							if (levenshteinDistance <= maximumLevenshteinDistance)
							{
								matchType = 'partlySimilar';
								matchCharacterLength = queryCharacterLength;						
								matchLevenshteinDistance = levenshteinDistance;
							}
						}
					}
				}
			}
		}
		
		if (matchType !== false)
		{
			result =
			{
				matchType: matchType,
				matchOffset: matchOffset,
				matchCharacterLength: matchCharacterLength,
				matchLevenshteinDistance: matchLevenshteinDistance
			};
		}
		
		return result;
	},
	
	processSourceWithQueryInMatcher: function (sourceValueInformation, queryValueInformation, matcher, termMode, characterMatchingMode)
	{
		var result = false;
		
		var sourceValue = '';
		var sourceCharacterLength = 0;
		
		var queryValue = '';
		var queryCharacterLength = 0;
		
		switch (termMode)
		{
			case 'full':
				
				switch (characterMatchingMode)
				{
					case 'raw':
						sourceValue = sourceValueInformation.rawValue;
						sourceCharacterLength = sourceValueInformation.rawCharacterLength;
						
						queryValue = queryValueInformation.rawValue;
						queryCharacterLength = queryValueInformation.rawCharacterLength;
						break;
					case 'simplified':
						sourceValue = sourceValueInformation.simplifiedValue;
						sourceCharacterLength = sourceValueInformation.simplifiedCharacterLength;
						
						queryValue = queryValueInformation.simplifiedValue;
						queryCharacterLength = queryValueInformation.simplifiedCharacterLength;
						break;
				}
				
				var matchInformation = this.getMatchInformation(sourceValue, queryValue, sourceCharacterLength, queryCharacterLength);
			
				if (matchInformation !== false)
				{				
					matcher = this.applyCharacterHitsToMatcher(matcher, sourceValueInformation, characterMatchingMode, matchInformation.matchType, matchInformation.matchOffset, matchInformation.matchCharacterLength);
					
					if (this.isBetterMatchType(matcher.bestMatchType, matchInformation.matchType))
					{
						matcher.bestMatchType = matchInformation.matchType;
					}
					
					switch (matchInformation.matchType)
					{
						case 'fullyIdentical':
							matcher.fullyIdenticalCharacterHitTotal = matchInformation.matchCharacterLength;
							
							matcher.fullTermHitTotal = 1;
							break;
						case 'identical':
							matcher.partlyIdenticalCharacterHitTotal = matchInformation.matchCharacterLength;
							
							matcher.partialTermHitTotal = 1;
							break;
						case 'similar':
							matcher.partlySimilarCharacterHitTotal = matchInformation.matchCharacterLength;
							matcher.levenshteinDistanceTotal = matchInformation.matchLevenshteinDistance;
							
							matcher.partialTermHitTotal = 1;
							break;
					}
					
					matcher.termHitTotal = 1;
				
					if (matchInformation.matchOffset < matcher.lowestMatchOffset)
					{
						matcher.lowestMatchOffset = matchInformation.matchOffset;
					}
					
					result = matcher;
				}
				
				break;
			case 'split':
				
				var hasMatch = false;
				
				var previousPartsOffset = 0;
				
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sourceValueInformation); i < iEnd; ++i)
				{
					var sourceValueInformationPart = sourceValueInformation[i];
					
					var matcherPart = matcher.parts[i];
					
					switch (characterMatchingMode)
					{
						case 'raw':
							sourceValue = sourceValueInformationPart.rawValue;
							sourceCharacterLength = sourceValueInformationPart.rawCharacterLength;
							break;
						case 'simplified':
							sourceValue = sourceValueInformationPart.simplifiedValue;
							sourceCharacterLength = sourceValueInformationPart.simplifiedCharacterLength;
							break;
					}
					
					switch (sourceValueInformationPart.partType)
					{
						case 'separator':
							// TODO count offset etc.
							break;
						case 'term':							
							for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(queryValueInformation); j < jEnd; ++j)
							{
								var queryValueInformationPart = queryValueInformation[j];
								
								if (queryValueInformationPart.partType == 'term')
								{
									switch (characterMatchingMode)
									{
										case 'raw':
											queryValue = queryValueInformationPart.rawValue;
											queryCharacterLength = queryValueInformationPart.rawCharacterLength;
											break;
										case 'simplified':
											queryValue = queryValueInformationPart.simplifiedValue;
											queryCharacterLength = queryValueInformationPart.simplifiedCharacterLength;
											break;
									}
									
									var matchInformation = this.getMatchInformation(sourceValue, queryValue, sourceCharacterLength, queryCharacterLength);
								
									if (matchInformation !== false)
									{
										hasMatch = true;
										
										matcherPart = this.applyCharacterHitsToMatcher(matcherPart, sourceValueInformationPart, characterMatchingMode, matchInformation.matchType, matchInformation.matchOffset, matchInformation.matchCharacterLength);
										
										if (this.isBetterMatchType(matcher.bestMatchType, matchInformation.matchType))
										{
											matcher.bestMatchType = matchInformation.matchType;
										}
										
										switch (matchInformation.matchType)
										{
											case 'fullyIdentical':
												matcher.fullyIdenticalCharacterHitTotal += matchInformation.matchCharacterLength;
												
												matcher.fullTermHitTotal += 1;
												break;
											case 'partlyIdentical':
												matcher.partlyIdenticalCharacterHitTotal += matchInformation.matchCharacterLength;
												
												matcher.partialTermHitTotal += 1;
												break;
											case 'partlySimilar':
												matcher.partlySimilarCharacterHitTotal += matchInformation.matchCharacterLength;
												matcher.levenshteinDistanceTotal += matchInformation.matchLevenshteinDistance;
												
												matcher.partialTermHitTotal += 1;
												break;
										}
										
										matcher.termHitTotal += 1;
										
										var correctedMatchOffset = previousPartsOffset + matchInformation.matchOffset;
										
										if (correctedMatchOffset < matcher.lowestMatchOffset)
										{
											matcher.lowestMatchOffset = correctedMatchOffset;
										}
									}
								}
							}
							break;
					}
					
					matcher.parts[i] = matcherPart;
					
					previousPartsOffset += sourceValueInformationPart.rawCharacterLength;
				}
				
				if (hasMatch)
				{
					result = matcher;
				}
				break;
		}
		
		return result;
	},
	
	composeLabelFromSourceValueInformationAndSourceMatcher: function (sourceValueInformation, sourceMatcher, termMode, characterMatchingMode)
	{
		var result = '';
		
		/*
		result += sourceMatcher.bestMatchType + '|';
		result += sourceMatcher.identicalCharacterHitTotal + '|';
		result += sourceMatcher.similarCharacterHitTotal + '|';
		result += sourceMatcher.levenshteinDistanceTotal + '|';
		result += sourceMatcher.termHitTotal + '|';
		result += sourceMatcher.lowestMatchOffset + '|';
		result += sourceMatcher.characterLength + '|';
		*/
		
		var previousCharacterHit = false;
		var characterHit = false;
		var character = '';
		
		var value = '';
		var characterHits = [];
		
		switch (termMode)
		{
			case 'full':
				switch (characterMatchingMode)
				{
					case 'raw':
						value = sourceValueInformation.rawValue;
						characterHits = sourceMatcher.rawCharacterHits;
						break;
					case 'simplified':
						value = sourceValueInformation.rawValue;
						characterHits = sourceMatcher.rawCharacterHits;
						break;
				}
				
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(characterHits); i < iEnd; ++i)
				{
					characterHit = characterHits[i];
					
					if (characterHit != previousCharacterHit)
					{
						switch (previousCharacterHit)
						{
							case 'fullyIdentical':
							case 'partlyIdentical':
								result += '</b>';
								break;
							case 'partlySimilar':
								result += '</u>';
								break;
						}
						
						switch (characterHit)
						{
							case 'fullyIdentical':
							case 'partlyIdentical':
								result += '<b>';
								break;
							case 'partlySimilar':
								result += '<u>';
								break;
						}
					}
					
					result += XXX_String.getPart(value, i, 1);
					
					previousCharacterHit = characterHit;
				}
				break;
			case 'split':
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(sourceValueInformation); i < iEnd; ++i)
				{
					var sourceValueInformationPart = sourceValueInformation[i];
					
					var sourceMatcherPart = sourceMatcher.parts[i];
					
					switch (sourceValueInformationPart.partType)
					{
						case 'separator':						
							switch (previousCharacterHit)
							{
								case 'fullyIdentical':
								case 'partlyIdentical':
									result += '</b>';
									break;
								case 'partlySimilar':
									result += '</u>';
									break;
							}
							
							result += sourceValueInformationPart.rawValue;
							
							previousCharacterHit = false;
							break;
						case 'term':
							
							switch (characterMatchingMode)
							{
								case 'raw':
									value = sourceValueInformationPart.rawValue;
									characterHits = sourceMatcherPart.rawCharacterHits;
									break;
								case 'simplified':
									value = sourceValueInformationPart.rawValue;
									characterHits = sourceMatcherPart.rawCharacterHits;
									break;
							}
							
							for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(characterHits); j < jEnd; ++j)
							{
								characterHit = characterHits[j];
								
								if (characterHit != previousCharacterHit)
								{
									switch (previousCharacterHit)
									{
										case 'fullyIdentical':
										case 'partlyIdentical':
											result += '</b>';
											break;
										case 'partlySimilar':
											result += '</u>';
											break;
									}
									
									switch (characterHit)
									{
										case 'fullyIdentical':
										case 'partlyIdentical':
											result += '<b>';
											break;
										case 'partlySimilar':
											result += '<u>';
											break;
									}
								}
								
								result += XXX_String.getPart(value, j, 1);
								
								previousCharacterHit = characterHit;
							}
							break;
					}
				}
				break;
		}
		
		switch (previousCharacterHit)
		{
			case 'fullyIdentical':
			case 'partlyIdentical':
				result += '</b>';
				break;
			case 'partlySimilar':
				result += '</u>';
				break;
		}
		
		return result;
	}
};
