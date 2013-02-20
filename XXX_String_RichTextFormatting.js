var XXX_String_RichTextFormatting =
{
	getTags: function (value, name)
	{
		var tagMatches = XXX_String_Pattern.getMatches(value, '\\[(' + name + ')((?:[^\\]]*?)?)\\](?:(.*?)\\[/(' + name + ')\\])?', 'i');
		
		var result = [];
		
		if (XXX_Array.getFirstLevelItemTotal(tagMatches))
		{
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(tagMatches[0]); i < iEnd; ++i)
			{
				var original = tagMatches[0][i];
				var opening = tagMatches[1][i];
				var attributes = tagMatches[2][i];
				var value = false;
				
				if (XXX_String.beginsWith(attributes, '='))
				{
					value = XXX_String.getPart(attributes, 1, XXX_String.getCharacterLength(attributes) - 1);
				}
				
				if (!value)
				{
					attributes = XXX_String_RichTextFormatting.parseAttributes(attributes);
				}
				
				var inner = tagMatches[3][i];
				var closing = tagMatches[4][i];
								
				result.push(
				{
					original: original,
					name: name,
					attributes: attributes,
					value: value,
					inner: inner,
					closing: closing ? true : false
				});
			}
		}
		
		return result;
	},
		
	parseAttributes: function (attributes)
	{
		var attributeMatches = XXX_String_Pattern.getMatches(attributes, '\\s{1,}([a-z_]*)=(.*?)(?=\\s{1,}|$)', 'i');
		
		var names = [];
		var values = [];
		
		if (XXX_Array.getFirstLevelItemTotal(attributeMatches))
		{
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(attributeMatches[0]); i < iEnd; ++i)
			{
				names.push(attributeMatches[1][i]);
				values.push(attributeMatches[2][i]);
			}
		}
		
		var result = {};
		
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(names); i < iEnd; ++i)
		{
			result[names[i]] = values[i];
		}
		
		return result;
	},
	
	
	processIcons: function (value)
	{
		var iconPath = XXX_Paths.composePublicWebURI('httpServer_static_XXX', 'presentation/images/userIcons/', 0);
		
		var icons = XXX_USER.getIcons();
		
		// User Icons
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(icons); i < iEnd; ++i)
		{
			var icon = icons[i];
			
			var code = icon.code;
			
			var composedIcon = '<img';
			
			composedIcon += ' src="' + iconPath + icon.file + '"';
			
			if (icon.title)
			{
				composedIcon += ' title="' + icon.name + '" alt="' + icon.name + '"';
			}
			
			composedIcon += '>';
			
			if (XXX_Type.isArray(icon.code))
			{
				for (var j = 0, jEnd = XXX_Array.getFirstLevelItemTotal(icon.code); j < jEnd; ++j)
				{
					code = icon.code[j];
					
					value = XXX_String.replace(value, code, composedIcon);
				}
			}
			else
			{
				value = XXX_String.replace(value, code, composedIcon);
			}
		}
		
		return value;
	},
		
	// TODO: Make case insensitive
	
	removeTextFormatting: function (value, formatOptions)
	{
		value = XXX_String.normalizeLineSeparators(value);
		
		value = XXX_String.disableHTMLTags(value);
		
		if (XXX_Array.hasValue(formatOptions, 'emphasis'))
		{
			value = XXX_String.replace(value, ['[strong]', '[/strong]'], ['', '']);		
			value = XXX_String.replace(value, ['[mild]', '[/mild]'], ['', '']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'edit'))
		{
			value = XXX_String.replace(value, ['[inserted]', '[/inserted]'], ['', '']);		
			value = XXX_String.replace(value, ['[deleted]', '[/deleted]'], ['', '']);
		}
			
		if (XXX_Array.hasValue(formatOptions, 'heading'))
		{
			value = XXX_String.replace(value, ['[heading1]', '[/heading1]'], ['', '']);		
			value = XXX_String.replace(value, ['[heading2]', '[/heading2]'], ['', '']);		
			value = XXX_String.replace(value, ['[heading3]', '[/heading3]'], ['', '']);
		}
			
		if (XXX_Array.hasValue(formatOptions, 'quote'))
		{
			value = XXX_String.replace(value, ['[quote]', '[/quote]'], ['', '']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'explicit'))
		{
			value = XXX_String.replace(value, ['[explicit]', '[/explicit]'], ['', '']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'textStyling'))
		{
			value = XXX_String_Pattern.replace(value, '\\[text_color=([0-9A-Fa-f]{6})\\]', '', '');
			value = XXX_String.replace(value, '[/text_color]', '');
			
			value = XXX_String_Pattern.replace(value, '\\[highlight_color=([0-9A-Fa-f]{6})\\]', '', '');
			value = XXX_String.replace(value, '[/highlight_color]', '');
			
			value = XXX_String_Pattern.replace(value, '\\[text_size=(small|medium|large|normal)\\]', '', '');
			value = XXX_String.replace(value, '[/text_size]', '');
			
			value = XXX_String_Pattern.replace(value, '\\[text_font=(classic|computer|business|normal)\\]', '', '');
			value = XXX_String.replace(value, '[/text_font]', '');
		}
		
		if (XXX_Array.hasValue(formatOptions, 'textAlignment'))
		{
			value = XXX_String_Pattern.replace(value, '\\[text_align=(left|center|right)\\]', '', '');
			value = XXX_String.replace(value, '[/text_align]', '');
		}
						
		if (XXX_Array.hasValue(formatOptions, 'list'))
		{
			value = XXX_String.replace(value, ['[ordered_list]', '[/ordered_list]'], ['', '']);
			value = XXX_String.replace(value, ['[unordered_list]', '[/unordered_list]'], ['', '']);
			value = XXX_String.replace(value, ['[item]', '[/item]'], ['', '']);
		}
			
		if (XXX_Array.hasValue(formatOptions, 'ruler'))
		{
			value = XXX_String.replace(value, '[ruler]', '');
		}
		
		if (XXX_Array.hasValue(formatOptions, 'link') || XXX_Array.hasValue(formatOptions, 'linkOnly'))
		{
			var linkTags = XXX_String_RichTextFormatting.getTags(value, 'link');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(linkTags); i < iEnd; ++i)
			{
				var linkTag = linkTags[i];
				
				value = XXX_String.replace(value, linkTag.original, linkTag.inner);
			}
			
		}
		
		if (XXX_Array.hasValue(formatOptions, 'link'))
		{
			var anchorTags = XXX_String_RichTextFormatting.getTags(value, 'anchor');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(anchorTags); i < iEnd; ++i)
			{
				var anchorTag = anchorTags[i];
				
				value = XXX_String.replace(value, anchorTag.original, '');
			}
		}
		
		if (XXX_Array.hasValue(formatOptions, 'externalMedia'))
		{
			var imageTags = XXX_String_RichTextFormatting.getTags(value, 'image');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(imageTags); i < iEnd; ++i)
			{
				var imageTag = imageTags[i];
				
				value = XXX_String.replace(value, imageTag.original, '');
			}
			
			
			var videoTags = XXX_String_RichTextFormatting.getTags(value, 'video');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(videoTags); i < iEnd; ++i)
			{
				var videoTag = videoTags[i];
				
				value = XXX_String.replace(value, videoTag.original, '');
			}
		}
		
		return value;
	},
	
	// TODO: Make case insensitive, always capitalize the word LAMOORA
	
	processTextFormatting: function (value, formatOptions)
	{
		value = XXX_String.normalizeLineSeparators(value);
	
		value = XXX_String.disableHTMLTags(value);
		
		value = XXX_String_Pattern.replace(value, XXX.lineSeparator, '', '<br>');	
		
		if (XXX_Array.hasValue(formatOptions, 'emphasis'))
		{
			value = XXX_String.replace(value, ['[strong]', '[/strong]'], ['<strong>', '</strong>']);
			value = XXX_String.replace(value, ['[mild]', '[/mild]'], ['<em>', '</em>']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'edit'))
		{
			value = XXX_String.replace(value, ['[inserted]', '[/inserted]'], ['<ins>', '</ins>']);
			value = XXX_String.replace(value, ['[deleted]', '[/deleted]'], ['<del>', '</del>']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'heading'))
		{
			value = XXX_String.replace(value, ['[heading1]', '[/heading1]'], ['<h1>', '</h1>']);
			value = XXX_String.replace(value, ['[heading2]', '[/heading2]'], ['<h2>', '</h2>']);
			value = XXX_String.replace(value, ['[heading3]', '[/heading3]'], ['<h3>', '</h3>']);
		}
			
		
		if (XXX_Array.hasValue(formatOptions, 'quote'))
		{
			value = XXX_String.replace(value, ['[quote]', '[/quote]'], ['<blockquote>', '</blockquote>']);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'explicit'))
		{
			// TODO....
			value = XXX_String.replace(value, ['[explicit]', '[/explicit]'], ['<div class="XXX_TextEditor_explicit"><a href="#" class="XXX_TextEditor_explicitContentToggler" title="' + XXX_I18n_Translation.get('InputComponent', 'TextEditor', 'toggleExplicitContent') + '" onclick="XXX.toggleExplicit(this); return false;">' + XXX_HTML.getIconSource('textEditor_explicit') +'</a><div class="XXX_TextEditor_explicitContent">', '</div></div>']);
		}
				
		if (XXX_Array.hasValue(formatOptions, 'textStyling'))
		{
			value = XXX_String_Pattern.replace(value, '\\[text_color=([0-9A-Fa-f]{6})\\]', '', '<span style="color: #$1;">');
			value = XXX_String.replace(value, '[/text_color]', '</span>');
			
			value = XXX_String_Pattern.replace(value, '\\[highlight_color=([0-9A-Fa-f]{6})\\]', '', '<span style="background-color: #$1;">');
			value = XXX_String.replace(value, '[/highlight_color]', '</span>');
			
			value = XXX_String_Pattern.replace(value, '\\[text_size=(small|medium|large|normal)\\]', '', '<span class="XXX_TextEditor_textSize_$1">');
			value = XXX_String.replace(value, '[/text_size]', '</span>');
			
			value = XXX_String_Pattern.replace(value, '\\[text_font=(classic|computer|business|normal)\\]', '', '<span class="XXX_TextEditor_textFont_$1">');
			value = XXX_String.replace(value, '[/text_font]', '</span>');
		}
		
		
		if (XXX_Array.hasValue(formatOptions, 'textAlignment'))
		{
			value = XXX_String_Pattern.replace(value, '\\[text_align=(left|center|right)\\]', '', '<span class="XXX_TextEditor_textAlign_$1">');
			value = XXX_String.replace(value, '[/text_align]', '</span>');
		}
		
		if (XXX_Array.hasValue(formatOptions, 'list'))
		{
			value = XXX_String.replace(value, ['[ordered_list]', '[/ordered_list]'], ['<ol>', '</ol>']);
			value = XXX_String.replace(value, ['[unordered_list]', '[/unordered_list]'], ['<ul>', '</ul>']);
			
			value = XXX_String.replace(value, ['[item]', '[/item]'], ['<li>', '</li>']);
			
			// Clear spacing between them
			var clearSpacing = function (all, before, spacing, after)
			{
				return before + after;
			};
			
			value = XXX_String_Pattern.replace(value, '(<(?:ul|ol|/li)>)((?:\\s|<br>)*)(<(?:/ul|/ol|li)>)', '', clearSpacing);
		}
		
		if (XXX_Array.hasValue(formatOptions, 'ruler'))
		{
			value = XXX_String.replace(value, '[ruler]', '<hr>');
		}
		
		if (XXX_Array.hasValue(formatOptions, 'link') || XXX_Array.hasValue(formatOptions, 'linkOnly'))
		{
			// Auto convert links
			var linkMatches = XXX_String_Pattern.getMatches(value, '((?:link|source)=|])?((?:(?:https?|ftp)://)?(?:[-a-z0-9+&@#/%?=~_|!:,;]{2,}\\.){2,}[-a-z0-9+&@#/%?=~_|!:,;]{2,})', 'i');
			
			var result = [];
			
			if (XXX_Array.getFirstLevelItemTotal(linkMatches))
			{
				for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(linkMatches[0]); i < iEnd; ++i)
				{
					var original = linkMatches[0][i];
					var prefix = linkMatches[1][i];
					var link = linkMatches[2][i];
					
					if (!(prefix == 'link=' || prefix == 'source=' || prefix == ']'))
					{
						value = XXX_String.replace(value, original, '[link=' + link + ']' + link + '[/link]');
					}
				}
			}
						
			// Link
			var linkTags = XXX_String_RichTextFormatting.getTags(value, 'link');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(linkTags); i < iEnd; ++i)
			{
				var linkTag = linkTags[i];
				
				var temp = '';
				
				if (linkTag.value)
				{
					temp += '<a';
					
					if (XXX_String.findFirstPosition(linkTag.value, '.') != -1 && !XXX_String.beginsWith(linkTag.value, '#'))
					{
						if (!(XXX_String.beginsWith(linkTag.value, 'http://') || XXX_String.beginsWith(linkTag.value, 'https://')))
						{
							linkTag.value = 'http://' + linkTag.value;
						}
						
						temp += ' href="' + linkTag.value + '"';
						temp += ' target="_blank"';
					}
					else if (XXX_String.beginsWith(linkTag.value, '#'))
					{
						temp += ' href="' + linkTag.value + '"';
					}
					else if (!XXX_String.beginsWith(linkTag.value, '#'))
					{
						temp += ' href="#' + linkTag.value + '"';
					}
										
					temp += '>';
					
					temp += linkTag.inner;
					
					temp += '</a>';
				}
				
				value = XXX_String.replace(value, linkTag.original, temp);
			}
			
		}
		
		if (XXX_Array.hasValue(formatOptions, 'link'))
		{
			
			var anchorTags = XXX_String_RichTextFormatting.getTags(value, 'anchor');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(anchorTags); i < iEnd; ++i)
			{
				var anchorTag = anchorTags[i];
				
				var temp = '';
				
				if (anchorTag.value)
				{
					temp += '<a';
										
					if (XXX_String.beginsWith(anchorTag.value, '#'))
					{
						anchorTag.value = XXX_String.getPart(anchorTag.value, 1, XXX_String.getCharacterLength(anchorTag.value) - 1);
					}
					
					temp += ' name=' + anchorTag.value;
					
					temp += '>';
					
					if (XXX_Type.isValue(anchorTag.inner))
					{
						temp += anchorTag.inner;
					}
					
					temp += '</a>';
				}
				
				value = XXX_String.replace(value, anchorTag.original, temp);
			}
		}
		
		if (XXX_Array.hasValue(formatOptions, 'externalMedia'))
		{
			// Image
			var imageTags = XXX_String_RichTextFormatting.getTags(value, 'image');
			
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(imageTags); i < iEnd; ++i)
			{
				var imageTag = imageTags[i];
				
				var temp = '';
				
				if (imageTag.attributes.source)
				{
					if (XXX_Array.hasValue(formatOptions, 'userImages') && XXX_Type.isNumeric(imageTag.attributes.source))
					{
						var userImage = XXX_USER.getImageByID(imageTag.attributes.source);
						
						if (userImage)
						{						
							imageTag.attributes.source = 'storage/userFiles/images/' + userImage.ID + '_normal.' + userImage.extension;
						}
						else
						{
							imageTag.attributes.source = false;
						}
												
						if (imageTag.attributes.size)
						{
							var originalWidth = XXX_Type.makeInteger(userImage.width);
							var originalHeight = XXX_Type.makeInteger(userImage.height);
							
							var desiredWidth = originalWidth;
							var desiredHeight = originalHeight;
							
							switch (imageTag.attributes.size)
							{
								case 'small':
									desiredWidth = 160;
									desiredHeight = 160;
									break;
								case 'medium':
									desiredWidth = 320;
									desiredHeight = 320;
									break;
								case 'large':
									desiredWidth = 640;
									desiredHeight = 640;
									break;
							}
							
							var newSize = XXX_Calculate.getScaledRectangleSize(originalWidth, originalHeight, desiredWidth, desiredHeight);
							
							imageTag.attributes.width = newSize.width;
							imageTag.attributes.height = newSize.height;
						}
					}
					
					if (imageTag.attributes.source)
					{
						
						temp = '<img';
												
						temp += ' src="' + imageTag.attributes.source + '"';
						
						if (imageTag.attributes.description)
						{
							temp += ' alt="' + imageTag.attributes.description + '"';
							temp += ' title="' + imageTag.attributes.description + '"';
						}
						
						if (imageTag.attributes.width)
						{
							imageTag.attributes.width = XXX_Type.makeInteger(imageTag.attributes.width);
							
							imageTag.attributes.width = XXX_Default.toIntegerRange(imageTag.attributes.width, 1, 1000, 640);
							
							temp += ' width="' + imageTag.attributes.width + '"';
						}
						
						if (imageTag.attributes.height)
						{
							imageTag.attributes.height = XXX_Type.makeInteger(imageTag.attributes.height);
							
							imageTag.attributes.height = XXX_Default.toIntegerRange(imageTag.attributes.height, 1, 1000, 640);
							
							temp += ' height="' + imageTag.attributes.height + '"';
						}
						
						if (imageTag.attributes.position)
						{
							imageTag.attributes.margin = XXX_Type.makeInteger(imageTag.attributes.margin);
							imageTag.attributes.margin = XXX_Default.toMinimumInteger(imageTag.attributes.margin, 1, 10);
							
							switch (imageTag.attributes.position)
							{
								case 'left':
									temp += ' style="float: left; margin: ' + imageTag.attributes.margin + 'px;"';
									break;
								case 'right':
									temp += ' style="float: right; margin: ' + imageTag.attributes.margin + 'px;"';
									break;
							}
						}
						else
						{
							if (!XXX_Type.isPositiveNumeric(imageTag.attributes.margin))
							{
								imageTag.attributes.margin = 0;
							}
							
							temp += ' style="margin: ' + imageTag.attributes.margin + 'px;"';
						}
						
						temp += '>';
					}
				}
				
				value = XXX_String.replace(value, imageTag.original, temp);
			}
			
			
			
			var videoTags = XXX_String_RichTextFormatting.getTags(value, 'video');
						
			for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(videoTags); i < iEnd; ++i)
			{
				var videoTag = videoTags[i];
				
				var videoSource = false;
				
				if (!XXX_Type.isPositiveNumeric(videoTag.attributes.width))
				{
					videoTag.attributes.width = XXX_Default.toIntegerRange(videoTag.attributes.width, 100, 1920, 480);
				}
				
				if (!XXX_Type.isPositiveNumeric(videoTag.attributes.height))
				{
					videoTag.attributes.height = XXX_Default.toIntegerRange(videoTag.attributes.height, 100, 1920, 320);
				}
				
				
				
				var videoID = false;
								
				// YouTube Video
				if (XXX_String.findFirstPosition(XXX_String.convertToLowerCase(videoTag.attributes.source), 'youtube.com') != -1)
				{
					/*
					http://www.youtube.com/v/kG2BYhjQIKQ&hl=en_US&fs=1
					*/
					
					var videoIDMatches = XXX_String_Pattern.getMatches(videoTag.attributes.source, '(?:v=|/v/)([a-z0-9=]{1,})', 'i');
					
					if (XXX_Array.getFirstLevelItemTotal(videoIDMatches[1]))
					{
						videoID = videoIDMatches[1][0];
					}
					
					videoSource = 'http://www.youtube.com/v/' + videoID + '&hl=en_US&fs=1';
				}
				
				// Google Video
				else if (XXX_String.findFirstPosition(XXX_String.convertToLowerCase(videoTag.attributes.source), 'video.google.com') != -1)
				{
					/*
					http://video.google.com/googleplayer.swf?docid=-8967914974980683249&hl=en&fs=true
					*/
					
					var videoIDMatches = XXX_String_Pattern.getMatches(videoTag.attributes.source, 'docid=(-?[0-9]{1,})', 'i');
					
					if (XXX_Array.getFirstLevelItemTotal(videoIDMatches[1]))
					{
						videoID = videoIDMatches[1][0];
					}
					
					videoSource = 'http://video.google.com/googleplayer.swf?docid=' + videoID + '&hl=en&fs=true';
				}
				
				// Vimeo video
				else if (XXX_String.findFirstPosition(XXX_String.convertToLowerCase(videoTag.attributes.source), 'vimeo.com') != -1)
				{
					/*
					http://vimeo.com/moogaloop.swf?clip_id=8423116&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1
					*/
					
					var videoIDMatches = XXX_String_Pattern.getMatches(videoTag.attributes.source, '(?:clip_id=|vimeo\.com/)([0-9]{1,})', 'i');
					
					if (XXX_Array.getFirstLevelItemTotal(videoIDMatches[1]))
					{
						videoID = videoIDMatches[1][0];
					}
					
					videoSource = 'http://vimeo.com/moogaloop.swf?clip_id=' + videoID + '&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0&color=&fullscreen=1';					
				}
								
				var temp = '';
				
				if (videoSource)
				{
					temp += '<object';
					
					temp += ' width="' + videoTag.attributes.width + '"';
					temp += ' height="' + videoTag.attributes.height + '"';
					
					if (videoTag.attributes.description)
					{
						temp += ' title' + videoTag.attributes.description + '"';	
					}
					
					temp += '>';
									
					temp += '<param name="allowfullscreen" value="true"></param>';					
					temp += '<param name="allowscriptaccess" value="always"></param>';
					temp += '<param name="movie" value="' + videoSource + '"></param>';	
					
					temp += '<embed';
					temp += ' type="application/x-shockwave-flash"';
					temp += ' allowfullscreen="true"';
					temp += ' allowscriptaccess="always"';
					temp += ' width="' + videoTag.attributes.width + '"';
					temp += ' height="' + videoTag.attributes.height + '"';
					temp += ' src="' + videoSource + '"';
					
					if (videoTag.attributes.description)
					{
						temp += ' title' + videoTag.attributes.description + '"';	
					}
					
					temp += '>';
					
					temp += '</embed>';
					
					temp += '</object>';
				}
				
				value = XXX_String.replace(value, videoTag.original, temp);
			}
		}
		
		if (XXX_Array.hasValue(formatOptions, 'userIcons'))
		{
			value = XXX_String_RichTextFormatting.processIcons(value);
		}
		
		return value;
	}
};