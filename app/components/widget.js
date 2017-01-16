/**
 * Editor Widget plugin.
 */

module.exports = {

    plugin: true,

    data: function () {
        return {
            helper: this.$parent.$options.utils['widget-helper'].methods
        };
    },

    created: function () {
        var vm = this, editor = this.$parent.editor;

        if (!editor || !editor.htmleditor) {
            return;
        }

        this.widgets = [];

        editor.addButton('widget', {
            title: this.$trans('Widget'),
            label: '<i class="uk-icon-puzzle-piece"></i>'
        });

        editor.options.toolbar.push('widget');

        editor
            .on('action.widget', function (e, editor) {
                vm.openModal(_.find(vm.widgets, function (widget) {
                    return widget.inRange(editor.getCursor());
                }));
            })
            .on('render', function () {
                // No recursion as it is not supported in JS -> nested JSON not possible.
                vm.widgets = editor.replaceInPreview(/\(widget\)(\{.+?\})/gi, vm.replaceInPreview);
            })
            .on('renderLate', function () {
                while (vm.$children.length) {
                    vm.$children[0].$destroy();
                }

                Vue.nextTick(function () {
                    editor.preview.find('widget-preview').each(function () {
                        vm.$compile(this);
                    });
                });
            });

        editor.debouncedRedraw();
    },

    methods: {

        openModal: function (widget) {
            var vm = this, editor = this.$parent.editor, cursor = editor.editor.getCursor();

            if (!widget) {
                widget = {
                    replace: function (value) {
                        editor.editor.replaceRange(value, cursor);
                    }
                };
            }

            new this.$parent.$options.utils['widget-picker']({
                parent: this,
                data: {
                    widget: widget
                }
            }).$mount()
                .$appendTo('body')
                .$on('select', function (widget) {
                    var content, widgetInfo;

                    widgetInfo = vm.helper.widgetInfoFromPickerSelection(widget)

                    content = '(widget)' + JSON.stringify(widgetInfo);

                    widget.replace(content);
                });
        },

        replaceInPreview: function (data, index) {
            var parsed = {};

            try {
                parsed = JSON.parse(data.matches[1]);
            } catch (e) {
                // Parsing fails -> just assume nothing was entered and keep the default values.
            }

            widget = this.helper.flatToNestedWidgetInfo(parsed);

            if(widget.id) {
                data.id = widget.id;
            }

            if(widget.data) {
                data.data = widget.data
            }

            return '<widget-preview index="' + index + '"></widget-preview>';
        }

    },

    components: {
        'widget-preview': require('./widget-preview.vue')
    }

};

window.Editor.components['plugin-widget'] = module.exports;
window.Editor.utils['widget-picker'] = Vue.extend(require('./widget-picker.vue'));
window.Editor.utils['widget-helper'] = require('./widget-helper.js');