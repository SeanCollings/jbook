import * as esbuild from 'esbuild-wasm';

export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // Handle root entry filer of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => ({
        path: 'index.js',
        namespace: 'a',
      }));

      // Handle relative paths in a module ('./' or '../')
      build.onResolve({ filter: /^\.+\// }, (args: any) => ({
        namespace: 'a',
        path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/')
          .href,
      }));

      // Handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });
    },
  };
};
