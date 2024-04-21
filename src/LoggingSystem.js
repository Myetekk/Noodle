import React from 'react';
import axios from 'axios';

import './App.css';
import logo from './logo.svg';





class LoggingSystem extends React.Component {





    constructor(props) {
        super(props);
        this.state = {
          loginValue: '',
          passwordValue: '',
          logged: false,
        };
        
        this.loginInputChange = this.loginInputChange.bind(this);
        this.passwordInputChange = this.passwordInputChange.bind(this);
        this.onButtonClickHandler = this.onButtonClickHandler.bind(this);
        this.checkCredentials = this.checkCredentials.bind(this);
    }





    loginInputChange(event) { 
        const loginValue = event.target.value;
        this.setState({ loginValue });
    }

    passwordInputChange(event) { 
        const passwordValue = event.target.value;
        this.setState({ passwordValue });
    }





    async onButtonClickHandler() { 
        await this.checkCredentials();
    }





    async checkCredentials() {
        
        axios.get('http://localhost:8080/api/data')
        .then(response => {
            const credentials = response.data;


            credentials.forEach(item => {
                if (item.email === this.state.loginValue){
                    if (item.password === this.state.passwordValue){
                        this.state.logged = true;
                        alert("Logged in ")
                    }
                }
            });
            
            this.setState(this.state.logged);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        
    }










  render () {
    return (
        <div>
            <header className="App-header">

            <img src={logo} className="App-logo" alt="logo" />

            <div className="Logging-element" >
                <input className="Logging-input" onChange={ this.loginInputChange } placeholder='login'  />
            </div>

            <div className="Logging-element" >
                <input className="Logging-input" onChange={ this.passwordInputChange } placeholder='password' />
            </div>

            <div className="Logging-element" >
                <button className='Logging-button' onClick={ this.onButtonClickHandler }>Log in</button>
            </div>

            </header>
        </div>
    )
  }





}

export default LoggingSystem
