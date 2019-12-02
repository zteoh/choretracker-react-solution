import React from "react"
import PropTypes from "prop-types"
class Chores extends React.Component {

	// Constructor
	state = { 
	    chores: [],
	}

	// Lifecycle Methods
	componentDidMount() {
	    this.get_chores()
	}

	// Methods - get information from database
	get_chores = () => {
	    this.run_ajax('/chores.json', 'GET', {}, (res) => {this.setState({chores: res})});
	}

	run_ajax = (link, method="GET", data={}, callback = () => {this.get_chores()}) => {
	    let options
	    if (method == "GET") {
	        options = { method: method}
	    } else {
	        options = { 
	            method: method, 
	            body: JSON.stringify(data), 
	            headers: {
	            'Content-Type': 'application/json',
	            },
	            credentials: 'same-origin'
	        }
	    }
	    
	    fetch(link, options)
	    .then((response) => {
	        if (!response.ok) {
	            throw (response);
	        }
	        return response.json();
	    })
	    .then(
	        (result) => {
	            callback(result);
	        })
	    .catch((error) => {
	        if (error.statusText) {
	            this.setState({error: error})
	        }
	        callback(error);
	    })
	}

	// Methods - manipulating data
	

	// Methods - rendering helpers

	showChores = () => {
    return this.state.chores.map((chore, index) => {
        return (
            <tr key={index} >
                <td width="125" align="left">{chore.child_id}</td>
                <td width="200" align="left">{chore.task_id}</td>
                <td width="75" align="center">{chore.due_on}</td>
                <td width="125" align="center">{chore.completed ? "True" : "False"}</td>
                <td width="50">Check</td>
                <td width="50">Delete</td>
            </tr>
            )
    })
}

	// Render Method
	render () {
	    return (
	        <div>
	            <table>
	                <thead>
	                    <tr>
	                        <th width="125" align="left">Child</th>
	                        <th width="200" align="left">Task</th>
	                        <th width="75">Due on</th>
	                        <th width="125">Completed</th>
	                    </tr>
	                </thead>

	                <tbody>
					    { this.showChores() }
					</tbody>
	            </table>
	            <button>New Chore</button>
	        </div>
	        );
	}
}

export default Chores
