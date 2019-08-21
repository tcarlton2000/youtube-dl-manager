module.exports = {
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
                loader:'style-loader!css-loader'
            },
            {
                test: /\.s[a|c]ss$/,
                loader:'sass-loader!style-loader!css-loader'
            },
            {
                test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
                loader:'url-loader?limit=100000'
            }
        ]
    },
    output: {
        path: __dirname + '/app/static',
        filename: 'bundle.js'
    }
};