export const clientConfig = {
	s3Proxy: `${import.meta.env.VITE_S3_PROXY || '/api/s3'
		}`,
	app: {
		host: `${import.meta.env.VITE_HOST || ''}`,
		name: `${import.meta.env.VITE_APP_NAME || 'hiring-portal'}`,
	},
	recaptcha: {
		key: `${import.meta.env.VITE_RECAPTCHA_KEY || ''}`,
	},
	graphql: {
		uri: `${import.meta.env.VITE_GRAPHQL_API_URL ||
			'/api/graphql'
			}`,
		wsUri: `${import.meta.env.VITE_GRAPHQL_WS_URL ||
			'/api/graphql-subscription'
			}`,
	},
};
