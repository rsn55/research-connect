///Lab Administrator endpoint
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


const labAdministratorSchema = new Schema({
    role: {type: String, enum: ["pi", "postdoc", "grad", "undergrad"], required: true},
    labId: {type: Schema.Types.ObjectId, required: true},
    netId: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    verified: {type: Boolean, default: false},
    //emailTime: {type, Number}

});
let labAdministratorModel = mongoose.model('LabAdministrators', labAdministratorSchema, 'LabAdministrators');

//get the lab admin for a given
router.post('/getLabAdmin', function (req, res) {
    var response = getLabAdmin(req.body.id);
    res.send(response);
});

function getLabAdmin(id, res) {
    labAdministratorModel.findById(id, function (err, labAdmin) {
        if (err) {
            return err;
        }
        console.log(labAdmin.labId);

        return labAdmin;
    });
}

router.post('/updateLabAdmin', function (req, res) {
    let id = req.body.id;
    labAdministratorModel.findById(id, function (err, labAdmin) {
        if (err) {
            res.status(500).send(err);
        }

        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isntin the request body, default back to whatever it was before.
            labAdmin.role = req.body.role || labAdmin.role;
            labAdmin.labId = req.body.labId || labAdmin.labId;
            labAdmin.netId = req.body.netId || labAdmin.netId;
            labAdmin.firstName = req.body.firstName || labAdmin.firstName;
            labAdmin.lastName = req.body.lastName || labAdmin.lastName;
            labAdmin.verified = req.body.verified || labAdmin.verified;

            // Save the updated document back to the database
            labAdmin.save((err, todo) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(todo);
            });
        }
    });
});



router.post('/deleteLabAdmin', function (req, res) {
    var id = req.body.id;
    console.log("delete lab admin");
    console.log(id);

    labAdministratorModel.findByIdAndRemove(id, function (err, labAdmin) {
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        let response = {
            message: "Lab admin successfully deleted",
            id: id
        };
        res.status(200).send(response);

    });
});
