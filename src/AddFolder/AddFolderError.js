import React from 'react';
import PropTypes from 'prop-types';

export default function AddFolderError(props) {
	if (props.message) {
		return <div className='add_folder_error'>{props.message}</div>;
	}
	return <> </>;
}

AddFolderError.propTypes = {
	message: PropTypes.string,
};
