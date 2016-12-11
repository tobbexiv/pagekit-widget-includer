<template>

    <div>
        <v-modal v-ref:modal :closed="close">
            <form class="uk-form uk-form-stacked" @submit.prevent="update">

                <div class="uk-modal-header">
                    <h2>{{ 'Add Widget' | trans }}</h2>
                </div>
                
                <div class="uk-form-row">
                    <label for="form-widget-id" class="uk-form-label">{{ 'Id' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-widget-id" class="uk-width-1-1" v-model="widget.id">
                            <option v-for="w in widgets" :value="w.id" v-bind:class="{ 'uk-text-muted': w.disabled }">{{ w.title }}</option>
                        </select>
                        <p v-show="isDeactivated" class="uk-form-help-block">
                            {{ 'This widget is disabled. No one will be able to see it.' | trans }}
                        </p>
                    </div>
                </div>

                <div class="uk-form-row">
                    <label for="form-widget-renderPlaceholder" class="uk-form-label">{{ 'Render placeholder instead of content in preview' | trans }}</label>
                    <div class="uk-form-controls">
                        <input type="checkbox" id="form-widget-renderPlaceholder" v-model="widget.data.renderPlaceholder">
                    </div>
                </div>

                <div class="uk-form-row">
                    <label for="form-widget-hideTitle" class="uk-form-label">{{ 'Hide Title' | trans }}</label>
                    <div class="uk-form-controls">
                        <input type="checkbox" id="form-widget-hideTitle" v-model="widget.data.hideTitle">
                    </div>
                </div>

                <div class="uk-form-row" v-show="!widget.data.hideTitle">
                    <label for="form-widget-titleSize" class="uk-form-label">{{ 'Title Size' | trans }}</label>
                    <div class="uk-form-controls">
                        <select id="form-widget-titleSize" class="uk-width-1-1" v-model="widget.data.titleSize">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                </div>
                
                <div class="uk-form-row" v-show="!widget.data.hideTitle">
                    <label for="form-widget-title" class="uk-form-label">{{ 'Title' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-widget-title" class="uk-width-1-1" v-model="widget.data.title"></input>
                    </div>
                </div>

                <div class="uk-modal-footer uk-text-right">
                    <button class="uk-button uk-button-link uk-modal-close" type="button">{{ 'Cancel' | trans }}</button>
                    <button class="uk-button uk-button-link" type="submit">{{ 'Update' | trans }}</button>
                </div>

            </form>
        </v-modal>
    </div>

</template>

<script>

    module.exports = {

        data: function () {
            return {
                widgets: [],
                widget: { id: -1, data: { hideTitle: false, titleSize: "4", title: '', renderPlaceholder: true } }
            }
        },

        created: function () {
            this.$resource('api/widgetincluder/widget').get().then(function (result) {
                this.widgets = result.data;

                if (result.data.length && this.widget.id < 0) {
                    this.widget.id = result.data[0].id;
                }
            });
        },

        ready: function () {
            this.$refs.modal.open();
        },
        
        computed: {

            isDeactivated: function () {
                return this.widgets.find(function(elem) { return this.widget.id == elem.id }, this).disabled;
            }

        },

        methods: {

            close: function() {
                this.$destroy(true);
            },

            update: function () {
                this.$refs.modal.close();
                this.$emit('select', this.widget);
            }

        }

    };

</script>