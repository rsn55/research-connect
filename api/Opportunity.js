///Opportunity endpoint
let express = require('express');
let router = express.Router();


const mongoose = require('mongoose');
var models = require('Undergrads.js');
//Set up default mongoose connection
const mongoDB = 'mongodb://research-connect:connectresearchers4cornell@ds251245.mlab.com:51245/research-connect';
mongoose.connect(mongoDB, {
    useMongoClient: true
});

module.exports = router;

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**Begin SCHEMAS*/
let Schema = mongoose.Schema;


const opportunitySchema = new Schema({
    creatorNetId: {type: String, required: [true, "Must have NetId for the user creating the opportunity"]},
    labPage: {type: String, default: "This lab does not have a website", required: false},
    title: {type: String, default: "TBD", required: [true, 'Must have title']}, //required
    projectDescription: {type: String, default: "TBD"}, //required, add min length that you see fit
    undergradTasks: {type: String, default: "TBD"},  //what the undergrad would be doing, can be null
    qualifications: {type: String, default: "TBD"}, //can be null/empty
    supervisor: {type: String, default: "TBD"}, //can be null
    spots: {type: Number, required: false, min: 0, default: -1},   //-1 if no limit, number of people they're willing to take, -1 indicates no cap to # of spots
    startSeason: {type: String, enum: ["Summer", "Fall", "Winter", "Spring"]}, //null if start asap, string b/c it will prob be something like Fall 2018
    startYear: {type: Number, min: new Date().getFullYear()},
    yearsAllowed: {
        type: [String],
        enum: ["freshman", "sophomore", "junior", "senior"],
        default: ["freshman", "sophomore", "junior", "senior"]
    },  //do they accept freshman, sophomores, juniors, and/or seniors
    applications: {type: [Schema.Types.Mixed], default: []},
    questions: Schema.Types.Mixed,    //can be empty
    requiredClasses: {type: [String], default: []}, //can be empty
    minGPA: {type: Number, min: 0, max: 4.3, default: 0}, //0 if no minimum gpa required
    minHours: {type: Number, min: 0, max: 500, default: 6}, //can be null, indicating no minimum
    maxHours: {type: Number, min: 0, max: 500, default: 9}, //can be null, indicating no max
    opens: {type: Date, default: new Date()},   //if no date is sent use new Date()
    closes: {type: Date, default: null},  //null if rolling
    areas: {type: [String], default: []} //required, area(s) of research (molecular bio, bioengineering, electrical engineering, computer science, etc.)
    // howToStoreObjects: Schema.Types.Mixed
});
opportunitySchema.pre('validate', function (next) {
    if (this.maxHours < this.minHours) {
        next(new Error('Min hours must be greater than or equal to max hours.'));
    } else {
        next();
    }
});
let opportunityModel = mongoose.model('Opportunities', opportunitySchema, 'Opportunities'); //a mongoose model = a Collection on mlab/mongodb

///ungergrad Scheme and Model




//get a Opportunity
router.post('/getOpportunity', function (req, res) {
    getOpportunity(req.body.id, res);
});

function getOpportunity(id, res) {
    opportunityModel.findById(id, function (err, opportunities) {
        if (err) {
            res.send(err);
            return; // instead of putting an else
            //handle the error appropriately
        }
        res.send(opportunities);
    });

}


router.post('/updateOpportunity', function (req, res) {
    let id = req.body.id;
    opportunityModel.findById(id, function (err, opportunity) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            opportunity.creatorNetId = req.body.creatorNetId || opportunity.creatorNetId;
            opportunity.labPage = req.body.labPage || opportunity.labPage;
            opportunity.title = req.body.title || opportunity.title;
            opportunity.projectDescription = req.body.projectDescription || opportunity.projectDescription;
            opportunity.qualifications = req.body.qualifications || opportunity.qualifications;
            opportunity.supervisor = req.body.supervisor || opportunity.supervisor;
            opportunity.spots = req.body.spots || opportunity.spots;
            opportunity.startSeason = req.body.startSeason || opportunity.startSeason;
            opportunity.startYear = req.body.startYear || opportunity.startYear;
            opportunity.applications = req.body.applications || opportunity.applications;
            opportunity.questions = req.body.questions || opportunity.questions;
            opportunity.requiredClasses = req.body.requiredClasses || opportunity.requiredClasses;
            opportunity.minGPA = req.body.minGPA || opportunity.minGPA;
            opportunity.minHours = req.body.minHours || opportunity.minHours;
            opportunity.maxHours = req.body.maxHours || opportunity.maxHours;
            opportunity.opens = req.body.opens || opportunity.opens;
            opportunity.closes = req.body.closes || opportunity.closes;
            opportunity.areas = req.body.areas || opportunity.areas;

            // Save the updated document back to the database
            opportunity.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});


router.post('/deleteOpportunity', function (req, res) {
    var id = req.body.id;
    console.log("delete opportuinty");
    console.log(id);

    opportunityModel.findByIdAndRemove(id, function (err, opportunity) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Opportunity successfully deleted",
            id: id
        };
        res.status(200).send(response);


    });
});


