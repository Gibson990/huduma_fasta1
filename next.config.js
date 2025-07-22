/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client to prevent this error on Webpack 5
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        dns: false,
        child_process: false,
        cluster: false,
        module: false,
        worker_threads: false,
        perf_hooks: false,
        readline: false,
        repl: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        util: false,
        v8: false,
        vm: false,
        wasi: false,
      }
    }
    return config
  },
  serverExternalPackages: ['pg', 'pg-connection-string']
}

module.exports = nextConfig 