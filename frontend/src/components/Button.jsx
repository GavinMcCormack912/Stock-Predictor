import React from 'react' 
import { Link } from 'react-router-dom'

export default function Button({classes, path, children}) {
    return (
    <>
        <Link className={`btn ${classes}`} to={path}>{children}</Link>
    </>
    )
}