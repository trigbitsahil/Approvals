import React from 'react';

import Loading from '@web/components/Loading';
import LoadingError from '@web/components/LoadingError';

import { ApolloError, ApolloQueryResult, QueryResult } from '@apollo/client';

const defaultOptions = {
	showError: true,
	showLoading: true,
	showErrorOnEmptyData: false,
	hideErrorIcon: false,
	onError: (): undefined => undefined,
};

type DisplayOptions = {
	showError?: boolean;
	showLoading?: boolean;
	showErrorOnEmptyData?: boolean;
	hideErrorIcon?: boolean;
	onError?: (erro: ApolloError | undefined) => void;
	loadingComponent?: React.ReactElement<any, any>;
	overlay?: boolean;
	onRetry?: () => void;
	errorComponent?: React.ReactElement<any, any>;
};

type ProcessQueryClientFN = (
	result: QueryResult<any, Record<string, any>>,
	displayOptions?: DisplayOptions,
) => React.ReactElement<any, any> | null | undefined;

type ProcessQueryRSCFN = <T = any>(
	result: ApolloQueryResult<T>,
	displayOptions?: Omit<DisplayOptions, 'showLoading' | 'onRSCRetry'>,
) => React.ReactElement<any, any> | null | undefined;

const processGQLResponse: ProcessQueryClientFN = (
	{ loading, error, refetch, data, called },
	displayOptions = defaultOptions,
) => {
	const {
		overlay,
		showError,
		showLoading,
		showErrorOnEmptyData,
		loadingComponent,
		errorComponent,
		hideErrorIcon,
		onError,
		onRetry,
	} = {
		...defaultOptions,
		...displayOptions,
	};
	const isCalled = called !== undefined && called !== null ? called : true;
	if (!isCalled) {
		return null;
	}
	const loader = loadingComponent || React.createElement(Loading, { overlay });
	if (loading) {
		return showLoading ? loader : null;
	}
	// if we have an error and data, we should go through
	if (error && !data) {
		console.warn(error);
		// if (error.graphQLErrors && error.graphQLErrors[0]?.statusCode === 401) {
		// 	// we have an expired token
		// 	return <LoggedOutModal />;
		// }
		if (showError) {
			onError(error);
			const statusCode =
				(error.graphQLErrors && (error.graphQLErrors[0] as any)?.statusCode) ||
				(error.graphQLErrors[0] as any)?.extensions?.statusCode;
			// if (statusCode === 404) {
			// 	return React.createElement(NotFoundError, { overlay });
			// }
			// if (statusCode === 403) {
			// 	return React.createElement(NoAccessError, { overlay });
			// }
			console.warn('process query', error);
			return (
				errorComponent ||
				React.createElement(LoadingError, {
					// overlay,
					hideErrorIcon,
					onRetry: () => (onRetry ? onRetry() : refetch()),
				})
			);
		}
		return null;
	}
	if (isCalled && !loading && (!data || Object.keys(data).length === 0)) {
		console.error('Empty data. Aborting render.', data);
		if (!showError || !showErrorOnEmptyData) {
			return null;
		}
		return React.createElement(LoadingError, {
			hideErrorIcon,
			// overlay,
			onRetry: () => (onRetry ? onRetry() : refetch()),
		});
	}
};

const processGQLResponseRSC: ProcessQueryRSCFN = (res, displayOptions) =>
	processGQLResponse(res as any, {
		...defaultOptions,
		...displayOptions,
		onRetry: () =>
			typeof window !== 'undefined' ? window.location.reload() : () => null,
		showLoading: false,
	});

export { processGQLResponse, processGQLResponseRSC };
