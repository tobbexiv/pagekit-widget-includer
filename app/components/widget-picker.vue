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
                        <input id="form-widget-id" class="uk-width-1-1" type="text" v-model="widget.id">
                    </div>
                </div>

                <div class="uk-form-row">
                    <label for="form-widget-hideTitle" class="uk-form-label">{{ 'Hide Title' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-widget-hideTitle" class="uk-width-1-1" type="text" v-model="widget.data.hideTitle">
                    </div>
                </div>

                <div class="uk-form-row">
                    <label for="form-widget-titleSize" class="uk-form-label">{{ 'Title Size' | trans }}</label>
                    <div class="uk-form-controls">
                        <input id="form-widget-titleSize" class="uk-width-1-1" v-model="widget.data.titleSize"></input>
                    </div>
                </div>
                
                <div class="uk-form-row">
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
                widget: { id: -1, data: { hideTitle: false, titleSize: 4, title: '' } }
            }
        },

        ready: function () {
            this.$refs.modal.open();
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