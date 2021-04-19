import React,{useState,useEffect}  from 'react';
import io from 'socket.io-client';
import ServerData from './ServerData'

function Dasboard() {

    const [leader,setLeader]=useState({})
    const [servers, setServers] = useState([{}])
    const [val, setVal]=useState(false)
    const [stop,setStop]=useState(0)
    const [data, setData] = useState({})

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

    socket.on('servers', (data)=>{
        let event = window.event
        if(event) event.preventDefault()
        var temp=JSON.parse(JSON.stringify(data))
        var s=[]
        for (let i = 0; i < temp.length; i++) {
            let element = temp[i];
            if (element.isLeader==true) {
                setLeader(element)
            }else{
                s.push({server:element.server,isLeader:element.isLeader,online:element.online})
            }
        }
        setServers(s)
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
                    <h1>LÍDER</h1>
                </div>
                <div className='card-body text-center'>
                    {leader &&< ServerData 
                        server={(leader.server)?leader.server:''} 
                        isLeader={(leader.isLeader)?leader.isLeader:true} 
                        online={(leader.online)?leader.online:false}
                    />}
                </div><br/>
                <div class="card-header text-center">
                    <h1>SERVERS</h1>
                </div>
                <div className='card-body text-center'>
                    <div className="row row-cols-5">
                        {servers.map((element)=>{
                            return(< ServerData 
                                server={(element.server)?element.server:''} 
                                isLeader={(element.isLeader)?element.isLeader:false} 
                                online={(element.online)?element.online:false}
                            />)
                        })}
                    </div>
                </div><br/>
            </div>
        </div>
    )
}

export default Dasboard