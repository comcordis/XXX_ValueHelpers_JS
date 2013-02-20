var XXX_String_ContextBoundaries =
{
	getWordBoundaries: function (value, selectionStart, selectionEnd)
	{
		var characterLength = XXX_String.getCharacterLength(value);
		
		selectionStart = XXX_Number.forceInRange(selectionStart, 0, characterLength);
		selectionEnd = XXX_Number.forceInRange(selectionEnd, selectionStart, characterLength);
		
		var partBeforeSelection = XXX_String.getPart(value, 0, selectionStart);
		var partAfterSelection = XXX_String.getPart(value, selectionEnd, characterLength);
		
		var partBeforeSelectionLastWordPart = XXX_String_Pattern.getMatch(partBeforeSelection, '([\\w-]*)$', 'i');
		partBeforeSelectionLastWordPart = partBeforeSelectionLastWordPart[0];		
		var partBeforeSelectionLastWordPartCharacterLength = XXX_String.getCharacterLength(partBeforeSelectionLastWordPart);
				
		var partAfterSelectionFirstWordPart = XXX_String_Pattern.getMatch(partAfterSelection, '^([\\w-]*)', 'i');
		partAfterSelectionFirstWordPart = partAfterSelectionFirstWordPart[0];		
		var partAfterSelectionFirstWordPartCharacterLength = XXX_String.getCharacterLength(partAfterSelectionFirstWordPart);
				
		var wordStart = selectionStart - partBeforeSelectionLastWordPartCharacterLength;
		var wordEnd = selectionEnd + partAfterSelectionFirstWordPartCharacterLength;
		var wordLength = wordEnd - wordStart;
		
		var beforePart = XXX_String.getPart(value, 0, wordStart);
		var wordPart = XXX_String.getPart(value, wordStart, wordLength);
		var afterPart = XXX_String.getPart(value, wordEnd, characterLength - wordEnd);
		
		var result =
		{
			start: wordStart,
			end: wordEnd,
			length: wordLength,
			
			position: selectionStart,
			
			beforePart: beforePart,
			part: wordPart,
			afterPart: afterPart
		};
		
		return result;
	},
	
	getItemBoundaries: function (value, selectionStart, selectionEnd)
	{
		var characterLength = XXX_String.getCharacterLength(value);
		
		selectionStart = XXX_Number.forceInRange(selectionStart, 0, characterLength);
		selectionEnd = XXX_Number.forceInRange(selectionEnd, selectionStart, characterLength);
		
		var partBeforeSelection = XXX_String.getPart(value, 0, selectionStart);
		var partAfterSelection = XXX_String.getPart(value, selectionEnd, characterLength);
		
		var partBeforeSelectionLastItemPart = XXX_String_Pattern.getMatch(partBeforeSelection, '((?:[\\w-][^,"\']*|[\\w-]?))$', 'i');
		partBeforeSelectionLastItemPart = partBeforeSelectionLastItemPart[0];		
		var partBeforeSelectionLastItemPartCharacterLength = XXX_String.getCharacterLength(partBeforeSelectionLastItemPart);
				
		var partAfterSelectionFirstItemPart = XXX_String_Pattern.getMatch(partAfterSelection, '^((?:[^,"\']*[\\w-]|[\\w-]?))', 'i');
		partAfterSelectionFirstItemPart = partAfterSelectionFirstItemPart[0];		
		var partAfterSelectionFirstItemPartCharacterLength = XXX_String.getCharacterLength(partAfterSelectionFirstItemPart);
				
		var itemStart = selectionStart - partBeforeSelectionLastItemPartCharacterLength;
		var itemEnd = selectionEnd + partAfterSelectionFirstItemPartCharacterLength;
		var itemLength = itemEnd - itemStart;
		
		var beforePart = XXX_String.getPart(value, 0, itemStart);
		var itemPart = XXX_String.getPart(value, itemStart, itemLength);
		var afterPart = XXX_String.getPart(value, itemEnd, characterLength - itemEnd);
		
		var result =
		{
			start: itemStart,
			end: itemEnd,
			length: itemLength,
			
			position: selectionStart,
			
			beforePart: beforePart,
			part: itemPart,
			afterPart: afterPart
		};
		
		return result;
	}
};