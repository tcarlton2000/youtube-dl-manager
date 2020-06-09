module.exports = env => {
    return {
        entry: [
            './app/client/index.js'
        ],
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader']
                },
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                },
                {
                    test: /\.s[a|c]ss$/,
                    loader: 'sass-loader!style-loader!css-loader'
                },
                {
                    test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
                    loader: 'url-loader?limit=100000'
                },
                {
                    test: /\.less$/,
                    use: [{
                        loader: 'style-loader',
                    }, {
                        loader: 'css-loader', // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            lessOptions: { // If you are using less-loader@5 please spread the lessOptions to options directly
                                modifyVars: {
                                    'primary-color': `${env.TEMPLATE_COLOR}`
                                },
                                javascriptEnabled: true
                            }
                        }
                    }]
                }
            ]
        },
        output: {
            path: __dirname + '/app/static',
            filename: 'bundle.js'
        }
    };
};