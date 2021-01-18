import React from 'react';
import PropTypes from 'prop-types';
import NotefulContext from '../NotefulContext';
import AddFolderError from './AddFolderError';
import config from '../config';
import './AddFolder.css';
import cuid from 'cuid';

export default class AddFolderForm extends React.Component {
	static defaultProps = {
		onAddFolder: () => {},
	};

	static contextType = NotefulContext;

	state = {
		nameValidate: '',
		touched: false,
	};

	handleFolderError = (name) => {
		this.setState({
			nameValidate: name,
			touched: true,
		});
	};

	validateFolderName = () => {
		const name = this.state.nameValidate.trim();
		const charFilter = /^[a-zA-Z 0-9]*$/;
		if (name.length === 0) {
			return 'This field is required';
		} else if (!charFilter.test(name)) {
			return 'Cannot include special characters';
		}
	};

	handleAddFolder = (e) => {
		e.preventDefault();
		const id = cuid();
		const name = e.target.input_folder_name.value;
		fetch(`${config.API_ENDPOINT}/folders`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ id: id, name: name }),
		})
			.then((res) => {
				if (!res.ok) return res.json().then((e) => Promise.reject(e));
			})
			.then(() => {
				this.context.addFolder(name, id);
				this.props.onAddFolder(id);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};
	render() {
		const folderError = this.validateFolderName();
		return (
			<div className='AddFolder'>
				<form
					className='add-folder-form'
					onSubmit={(e) => this.handleAddFolder(e)}
				>
					<label htmlFor='input_folder_name'>Enter Folder Name</label>
					<input
						type='text'
						name='input_folder_name'
						id='input_folder_name'
						className='input_folder_name'
						required
						onChange={(e) => this.handleFolderError(e.target.value)}
					/>
					{this.state.touched && <AddFolderError message={folderError} />}
					<button
						type='submit'
						className='AddFolder__add-folder-button'
						disabled={this.validateFolderName()}
					>
						Add Folder
					</button>
				</form>
			</div>
		);
	}
}

AddFolderForm.propTypes = {
	onAddFolder: PropTypes.func,
};
