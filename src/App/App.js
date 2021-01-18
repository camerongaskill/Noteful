import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import ErrorComponent from '../ErrorComponent';
import NotefulContext from '../NotefulContext';
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers';
import './App.css';

class App extends Component {
	state = {
		notes: [],
		folders: [],
	};

	componentDidMount() {
		// fake date loading from API call
		setTimeout(() => this.setState(dummyStore), 600);
	}

	handleDeleteNote = (noteId) => {
		this.setState({
			notes: this.state.notes.filter((note) => note.id !== noteId),
		});
	};

	handleAddFolder = (folderName, folderId) => {
		const obj = {};
		obj['id'] = folderId;
		obj['name'] = folderName;
		this.state.folders.push(obj);
	};

	handleAddNote = (id, name, modified, folderId, content) => {
		const noteObj = {};
		noteObj['id'] = id;
		noteObj['name'] = name;
		noteObj['modified'] = modified;
		noteObj['folderId'] = folderId;
		noteObj['content'] = content;
		this.state.notes.push(noteObj);
	};

	renderNavRoutes() {
		const { notes, folders } = this.state;
		return (
			<>
				{['/', '/folder/:folderId'].map((path) => (
					<Route
						exact
						key={path}
						path={path}
						render={(routeProps) => (
							<NoteListNav folders={folders} notes={notes} {...routeProps} />
						)}
					/>
				))}
				<Route
					path='/note/:noteId'
					render={(routeProps) => {
						const { noteId } = routeProps.match.params;
						const note = findNote(notes, noteId) || {};
						const folder = findFolder(folders, note.folderId);
						return <NotePageNav {...routeProps} folder={folder} />;
					}}
				/>
				<Route path='/add-folder' component={NotePageNav} />
				<Route path='/add-note' component={NotePageNav} />
			</>
		);
	}

	renderMainRoutes() {
		return (
			<>
				{['/', '/folder/:folderId'].map((path) => (
					<Route exact key={path} path={path} component={NoteListMain} />
				))}
				<Route path='/note/:noteId' component={NotePageMain} />
				<Route path='/add-folder' component={AddFolder} />
				<Route path='/add-note' component={AddNote} />
			</>
		);
	}

	render() {
		const value = {
			notes: this.state.notes,
			folders: this.state.folders,
			deleteNote: this.handleDeleteNote,
			addFolder: this.handleAddFolder,
			addNote: this.handleAddNote,
		};
		return (
			<ErrorComponent>
				<NotefulContext.Provider value={value}>
					<div className='App'>
						<nav className='App__nav'>{this.renderNavRoutes()}</nav>
						<header className='App__header'>
							<h1>
								<Link to='/'>Noteful</Link>{' '}
								<FontAwesomeIcon icon='check-double' />
							</h1>
						</header>
						<main className='App__main'>{this.renderMainRoutes()}</main>
					</div>
				</NotefulContext.Provider>
			</ErrorComponent>
		);
	}
}

export default App;
