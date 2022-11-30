import React from 'react'
import './Herbs.css'
import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'

const Herbs = () => {

    const [herbs, setHerbs] = useState([])

    const handleSlider = (e) => {
        console.log(e.target.id, e.target.value)
    }

    useEffect(() => {
        const fetchHerbs = async () => {
            const response = await fetch('https://healthy-ray-cowboy-boots.cyclic.app/api/herb', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const json = await response.json()

            if (response.ok) {
                // console.log('response good')
                // console.log(json)
                setHerbs(json)
            }
        }
        fetchHerbs()
    }, [])
  return (
    <div>
        <main style={{height: '90vh', display: 'flex', flexDirection: 'column', flexWrap: 'true'}}>
            {herbs.length < 1 ? <div>Loading...</div> : herbs.map((item, index) => {
                let year = Number(item.expiry.substring(0, 4))
                let month = Number(item.expiry.substring(5, 7))
                let day = Number(item.expiry.substring(8, 10))
                let properDate = `${day}/${month}/${year}`
                let jsExpiry = new Date(item.expiry)
                let today = new Date()
                let difference = jsExpiry.getTime() - today.getTime()
                let diffInDays = Math.round(difference / (1000 * 3600 * 24))
                let green = 255
                let red = 0
                let opacity = 0.2
                
                if (diffInDays <= 0 ) {
                    green = 0
                    red = 255
                    opacity = 0.8
                } else if (diffInDays > 0 && diffInDays <= 50 ) {
                    green = 0
                    red = 255
                    let part = (diffInDays / 100) * 1.2
                    opacity = part + 0.2
                }
                let cardStyle = {
                    backgroundColor: `rgba(${red}, ${green}, 0, ${opacity}`,
                    width: '200px',
                    margin: '10px'
                }
                // console.log(`daydiff: ${diffInDays}, r: ${red} g: ${green} o: ${opacity}`)
                return (
                    <Card style={cardStyle} key={index}>
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text>Expiry: {properDate}</Card.Text>
                            <Card.Footer style={{textAlign: 'center'}}>
                            Amount left:
                            <input type="range" style={{backgroundColor: '#000'}} min="1" max="100" defaultValue={item.amount} id={item._id} onTouchEnd={handleSlider} onMouseUp={handleSlider} />
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                )
            })}
        </main>
    </div>
  )
}

export default Herbs