import React from 'react';
import Paper from '../components/Paper';

class Home extends React.Component {
    render() {
        return (
            <Paper className="contents-paper">
                <h2>Coming soon!</h2>
            </Paper>
        );
    }
}

Home.pageName = "Home";
export default Home;