interface ApiConfig {
  API_URL: string;
}

interface Config {
  api: ApiConfig;
}

const config: Config = {
  api: {
    API_URL: "https://building-management-dczk.onrender.com/api",
  },
};
export const configImage: Config = {
  api: {
    API_URL: "https://building-management-dczk.onrender.com/uploads",
  },
};

export default config;
