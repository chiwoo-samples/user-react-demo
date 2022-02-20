import React, {Component} from 'react';
import {Link, Switch, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from './AppNavbar';

class UserEdit extends Component {

    emptyItem = {
        firstName: '',
        lastName: '',
        email: '',
        role: 'Admin',
        title: '',
        usercode: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const users = await (await fetch(`/api/users/${this.props.match.params.id}`)).json();
            this.setState({item: users});
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        // console.log("handleChange=====  " + target.type + " - " + target.name );
        // console.log("handleChange=====  " + name + " : " + value);
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item} = this.state;


        await fetch('/api/users' + (item.id ? '/' + item.id : ''), {
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/users');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit users' : 'Add users'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup className={"fg-usr"}>
                        <Label for="firstName">First Name</Label>
                        <Input type="text" name="firstName" id="firstName" value={item.firstName || ''}
                               onChange={this.handleChange} autoComplete="firstName"/>
                    </FormGroup>
                    <FormGroup className={"fg-usr"}>
                        <Label for="lastName">Last Name</Label>
                        <Input type="text" name="lastName" id="lastName" value={item.lastName || ''}
                               onChange={this.handleChange} autoComplete="lastName"/>
                    </FormGroup>
                    <FormGroup className={"fg-usr"}>
                        <Label for="email">Email</Label>
                        <Input type="text" name="email" id="email" value={item.email || ''}
                               onChange={this.handleChange} autoComplete="email"/>
                    </FormGroup>
                    <FormGroup className={"fg-usr"}>
                        <Label for="role">Role</Label> &nbsp;
                        <select name="role" value={item.role || ''} onChange={this.handleChange}>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Guest">Guest</option>
                        </select>
                    </FormGroup>
                    <FormGroup className={"fg-usr"}>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" value={item.title || ''}
                               onChange={this.handleChange} autoComplete="title"/>
                    </FormGroup>
                    <FormGroup className={"fg-usr"}>
                        <Label for="usercode">User Code</Label>
                        <Input type="text" name="usercode" id="usercode" value={item.usercode || ''}
                               onChange={this.handleChange} autoComplete="usercode"/>
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{''} &nbsp;
                        <Button color="secondary" tag={Link} to="/users">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(UserEdit);