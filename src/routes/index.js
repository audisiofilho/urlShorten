import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from "../pages/Profile";
import New from "../pages/New";
import Shorten from '../pages/Shorten';
import Erro from '../pages/Erro';
import Favoritos from '../pages/Favoritos'

export default function Routes(){
    return(
        <Switch>
            <Route exact path="/" component={Shorten} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate/>
            <Route exact path="/profile" component={Profile} isPrivate/>
            <Route exact path="/new" component={New} isPrivate/>
            <Route exact path="/favoritos" component={Favoritos} isPrivate/>
            <Route path="*"  component={Erro}/>
        </Switch>
    )
}