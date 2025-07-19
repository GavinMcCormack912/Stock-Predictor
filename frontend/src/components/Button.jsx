import React from 'react' 

export default function Button({classes, children}) {
    return (
    <>
        <a className={`btn ${classes}`} href="">{children}</a>
    </>
    )
}