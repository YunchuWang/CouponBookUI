'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssModuleFileTest = /.*\.module.scss$/;
const projectBase = path.resolve(__dirname, '../../..');
const buildDir = path.join(projectBase, 'build/gen/npm/static');

const config = {
    entry: {
        'app': './src/app.tsx',
        'appError': './src/appError.tsx',
    },
    output: {
        path: buildDir,
        filename: 'scripts/[name].js',
    },
    'devServer': {
        'https': true,
        'headers': {
            'Access-Control-Allow-Origin': '*',
        },
        'stats': 'errors-only',
        contentBase: path.join(projectBase, 'build/gen/npm'),
    },
    module: {
        rules: [
            {
                test: cssModuleFileTest,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            modules: true,
                            ident: 'postcss',
                            plugins: [
                                require('postcss-modules')({
                                    generateScopeName: '[local]_[md5:hash:6]',
                                    getJSON: () => undefined,
                                }),
                            ],
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            modules: true,
                            outputStyle: 'nested',
                        },
                    },
                ],
            },
            {
                test: /\.(scss|css)$/,
                exclude: cssModuleFileTest,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.(ico|gif|png|jpg|jpeg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.js$/,
                exclude: [ '/node_modules/', '/src/styles'],
                use: ['babel-loader'],
            },
            {
                test: /\.ts(x?)$/,
                exclude: [ '/node_modules/', '/src/styles'],
                use: ['ts-loader', 'babel-loader'],
            },
        ],
    },
    'plugins': [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],
    'resolve': {
        modules: [
            path.resolve('./src/scripts'),
            path.resolve('./src/styles'),
            path.resolve('./src/images'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '*'],
    },
};

module.exports = {
    ...config,
};
