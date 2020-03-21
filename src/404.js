import React from 'react';
import "./404.css"

class Error extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		return (
			<div className="background" id='page-wrapper'>
				<title title='Wrong！'></title>
				<div className="row">
					<div>
						<h1>This page is not exist</h1>
						<br></br>
						<a href='/'> Click me to return main page</a>
					</div>
				</div>
			</div>
		)
	}
}
export default Error;