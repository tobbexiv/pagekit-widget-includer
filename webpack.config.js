module.exports = [

    {
        entry: {
            "editor-widget": "./app/components/widget.js"
        },
        output: {
            filename: "./app/bundle/[name].js",
            library: "Editor"
        },
        module: {
            loaders: [
                { test: /\.vue$/, loader: "vue" }
            ]
        }
    }

];