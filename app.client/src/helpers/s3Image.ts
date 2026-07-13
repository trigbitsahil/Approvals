const processS3Path = (imageUrl: string, s3Proxy: string, folder?: string) => {
	if (!imageUrl) {
		return imageUrl;
	}
	if (imageUrl.startsWith('http')) {
		return imageUrl;
	}
	const url = `${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
	if (folder) {
		return `${s3Proxy}${folder.startsWith('/') ? folder : `/${folder}`}${url}`;
	}
	return `${s3Proxy}${url}`;
};

export default processS3Path;
