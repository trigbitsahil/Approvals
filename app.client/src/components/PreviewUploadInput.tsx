/* eslint-disable indent */
import React from 'react';

import { Accept, FileRejection } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

// import { Row, Col } from '@components/UI/Grid';
import { styled } from '@mui/material/styles';
// import LightBox from '@components/UI/LightBox';
import Text from '@components/Text';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import useS3Upload, {
	MultipleFn,
	SingleFn,
	UploadArgs,
	UploadData,
} from '@hooks/s3Upload';
import { imageToDataUrl } from '@helpers/upload';
import { trimFileName } from '@web/helpers/stringHelper';
import useS3ImageUrl from '@web/hooks/uses3ImageUrl';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DropZone, { DropZoneProps } from './DropZone';
// import LinearProgress from '@components/UI/LinearProgress';
import { useSnackbar } from 'notistack';
import { Optional } from '@web/types/graphql';
import Row from './Grid/Row';
import Col from './Grid/Col';
import LinearProgress from './LinearProgress';

const LinkText = styled(Text, {
	shouldForwardProp: prop => prop !== 'decoration',
})<{ decoration?: boolean }>(({ theme, decoration }) =>
	decoration
		? {
				textDecoration: 'underline',
				cursor: 'pointer',
		  }
		: {},
);

const TheButton = styled(Button)(({ theme }) => ({
	marginRight: theme.spacing(2),
}));

const BorderBox = styled(Box, { shouldForwardProp: prop => prop !== 'error' })<{
	error?: boolean;
}>(({ theme, error }) => ({
	border: `1px dashed ${
		error ? theme.palette.error.main : theme.palette.divider
	}`,
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(2),
}));

export type UploadRef = {
	abortUpload: () => void;
	handleUpload: () => Promise<boolean>;
	afterUpload?: () => void;
	file?: File | null;
};
export type PreviewUploadInputProps<T extends boolean> = {
	disabled?: boolean;
	multiple?: T;
	path: string;
	label: string;
	uploadRef: React.RefObject<UploadRef>;
	value?: string;
	fileName?: string;
	mode?: 'external' | 'auto' | 'manual';
	onClear?: () => void;
	showThumbnail?: boolean;
} & UploadArgs<T> &
	Optional<DropZoneProps, 'onAccept' | 'onReject'>;
const getUploadInfo = (accept?: Accept) => {
	const values = Object.values(accept || {}).flat(1);
	if (!values.length) {
		return `(Only '*.jpeg and *.png' will be accepted)`;
	}
	if (values.length === 1) {
		return `(Only  '* ${values[0]}' will be accepted)`;
	}
	const last = values[values.length - 1];
	const others = values.slice(0, -2);
	return `(Only ${others
		.map(m => `* ${m}`)
		.join(', ')} and * ${last} will be accepted)`;
};

// let data: Promise<void[]> = [];
const PreviewUploadInput = <T extends boolean>({
	path,
	onFinishUpload,
	onAccept,
	onReject,
	onError,
	requestHeaders,
	label,
	uploadRef,
	value,
	fileName,
	error,
	onClear,
	mode = 'manual',
	dropZoneOptions,
	showThumbnail,
	multiple,
	...props
}: PreviewUploadInputProps<T>) => {
	const { enqueueSnackbar } = useSnackbar();
	const { getS3Url } = useS3ImageUrl();
	const [files, setFiles] = React.useState<File[] | null>(null);
	const [uploaded, setUploaded] = React.useState<boolean>(false);
	const [base64File, setBase64File] = React.useState<string>(value || '');
	const [show, setShow] = React.useState(false);

	const isVideo =
		['video/mp4'].includes(files?.[0]?.type || '') || value?.endsWith('.mp4');

	const isPdf =
		['application/pdf'].includes(files?.[0]?.type || '') ||
		value?.endsWith('.pdf');

	const handleFinishUpload = React.useCallback(
		(file: File, fileName: string, label?: string | undefined) => {
			setUploaded(true);
			(onFinishUpload as SingleFn)(file, fileName, label);
			if (uploadRef.current?.afterUpload) {
				uploadRef.current?.afterUpload();
			}
		},
		[onFinishUpload, uploadRef],
	);
	const handleFinishUploadMultiple = React.useCallback(
		(data: UploadData[]) => {
			setUploaded(true);
			(onFinishUpload as MultipleFn)(data);
			if (uploadRef.current?.afterUpload) {
				uploadRef.current?.afterUpload();
			}
		},
		[onFinishUpload, uploadRef],
	);
	React.useEffect(() => {
		if (value && getS3Url(value) !== base64File) {
			setBase64File(getS3Url(value));
		}
	}, [value, base64File, getS3Url]);
	React.useEffect(() => {
		if (base64File && !files) {
			setUploaded(true);
		}
	}, [base64File, files]);
	React.useEffect(() => {
		if (uploaded && !value) {
			setBase64File('');
		}
	}, [uploaded, value]);

	const { abortUpload, uploadSingleFile, progress, uploadMultipleFiles } =
		useS3Upload({
			multiple,
			onError: onError,
			onFinishUpload: (multiple
				? handleFinishUploadMultiple
				: handleFinishUpload) as any,
			requestHeaders,
		});
	const handleClose = React.useCallback(() => {
		setShow(false);
	}, []);
	const handleShow = React.useCallback(() => {
		if (value?.endsWith('.pdf') || value?.endsWith('.csv')) {
			const a = document.createElement('a');
			a.target = 'blank';
			a.href = getS3Url(value);
			a.click();
		} else {
			setShow(true);
		}
	}, [getS3Url, value]);
	const handleUpload = React.useCallback(async () => {
		// TODO for now upload supports only one document if started suporting multiple adjust this
		if (uploaded) {
			// if (uploadRef.current?.afterUpload) {
			// 	uploadRef.current?.afterUpload();
			// }
			return Promise.resolve(true);
		}
		// if (files?.length) {
		// 	const data = await Promise.all(
		// 		files.map(async file => {
		// 			return uploadSingleFile(file, path)
		// 				.then(() => {
		// 					enqueueSnackbar('Saved successfully', {
		// 						variant: 'success',
		// 					});
		// 					if (uploadRef.current?.afterUpload) {
		// 						uploadRef.current?.afterUpload();
		// 					}
		// 					return true;
		// 				})
		// 				.catch(error => {
		// 					enqueueSnackbar(`Upload failed`, {
		// 						variant: 'error',
		// 					});
		// 					return false;
		// 				});
		// 		}),
		// 	);
		// 	console.log(data);
		// }
		if (files?.length) {
			try {
				const data = await uploadMultipleFiles(files, path);
				data.forEach((result, index) => {
					if (result) {
						enqueueSnackbar(`File ${files[index].name} uploaded successfully`, {
							variant: 'success',
						});
					} else {
						enqueueSnackbar(`File ${files[index].name} upload failed`, {
							variant: 'error',
						});
					}
				});
			} catch (error) {
				console.error('Error uploading files:', error);
			}
		}
		return Promise.resolve(true);
	}, [uploaded, files, uploadSingleFile, path, enqueueSnackbar, uploadRef]);
	React.useImperativeHandle(
		uploadRef,
		() => ({
			abortUpload,
			handleUpload,
			files,
		}),
		[abortUpload, files, handleUpload],
	);

	const handleSelect = React.useCallback(
		(files: File[]) => {
			// TODO for now upload supports only one document if started suporting multiple adjust this
			Promise.all(
				files.map((file, idx) => {
					setUploaded(false);
					setFiles(files);
					const video = ['video/mp4'].includes(file?.type || '');
					if (!video) {
						imageToDataUrl(files[idx]).then(val =>
							setBase64File(val as string),
						);
					}
					if (onAccept) {
						onAccept(files);
					}
				}),
			);
		},
		[onAccept],
	);
	const handleChange = React.useCallback(() => {
		setFiles(null);
		setBase64File('');
		setUploaded(false);
		if (onClear) {
			onClear();
		}
	}, [onClear]);
	const handleReject = React.useCallback(
		(files: FileRejection[]) => {
			const names = files.map(m => m.file.name).join(', ');
			enqueueSnackbar(
				`The following file is invalid and will not be sent: ${names}`,
				{
					variant: 'error',
				},
			);
			if (onReject) {
				onReject(files);
			}
		},
		[enqueueSnackbar, onReject],
	);
	React.useEffect(() => {
		if (mode === 'auto') {
			handleUpload();
		}
	}, [files, mode, handleUpload]);
	const name =
		files?.[0]?.name ||
		(fileName || value || '')?.substring(
			(fileName || value || '')?.lastIndexOf('/') + 1,
		);
	const disabled =
		!value || ['text/csv', 'application/pdf'].includes(files?.[0]?.type || '');
	if (base64File) {
		return (
			<Box pt={2}>
				<Text color="common.black" fontWeight="medium">
					{label}
				</Text>
				<BorderBox error={error}>
					{/* {show ? (
						<LightBox
							enableZoom
							onCloseRequest={handleClose}
							mainSrc={base64File}
							mainSrcThumbnail={base64File}
						/>
					) : null} */}
					<Row>
						<Col xs={12} sm={6} display="flex" justifyContent="center">
							<Row flexWrap="nowrap" alignItems="center">
								<Col display="flex" justifyContent="center">
									{files &&
									files.length === 1 &&
									showThumbnail &&
									!isVideo &&
									!isPdf ? (
										<>
											<img
												src={base64File}
												height={100}
												width={100}
												alt="Selected image"
												onClick={
													disabled && !base64File ? undefined : handleShow
												}
											/>
											{files && files.length > 1 && !isPdf ? (
												<Text>{files.length - 1}</Text>
											) : null}
										</>
									) : (
										<>
											{files && files.length > 1 && !isPdf ? (
												<>
													<img
														src={base64File}
														height={100}
														width={100}
														alt="Selected image"
														onClick={
															disabled && !base64File ? undefined : handleShow
														}
													/>
												</>
											) : (
												<InsertDriveFileIcon />
											)}
										</>
									)}
								</Col>
								<Col>
									{base64File ? (
										<LinkText
											decoration={
												(Boolean(base64File) || !disabled) && !isVideo
											}
											variant="body1"
											color="primary"
											onClick={
												(Boolean(base64File) || !disabled) && !isVideo
													? handleShow
													: undefined
											}
											pl={1}
										>
											{trimFileName(name, 16)}
										</LinkText>
									) : null}

									{files && files?.length > 1 && !isPdf && showThumbnail ? (
										<Text>and {files?.length - 1} more</Text>
									) : null}
								</Col>
							</Row>
							{progress && progress !== 100 ? (
								<LinearProgress value={progress} withLabel />
							) : null}
						</Col>
						<Col xs={12} sm={6} display="flex" justifyContent="center">
							<Row alignItems="center">
								<TheButton
									color="primary"
									size="small"
									startIcon={<ChangeCircleIcon />}
									onClick={handleChange}
								>
									Change
								</TheButton>
								{['auto', 'external'].includes(mode) ? null : (
									<Button
										color={uploaded ? 'success' : 'primary'}
										size="small"
										startIcon={
											uploaded ? <CloudDoneIcon /> : <CloudUploadIcon />
										}
										onClick={handleUpload}
									>
										Save and Upload
									</Button>
								)}
							</Row>
						</Col>
					</Row>
				</BorderBox>
			</Box>
		);
	}
	return (
		<Box pt={2}>
			<Text color="common.black" fontWeight="medium">
				{label}
			</Text>
			<DropZone
				onAccept={handleSelect}
				onReject={handleReject}
				error={error}
				dropZoneOptions={dropZoneOptions}
				{...props}
			>
				<Text textAlign="center" width="100%">
					Drag and drop some files here or click to select files
					<br />
					<Text component="em">{getUploadInfo(dropZoneOptions?.accept)}</Text>
				</Text>
			</DropZone>
		</Box>
	);
};

export default PreviewUploadInput;
