import React, {Component} from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import '../Opportunities.css';
import '../index.css';
import OpportunityBox from '../components/OpportunityBox';
import YearSelect from '../components/YearSelect'
import MajorSelect from '../components/MajorSelect'
import GPASelect from '../components/GPASelect'
import StartDate from '../components/StartDate'



class Opportunities extends Component {

	constructor(props) {
		super(props);
		this.state = {
			yearSelect: {

			},
			gpaSelect: {

			},
			majorSelect: {

			},
			startDate: {

			}
		};
	}

	//will be called by the year component whenever the year checkboxes are updated
	handleUpdateYear(yearObj) {
		this.setState({yearSelect: yearObj});
	}
	handleUpdateGPA(gpaObj) {
		this.setState({gpaSelect: gpaObj});
	}

	handleUpdateMajor(majorObj) {
		this.setState({majorSelect: majorObj});
	}
	handleUpdateDate(majorObj) {
			this.setState({startDate: majorObj});
		}



	render() {
		return (
			<div>

				<div className="header"></div>

				<div className="opp-container">

					<div className="row">
						<div className="column column-100 search-div-container">
							<div className="search-div">
								<input type="text" name="search" placeholder="Search keywords (e.g. psychology, machine learning, Social Media Lab)"/>
							</div>
						</div>
					</div>

					<div className="row">
						<div className="column column-20">
							<div className="filter-box">
							<h3>Filters</h3>
							<hr />

							<label htmlFor="depField">Area of Interest</label>
								<MajorSelect updateMajor={this.handleUpdateMajor.bind(this)} />
								<hr />
								<label htmlFor="yearField">School Year</label>
								<YearSelect updateYear={this.handleUpdateYear.bind(this)} />
								<hr />
								<label htmlFor="gpaField">GPA Requirement</label>
								<GPASelect updateGPA= {this.handleUpdateGPA.bind(this)}/>
									<hr />
								<label htmlFor="datesField">Start Date</label>
								<StartDate updateDate= {this.handleUpdateDate.bind(this)}/>


							</div>
						</div>

						<div className="column column-70">
							<div className="opp-list-container">
								<OpportunityBox filteredOptions = {this.state}
								url='/getOpportunitiesListing' />
							</div>
						</div>
					</div>

				</div>

			</div>

		);
	}
}

export default Opportunities;
