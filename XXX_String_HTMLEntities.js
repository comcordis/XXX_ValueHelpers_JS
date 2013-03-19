
/*

Encoding is also known as escape HTML

Regression test:

Original:
<<<in>>> ""&quot;"hello" £299 o'hara &&&&amp;&  © قطر تشن فولكس فاغن

Encoded:
&lt;&lt;&lt;in&gt;&gt;&gt; &quot;&quot;&amp;quot;&quot;hello&quot; &pound;299 o&#39;hara &amp;&amp;&amp;&amp;amp;&amp;  &copy; &#1602;&#1591;&#1585; &#1578;&#1588;&#1606; &#1601;&#1608;&#1604;&#1603;&#1587; &#1601;&#1575;&#1594;&#1606;

*/

var XXX_String_HTMLEntities =
{
	entities:
	[
		['&nbsp;', '&#160;'],
		['&iexcl;', '&#161;'],
		['&cent;', '&#162;'],
		['&pound;', '&#163;'],
		['&curren;', '&#164;'],
		['&yen;', '&#165;'],
		['&brvbar;', '&#166;'],
		['&sect;', '&#167;'],
		['&uml;', '&#168;'],
		['&copy;', '&#169;'],
		['&ordf;', '&#170;'],
		['&laquo;', '&#171;'],
		['&not;', '&#172;'],
		['&shy;', '&#173;'],
		['&reg;', '&#174;'],
		['&macr;', '&#175;'],
		['&deg;', '&#176;'],
		['&plusmn;', '&#177;'],
		['&sup2;', '&#178;'],
		['&sup3;', '&#179;'],
		['&acute;', '&#180;'],
		['&micro;', '&#181;'],
		['&para;', '&#182;'],
		['&middot;', '&#183;'],
		['&cedil;', '&#184;'],
		['&sup1;', '&#185;'],
		['&ordm;', '&#186;'],
		['&raquo;', '&#187;'],
		['&frac14;', '&#188;'],
		['&frac12;', '&#189;'],
		['&frac34;', '&#190;'],
		['&iquest;', '&#191;'],
		['&agrave;', '&#192;'],
		['&aacute;', '&#193;'],
		['&acirc;', '&#194;'],
		['&atilde;', '&#195;'],
		['&Auml;', '&#196;'],
		['&aring;', '&#197;'],
		['&aelig;', '&#198;'],
		['&ccedil;', '&#199;'],
		['&egrave;', '&#200;'],
		['&eacute;', '&#201;'],
		['&ecirc;', '&#202;'],
		['&euml;', '&#203;'],
		['&igrave;', '&#204;'],
		['&iacute;', '&#205;'],
		['&icirc;', '&#206;'],
		['&iuml;', '&#207;'],
		['&eth;', '&#208;'],
		['&ntilde;', '&#209;'],
		['&ograve;', '&#210;'],
		['&oacute;', '&#211;'],
		['&ocirc;', '&#212;'],
		['&otilde;', '&#213;'],
		['&Ouml;', '&#214;'],
		['&times;', '&#215;'],
		['&oslash;', '&#216;'],
		['&ugrave;', '&#217;'],
		['&uacute;', '&#218;'],
		['&ucirc;', '&#219;'],
		['&Uuml;', '&#220;'],
		['&yacute;', '&#221;'],
		['&thorn;', '&#222;'],
		['&szlig;', '&#223;'],
		['&agrave;', '&#224;'],
		['&aacute;', '&#225;'],
		['&acirc;', '&#226;'],
		['&atilde;', '&#227;'],
		['&auml;', '&#228;'],
		['&aring;', '&#229;'],
		['&aelig;', '&#230;'],
		['&ccedil;', '&#231;'],
		['&egrave;', '&#232;'],
		['&eacute;', '&#233;'],
		['&ecirc;', '&#234;'],
		['&euml;', '&#235;'],
		['&igrave;', '&#236;'],
		['&iacute;', '&#237;'],
		['&icirc;', '&#238;'],
		['&iuml;', '&#239;'],
		['&eth;', '&#240;'],
		['&ntilde;', '&#241;'],
		['&ograve;', '&#242;'],
		['&oacute;', '&#243;'],
		['&ocirc;', '&#244;'],
		['&otilde;', '&#245;'],
		['&ouml;', '&#246;'],
		['&divide;', '&#247;'],
		['&Oslash;', '&#248;'],
		['&ugrave;', '&#249;'],
		['&uacute;', '&#250;'],
		['&ucirc;', '&#251;'],
		['&uuml;', '&#252;'],
		['&yacute;', '&#253;'],
		['&thorn;', '&#254;'],
		['&yuml;', '&#255;'],
		['&quot;', '&#34;'],
		['&amp;', '&#38;'],
		['&lt;', '&#60;'],
		['&gt;', '&#62;'],
		['&oelig;', '&#338;'],
		['&oelig;', '&#339;'],
		['&scaron;', '&#352;'],
		['&scaron;', '&#353;'],
		['&yuml;', '&#376;'],
		['&circ;', '&#710;'],
		['&tilde;', '&#732;'],
		['&ensp;', '&#8194;'],
		['&emsp;', '&#8195;'],
		['&thinsp;', '&#8201;'],
		['&zwnj;', '&#8204;'],
		['&zwj;', '&#8205;'],
		['&lrm;', '&#8206;'],
		['&rlm;', '&#8207;'],
		['&ndash;', '&#8211;'],
		['&mdash;', '&#8212;'],
		['&lsquo;', '&#8216;'],
		['&rsquo;', '&#8217;'],
		['&sbquo;', '&#8218;'],
		['&ldquo;', '&#8220;'],
		['&rdquo;', '&#8221;'],
		['&bdquo;', '&#8222;'],
		['&dagger;', '&#8224;'],
		['&dagger;', '&#8225;'],
		['&permil;', '&#8240;'],
		['&lsaquo;', '&#8249;'],
		['&rsaquo;', '&#8250;'],
		['&euro;', '&#8364;'],
		['&fnof;', '&#402;'],
		['&alpha;', '&#913;'],
		['&beta;', '&#914;'],
		['&gamma;', '&#915;'],
		['&delta;', '&#916;'],
		['&epsilon;', '&#917;'],
		['&zeta;', '&#918;'],
		['&eta;', '&#919;'],
		['&theta;', '&#920;'],
		['&iota;', '&#921;'],
		['&kappa;', '&#922;'],
		['&lambda;', '&#923;'],
		['&mu;', '&#924;'],
		['&nu;', '&#925;'],
		['&xi;', '&#926;'],
		['&omicron;', '&#927;'],
		['&pi;', '&#928;'],
		['&rho;', '&#929;'],
		['&sigma;', '&#931;'],
		['&tau;', '&#932;'],
		['&upsilon;', '&#933;'],
		['&phi;', '&#934;'],
		['&chi;', '&#935;'],
		['&psi;', '&#936;'],
		['&omega;', '&#937;'],
		['&alpha;', '&#945;'],
		['&beta;', '&#946;'],
		['&gamma;', '&#947;'],
		['&delta;', '&#948;'],
		['&epsilon;', '&#949;'],
		['&zeta;', '&#950;'],
		['&eta;', '&#951;'],
		['&theta;', '&#952;'],
		['&iota;', '&#953;'],
		['&kappa;', '&#954;'],
		['&lambda;', '&#955;'],
		['&mu;', '&#956;'],
		['&nu;', '&#957;'],
		['&xi;', '&#958;'],
		['&omicron;', '&#959;'],
		['&pi;', '&#960;'],
		['&rho;', '&#961;'],
		['&sigmaf;', '&#962;'],
		['&sigma;', '&#963;'],
		['&tau;', '&#964;'],
		['&upsilon;', '&#965;'],
		['&phi;', '&#966;'],
		['&chi;', '&#967;'],
		['&psi;', '&#968;'],
		['&omega;', '&#969;'],
		['&thetasym;', '&#977;'],
		['&upsih;', '&#978;'],
		['&piv;', '&#982;'],
		['&bull;', '&#8226;'],
		['&hellip;', '&#8230;'],
		['&prime;', '&#8242;'],
		['&prime;', '&#8243;'],
		['&oline;', '&#8254;'],
		['&frasl;', '&#8260;'],
		['&weierp;', '&#8472;'],
		['&image;', '&#8465;'],
		['&real;', '&#8476;'],
		['&trade;', '&#8482;'],
		['&alefsym;', '&#8501;'],
		['&larr;', '&#8592;'],
		['&uarr;', '&#8593;'],
		['&rarr;', '&#8594;'],
		['&darr;', '&#8595;'],
		['&harr;', '&#8596;'],
		['&crarr;', '&#8629;'],
		['&larr;', '&#8656;'],
		['&uarr;', '&#8657;'],
		['&rarr;', '&#8658;'],
		['&darr;', '&#8659;'],
		['&harr;', '&#8660;'],
		['&forall;', '&#8704;'],
		['&part;', '&#8706;'],
		['&exist;', '&#8707;'],
		['&empty;', '&#8709;'],
		['&nabla;', '&#8711;'],
		['&isin;', '&#8712;'],
		['&notin;', '&#8713;'],
		['&ni;', '&#8715;'],
		['&prod;', '&#8719;'],
		['&sum;', '&#8721;'],
		['&minus;', '&#8722;'],
		['&lowast;', '&#8727;'],
		['&radic;', '&#8730;'],
		['&prop;', '&#8733;'],
		['&infin;', '&#8734;'],
		['&ang;', '&#8736;'],
		['&and;', '&#8743;'],
		['&or;', '&#8744;'],
		['&cap;', '&#8745;'],
		['&cup;', '&#8746;'],
		['&int;', '&#8747;'],
		['&there4;', '&#8756;'],
		['&sim;', '&#8764;'],
		['&cong;', '&#8773;'],
		['&asymp;', '&#8776;'],
		['&ne;', '&#8800;'],
		['&equiv;', '&#8801;'],
		['&le;', '&#8804;'],
		['&ge;', '&#8805;'],
		['&sub;', '&#8834;'],
		['&sup;', '&#8835;'],
		['&nsub;', '&#8836;'],
		['&sube;', '&#8838;'],
		['&supe;', '&#8839;'],
		['&oplus;', '&#8853;'],
		['&otimes;', '&#8855;'],
		['&perp;', '&#8869;'],
		['&sdot;', '&#8901;'],
		['&lceil;', '&#8968;'],
		['&rceil;', '&#8969;'],
		['&lfloor;', '&#8970;'],
		['&rfloor;', '&#8971;'],
		['&lang;', '&#9001;'],
		['&rang;', '&#9002;'],
		['&loz;', '&#9674;'],
		['&spades;', '&#9824;'],
		['&clubs;', '&#9827;'],
		['&hearts;', '&#9829;'],
		['&diams;', '&#9830;']
	],
	
	ampersandPlaceholder: '##AMPHASH##',
	
	encodingType : 'named',
	
	decode: function (string)
	{
		var codePoint, entity;
		var d = string;
		
		// convert HTML entites back to numbered entites first
		d = this.convertNamedToNumbered(d);
		
		// look for numbered entities &#34;
		var matches = XXX_String_Pattern.getMatches(d, '&#[0-9]{1,5};', '');
		
		var iEnd = XXX_Array.getFirstLevelItemTotal(matches[0]);
		
		if (iEnd)
		{
			for (var i = 0; i < iEnd; ++i)
			{
				entity = matches[0][i];
				codePoint = XXX_String.getPart(entity, 2, -1); // &#XXXX;
				
				// if its a valid number we can decode
				if (codePoint >= -32768 && codePoint <= 65535)
				{
					// decode every single match within string
					d = XXX_String.replace(d, entity, XXX_String.codePointToCharacter(codePoint));
				}
				else
				{
					d = XXX_String.replace(d, entity, ''); //invalid so replace with nada
				}
			}
		}

		return d;
	},
	
	encode: function (string, leaveEncodedEntitiesUntouched)
	{
		// do we allow double encoding? E.g will &amp; be turned into &amp;amp; or left as is
		
		// if allowing double encoding we do ampersands first
		if (!leaveEncodedEntitiesUntouched)
		{
			string = XXX_String.replace(string, '&', (this.encodingType == 'numbered') ? '&#38;' : '&amp;');
		}
		
		string = this.xssEncode(string, false);
		
		if (this.encodingType == 'numbered' || leaveEncodedEntitiesUntouched)
		{
			// Now call function that will convert any HTML entities to numbered codes
			string = this.convertNamedToNumbered(string);
		}

		string = this.numberEncodeNonASCIIAndASCIIControlCharacters(string);

		// if we don't want double encoded entities we ignore the & in existing entities
		if (leaveEncodedEntitiesUntouched)
		{
			// Anything that needs to be encoded has been converted to numbered entities.
			// We can encode any ampersands & that are not part of encoded entities
			
			string = XXX_String.replace(string, '&#', this.ampersandPlaceholder);
			string = XXX_String.replace(string, '&', (this.encodingType == 'numbered') ? '&#38;' : '&amp;');
			string = XXX_String.replace(string, this.ampersandPlaceholder, '&#');
		}
		
		// replace any malformed entities
		string = XXX_String_Pattern.replace(string, '&#\\d*([^\\d;]|$)', '', '$1');

		if (leaveEncodedEntitiesUntouched)
		{
			string = this.correctDoubleEncoding(string);
		}

		// now do we need to convert our numbered encoded string into entities
		if (this.encodingType == 'named')
		{
			string = this.convertNumberedToNamed(string);
		}

		return string;					
	},

	numberEncodeNonASCIIAndASCIIControlCharacters: function (string)
	{
		var result = '';
		
		for (var i = 0, iEnd = XXX_String.getCharacterLength(string); i < iEnd; ++i)
		{
			var character = XXX_String.getCharacterAtIndex(string, i);
			
			// Outside ASCII (or ASCII control characters)
			if (character < XXX_String.codePointToCharacter(32) || character > XXX_String.codePointToCharacter(126))
			{
				character = '&#' + XXX_String.characterToCodePoint(character) + ';';
			}
			
			result += character;
		}
		
		return result;
	},
	
	// Encode the basic 4 characters (' " < >) used to malform HTML in XSS hacks
	xssEncode: function (string, named)
	{
		// ' as &apos; is not cross browser supported, so use the numeric &#39;
		
		if (named)
		{
			string = XXX_String.replace(string, '\'', '&#39;');
			string = XXX_String.replace(string, '\"', '&quot;');
			string = XXX_String.replace(string, '<', '&lt;');
			string = XXX_String.replace(string, '>', '&gt;');
		}
		else
		{
			string = XXX_String.replace(string, '\'', '&#39;');
			string = XXX_String.replace(string, '\"', '&#34;');
			string = XXX_String.replace(string, '<', '&#60;');
			string = XXX_String.replace(string, '>', '&#62;');
		}
		
		return string;
	},
	
	convertNamedToNumbered: function (string)
	{
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.entities); i < iEnd; ++i)
		{
			var entity = this.entities[i];
			
			string = XXX_String.replace(string, entity[0], entity[1]);
		}
		
		return string;
	},
	
	convertNumberedToNamed: function (string)
	{
		for (var i = 0, iEnd = XXX_Array.getFirstLevelItemTotal(this.entities); i < iEnd; ++i)
		{
			var entity = this.entities[i];
			
			string = XXX_String.replace(string, entity[1], entity[0]);
		}
		
		return string;
	},
	
	// Test if a string contains html or numbered encoded entities
	hasEncodedEntities: function (string)
	{
		return XXX_String_Pattern.test(string, '&(?:#[0-9]{1,5}|[A-Z]{2,6});', '');
	},
	
	// Corrects any double encoded &amp; entities e.g &amp;amp;
	correctDoubleEncoding: function (string)
	{
		return XXX_String_Pattern.replace(string, '(&amp;)(amp;)+', '', '$1');
	}
};
