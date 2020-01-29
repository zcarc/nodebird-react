// 타입스크립트 or SASS 전용  패키지도 따로 있다.
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

// analyze를 both로 설정하면 프론트와 서버 둘다 분석해준다.
module.exports = withBundleAnalyzer({
    distDir: '.next', // 기본폴더 경로
    analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        }
    },
    webpack(config) { // 웹팩 설정 커스터마이징 config 안에 next의 설정이 들어있다.
        console.log('### front/next.config... config: ', config, ' ###');
        console.log('### front/next.config... config.module.rules[0]: ', config.module.rules[0], ' ###');
        const prod = process.env.NODE_ENV === 'production';
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',
        };
    },
});