/* eslint-disable no-useless-catch */
export const dataURItoBlob = (dataURI: string, format?: string) => {
	// convert base64 to raw binary data held in a string
	const byteString = atob(dataURI.split(',')[1]);

	// separate out the mime component
	const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([arrayBuffer], { type: mimeString || format });
};

export const blobToFile = (blob: Blob, fileName: string) => {
	return new File([blob], fileName, { type: blob.type });
};

export const imgWidthHeight = (
	url: string,
	maxWidth = 1248,
	maxHeight = 1248,
) =>
	new Promise<{
		width: number;
		height: number;
	}>((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			const { width, height } = img;

			try {
				const calc = calcWidthHeight(width, height, maxWidth, maxHeight);
				resolve(calc);
			} catch (err) {
				console.log(err); // eslint-disable-line
				reject(err);
			}
		};
		img.crossOrigin = 'anonymous';
		img.src = url;
	});

export const calcWidthHeight = (
	currentWidth: number,
	currentHeight: number,
	maxWidth: number,
	maxHeight: number,
) => {
	const targetHeightRatio =
		maxHeight > -1 && currentHeight > maxHeight ? maxHeight / currentHeight : 1;
	const targetWidthRatio =
		maxWidth > -1 && currentWidth > maxWidth ? maxWidth / currentWidth : 1;

	let finalWidth = currentWidth;
	let finalHeight = currentHeight;
	if (currentHeight > currentWidth) {
		// portrait
		finalWidth = targetHeightRatio * currentWidth;
		finalHeight = targetHeightRatio * currentHeight;
	} else {
		// landscape
		finalWidth = targetWidthRatio * currentWidth;
		finalHeight = targetWidthRatio * currentHeight;
	}

	return { width: Math.round(finalWidth), height: Math.round(finalHeight) };
};

// Be aware that the url should be included in the CORS setup
export const resizeImage = (
	file: File,
	format = 'image/png',
	maxWidth = 1248,
	maxHeight = 1248,
) =>
	new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		img.onload = () => {
			const { width, height } = img;

			try {
				const calc = calcWidthHeight(width, height, maxWidth, maxHeight);
				canvas.width = calc.width;
				canvas.height = calc.height;
				ctx?.drawImage(img, 0, 0, calc.width, calc.height);

				const blob = dataURItoBlob(canvas.toDataURL(format, 1), format);

				const res = blobToFile(blob, file.name);

				resolve({
					file: res,
					width: canvas.width,
					height: canvas.height,
				});
			} catch (err) {
				reject(err);
			}
		};

		img.onerror = err => {
			reject(err);
		};

		img.crossOrigin = 'anonymous';
		img.src = URL.createObjectURL(file);
	});

export const convertUrlImageToBlob = (
	url: string,
	format = 'image/jpeg',
	timeout: number,
) =>
	new Promise<Blob>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const blob = new Blob([xhr.response], {
					type: xhr.getResponseHeader('Content-Type') || format,
				});

				resolve(blob);
			} else {
				reject(new Error(`Failed to load ${url}, status: ${xhr.status}`));
			}
		};

		xhr.onerror = err => {
			console.log('xhr error', xhr);
			reject(err);
		};
		xhr.open('GET', url, true);
		if (timeout) {
			xhr.timeout = timeout;
		}
		xhr.responseType = 'arraybuffer';
		xhr.send();
	});

export const convertUrlImageToFile = async (
	url: string,
	fileName: string,
	format = 'image/jpeg',
	timeout: number,
) => {
	try {
		const blob = await convertUrlImageToBlob(url, format, timeout);

		const file = blobToFile(blob, fileName);

		return file;
	} catch (err) {
		console.log(err); //eslint-disable-line
		throw err;
	}
};

export const imageToDataUrl = (file: File) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});

export const convertFileToDocument = (
	uploadedFile: {
		name: string;
		label?: string;
		file: File;
	},
	s3Url: string,
): { label: string; name: string; folder: string } => {
	try {
		// const fileUrl = `${s3Url}/${uploadedFile.name}`;
		// const { width, height } = await imgWidthHeight(fileUrl);
		const fileName = uploadedFile.name;
		return {
			label: uploadedFile.label || fileName,
			name: fileName,
			folder: s3Url,
			// width,
			// height,
		};
	} catch (err) {
		throw err;
	}
};
