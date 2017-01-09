module.exports = [

    {
        entry: {
            "editor-widget": "./app/components/widget.js",
            "editor-widget-tinymce": "./app/components/widget-tinymce.js"
        },
        output: {
            filename: "./app/bundle/[name].js",
        },
        module: {
            loaders: [
                { test: /\.vue$/, loader: "vue" }
            ]
        }
    }

];