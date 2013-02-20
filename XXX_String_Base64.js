var XXX_String_Base64 =
{	
	base64Characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	encode: function (input)
	{
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = XXX_String_Unicode.encodeURIValue(input);
 
		while (i < input.length)
		{
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2))
			{
				enc3 = enc4 = 64;
			}
			else if (isNaN(chr3))
			{
				enc4 = 64;
			}
 
			output = output +
			this.base64Characters.charAt(enc1) +
			this.base64Characters.charAt(enc2) +
			this.base64Characters.charAt(enc3) +
			this.base64Characters.charAt(enc4);
 
		}
 
		return output;
	},
 
	decode: function (input)
	{
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length)
		{
 
			enc1 = this.base64Characters.indexOf(input.charAt(i++));
			enc2 = this.base64Characters.indexOf(input.charAt(i++));
			enc3 = this.base64Characters.indexOf(input.charAt(i++));
			enc4 = this.base64Characters.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64)
			{
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64)
			{
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = XXX_String_Unicode.decodeURIValue(output);
 
		return output; 
	}
};