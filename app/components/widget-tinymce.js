/**
 * Editor Widget plugin for tinyMCE.
 */

module.exports = {

    plugin: true,

    data: function () {
        return {
            helper: this.$parent.$options.utils['widget-helper'].methods
        };
    },

    created: function () {
        var vm = this;

        if (typeof tinyMCE ==='undefined') {
            return;
        }

        this.$parent.editor.plugins.push('-tobbeWidgetPicker');
        tinyMCE.PluginManager.add('tobbeWidgetPicker', function (editor) {
            editor.on('beforeSetContent', function(ed) {
                ed.content = vm.pagekitPluginCodeToHtml(ed.content);
            });

            editor.on('postProcess', function(ed) {
                if(ed.set) {
                    ed.content = vm.pagekitPluginCodeToHtml(ed.content);
                }

                if(ed.get) {
                    ed.content = vm.htmlToPagekitPluginCode(ed.content);
                }
            });

            var showDialog = function () {
                var element = editor.selection.getNode(), widget = {}, parsed = {};

                if (element.nodeName === 'DIV' && !!element.attributes['data-tobbe-widget'].value) {
                    editor.selection.select(element);

                    try {
                        parsed = JSON.parse(vm.helper.decodeHTML(element.attributes['data-tobbe-widget'].value));
                    } catch (e) {
                        // Parsing fails -> just assume nothing was entered and keep the default values.
                    }
                }

                widget = vm.helper.flatToNestedWidgetInfo(parsed);

                new vm.$parent.$options.utils['widget-picker']({
                    parent: vm,
                    data: {
                        widget: widget
                    }
                }).$mount()
                    .$appendTo('body')
                    .$on('select', function (widget) {
                        var widgetInfo = vm.helper.widgetInfoFromPickerSelection(widget);

                        editor.selection.setContent(
                            vm.getWidgetText(widgetInfo)
                        );

                        editor.fire('change');
                    });
            };

            editor.addButton('widgetPicker', {
                tooltip: vm.$trans('Insert/edit widget'),
                icon: 'none uk-icon-puzzle-piece" style="font-family: FontAwesome;', // We need to specify FontAwesome explicitly as tinymce overwrites the font family.
                onclick: showDialog
            });

            editor.addContextToolbar(function (element) {
                return element && element.nodeName === 'DIV' && !!element.attributes['data-tobbe-widget'].value;
            }, 'widgetPicker');

            editor.addMenuItem('widgetPicker', {
                text: vm.$trans('Insert/edit widget'),
                icon: 'none uk-icon-puzzle-piece" style="font-family: FontAwesome;', // We need to specify FontAwesome explicitly as tinymce overwrites the font family.
                context: 'insert',
                onclick: showDialog
            });
        });
    },

    methods: {
        pagekitPluginCodeToHtml: function(content) {
            var vm = this;

            return content.replace(/(\(widget\)(\{.+?\}))/gi, function(match, widgetString, widgetJSON) {
                var widgetParsed = {};

                try {
                    widgetParsed = JSON.parse(widgetJSON);
                } catch (e) {
                    // Parsing fails -> just assume nothing was entered and keep the default.
                    return widgetString;
                }

                return vm.getWidgetText(widgetParsed);
            });
        },

        htmlToPagekitPluginCode: function(content) {
            var vm = this;
            
            return content.replace(/<div .*?data-tobbe-widget="(\{.+?\})".*?>.+?<\/div>/gi, function (match, widgetJSON) { return '(widget)' + vm.helper.decodeHTML(widgetJSON); });
        },

        getWidgetText: function (widgetInfo) {
            var infoText = '<span class="uk-icon-puzzle-piece">&nbsp;</span>' + this.$trans('Widget placeholder.')
                    + '<br><span class="uk-icon-justify">&nbsp;</span> ' + this.$trans('Widget id: %widgetId%', { widgetId: widgetInfo.id });

            if (widgetInfo.comment) {
                infoText += '<br><span class="uk-icon-justify">&nbsp;</span> ' + this.$trans('Widget comment: %comment%', { comment: this.helper.encodeHTML(widgetInfo.comment) })
            }

            return '<div class="uk-alert uk-alert-success" data-tobbe-widget="%widgetString%" contenteditable="false">%infoText%</div>'
                .replace('%widgetString%', this.helper.encodeHTML(JSON.stringify(widgetInfo)))
                .replace('%infoText%', infoText);
        }
    }

};

window.Editor.components['plugin-widget'] = module.exports;