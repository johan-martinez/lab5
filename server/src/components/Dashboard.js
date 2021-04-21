import React,{useState,useEffect}  from 'react';
import io from 'socket.io-client';

function Dasboard() {

    const [val, setVal]=useState(false)
    const [data, setData] = useState({})
    const [lines, setLines] = useState([])

    const stopInstance =()=>{
        let s=String(window.location).replace('/dashboard','/')
        console.log(`${s}stopInstance`)
        fetch(`${s}stopInstance`, {
            method: 'post',
            body: JSON.stringify({}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {})
        .catch(()=>{})
    }

    var socket=io('/',{autoConnect: false})

    socket.on('data-server', (res)=>{
        let event = window.event
        if(event) event.preventDefault()
        setData(JSON.parse(JSON.stringify(res)))
    })

    socket.on('logs',(data)=>{
        let event = window.event
        if(event) event.preventDefault()
        setLines(String(data).split('\n'))
    })

    useEffect(()=>{
        if (!val) {
            socket.connect()
            setVal(true)
        }
    },[stop])


    return(
        <div>
            <div className="text-center">
                <h1 className="display-2">ID: <span className="badge bg-secondary">
                    {data.id}</span></h1>
                <h1><span className={(data.isLeader)?"badge bg-primary":"badge bg-secondary"}>
                {(data.isLeader)?'LÍDER':'SERVER'}</span></h1>
                {data.isLeader&&<button className="btn btn-danger" onClick={stopInstance}>DENTENER</button>}
            </div>
            
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
        
        </div>
    )
}

export default Dasboard