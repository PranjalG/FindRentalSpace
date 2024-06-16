const express = require('express');
const mongoose = require('mongoose');

const app = express();

const rentalsSchema = new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    owner_contact: {
        type: Number,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    bedroom_type: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    family_preference: {
        type: String,
        required: true
    },
    food_preference: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    expected_availability: {
        type: String,
        required: true
    },
    refree: {
        type: String,
        required: true
    },
    refree_contact: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    last_update: {
        type: String,
        required: true
    },
    rent: {
        type: Number,
        required: true
    },
    image_path: {
        type: String,
        required: true
    },
    created_by: {
        type: String
    }
});

const userfavSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    favourite_rentals: {
        type: Array,
        required: true
    },
    parameters: {
        type: JSON
    }
});

const Rental = mongoose.model('Rental', rentalsSchema);
const Userfav = mongoose.model('User', userfavSchema);

app.use(express.json());

/*We have to enable CORS - Cross Origin Request Security */ 

// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:4200',   //or whatever port the frontend is using
//     credentials:true,                //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Establishing Database Connection */

mongoose.promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/rentals', {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
        console.log("Database connected!");
    }).catch((error) => {
        console.log(error);
    }); 

/* Connecting with Active Directory using ldapjs */

const ActiveDirectory = require('activedirectory');
 
const config = {
  url: 'ldap://sml.com',
  baseDN: 'dc=sml,dc=com',
//   username: 'Pranjal.Gaur@securemeters.com',
//   password: ''
};
 
const ad = new ActiveDirectory(config);

/* Defining REST methods */

//GET
app.get('/rentals', (req, res) => {
    Rental.find({})
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

app.get('/rentals/page/:pageN', (req, res) => {
    Rental.find({}).skip(12*req.params.pageN).limit(12)
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

app.get('/rentals/:rentalId', (req, res) => {
    Rental.find({ _id: req.params.rentalId })
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

app.get('/userfavs/:emailId', (req, res) => {
    Userfav.find({ user_email: req.params.emailId })
        .then((userfavdata) => {
            res.send(userfavdata);
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

app.get('/users/:emailId', (req, res) => {
    Userfav.find({"$or": [{user_email: req.params.emailId}]}).count()
        .then((data) => {
            res.status(200).send(data.toString());
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

//POST
app.post('/userauth',  (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
 
    ad.authenticate(username, password, function(err, auth) {
    if (err) {
        console.log('ERROR: '+JSON.stringify(err));
        res.send({"Authenticated": false});
        return;
        }
    if (auth) {
        console.log('Authenticated!');
        res.send({"Authenticated": true});
        } else {
            console.log('Authentication failed!');
        }
    })
});

app.post('/rentals', (req, res) => {
    new Rental({
        "owner" : req.body.owner,
        "owner_contact": req.body.owner_contact,
        "bedroom_type": req.body.bedroom_type,
        "family_preference": req.body.family_preference,
        "food_preference": req.body.food_preference,
        "type": req.body.type,
        "address": req.body.address,
        "city": req.body.city,
        "landmark": req.body.landmark,
        "expected_availability": req.body.expected_availability,
        "refree": req.body.refree,
        "refree_contact": req.body.refree_contact,
        "rent": req.body.rent,
        "last_update": req.body.last_update,
        "image_path" : req.body.image_path,
        "distance": req.body.distance, 
        "comments": req.body.comments,
        "created_by": req.body.created_by       
    }).save()
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
});

app.post('/rentals/filtered', (req, res) => {
    //condition when user does not touch the filter form and just hits Apply filter button
    if(req.body.type == '' && req.body.btype == '' && req.body.famPref == '' && req.body.foodPref == '') {
        Rental.find({ distance: {$lte : req.body.distMark}, 
                      rent: {$lte : req.body.rentMark},
                      expected_availability : {$regex: req.body.expecAvail} })
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    //condition when user leaves any field empty
    else if(req.body.type == '' || req.body.btype == '' || req.body.famPref == '' || req.body.foodPref == '') {
        if(req.body.type == '' && req.body.btype != '' && req.body.famPref != '' && req.body.foodPref != ''){
            Rental.find({ bedroom_type: { $regex: req.body.btype},
                          family_preference : req.body.famPref,
                          food_preference : req.body.foodPref,
                          distance: {$lte : req.body.distMark}, 
                          rent: {$lte : req.body.rentMark},
                          expected_availability : {$regex: req.body.expecAvail} })
            .then((rentals) => {
              res.send(rentals);
            })
            .catch((error) => {
                console.log(error);
            });
        }
        else if(req.body.type != '' && req.body.btype == '' && req.body.famPref != '' && req.body.foodPref != ''){
                Rental.find({ type: { $regex: req.body.type},
                              family_preference : req.body.famPref,
                              food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if( req.body.type != '' && req.body.btype != ''&& req.body.famPref == '' && req.body.foodPref != '') {
                Rental.find({ type: { $regex:req.body.type},
                              bedroom_type :{ $regex: req.body.btype},
                              food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if( req.body.type != '' && req.body.btype != '' && req.body.famPref != ''&& req.body.foodPref == ''){
                Rental.find({ type: { $regex: req.body.type},
                              family_preference : req.body.famPref,
                              bedroom_type :{ $regex: req.body.btype},
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        // condition when user leaves any two fields empty or untouched
        else if(req.body.type != '' && req.body.btype != '' && req.body.famPref == '' && req.body.foodPref == '') {
                Rental.find({ type : {$regex : req.body.type},
                              bedroom_type : {$regex : req.body.btype},
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type != '' && req.body.btype == '' && req.body.famPref != '' && req.body.foodPref == '') {
                Rental.find({ type : {$regex : req.body.type},
                              family_preference : req.body.famPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type != '' && req.body.btype == '' && req.body.famPref == '' && req.body.foodPref != '') {
                Rental.find({ type : {$regex : req.body.type},
                              food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype != '' && req.body.famPref != '' && req.body.foodPref == '') {
                Rental.find({ bedroom_type : {$regex : req.body.btype},
                              family_preference : req.body.famPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype != '' && req.body.famPref == '' && req.body.foodPref != '') {
                Rental.find({ bedroom_type : {$regex : req.body.btype},
                              food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype == '' && req.body.famPref != '' && req.body.foodPref != '') {
                Rental.find({ family_preference : req.body.famPref,
                              food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            // condition when user leaves any three fields empty or untouched
        else if(req.body.type != '' && req.body.btype == '' && req.body.famPref == '' && req.body.foodPref == '') {
                Rental.find({ type : {$regex : req.body.type},
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype != '' && req.body.famPref == '' && req.body.foodPref == '') {
                Rental.find({ bedroom_type : {$regex : req.body.btype},
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype == '' && req.body.famPref == '' && req.body.foodPref != '') {
                Rental.find({ food_preference : req.body.foodPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        else if(req.body.type == '' && req.body.btype == '' && req.body.famPref != '' && req.body.foodPref == '') {
                Rental.find({ family_preference : req.body.famPref,
                              distance: {$lte : req.body.distMark}, 
                              rent: {$lte : req.body.rentMark},
                              expected_availability : {$regex: req.body.expecAvail} })
                .then((rentals) => {
                  res.send(rentals);
                })
                .catch((error) => {
                    console.log(error);
                });
            }
    }
    else {
        Rental.find({ type: { $regex: req.body.type}, 
                      bedroom_type:{ $regex: req.body.btype}, 
                      family_preference: req.body.famPref, 
                      food_preference: req.body.foodPref,
                      distance: {$lte : req.body.distMark}, 
                      rent: {$lte : req.body.rentMark},
                      expected_availability : {$regex: req.body.expecAvail} 
                    })
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
});

app.post('/users', (req, res) => {
    new Userfav({
        "user_email" : req.body.user_email,
        "favourite_rentals" : req.body.favourite_rentals,
        "parameters": req.body.parameters
    }).save()
    .then((userData) => {
        res.send(userData);
    })
    .catch((error) => {
        console.log(error);
    });
})

app.post('/rentals/address', (req, res) => {
    Rental.find({ address: { $regex: req.body.address } })
        .then((rentals) => {
            res.send(rentals);
        })
        .catch((error) => {
            console.log(error);
        });
    }
);

// PATCH

app.patch('/rentals/:id', (req, res) => {
    Rental.findOneAndUpdate({
        "_id": req.params.id
    }, {$set: req.body})
    .then((rental) => {
        res.send(rental);
    })
    .catch((error) => {
        console.log(error);
    });
})

app.patch('/userfavs/:id', (req, res) => {
    Userfav.findByIdAndUpdate(req.params.id, {$set: {
        "favourite_rentals" : req.body.favourite_rentals
    }})
    .then((userfav) => {
        res.send(userfav);
    })
    .catch((error) => {
        res.send(error);
    });
})

app.patch('/users/:userEmail', (req, res) => {
    Userfav.findOneAndUpdate({
        "user_email" : req.params.userEmail
    }, {$set: { "parameters.rent" : req.body.rentChecked,
                "parameters.distance" : req.body.distanceChecked,
                "parameters.family_preference" : req.body.familyPrefChecked, 
                "parameters.food_preference" : req.body.foodPrefChecked,
                "parameters.expected_availability" : req.body.expectedAvailabilityChecked,
                "parameters.owner_contact" : req.body.ownerContactChecked
            }
    })
    .then((userData) => {
        res.send(userData);
    })
    .catch((error) => {
        console.log(error);
    });
})

//DELETE
app.delete('/rentals/:id', (req, res) => {
    Rental.findByIdAndDelete(req.params.id)
    .then((rental) => {
        res.send(rental);
    })
    .catch((error) => {
        console.log(error);
    });
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening at port: 3000");   
});