<template>

    <div v-html="calculatedContent"></div>

</template>

<script>

    module.exports = {

        data: function () {
            const WIDGET_STATE = {
                INITIAL: 0,
                LOADING: 10,
                LOADED: 11,
                RENDER_PLACEHOLDER: 12,
                ERROR: 20,
                NOT_EXISTING: 21,
                ACCESS_DENIED: 22,
                DISABLED: 23
            };

            return {
                WIDGET_STATE: WIDGET_STATE,
                widgetState: WIDGET_STATE.INITIAL,
                content: ''
            };
        },

        props: ['index'],

        created: function () {
            var data = this.widget.data;
            data.id = this.widget.id;

            this.$set('widgetState', this.WIDGET_STATE.LOADING);

            this.$resource('api/widgetincluder/widget/show').query({options: data}).then(function (res) {
                this.$set('content', res.data.content);

                if (res.data.widgetExists === false) {
                    this.$set('widgetState', this.WIDGET_STATE.NOT_EXISTING);
                } else if (res.data.hasAccess === false) {
                    this.$set('widgetState', this.WIDGET_STATE.ACCESS_DENIED);
                } else if (res.data.disabled === true) {
                    this.$set('widgetState', this.WIDGET_STATE.DISABLED);
                } else if (this.widget.data.renderPlaceholder === true) {
                    this.$set('widgetState', this.WIDGET_STATE.RENDER_PLACEHOLDER);
                } else {
                    this.$set('widgetState', this.WIDGET_STATE.LOADED);
                }
            }, function (res) {
                this.$set('content', '');

                this.$set('widgetState', this.WIDGET_STATE.ERROR);
            });
        },

        computed: {

            widget: function() {
                return this.$parent.widgets[this.index] || {};
            },

            calculatedContent: function() {
                var alert = {
                    type: 'uk-alert-warning',
                    icon: 'uk-icon-warning',
                    content: ''
                };

                switch (this.widgetState) {
                    case this.WIDGET_STATE.ERROR:
                        alert.type = 'uk-alert-danger';
                        alert.content = this.$trans('There was an error loading the widget with id %widgetId%!', { widgetId: this.widget.id });
                        break;

                    case this.WIDGET_STATE.LOADING:
                        alert.type = '';
                        alert.icon = 'uk-icon-spinner';
                        alert.content = this.$trans('Loading widget ...');
                        break;

                    case this.WIDGET_STATE.NOT_EXISTING:
                        alert.type = 'uk-alert-danger';
                        alert.content = this.$trans('Widget with id %widgetId% does not exist!', { widgetId: this.widget.id });
                        break;

                    case this.WIDGET_STATE.ACCESS_DENIED:
                        alert.content = this.$trans('You are not authorized to see widget with id %widgetId%!', { widgetId: this.widget.id });
                        break;

                    case this.WIDGET_STATE.DISABLED:
                        alert.content = this.$trans('Widget with id %widgetId% is disabled!', { widgetId: this.widget.id });
                        break;

                    case this.WIDGET_STATE.RENDER_PLACEHOLDER:
                        alert.type = 'uk-alert-success';
                        alert.icon = 'uk-icon-puzzle-piece';
                        alert.content = this.$trans('Placeholder for widget with id ' + this.widget.id + '.', { widgetId: this.widget.id });
                        break;

                    default:
                        return this.content;
                };

                return '<div class="uk-alert %alert_class%"><span class="%icon_class%"></span> %content%</div>'
                            .replace('%alert_class%', alert.type)
                            .replace('%icon_class%', alert.icon + (alert.icon === 'uk-icon-spinner' ? ' uk-icon-spin' : ''))
                            .replace('%content%', alert.content);
            }

        }

    };

</script>