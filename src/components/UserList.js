import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';

class UserList extends Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        fetch('/api/users')
            .then(response => response.json())
            .then(data => this.setState({users: data}));
    }

    async remove(id) {
        await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedUsers = [...this.state.users].filter(i => i.id !== id);
            this.setState({users: updatedUsers});
        });
    }

    render() {
        const {users} = this.state;

        const userTableBody = users.map(row => {
            return <tr key={row.id}>
                <td style={{whiteSpace: 'nowrap'}}>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.email}</td>
                <td>{row.role}</td>
                <td>{row.title}</td>
                <td>{row.usercode}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/users/" + row.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(row.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/users/new">Add User</Button>
                    </div>
                    <h3>Clients</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="14%">Name</th>
                            <th width="14%">Last Name</th>
                            <th width="15%">Email</th>
                            <th width="14%">Role</th>
                            <th width="14%">Title</th>
                            <th width="14%">UserCode</th>
                            <th width="14%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userTableBody}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default UserList;