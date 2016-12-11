/**
 * Editor Widget plugin.
 */

module.exports = {

    plugin: true,

    created: function () {
        var vm = this, editor = this.$parent.editor;

        if (!editor || !editor.htmleditor) {
            return;
        }

        this.widgets = [];

        editor.addButton('widget', {
            title: 'Widget',
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
            var editor = this.$parent.editor, cursor = editor.editor.getCursor();

            if (!widget) {
                widget = {
                    replace: function (value) {
                        editor.editor.replaceRange(value, cursor);
                    }
                };
            }

            new this.$options.utils['widget-picker']({
                parent: this,
                data: {
                    widget: widget
                }
            }).$mount()
                .$appendTo('body')
                .$on('select', function (widget) {
                    var content;
                    var options = {};

                    options.id = parseInt(widget.id);

                    if(!!widget.data.comment === true) {
                        options.comment = widget.data.comment;
                    }

                    if(widget.data.hideTitle === true) {
                        options.hideTitle = true;
                    }

                    if(parseInt(widget.data.titleSize) > 0 && parseInt(widget.data.titleSize) < 6 && parseInt(widget.data.titleSize) !== 4) {
                        options.titleSize = parseInt(widget.data.titleSize) + '';
                    }

                    if(!!widget.data.title === true) {
                        options.title = widget.data.title;
                    }

                    if(widget.data.renderPlaceholder === false) {
                        options.renderPlaceholder = false;
                    }

                    content = '(widget)' + JSON.stringify(options);

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

            if(parseInt(parsed.id) > 0) {
                data.id = parseInt(parsed.id);
            }

            data.data = {};

            if(parsed.hideTitle === true) {
                data.data.hideTitle = true;
            }

            if(parseInt(parsed.titleSize) > 0 && parseInt(parsed.titleSize) < 10) {
                data.data.titleSize = parseInt(parsed.titleSize);
            }

            if(!!parsed.title === true) {
                data.data.title = parsed.title;
            }

            if(!!parsed.comment === true) {
                data.data.comment = parsed.comment;
            }

            data.data.renderPlaceholder = parsed.renderPlaceholder !== false;

            return '<widget-preview index="' + index + '"></widget-preview>';
        }

    },

    components: {
        'widget-preview': require('./widget-preview.vue')
    },

    utils: {
        'widget-picker': Vue.extend(require('./widget-picker.vue'))
    }

};

window.Editor.components['plugin-widget'] = module.exports;