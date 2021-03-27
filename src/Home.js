import React from 'react';
import {
    Link
} from "react-router-dom";

export default function Home(props) {
    return (
        <div>
            <h1>Welcome to TechU's Group 3 Capstone Page</h1>
            <h3>Click on each TF model to explore</h3>
            <Link onClick={() => { props.history.push('/qna') }}>Question and Answer Model</Link>
            <br />
            <Link onClick={() => { props.history.push('/facemash') }}>Facemash Model</Link>
            <br />
            <Link onClick={() => { props.history.push('/pose') }}>Pose Model</Link>
        </div>
    )
}
