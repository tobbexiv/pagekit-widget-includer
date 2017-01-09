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
            var data = this.$parent.helper.nestedToFlatWidgetInfo(this.widget);

            this.$set('widgetState', this.WIDGET_STATE.LOADING);

            this.$resource('api/widgetincluder/widget/show').query({options: data}).then(function (res) {
                this.$set('content', res.data.content);

                if (res.data.widgetExists === false) {
                    this.$set('widgetState', this.WIDGET_STATE.NOT_EXISTING);
                } else if (res.data.hasAccess === false) {
                    this.$set('widgetState', this.WIDGET_STATE.ACCESS_DENIED);
                } else if (res.data.disabled === true) {
                    this.$set('widgetState', this.WIDGET_STATE.DISABLED);
                } else if (data.renderPlaceholder === true) {
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
                var alertSettings = {
                    type: 'uk-alert-warning',
                    icon: 'uk-icon-warning',
                    content: ''
                };

                switch (this.widgetState) {
                    case this.WIDGET_STATE.ERROR:
                        alertSettings.type = 'uk-alert-danger';
                        alertSettings.content = this.$trans('There was an error loading the widget!');
                        break;

                    case this.WIDGET_STATE.LOADING:
                        alertSettings.type = '';
                        alertSettings.icon = 'uk-icon-spinner';
                        alertSettings.content = this.$trans('Loading widget ...');
                        break;

                    case this.WIDGET_STATE.NOT_EXISTING:
                        alertSettings.type = 'uk-alert-danger';
                        alertSettings.content = this.$trans('Widget does not exist!');
                        break;

                    case this.WIDGET_STATE.ACCESS_DENIED:
                        alertSettings.content = this.$trans('You are not authorized to see this widget!');
                        break;

                    case this.WIDGET_STATE.DISABLED:
                        alertSettings.content = this.$trans('Widget is disabled!');
                        break;

                    case this.WIDGET_STATE.RENDER_PLACEHOLDER:
                        alertSettings.type = 'uk-alert-success';
                        alertSettings.icon = 'uk-icon-puzzle-piece';
                        alertSettings.content = this.$trans('Widget placeholder.');
                        break;

                    default:
                        return this.content;
                };

                alertSettings.content += '<br><span class="uk-icon-justify"></span> ' + this.$trans('Widget id: %widgetId%', { widgetId: this.widget.id });

                if(!!this.widget.data.comment === true) {
                    alertSettings.content += '<br><span class="uk-icon-justify"></span> ' + this.$trans('Widget comment: %comment%', { comment: this.widget.data.comment });
                }

                return '<div class="uk-alert %alert_class%"><span class="%icon_class%"></span> %content%</div>'
                            .replace('%alert_class%', alertSettings.type)
                            .replace('%icon_class%', 'uk-icon-justify ' + alertSettings.icon + (alertSettings.icon === 'uk-icon-spinner' ? ' uk-icon-spin' : ''))
                            .replace('%content%', alertSettings.content);
            }

        }

    };

</script>