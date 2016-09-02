<template>

    {{ 'Widget placeholder. Direct preview not yet implemented.' }}

</template>

<script>

    module.exports = {

        props: ['index'],

        computed: {

            widget: function() {
                return this.$parent.widgets[this.index] || {};
            }

        }

    };

</script>