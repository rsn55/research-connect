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

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//TODO new api keyh
//More powerful example
/**
 {
 personalizations: [
     {
         to: [
             {
                 "email": ugradNetId + "@cornell.edu",
                 "name": ugradInfo.firstName
             }
         ],
         subject: "Research Connect Application Update for " + opportunity.title
     }
 ],
     content: [{
     type: "text/plain",
     content: message
 }],
     from: {
     email: "CornellDTITest@gmail.com",
         name: "Research Connect"
 },
 }
 */
// sgMail.send(msg);

router.get('/', function (req, res) {
    res.json({message: 'API Initialized!'});
});

app.get('/messages/:opportunityId', function (req, res) {
    let opportunityId = req.params.opportunityId;
    opportunityModel.findById(opportunityId, function (err, opportunity) {
        res.send(opportunity.messages);
    })
});

app.post('/messages/send', function (req, res) {
    let oppId = req.body.opportunityId;
    let profId = req.body.labAdminNetId;
    let ugradNetId = req.body.undergradNetId;
    let message = req.body.message;
    let status = req.body.status;
    /**
     *  *  Values we can replace:
     *  {studentFirstName}, {studentLastName} --> the first or last name of the student they just clicked accept/reject/interview for
     *  {opportunity title} --> the title/name of the opportunity that students see when browsing and examining opportunities.
     *  {yourFirstName}, {yourLastName}, {yourEmail} --> first or last name or email of current lab administrator viewing applications
     *
     */

    undergradModel.findOne({netId: ugradNetId}, function (err, ugradInfo) {
        labAdministratorModel.findOne({netId: profId}, function (err, prof) {
            opportunityModel.findById(oppId, function (err, opportunity) {
                for (let i = 0; i < opportunity.applications.length; i++) {
                    if (opportunity.applications[i].undergradNetId === ugradNetId) {
                        opportunity.applications[i].status = status;
                        break;
                    }
                }
                let temp = opportunity.messages;
                temp[status] = message;
                opportunity.messages = temp;
                opportunity.markModified("messages");
                opportunity.markModified("applications");
                opportunity.save(function (err, todo) {
                    if (err) {
                        debug(err);
                    }
                });
                message = replaceAll(message, "{studentFirstName}", ugradInfo.firstName);
                message = replaceAll(message, "{studentLastName}", ugradInfo.lastName);
                message = replaceAll(message, "{yourFirstName}", prof.firstName);
                message = replaceAll(message, "{yourLastName}", prof.lastName);
                message = replaceAll(message, "{yourEmail}", prof.netId + "@cornell.edu");
                message = replaceAll(message, "{opportunityTitle}", opportunity.title);
                let msg = {
                    to: ugradNetId + "@cornell.edu",
                    from: 'CornellDTITest@gmail.com',
                    subject: "Research Connect Application Update for \"" + opportunity.title + "\"",
                    text: message,
                    html: replaceAll(message, "\n", "<br />")
                };
                //TODO Change the "from" email to our domain name using zoho mail
                sgMail.send(msg);
                res.status(200).end();
            })
        })
    });
});