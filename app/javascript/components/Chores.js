import React from "react"
import PropTypes from "prop-types"
import NewChoreForm from './NewChoreForm';

class Chores extends React.Component {

	// Constructor
	state = { 
	    chores: [],
	    tasks: [],
		children: [],
		modal_open: false
	}

	// Lifecycle Methods
	componentDidMount() {
	    this.get_chores()
	    this.get_tasks()
		this.get_children()
	}

	// Methods - get information from database
	get_chores = () => {
	    this.run_ajax('/chores.json', 'GET', {}, (res) => {this.setState({chores: res})});
	}

	get_tasks = () => {
		this.run_ajax('/tasks.json', 'GET', {}, (res) => {this.setState({tasks: res})});
	}

	get_children = () => {
		this.run_ajax('/children.json', 'GET', {}, (res) => {this.setState({children: res})});
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

	// Methods - manipulating state
	switchModal = () => {
	    this.setState(prevState => ({
	        modal_open: !prevState.modal_open
	    }));
	}

	toggle_complete = (chore) => {
        const updated_chore = {
            child_id: chore.child_id,
            task_id: chore.task_id,
            due_on: chore.due_on,
            completed: !chore.completed
        }
        this.run_ajax('/chores/'.concat(chore.id, '.json'), 'PATCH', {chore: updated_chore});
    }


	// Methods - rendering helpers

	find_child_name = (chore) => {
	    var desired_id = chore.child_id;
	    const children = this.state.children
	    for (var child = 0; child < children.length; child += 1){
	        if (children[child]['id'] == desired_id){
	            return children[child]['first_name'].concat(' ', children[child]['last_name']);
	        }
	    }
	    return "No name"
	}

	find_task_name = (chore) => {
		var desired_id = chore.task_id;
		const tasks = this.state.tasks
		for (var task = 0; task < tasks.length; task += 1){
			if (tasks[task]['id'] == desired_id){
				return tasks[task]['name'];
			}
		}
		return "No task"
	}


	showChores = () => {
	    return this.state.chores.map((chore, index) => {
	        return (
	            <tr key={index} >
	                <td width="125" align="left">{this.find_child_name(chore)}</td>
	                <td width="200" align="left">{this.find_task_name(chore)}</td>
	                <td width="75" align="center">{chore.due_on}</td>
	                <td width="125" align="center">{chore.completed ? "True" : "False"}</td>
	                <td width="50" onClick={() => this.toggle_complete(chore)}>Check</td>
	                <td width="50">Delete</td>
	            </tr>
	            )
	    })
	}

	showChoreForm = () => {
        return (
            <div>
                <NewChoreForm 
                    children={this.state.children}
                    tasks={this.state.tasks}
                    run_ajax={this.run_ajax}
                    switchModal={this.switchModal}
                />
            </div>
            )
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

	            <button onClick={this.switchModal}>New Chore</button>
	            { this.state.modal_open ? this.showChoreForm() : null }

	        </div>
	        );
	}
}

export default Chores
