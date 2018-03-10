import React, {Component} from 'react';
import Opportunity from './Opportunity'

class OpportunityList extends Component {
    render() {
        console.log("DATA");
        console.log(this.props.data);
        let oppNodes = this.props.data.map(opp => {
            return (
                <Opportunity filteredOptions={this.props.filteredOptions }
                             key={ opp['_id'] }
                             title={ opp.title }
                             area={ opp.areas }
                             labId={ opp.labId }
                             labName={ opp.labName }
                             pi={ opp.pi }
                             supervisor={ opp.supervisor }
                             projectDescription={ opp.projectDescription }
                             undergradTasks={ opp.undergradTasks}
                             opens={ opp.opens }
                             closes={ opp.closes }
                             startSeason={ opp.startSeason }
                             startYear={ opp.startYear}
                             minSemesters={ opp.minSemesters }
                             minHours={ opp.minHours }
                             maxHours={ opp.maxHours }
                             qualifications={ opp.qualifications }
                             minGPA={ opp.minGPA }
                             requiredClasses={ opp.requiredClasses }
                             questions={ opp.questions }
                             yearsAllowed={ opp.yearsAllowed }
                             prereqsMatch={opp.prereqsMatch}
                    //applications={ opp.applications }
                             spots={ opp.spots }
                             opId={opp._id}/>
            )
        });

        return (
            <div>{ oppNodes }</div>
        )
    }
}

export default OpportunityList
