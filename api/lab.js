///Lab endpoint
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


const labSchema = new Schema({
    name: {type: String, required: true},
    labPage: {type: String, default: ""},
    labDescription: {type: String, default: ""},
    labAdmins: {type: [String], default: []},
    opportunities: [Schema.Types.ObjectId]
});
let labModel = mongoose.model('Labs', labSchema, 'Labs'); //a mongoose model = a Collection on mlab/mongodb

//get all the labs
router.get('/get/all', function (req, res) {
    labModel.find({}, function (err, labs) {
        if (err) {
            res.send(err);
            //handle the error appropriately
            return; //instead of putting an else
        }
        res.send(labs);

    });
});

//get one lab by id
router.get('/getLab', function (req, res) {
    var response = getLab(req.body.id, res);
    res.send(response);
});

function getLab(id, res) {
    labModel.findById(id, function (err, lab) {
        if (err) {
            return err;
        }
        console.log(lab.name);
        return lab;
    });
}


//create a lab
router.post('/createLab', function (req, res) {
    //req is json containing the stuff that was sent if there was anything
    var data = req.body;
    console.log(data);


    var lab = new labModel({
        name: data.name,
        labPage: data.labPage,
        labDescription: data.labDescription,
        labAdmins: data.labAdmins,
        opportunities: data.opportunities

    });

    lab.save(function (err) {
        if (err) {
            res.status(500).send({"errors": err.errors});
            console.log(err);
        } //Handle this error however you see fit
        else {
            res.send("success!");
        }
    });
});

//delete a lab
router.post('/deleteLab', function (req, res) {
    var id = req.body.id;
    console.log("delete lab");
    console.log(id);

    labModel.findByIdAndRemove(id, function (err, lab) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});


router.post('/updateLab', function (req, res) {
    let id = req.body.id;
    labModel.findById(id, function (err, lab) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            lab.name = req.body.name || lab.name;
            lab.labPage = req.body.labPage || lab.labPage;
            lab.labDescription = req.body.labDescription || lab.labDescription;
            lab.labAdmins = req.body.labAdmins || lab.labAdmins;
            lab.opportunities = req.body.opportunities || lab.opportunities;

            // Save the updated document back to the database
            lab.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});




