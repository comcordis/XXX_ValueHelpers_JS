/*

Bitwise operations:
& = Mask out (Filter out only specific bits that are in both values)
| = Merge
>> = Shift to the right (Meaning the number gets lower)
<< = Shift to the left (Meaning the number gets higher)

Example: Shift the entire code point bit sequence 24 steps to the right, mask out the last six code point bits and merge them with binary 10XXXXXX
((codePoint >> 24) & 63) | 128

*/

var XXX_String_Unicode =
{
	encodingCharacters: false,
	
	initialize: function ()
	{
		// Prepare all encoding characters
		this.encodingCharacters = {};
		
		this.encodingCharacters.alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		this.encodingCharacters.digit = '0123456789';
		this.encodingCharacters.unreserved = this.encodingCharacters.alpha + this.encodingCharacters.digit + '-._~';
				
		this.encodingCharacters.generalDelimiters = ':/?#[]@';
		this.encodingCharacters.subDelimiterss = "!$&'()*+,;=";
		this.encodingCharacters.reserved = this.encodingCharacters.generalDelimiterss + this.encodingCharacters.subDelimiters;
		
		this.encodingCharacters.allowed = this.encodingCharacters.unreserved + this.encodingCharacters.reserved;
	},
	
	// 10XXXXXX
	isTrailingByte: function (decimal)
	{
		if (decimal > 127 && decimal < 192)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
		
	encodeURIValue: function (data)
	{			
		data = XXX_Type.makeString(data);
		
		// Initiate a buffer for the encoded string
		var encoded = '';
		
		// Get the length of the data
		var dataLength = data.length;
		
		var i;
		
		var character;
		
		var codePoint;
		
		for (i = 0; i < dataLength; ++i)
		{
			// Get the literal character at the given position
			character = data.charAt(i);
			
			// Check if the character is an unreserved character, if so it doesn't need encoding
			if (this.encodingCharacters.unreserved.indexOf(character) != -1)
			{
				encoded += character;
			}
			// The character is not within the unreserved characters, therefor it needs encoding
			else
			{
				// Get the code point of the character at that position
				codePoint = data.charCodeAt(i);
				
				if (codePoint < 128)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal(codePoint);
				}
				else if (codePoint < 2048)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint >> 6) | 192);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}
				else if (codePoint < 65536)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint >> 12) | 224);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}
				else if (codePoint < 2097152)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint >> 18) | 240);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 12) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}
				else if (codePoint < 67108864)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint >> 24) | 248);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 18) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 12) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}
				else if (codePoint < 2147483648)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint >> 30) | 252);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 24) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 18) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 12) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}				
				else if (codePoint < 68719476736)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal(254);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 30) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 24) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 18) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 12) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}				
				else if (codePoint < 4398046511104)
				{
					encoded += XXX_String.codePointToEncodedHexaDecimal(255);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 36) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 30) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 24) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 18) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 12) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal(((codePoint >> 6) & 63) | 128);
					encoded += XXX_String.codePointToEncodedHexaDecimal((codePoint & 63) | 128);
				}
			}
		}
		
		return encoded;
	},
	
	decodeURIValue: function (data)
	{
		data = XXX_Type.makeString(data);
		
		var decoded = '';		
		var notAllowed = ''; // Initiate a buffer for the non allowed characters (raw, so doesn't decode them)		
		var illegalEncoding = ''; // Initiatie a buffer for the illegal encoded hashes
		
		var i = 0;
		var dataLength = data.length; // Get the length of the data
		
		var character = '';
		
		// Initiate byte variables
		var byte1, byte2, byte3, byte4, byte5, byte6, byte7, byte8 = 0;
		
		while (i < dataLength)
		{
			// Get the literal character at the given position
			character = data.charAt(i);
								
			// Detect encoded character
			if (character == '%')
			{
				// Get the %XX
				var firstHexaDecimalEncoded = data.substr(i, 3);
				
				// Check for valid hexaDecimal percent encoding, value must be in range 0 - 255 (otherwise letters higher than F are used...)
				if (XXX_String.encodedHexaDecimalToCodePoint(firstHexaDecimalEncoded) < 256)
				{
					// Read out all code point parts (%XX) - 3 characters per code point
					byte1 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i, 3));
					byte2 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 3, 3));
					byte3 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 6, 3));
					byte4 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 9, 3));
					byte5 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 12, 3));
					byte6 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 15, 3));
					byte7 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 18, 3));
					byte8 = XXX_String.encodedHexaDecimalToCodePoint(data.substr(i + 21, 3));
					
					if (byte1 < 128)
					{
						decoded += String.fromCharCode(byte1);
						
						i += 3;
					}
					else if (byte1 > 127 && byte1 < 192)
					{
						illegalEncoding +=  firstHexaDecimalEncoded + ' ';					
						decoded += firstHexaDecimalEncoded;
						
						i += 3;
					}
					else if (byte1 > 191 && byte1 < 224)
					{
						if (this.isTrailingByte(byte2))
						{
							decoded += String.fromCharCode(((byte1 & 31) << 6) | (byte2 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 6) + ' ';
							decoded += data.substr(i, 6);
						}
						
						i += 6;
					}
					else if (byte1 > 223 && byte1 < 240)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3))
						{
							decoded += String.fromCharCode(((byte1 & 15) << 12) | ((byte2 & 63) << 6) | (byte3 &63));
						}
						else
						{
							illegalEncoding += data.substr(i, 9) + ' ';
							decoded += data.substr(i, 9);
						}
						
						i += 9;
					}
					else if (byte1 > 239 && byte1 < 248)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3) && this.isTrailingByte(byte4))
						{
							decoded += String.fromCharCode(((byte1 & 7) << 18) | ((byte2 & 63) << 12) | ((byte3 & 63) << 6) | (byte4 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 12) + ' ';							
							decoded += data.substr(i, 12);
						}
						
						i += 12;
					}
					else if (byte1 > 247 && byte1 < 252)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3) && this.isTrailingByte(byte4) && this.isTrailingByte(byte5))
						{
							decoded += String.fromCharCode(((byte1 & 3) << 24) | ((byte2 & 63) << 18) | ((byte3 & 63) << 12) | ((byte4 & 63) << 6) | (byte5 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 15) + ' ';
							decoded += data.substr(i, 15);
						}
						
						i += 15;
					}
					else if (byte1 > 251 && byte1 < 254)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3) && this.isTrailingByte(byte4) && this.isTrailingByte(byte5) && this.isTrailingByte(byte6))
						{
							decoded += String.fromCharCode(((byte1 & 1) << 30) | ((byte2 & 63) << 24) | ((byte3 & 63) << 18) | ((byte4 & 63) << 12) | ((byte5 & 63) << 6) | (byte6 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 18) + ' ';
							decoded += data.substr(i, 18);
						}
						
						i += 18;
					}
					else if (byte1 == 254)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3) && this.isTrailingByte(byte4) && this.isTrailingByte(byte5) && this.isTrailingByte(byte6) && this.isTrailingByte(byte7))
						{
							decoded += String.fromCharCode((byte1 << 36) | ((byte2 & 63) << 30) | ((byte3 & 63) << 24) | ((byte4 & 63) << 18) | ((byte5 & 63) << 12) | ((byte6 & 63) << 6) | (byte7 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 21) + ' ';
							decoded += data.substr(i, 21);
						}
						
						i += 21;
					}
					else if (byte1 == 255)
					{
						if (this.isTrailingByte(byte2) && this.isTrailingByte(byte3) && this.isTrailingByte(byte4) && this.isTrailingByte(byte5) && this.isTrailingByte(byte6) && this.isTrailingByte(byte7) && this.isTrailingByte(byte8))
						{
							decoded += String.fromCharCode((byte1 << 42) | (byte2 << 36) | ((byte3 & 63) << 30) | ((byte4 & 63) << 24) | ((byte5 & 63) << 18) | ((byte6 & 63) << 12) | ((byte7 & 63) << 6) | (byte8 & 63));
						}
						else
						{
							illegalEncoding += data.substr(i, 24) + ' ';
							decoded += data.substr(i, 24);
						}
						
						
						i += 24;
					}
				}
				// Illegal encoding
				else
				{
					illegalEncoding += firstHexaDecimalEncoded + ' ';
					decoded += firstHexaDecimalEncoded;
											
					i += 3;
				}
			}
			// Unencoded character
			else
			{
				// Unallowed character
				if (this.encodingCharacters.allowed.indexOf(character) != -1)
				{
					notAllowed += character + ' ';
					decoded += character;
				}
				// Allowed character
				else
				{						
					decoded += character;
				}
				
				i++;
			}
		}
		
		return decoded;
	}
};
