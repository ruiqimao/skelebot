class Util {

	/*
	 * Wrap in code blocks.
	 *
	 * @param language The language to wrap the content in. Optional.
	 * @param text The text to put in the code block.
	 *
	 * @return The wrapped text.
	 */
	static wrap(language, text) {
		// Check if language is missing.
		if (arguments.length == 1) {
			text = language || '';
			language = '';
		}

		// "Escape" backticks.
		text = String(text);
		text = text.replace(/`/g, String.fromCharCode(8203) + '`');

		// Return the wrapped text.
		return '```' + language + '\n' + text + '\n```';
	}

}

module.exports = Util;
