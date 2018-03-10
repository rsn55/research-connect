///Undergrad endpoint
let express = require('express');
let router = express.Router();


const mongoose = require('mongoose');

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



const undergradSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    gradYear: {type: Number, required: true, min: new Date().getFullYear()},
    major: {type: String},
    gpa: {type: Number, min: 0, max: 4.3},
    netId: {type: String, required: true}
});
let undergradModel = mongoose.model('Undergrads', undergradSchema, 'Undergrads'); //a mongoose model = a Collection on mlab/mongodb



router.post('/create', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;

    var undergrad = new undergradModel({

        firstName: data.firstName,
        lastName: data.lastName,
        gradYear: data.gradYear,    //number
        major: data.major,
        gpa: data.gpa,
        netId: data.netId
    });
    console.log(undergrad);
    undergrad.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            console.log(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
        // Now the opportunity is saved in the commonApp collection on mlab!
    });

});


router.post('/update', function (req, res) {
    let id = req.body.id;
    console.log(id);
    undergradModel.findById(id, function (err, undergrad) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            undergrad.firstName = req.body.firstName || undergrad.firstName;
            undergrad.lastName = req.body.lastName || undergrad.lastName;
            undergrad.gradYear = req.body.gradYear || undergrad.gradYear;
            undergrad.major = req.body.major || undergrad.major;
            undergrad.gpa = req.body.gpa || undergrad.gpa;
            undergrad.netID = req.body.netID || undergrad.netID;

            // Save the updated document back to the database
            undergrad.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});


router.post('/delete', function (req, res) {
    var id = req.body.id;
    console.log("delete undergrad");
    console.log(id);

    undergradModel.findByIdAndRemove(id, function (err, undergrad) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Undergrad successfully deleted",
            id: id
        };
        res.status(200).send(response);


    });
});
