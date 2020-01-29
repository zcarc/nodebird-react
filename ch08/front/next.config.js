module.exports = {
    distDir: '.next', // 기본폴더 경로
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
};