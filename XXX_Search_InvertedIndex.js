

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

var XXX_Search_InvertedIndex = function ()
{
	this.sources = [];
	this.terms = [];
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