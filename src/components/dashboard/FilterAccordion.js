import React from 'react'
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'

const FilterAccordion = (props) => {
    const tags = props.tags;

    return (
        <div className="section">
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>Filter</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {tags && tags.map(tag => {
                            return (
                                <FormControlLabel
                                    control={<Checkbox defaultChecked />}
                                    label={tag.label}
                                    key={tag.label}
                                />
                            )
                        })}
                        <Button variant="contained">Apply</Button>
                    </FormGroup>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        tags: state.firestore.ordered.tags,
    }
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'tags', orderBy: ['createdAt', 'desc'] }
    ])
)(FilterAccordion)