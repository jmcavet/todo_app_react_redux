import React, { useEffect, useState } from 'react'
import { Toolbar, Box, Typography } from "@mui/material"

import { definePageTitle } from '../../store/actions/settingsActions'

const ContactPage = () => {
    useEffect(() => {
        definePageTitle({
            pageTitle: "Contact",
        })
    }, [])

    return (
        <div className="dashboard container">
            <Toolbar />
            <div className="row">
                <Typography component="h2" variant="h3" style={{ textAlign: 'center', marginTop: '2rem' }}>
                    Jean-Marie Cavet
                </Typography>
                <Typography component="h1" variant="h4" style={{ textAlign: 'center', marginTop: '3rem' }}>
                    You can find me on <a href='https://www.linkedin.com/in/jean-marie-cavet-24687216/'>LinkedIn</a>
                </Typography>

            </div>
        </div>
    )
}

export default ContactPage
