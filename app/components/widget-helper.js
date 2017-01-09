/**
 * Editor Widget tools.
 */

module.exports = {

    methods: {

        flatToNestedWidgetInfo: function (flatWidgetInfo) {
            var nestedWidgetInfo = {};

            flatWidgetInfo = this.validateFlatWidgetInfo(flatWidgetInfo);

            if (flatWidgetInfo.id) {
                nestedWidgetInfo.id = flatWidgetInfo.id;
                delete flatWidgetInfo.id;
            }

            if (Object.keys(flatWidgetInfo).length > 0) {
                nestedWidgetInfo.data = flatWidgetInfo;
            }

            return nestedWidgetInfo;
        },

        nestedToFlatWidgetInfo: function (nestedWidgetInfo) {
            var flatWidgetInfo = !!nestedWidgetInfo.data && typeof nestedWidgetInfo.data === 'object' ? nestedWidgetInfo.data : {};
            flatWidgetInfo.id = nestedWidgetInfo.id;

            return this.validateFlatWidgetInfo(flatWidgetInfo);
        },

        validateFlatWidgetInfo: function (flatWidgetInfo) {
            var validFlatWidgetInfo = {};

            if(parseInt(flatWidgetInfo.id) > 0) {
                validFlatWidgetInfo.id = parseInt(flatWidgetInfo.id);
            }

            if(flatWidgetInfo.hideTitle === true) {
                validFlatWidgetInfo.hideTitle = true;
            }

            if(parseInt(flatWidgetInfo.titleSize) > 0 && parseInt(flatWidgetInfo.titleSize) < 10) {
                validFlatWidgetInfo.titleSize = parseInt(flatWidgetInfo.titleSize);
            }

            if(!!flatWidgetInfo.title === true) {
                validFlatWidgetInfo.title = flatWidgetInfo.title;
            }

            if(!!flatWidgetInfo.comment === true) {
                validFlatWidgetInfo.comment = flatWidgetInfo.comment;
            }

            validFlatWidgetInfo.renderPlaceholder = flatWidgetInfo.renderPlaceholder !== false;

            return validFlatWidgetInfo;
        },

        widgetInfoFromPickerSelection: function (pickerSelection) {
            var widgetInfo = {};

            widgetInfo.id = parseInt(pickerSelection.id);

            if(!!pickerSelection.data.comment === true) {
                widgetInfo.comment = pickerSelection.data.comment;
            }

            if(pickerSelection.data.hideTitle === true) {
                widgetInfo.hideTitle = true;
            }

            if(parseInt(pickerSelection.data.titleSize) > 0 && parseInt(pickerSelection.data.titleSize) < 6 && parseInt(pickerSelection.data.titleSize) !== 4) {
                widgetInfo.titleSize = parseInt(pickerSelection.data.titleSize) + '';
            }

            if(!!pickerSelection.data.title === true) {
                widgetInfo.title = pickerSelection.data.title;
            }

            if(pickerSelection.data.renderPlaceholder === false) {
                widgetInfo.renderPlaceholder = false;
            }

            return widgetInfo;
        },

        encodeHTML: function (stringToEncode) {
            // Set the characters to encode.
            var lo_characters = {
                '&':    '&amp;',
                '"':    '&quot;',
                '\'':   '&apos;',
                '<':    '&lt;',
                '>':    '&gt;'
            };

            return stringToEncode.replace(/([\&"'<>])/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
        },

        decodeHTML: function (stringToDecode) {
            // Set the characters to decode.
            var lo_characters = {
                '&amp;':    '&',
                '&quot;':   '"',
                '&apos;':   '\'',
                '&lt;':     '<',
                '&gt;':     '>'
            };

            return stringToDecode.replace(/(&quot;|&apos;|&lt;|&gt;|&amp;)/g, function(is_string, is_symbol) { return lo_characters[is_symbol]; });
        }

    }

};