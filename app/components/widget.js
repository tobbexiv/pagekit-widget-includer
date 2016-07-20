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
            label: '<i class="uk-icon-gears"></i>' // uk-icon-puzzle-piece or uk-icon-gear or uk-icon-gears or something else?
        });

        editor.options.toolbar.push('widget');

        editor
            .on('action.widget', function (e, editor) {
                vm.openModal(_.find(vm.widgets, function (widget) {
                    return widget.inRange(editor.getCursor());
                }));
            })
            .on('render', function () {
                vm.widgets = editor.replaceInPreview(/\(widget\)\{(.+?)}/gi, vm.replaceInPreview);
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
                    var options;
                    
                    options = '"id":"' + widget.id + '"';
                    
                    if(widget.data.hideTitle == 1) {
                        options += ', "hideTitle":"1"';
                    }
                    
                    if(widget.data.titleSize != 4) {
                        options += ', "titleSize":"' + widget.data.titleSize + '"';
                    }
                    
                    if(widget.data.title) {
                        options += ', "title":"' + widget.data.title + '"';
                    }

                    content = '(widget){' + options + '}';

                    widget.replace(content);
                });
        },

        replaceInPreview: function (data, index) {
        	console.log(data);
            var id        = /"id":[\s]*"([1-9]?[0-9]*)"/gi.exec(data.matches[0]),
                hideTitle = /"hideTitle":[\s]*"([01])"/gi.exec(data.matches[0]),
                titleSize = /"titleSize":[\s]*"([1-9]?[0-9]*)"/gi.exec(data.matches[0]),
                title     = /"title":[\s]*"([^"]*)"/gi.exec(data.matches[0]);
            
            if(!!id === true) {
                data.id = id[1];
            }
            
            data.data = {};
            
            if(!!hideTitle === true) {
                data.data.hideTitle = hideTitle[1];
            }
            
            if(!!titleSize === true) {
                data.data.titleSize = titleSize[1];
            }
            
            if(!!title === true) {
                data.data.title = title[1];
            }
            
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