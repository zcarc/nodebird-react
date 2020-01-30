// 타입스크립트 or SASS 전용  패키지도 따로 있다.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
    distDir: '.next', // 기본폴더 경로

    webpack(config) { // 웹팩 설정 커스터마이징 config 안에 next의 설정이 들어있다.
        // console.log('### front/next.config... config: ', config, ' ###');
        // console.log('### front/next.config... config.module.rules[0]: ', config.module.rules[0], ' ###');
        const prod = process.env.NODE_ENV === 'production';
        const plugins = [
            ...config.plugins,
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
        ];
        if(prod) {
            // 파일 확장자를 main.js.gz .gz를 붙여주고 파일 용량을 1/3 정도 압축해준다. (배포환경일 때만 동작)
            plugins.push(new CompressionPlugin());
        }
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',
            plugins,
        };
    },
});