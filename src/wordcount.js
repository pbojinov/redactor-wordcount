'use strict';

if (!window.RedactorPlugins) {
    var RedactorPlugins = {};
}

(function($) {

    RedactorPlugins.counter = function() {
        function wordCount(html) {
            var words = 0,
                characters = 0,
                spaces = 0;

            var text = html.replace(/<\/(.*?)>/gi, ' ');
            text = text.replace(/<(.*?)>/gi, '');
            text = text.replace(/\t/gi, '');
            text = text.replace(/\n/gi, '');
            text = text.replace(/\r/gi, '');
            text = $.trim(text);

            if (text !== '') {
                var arrWords = text.split(/\s+/);
                var arrSpaces = text.match(/\s/g);
                if (arrWords) {
                    words = arrWords.length;
                }
                if (arrSpaces) {
                    spaces = arrSpaces.length;
                }
                characters = text.length;
            }
            return {
                words: words,
                characters: characters,
                spaces: spaces
            };
        }
        return {
            init: function(e) {

                /** 
                 * petar@tapptv.com - 2/13/15
                 *
                 * Redactor API docs dont mention how to do add word count anywhere but their modal (popup alert).
                 * We had to hack it and get the parent container on load through `this.$editor.parent()`
                 * Then append a simple div and update it with the word count
                 */

                if (!this.opts.counterCallback) {
                    return;
                }

                // get parent redactor box and append word count box
                var $parentRedactorBox = this.$editor.parent();
                var $wordCountNode = $('<div class="re-wordcount-container">word count: 0</div>');
                $parentRedactorBox.append($wordCountNode);

                // select the container for later use
                var $wordCount = $('.re-wordcount-container');

                // get the word count when it loads
                var html = this.code.get();
                var wc = wordCount(html);
                $wordCount.text('word count: ' + wc.words);

                // Update word count when the user types
                this.$editor.on('keyup.redactor-limiter', $.proxy(function(e) {

                    var html = this.code.get();
                    var wc = wordCount(html);

                    this.core.setCallback('counter', {
                        words: wc.words,
                        characters: wc.characters,
                        spaces: wc.spaces
                    });

                    // update the word count container that we appended on load
                    $wordCount.text('word count: ' + wc.words);

                }, this));
            },
        };
    };
})(jQuery);
