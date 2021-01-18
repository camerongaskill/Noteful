import React from 'react';
import NotefulContext from '../NotefulContext';
import { findNote, findFolder } from '../notes-helpers';
import AddFolderForm from './AddFolderForm';
import PropTypes from 'prop-types';
export default class AddFolder extends React.Component {
	static defaultProps = {
		history: {
			goBack: () => {},
		},
		match: {
			params: {},
		},
	};
	static contextType = NotefulContext;

	handleAddFolder = (folderId) => {
		this.props.history.push(`/`);
	};

	render() {
		const { notes, folders } = this.context;
		const { noteId } = this.props.match.params;
		const note = findNote(notes, noteId) || {};
		const folder = findFolder(folders, note.folderId);
		return (
			<div className='AddFolder'>
				<AddFolderForm onAddFolder={this.handleAddFolder} />
				{folder && <h3 className='NotePageNav__folder-name'>{folder.name}</h3>}
			</div>
		);
	}
}

AddFolder.propTypes = {
	history: PropTypes.shape({
		goBack: PropTypes.func,
	}),
	match: PropTypes.shape({
		params: PropTypes.object,
	}),
};
