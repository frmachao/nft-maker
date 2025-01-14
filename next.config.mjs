/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push("pino-pretty");
        return config;
      },
      api: {
        bodyParser: {
          sizeLimit: '1mb'
        }
    }
};

export default nextConfig;
