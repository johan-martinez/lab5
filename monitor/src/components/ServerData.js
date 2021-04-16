import React  from 'react'

function ServerData (props){

    return(
            <div className ="card ">
                <div className="card-header"><h5 class="card-title">{props.server}</h5></div>
                <div className="card-body text-center">
                <span className={(props.isLeader)?"badge bg-primary":"badge bg-secondary"}>
                    {(props.isLeader)?'LÍDER':'SERVER'}</span>
                    <img  width="70" height="70" className="rounded mx-auto d-block" src={(props.state)?'https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/server.png':'https://d1nhio0ox7pgb.cloudfront.net/_img/v_collection_png/512x512/shadow/server_error.png'}></img>
                </div>
                <div className="card-footer text-center">
                    <span className={(props.online)?"badge bg-success":"badge bg-danger"}>
                    {(props.state)?'ONLINE':'OFFLINE'}</span>
                </div>
            </div>
        )
    
}

export default ServerData