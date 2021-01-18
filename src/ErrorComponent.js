import React from 'react';

export default class ErrorComponent extends React.Component {
	state = {
		hasError: false,
	};

	componentDidCatch(error, errorInfo) {
		console.log('caught an error', error, errorInfo);

		this.setState({ hasError: true });
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className='page_error'>
					<h3>Oh no! Looks like something went wrong.</h3>
					<p>We apologise for any inconvenience.</p>
				</div>
			);
		}
		return this.props.children;
	}
}
