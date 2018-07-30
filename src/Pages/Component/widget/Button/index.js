import React from 'react';
import { browserHistory } from 'react-router';
import UploadButton from './UploadButton';
import LinkButton from './LinkButton';

const handleCallback = (options, props, opt_response) => {
	if (options.action == 'redirect') {
		browserHistory.push({
          pathname: '/',
          query: ''
        });
	} else if (options.action == 'replace') {
		browserHistory.replace({
          pathname: '/',
          query: ''
        });
	} else if (options.action == 'reload') {
		window.location.reload();
	}
};

export const buttonWarp = (options, props) => {
	let callback = handleCallback.bind(null, options.callback, props);
	if (options.type == "UploadButton") {
		return <UploadButton label={options.label} action={options.url} callback={callback} />
	} else if (options.type == "LinkButton") {
		return <LinkButton label={options.label} href={options.url} newblank={options.newblank}/>
	}
	return null;
};