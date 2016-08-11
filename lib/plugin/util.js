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
		if (text === undefined) {
			text = language;
			language = '';
		}

		// Return the wrapped text.
		return '```' + language + '\n' + text + '\n```';
	}

}

module.exports = Util;
