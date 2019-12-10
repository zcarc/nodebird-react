import React from 'react';
import Link from "next/link";

const Home = () => {

    return(
        <>
            {/*<a href="/about">about</a>*/}
            <Link href="/about"><a>about</a></Link>
            <div>Hello, Next!</div>
        </>
    );
};

export default Home;