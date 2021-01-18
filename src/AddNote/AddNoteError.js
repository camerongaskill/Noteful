import React from 'react';
import PropTypes from 'prop-types';

export default function AddNoteError(props) {
	if (props.message) {
		return <div className='add_note_error'>{props.message}</div>;
	}
	return <> </>;
}

AddNoteError.propTypes = {
	message: PropTypes.string,
};
