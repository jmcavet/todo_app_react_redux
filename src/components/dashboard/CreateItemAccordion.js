import React, { useState } from 'react'

import { Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import CreateTodo from '../todos/CreateTodo'

const CreateItemAccordion = () => {
    const [openAccordion, setOpenAccordion] = useState(false)

    const myStyle = {
        typography: {
            fontSize: '1.3rem',
            width: '100%',
            background: '#666666',
            color: 'white',
            textAlign: 'center'
        }
    }

    const toggleAcordion = (e) => setOpenAccordion(!openAccordion)

    return (
        <div className="section">
            <Accordion
                expanded={openAccordion}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1b-content"
                    id="panel1b-header"
                    onClick={toggleAcordion}
                >
                    <Typography style={myStyle.typography}>Enter New Item</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CreateTodo />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

export default CreateItemAccordion
