import React from 'react';
import NotefulContext from '../NotefulContext';
import './AddNote.css';
import cuid from 'cuid';
import AddNoteError from './AddNoteError';
import moment from 'moment';
import config from '../config';
import PropTypes from 'prop-types';

const now = moment().format();

export default class AddNoteForm extends React.Component {
	static contextType = NotefulContext;
	static defaultProps = {
		onAddNote: () => {},
	};

	state = {
		folderId: '',
		name: {
			value: '',
			touched: false,
		},
		content: {
			value: '',
			touched: false,
		},
	};

	getFolderId = (e) => {
		this.setState({
			folderId: e.target.value,
		});
	};

	getNoteName = (e) => {
		this.setState({
			name: {
				value: e.target.value,
				touched: true,
			},
		});
	};

	handleNameError = () => {
		if (this.state.name.value.trim().length === 0) {
			return 'Please enter a name';
		}
	};

	getContentName = (e) => {
		this.setState({
			content: {
				value: e.target.value,
				touched: true,
			},
		});
	};

	handleContentError = () => {
		if (this.state.content.value.trim().length === 0) {
			return 'Please enter a brief content or description';
		}
	};

	handleSubmitNote = (e) => {
		e.preventDefault();
		const noteId = cuid();
		const modified = now;
		const noteName = this.state.name.value;
		const folderId = this.state.folderId;
		const content = this.state.content.value;
		fetch(`${config.API_ENDPOINT}/notes`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				id: noteId,
				name: noteName,
				modified: modified,
				folderId: folderId,
				content: content,
			}),
		})
			.then((res) => {
				if (!res.ok) return res.json().then((e) => Promise.reject(e));
			})
			.then(() => {
				this.context.addNote(noteId, noteName, modified, folderId, content);
				this.props.onAddNote(noteId);
			})
			.catch((error) => {
				console.error('Error: ', error);
			});
	};

	render() {
		const { folders = [] } = this.context;
		const nameError = this.handleNameError();
		const contentError = this.handleContentError();
		return (
			<div className='add_note_form'>
				<form
					className='note_form_field'
					onSubmit={(e) => this.handleSubmitNote(e)}
				>
					<label htmlFor='note_name'>
						Note Name:
						{this.state.name.touched && <AddNoteError message={nameError} />}
					</label>
					<input
						type='text'
						id='note_name'
						className='note_name'
						name='note_name'
						required
						onChange={(e) => this.getNoteName(e)}
					/>
					<label htmlFor='note_content'>
						Note Content:
						{this.state.content.touched && (
							<AddNoteError message={contentError} />
						)}
					</label>
					<textarea
						id='note_content'
						className='note_content'
						name='note_content'
						required
						onChange={(e) => this.getContentName(e)}
					/>
					<label htmlFor='note_folder'>Choose a folder:</label>
					<select
						name='note_folder'
						id='note_folder'
						className='note_folder'
						onChange={(e) => this.getFolderId(e)}
						required
					>
						<option selected disabled='disabled'>
							Make a Selection
						</option>
						{folders.map((folder) => (
							<option value={folder.id} key={folder.id}>
								{folder.name}
							</option>
						))}
					</select>
					<div className='note_form_buttons'>
						<button
							type='submit'
							className='submit_note_button'
							disabled={this.handleNameError() || this.handleContentError()}
						>
							Submit
						</button>
						<button type='reset' className='submit_note_clear'>
							Clear
						</button>
					</div>
				</form>
			</div>
		);
	}
}

AddNoteForm.propTypes = {
	onAddNote: PropTypes.func,
};
