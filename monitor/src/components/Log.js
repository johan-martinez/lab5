import React, {useState,useEffect} from 'react';
import io from 'socket.io-client';

function Log(props) {
    const [val, setVal]=useState(false)
    const [stop,setStop]=useState(0)
    const [lines, setLines] = useState([])
    var socket=io('/',{autoConnect: false})

    useEffect(()=>{
        if (!val) {
            socket.connect()
            setVal(true)
        }
    },[stop])

    socket.on('logs',(data)=>{
        let event = window.event
        if(event) event.preventDefault()
        setLines(String(data).split('\n'))
    })

    return(
        <div class="card mt-5" >
            <div class="card-header text-center">
                <h1>LOGS</h1>
            </div>
            <div id="log" className='h-50 d-inline-block overflow-auto'>
                {lines.slice(0).reverse().map(element=>{
                    return <p>{element}</p>
                })}
            </div>
        </div>
    )
}

export default Log