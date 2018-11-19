const path = require('path');

const createSrcPath = (pathname) => path.resolve(__dirname, 'react', pathname);
//notification: './react/notification.js'
module.exports = {
    entry: {
        waitlist: './react/waitlist.js',
        skillsManagment: './react/skillsManagment.js',
        FcWaitlist: './react/fcWaitlist.js',
    },
    output: {    
        path: path.resolve(__dirname, 'compiled-react'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            components: createSrcPath('components')
        }
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                }
            }
        ]
    }
};