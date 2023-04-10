import React from 'react'
import './Herbs.css'
import { useState, useEffect } from 'react'
import { Navbar, Button, Nav, Modal, Card, Row, Col, Container, Form } from 'react-bootstrap'
import close from './close.png'
import { useHerbsContext } from '../hooks/useHerbsContext'

const Herbs = () => {

    const { results, dispatch } = useHerbsContext()
    const [firstGet, setFirstGet] = useState(false)
    const [search, setSearch] = useState("")
    const [formName, setFormName] = useState("")
    const [formMonth, setFormMonth] = useState("")
    const [formYear, setFormYear] = useState(2023)
    const [formVal, setFormVal] = useState([false, false, false])
    const [show, setShow] = useState(false)
    const [extended, setExtended] = useState(false)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]



    const handleClose = () => {
        setShow(false);
        setFormName("")
        setFormMonth("")
        setFormYear(2023)
        setFormVal([false, false, false])
    }
    const handleShow = () => setShow(true);

    const handleSearch = async (e) => {
        setSearch(e.target.value)
    }
    const clearSearch = () => {
        setSearch("")
    }
    const handleFormName = (e) => {
        setFormName(e.target.value)
    }
    const handleFormMonth = (e) => {
        setFormMonth(e.target.value)
    }
    const handleFormYear = (e) => {
        setFormYear(e.target.value)
    }
    const handleDelete = async (e) => {
        const herbToDel = e.target.id
        const delHerb = async () => {
            const response = await fetch(`https://healthy-ray-cowboy-boots.cyclic.app/api/herb/${herbToDel}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const json = await response.json()
            if (!response.ok) {
                alert(json.error)
            }
            if (response.ok) {
                dispatch({type: 'DISCARD_HERB', payload: json})
            }
        }

        delHerb()

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let oldFormVal = [...formVal]
        if (formName === "") {
            oldFormVal[0] = true
            setFormVal(oldFormVal)
        } else {
            oldFormVal[0] = false
            setFormVal(oldFormVal)
        }

        if (formMonth === "" || formMonth <= 0 || formMonth > 12) {
            oldFormVal[1] = true
            setFormVal(oldFormVal)
        } else {
            oldFormVal[1] = false
            setFormVal(oldFormVal)
        }

        if (formYear === "") {
            oldFormVal[2] = true
            setFormVal(oldFormVal)
        } else {
            oldFormVal[2] = false
            setFormVal(oldFormVal)
        }

        if (oldFormVal[0] === false && oldFormVal[1] === false && oldFormVal[2] === false) {
            
            const sendThis = {
                herbName: formName,
                expiryDate: `${formYear}/${formMonth}/15`
            }

            const addHerb = async () => {
                const response = await fetch(`https://healthy-ray-cowboy-boots.cyclic.app/api/herb/`, {
                    method: "POST",
                    body: JSON.stringify(sendThis),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const json = await response.json()

                const dispatchLoad = {
                    _id: json._id,
                    name: json.name,
                    amount: json.amount,
                    expiry: json.expiry,
                    search: search
                }

                if (!response.ok) {
                    alert(json.error)
                }
                if (response.ok) {
                    
                    // json.search = search
                    // console.log('json with search:')
                    console.log('dispatchLoad from herbs.js')
                    console.log(dispatchLoad)
                    dispatch({type: "CREATE_HERB", payload: dispatchLoad})
                    setFormName("")
                    setFormMonth("")
                    setFormYear(2023)
                    setShow(false)
                    dispatch({type: 'SEARCH', payload: search})
                }
            }

            addHerb()
            
        } else {
            
            return null;
            
        }


    }

    const handleSlider = (e) => {
        // console.log(e.target.id, e.target.value)
        const { id, value } = e.target
        const sendThis = { herbId: id, newAmount: value }
        console.log(sendThis)
        const updateAmount = async () => {
            
            const response = await fetch(`https://healthy-ray-cowboy-boots.cyclic.app/api/herb/${id}`, {
                method: "PATCH",
                body: JSON.stringify(sendThis),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const json = await response.json()

            if (!response.ok) {
                console.log('coming from react')
                alert(json.error)
            }
            if (response.ok) {
                console.log('slider updated, return value:')
                console.log(json)
            }
        }
        updateAmount()
    }

    const navbarToggleHandler = () => {
        if (!extended) {
            setExtended(true)
        } else {
            setExtended(false)
        }
        
        
    }

    useEffect(() => {
        
        if (!firstGet) {
            const fetchHerbs = async () => {
                const response = await fetch('https://healthy-ray-cowboy-boots.cyclic.app/api/herb', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const json = await response.json()
    
                if (response.ok) {
                    
                    // setHerbs(json)
                    dispatch({type: 'SET_HERBS', payload: json})
                }
            }
            
            fetchHerbs().then(dispatch({type: 'SEARCH', payload: search}))
            setFirstGet(true)
        } else {
            dispatch({type: 'SEARCH', payload: search})
        }
        
        
    }, [dispatch, search, firstGet])
  return (
    <div>
        <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
            <Navbar.Brand className="ms-2 me-auto">Herb Tracker</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" style={{marginRight: '10px'}} onClick={navbarToggleHandler}/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Container style={{width: '380px'}}>
                    <Nav style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span><input autoComplete="off" style={{marginTop: '5px', marginBottom: '5px', marginRight: '5px'}}placeholder="🔍 Search..." type="text" value={search} onKeyUp={handleSearch} onInput={handleSearch}/>
                        <img src={close} alt="clear search" style={{width: '30px', height: '30px', marginBottom: '4px'}} onClick={clearSearch}/></span>
                        
                    </Nav>
                </Container>
                <Container style={{width: '120px'}}>
                    <Nav style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                        <Button onClick={handleShow} variant="success" style={{width: '100px'}}>Add Herb</Button>
                    </Nav>
                </Container>
                <Container style={{width: '240px'}}>
                    <Nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                    <Navbar.Text className="mx-auto">Username</Navbar.Text>
                    <Button className="mx-auto">Logout</Button>
                    </Nav>
                </Container>
            </Navbar.Collapse>
        </Navbar>
    <main style={{marginTop: extended ? '180px' : '60px', transition: "all 250ms ease-in-out"}}>
            <Row xs={2} sm={3} md={4} lg={5} xl={6} xxl={7} >
               
            {!results ? 'Loading...' : results.map((item, index) => {
                let year = Number(item.expiry.substring(0, 4))
                let mongoID = item._id                
                let month = monthNames[Number(item.expiry.substring(5, 7)) - 1]
                // let day = Number(item.expiry.substring(8, 10))
                let properDate = `${month} ${year}`
                let jsExpiry = new Date(item.expiry)
                let today = new Date()
                let difference = jsExpiry.getTime() - today.getTime()
                let diffInDays = Math.round(difference / (1000 * 3600 * 24))
                let green = 255
                let red = 0
                let part = 0
                let opacity = 0.2
                
                if (diffInDays <= 0 ) {
                    green = 0
                    red = 255
                    opacity = 0.8
                } else if (diffInDays > 0 && diffInDays <= 50 ) {
                    green = 0
                    red = 255
                    part = (diffInDays / 100) * 1.2
                    opacity = 0.8 - part
                }
                let cardStyle = {
                    backgroundColor: `rgba(${red}, ${green}, 0, ${opacity}`,
                    margin: '4px'
                }
                // console.log(`daydiff: ${diffInDays}, part: ${part}, r: ${red} g: ${green} o: ${opacity}`)
                return (
                    <Col key={index} style={{textAlign: 'center', display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                        <Card style={cardStyle} key={index}>
                        <Card.Body>
                            <Card.Title>
                                <img src={close} alt="delete" id={mongoID} style={{position: 'absolute', top: '2px', right: '2px', zIndex: '99', background: '#fff', borderRadius: '50%',
                                            width: '20px', height: '20px', textAlign: 'center', border: '1px solid black', padding: '0px', cursor: 'pointer'}}  
                                            onClick={handleDelete} />
                                    
                            
                                {item.name}
    
                            </Card.Title>
                            <Card.Text>
                                Expiry: {properDate}</Card.Text>
                            <Card.Footer style={{textAlign: 'center'}}>
                            Amount left:<br/>
                            <input type="range" style={{backgroundColor: '#000', width: '100px'}} min="1" max="100" defaultValue={item.amount} id={item._id} onTouchEnd={handleSlider} onMouseUp={handleSlider} />
                            </Card.Footer>
                        </Card.Body>
                    </Card>
                    </Col>
                )
            })}
            </Row>
        </main>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Herb</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Herb Name</Form.Label>
                        <Form.Control type="text" id="newHerbName" value={formName} onChange={handleFormName} autoComplete="off" required/>
                        <div className={formVal[0] ? 'visible' : 'invisible'} style={{color: "red"}}>Name required</div>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Expiry:</Form.Label>
                        <Row>
                            <Col>
                                <Form.Text id="expiryMonth">Month</Form.Text>
                                <Form.Control type="number" min="1" max="12" value={formMonth} onChange={handleFormMonth} id="expiryMonth" autoComplete="off" required/>
                                <div className={formVal[1] ? 'visible' : 'invisible'} style={{color: "red"}}>Month required (1-12)</div>
                            </Col>
                            <Col>
                                <Form.Text id="expiryYear">Year</Form.Text>
                                <Form.Control type="number" value={formYear} onChange={handleFormYear} id="expiryYear" autoComplete="off" required/>
                                <div className={formVal[2] ? 'visible' : 'invisible'} style={{color: "red"}}>Year required</div>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group>
                        
                    <Row>
                        <Col>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                        </Col>
                        <Col>
                    <Button type="submit" variant="success" onClick={handleSubmit} className="float-end">
                        Create
                    </Button>
                    </Col>
                    </Row>

                    </Form.Group>
                </Form>    
            </Modal.Body>
            <Modal.Footer>
            
            
            </Modal.Footer>
            
        </Modal>
    </div>
  )
}

export default Herbs