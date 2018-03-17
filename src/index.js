import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './routes/App';
import Opportunities from './routes/Opportunities';
import OpportunityPage from './routes/OpportunityPage';
import Reference from './routes/Reference';
import Error from './components/Error';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import CreateOpportunityForm from './routes/CreateOpportunityForm';
import InstructorRegister from './routes/InstructorRegister';
import ProfessorView from './routes/ProfessorView';
import ApplicationPage from './routes/ApplicationPage';
import Resume from './routes/Resume';
import LandingPage from './routes/LandingPage';

ReactDOM.render(
    <BrowserRouter>
        <Switch>

            <Route exact path='/opportunities' component = {Opportunities} />
            <Route path='/opportunity/:id' component = {OpportunityPage} />
            <Route path='/application/:id' component = {ApplicationPage} />
            <Route exact path='/newopp' component = {CreateOpportunityForm} />
            <Route exact path='/instructorRegister' component = {InstructorRegister} />
            <Route exact path='/professorView' component = {ProfessorView} />
            <Route path = '/resume/:id' component = {Resume} />
            <Route exact path='/' component = {LandingPage} />
            <Route path='/' component = {Error} />
        </Switch>
    </BrowserRouter>
    , document.getElementById('root'));
registerServiceWorker();
