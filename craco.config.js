const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // 分析模板依赖大小用的，我这边只配置了在开发时打开服务器
const CompressionWebpackPlugin = require('compression-webpack-plugin'); // 打包时压缩代码成gz，如果服务器开启了gzip可以大大压缩大小
// const CracoLessPlugin = require('craco-less') // 配合按需加载antd 和 修改主题使用
const WebpackBar = require('webpackbar'); // 显示打包进度条用的
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); // 缓存用的，第二次打包和构建会极大提升速率

const resolve = (dir) => path.resolve(__dirname, dir);
const env = process.env.REACT_APP_ENV;

const getAnalyzerConfig = (env) => {
  if (env === 'production') {
    return {
      analyzerMode: 'disabled'
    };
  }
};

module.exports = ({ env: webpackEnv }) => {
  return {
    webpack: {
      plugins: [
        new BundleAnalyzerPlugin(
          Object.assign(
            {},
            {
              analyzerPort: 'auto',
              openAnalyzer: webpackEnv !== 'production',
              generateStatsFile: false,
              defaultSizes: 'gzip',
              analyzerMode: 'server'
            },
            getAnalyzerConfig(webpackEnv)
          )
        ),
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
          threshold: 1024,
          minRatio: 0.8
        }),
        new WebpackBar({
          name: webpackEnv !== 'production' ? '正在启动' : '正在打包',
          color: '#fa8c16'
        }),
        new HardSourceWebpackPlugin()
      ],
      alias: {
        '@': resolve('src')
      },
      // configure这里可以拿到create-react-app的所有webpack配置，某些在外面修改不了的配置，可以在这配置
      configure: (webpackConfig, { env: webpackEnv, paths }) => {
        // console.log(env, paths)
        paths.appBuild = path.join(path.dirname(paths.appBuild), 'build');
        webpackConfig.output = {
          ...webpackConfig.output,
          ...{
            path: paths.appBuild
          }
        };
        webpackConfig.devtool =
          webpackEnv !== 'production' ? 'eval-source-map' : 'none';
        return webpackConfig;
      }
    },
    // 下面是antd 的按需加载用的，不用每次导入css文件
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              chrome: '49',
              ios: '10'
            }
          }
        ]
      ],
      plugins: []
    },
    plugins: [],
    style: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')]
      }
    },
    //配置代理解决跨域
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    }
  };
};
