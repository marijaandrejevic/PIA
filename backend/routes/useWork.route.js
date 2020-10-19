const express = require('express');
const app = express();
var request = require('request');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const webpush = require('web-push');
const user_Route = express.Router();

app.use(bodyParser.json());
const publicVapidKey = "BO8q7xzIVv7rs8M_S0Q8sduLOzYJAl6lRXI_DCO9cF1khV9iit711kXLmwOgWKWFsdok1vXe8qxdj0MUICAsdX4"
const privateVapidKey = "fWBKNUv0usfWL_A_vs_EksZIn5lobdLrqAfrGaDGeNY"

webpush.setVapidDetails(
    "http://localhost:4200/poljoprivrednik",
    publicVapidKey,
    privateVapidKey
)
let User_polj = require('../models/User_poljoprivrednik');
let User_pre = require('../models/User_preduzece');
let Rasadnik = require('../models/Rasadnik');
let Magacin = require('../models/Magacin');
let Preduzece_proizvod = require('../models/Preduzece_proizvod');
let Narudzbina = require('../models/Narudzbine');
const e = require('express');
const User_preduzece = require('../models/User_preduzece');
const Narudzbine = require('../models/Narudzbine');
const Subscriptions = require('../models/Subscription');
const { json } = require('body-parser');

let sub;
//subscribe Route
user_Route.post('/subscribe', (req, res) => {
    const subscription = req.body;

    //send 201 status the resource created
    res.status(201).json({}); //sends back

    const payload = JSON.stringify({ title: 'Push Notification' });

    //Pass object into send Notification
    webpush.sendNotification(subscription, payload).catch(err => console.log(err));
})
//dodaj poljoprivrednika
user_Route.post('/registracijaPolj', (req, res) => {
    const userData = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        korisnickoIme: req.body.korisnickoIme,
        lozinka: req.body.lozinka,
        lozinka_potvrda: req.body.lozinka_potvrda,
        datumRodjenja: req.body.datumRodjenja,
        mestoRodjenja: req.body.mestoRodjenja,
        kontaktTelefon: req.body.kontaktTelefon,
        emailPosta: req.body.emailPosta,
        administrator: req.body.administrator,
        odobreno: req.body.odobreno

    }
    User_polj.findOne({
        korisnickoIme: req.body.korisnickoIme
    }).
        then(user => {
            if (!user) {
                User_polj.create(userData)
                    .then(user => {
                        res.json({ status: "Poljoprivrednik: " + user.korisnickoIme + " je registrovan" });
                    })
                    .catch(err => {
                        res.send(
                            'error: ' + err
                        );
                    })
            }
            else {
                res.json(null);
            }
        })
        .catch(err => {
            res.send('error:' + err);
        })
})

//dodaj preduzece
user_Route.post('/registracijaPred', (req, res) => {
    const userData = {
        nazivPreduzeca: req.body.nazivPreduzeca,
        jedinstveniNaziv: req.body.jedinstveniNaziv,
        lozinka: req.body.lozinka,
        lozinka_potvrda: req.body.lozinka_potvrda,
        datumOsnivanja: req.body.datumOsnivanja,
        mestoPreduzeca: req.body.mestoPreduzeca,
        emailPosta: req.body.emailPosta,
        odobreno: req.body.odobreno,
        brKurira: 5
    }
    User_pre.findOne({
        jedinstveniNaziv: req.body.jedinstveniNaziv
    }).
        then(user => {
            if (!user) {
                User_pre.create(userData)
                    .then(user => {
                        res.json({ status: "Preduzece: " + user.jedinstveniNaziv + " je registrovano" });
                    })
                    .catch(err => {
                        res.send(
                            'error: ' + err
                        );
                    })
            }
            else {
                res.json(null);
            }
        })
        .catch(err => {
            res.send('error:' + err);
        })
});

//uloguj se 
user_Route.post('/login', (req, res) => {
    console.log("Sub sacuvana");
    console.log(this.sub);
    let data = req.body; //korisnicko ime i lozinka
    User_polj.findOne({ korisnickoIme: data.korime, lozinka: data.lozinka }, (error_polj, data_polj) => {
        if (error_polj) {
            console.log(error_polj);
        }
        else {
            if (data_polj == null) {
                User_pre.findOne({ jedinstveniNaziv: data.korime, lozinka: data.lozinka }, (error_pred, data_pred) => {
                    if (error_pred) {
                        console.log(error_pred)
                    }
                    else {
                        res.json(data_pred);
                    }
                })
            }
            else {
                res.json(data_polj);
            }
        }
    })



});

var data_moje = new Array();
//dohvatiSveKorisnike 
user_Route.get('/dohvatiSve', (req, res) => {
    data_moje = [];
    User_polj.find((err, data) => {
        if (err) return res.send('error: ' + error);
        else {
            // res.json(data);
            data_moje.push(data);
            //res.send(data_moje);
        }
    });
    User_pre.find((err, data) => {
        if (err) return res.send('error: ' + error);
        else {
            // res.json(data);
            data_moje.push(data);
            res.json(data_moje);
        }
    })




})




//delete zahteva korisnika
user_Route.post('/odbij', (req, res) => {

    User_polj.deleteOne({ korisnickoIme: req.body.ime }, (error_polj, data_polj) => {
        if (error_polj) {
            console.log(error_polj);
        }
        else {
            if (data_polj.deletedCount == 0) {
                User_pre.deleteOne({ jedinstveniNaziv: req.body.ime }, (error_pred, data_pred) => {
                    if (error_pred) {
                        console.log(error_pred)
                    }
                    else {
                        res.json(data_pred);
                    }
                })
            }
            else {
                console.log('Polje' + data_polj.deletedCount);
                res.json(data_polj);
            }
        }

    })
}
)

//obrisi korisnika
user_Route.post('/obrisi', (req, res) => {

    User_polj.deleteOne({ korisnickoIme: req.body.ime }, (error_polj, data_polj) => {
        if (error_polj) {
            console.log(error_polj);
        }
        else {
            if (data_polj.deletedCount == 0) {
                User_pre.deleteOne({ jedinstveniNaziv: req.body.ime }, (error_pred, data_pred) => {
                    if (error_pred) {
                        console.log(error_pred)
                    }
                    else {
                        res.json(data_pred);
                    }
                })
            }
            else {
                console.log('Polje' + data_polj.deletedCount);
                res.json(data_polj);
            }
        }

    })

})

user_Route.post('/prihvati', (req, res) => {
    User_polj.updateOne({ korisnickoIme: req.body.ime },
        { $set: { odobreno: 'true' } },
        (err, data_polj) => {
            if (err) {
                console.log(err);
            } else {
                if (data_polj.nModified == 0) {
                    User_pre.updateOne({ jedinstveniNaziv: req.body.ime },
                        { $set: { odobreno: 'true' } },
                        (err, data_pred) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.json(data_pred);
                            }
                        })
                }
                else {

                    res.json(data_polj);
                }
            }
        })
})




//setovanje nove lozinke
user_Route.post('/setLozinkaNova', (req, res) => {
    User_polj.updateOne({ korisnickoIme: req.body.ime },
        { $set: { lozinka: req.body.lozinka, lozinka_potvrda: req.body.lozinka_potvrda } },
        (err, data_polj) => {
            if (err) {
                console.log(err);
            } else {
                if (data_polj.nModified == 0) {
                    User_pre.updateOne({ jedinstveniNaziv: req.body.ime },
                        { $set: { lozinka: req.body.lozinka, lozinka_potvrda: req.body.lozinka_potvrda } },
                        (err, data_pred) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.json(data_pred);
                            }
                        })
                }
                else {

                    res.json(data_polj);
                }
            }
        })
})


//setovanje novih podataka 
user_Route.post('/setujNovePodatke', (req, res) => {
    var mojString = "";
    var func = req.body.f;
    console.log(func);

    var data = req.body.data;
    console.log(data);
    if (func == "promena_loz") {
        User_polj.updateOne({ korisnickoIme: data.ime },
            { $set: { lozinka: data.novaSifra, lozinka_potvrda: data.novaSifra } },
            (err, data_polj) => {
                if (err) {
                    console.log(err);
                    res.json("Greska");
                } else {
                    if (data_polj.nModified == 0) {
                        console.log("USAO OVDE polj");
                        User_pre.updateOne({ jedinstveniNaziv: data.ime },
                            { $set: { lozinka: data.novaSifra, lozinka_potvrda: data.novaSifra } },
                            (err, data_pred) => {
                                if (err) {
                                    console.log(err);
                                    res.json("Greska");
                                }
                                else {
                                    console.log(data_pred);
                                    if (data_pred.nModified == 0) {
                                        console.log("Niko nije promenio lozinku");
                                        res.json("Neuspesna promena lozinke");
                                    }
                                    else {
                                        console.log("Uspesno promenio lozinku preduzeca");
                                        res.json("Uspesno promenio lozinku preduzeca ");
                                    }
                                }

                            })
                    }
                    else {
                        console.log("Uspesno promenio lozinku poljoprivrednika");
                        res.json("Uspesno promenio lozinku poljoprivrednika");

                    }
                }
            });
    }
    else if (func == "promena_mejl") {
        User_polj.updateOne({ korisnickoIme: data.ime },
            { $set: { emailPosta: data.noviMejl } },
            (err, data_polj) => {
                if (err) {
                    console.log(err);
                    res.json("Greska");
                } else {
                    if (data_polj.nModified == 0) {
                        User_pre.updateOne({ jedinstveniNaziv: data.ime },
                            { $set: { emailPosta: data.noviMejl } },
                            (err, data_pred) => {
                                if (err) {
                                    console.log(err);
                                    res.json("Greska");

                                }
                                else {
                                    if (data_pred.nModified == 0) {
                                        console.log("Nije uspela promena mejla");
                                        res.json("Nije uspela promena mejla");
                                    }
                                    else {
                                        console.log("Uspesno promenio mejl preduzeca");
                                        res.json("Uspesno promenio mejl preduzeca");
                                    }
                                }

                            });


                    }
                    else {
                        console.log("Uspesno promenio mejl poljoprivrednika");
                        res.json("Uspesno promenio mejl poljoprivrednika");



                    }
                }
            });
    }

});

user_Route.post('/promeniLozinku', (req, res) => {
    User_polj.updateOne({ korisnickoIme: req.body.korime, lozinka: req.body.lozinka_stara },
        { $set: { lozinka: req.body.loz_nova, lozinka_potvrda: req.body.loz_nova } },
        (err, data_polj) => {
            if (err) {
                console.log(err);
            } else {
                if (data_polj.nModified == 0) {
                    User_pre.updateOne({ jedinstveniNaziv: req.body.korime, lozinka: req.body.lozinka_stara },
                        { $set: { lozinka: req.body.loz_nova, lozinka_potvrda: req.body.loz_nova } },
                        (err, data_pred) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if (data_pred.nModified == 0) {
                                    console.log("Neuspesna promena lozinke");
                                    res.json(data_pred);
                                }
                                else {
                                    res.json(data_pred);
                                }
                            }
                        })
                }
                else {

                    res.json(data_polj);
                }
            }
        })
})


user_Route.post('/token_validate', (req, res) => {

    let token = req.body.recaptcha;
    const secretkey = "6LcDL-kUAAAAAJTJUxdsQhtD4u1ttu3XPcn3SOxE"; //the secret key from your google admin console;

    //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
    // METHOD used is: POST

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}&remoteip=${req.connection.remoteAddress}`

    //note that remoteip is the users ip address and it is optional
    // in node req.connection.remoteAddress gives the users ip address

    if (token === null || token === undefined) {
        res.status(201).send({ success: false, message: "Token is empty or invalid" })
        return console.log("token empty");
    }

    request(url, function (err, response, body) {
        //the body is the data that contains success message
        let data = JSON.parse(body);

        //check if the validation failed
        if (body.success !== undefined && !data.success) {
            res.send({ success: false, 'message': "recaptcha failed" });
            return console.log("failed")
        }

        //if passed response success message to client
        res.send({ "success": true, 'message': "recaptcha passed" });

    })

})

//ubacivanje Rasadnika

user_Route.post('/dodajRasadnik', (req, res) => {
    let iterator = 0;
    let novi_rasadnik = {
        poljoprivrednik: req.body.poljoprivrednik,
        naziv: req.body.naziv,
        mesto: req.body.mesto,
        sirina: req.body.sirina,
        duzina: req.body.duzina,
        brojSlobodnihMesta: req.body.sirina * req.body.duzina,
        brojZasadjenih: 0,
        trenutnoVode: 200,
        trenutnaTemperatura: 18,
        raspored: new Array(req.body.sirina * req.body.duzina).fill(0),
        sadnice: new Array()
    };

    for (let i = 0; i < req.body.sirina * req.body.duzina; i++) {
        let sadnica = {
            _id: i,
            naziv: "",
            proizvodjac: "",
            napredak: 0,
            maxNapredak: 0
        };
        novi_rasadnik.sadnice.push(sadnica);
    }



    console.log(novi_rasadnik.sadnice);

    Rasadnik.findOne({
        naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik
    }).
        then(ras => {
            if (!ras) {

                Rasadnik.create(novi_rasadnik)
                    .then(ras => {
                        res.json({ status: "Rasadnik: " + ras.naziv + " je dodat" });
                    })
                    .catch(err => {
                        res.send(
                            'error: ' + err
                        );
                    })
            }
            else {
                res.json(null);
            }
        })
        .catch(err => {
            res.send('error:' + err);
        })
});

var number = 0;
var ras_moji = new Array();
//dohvatiSveRasadnikeZaDatogKorisnika
user_Route.post('/dohvatiSveRas', (req, res) => {
    ras_moji = [];
    Rasadnik.find({ "poljoprivrednik": req.body.ime }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            ras_moji.push(data);
            res.json(ras_moji);

        }
    });

})

//azurirajTemperaturu
user_Route.post('/TempPromena', (req, res) => {

    Rasadnik.updateOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik },
        { $set: { trenutnaTemperatura: req.body.novatemperatura } },
        (err, data) => {
            if (err) res.send("Error: " + err);
            else {
                Rasadnik.findOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik }, (err, data) => {
                    if (err) {
                        console.log('Error: Nije pronadjen odgovarajuci rasadnik');
                    }
                    else {
                        if (data.trenutnaTemperatura == 11.5 || data.trenutnaTemperatura == 11) {
                            Subscriptions.find().then(subscriptions => {

                                console.log(subscriptions);
                                const payload = {
                                    "notification": {
                                        "data": {
                                            url: "https://www.youtube.com/watch?v=0vSEmEdYKro"
                                        },
                                        "title": "My first notification",
                                        "vibrate": [100, 50, 100]
                                    }
                                }

                                webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);
                                subscriptions.forEach(sub => {
                                    console.log("Subskripcija: :D ");
                                    console.log(sub);
                                    webpush.sendNotification(sub, JSON.stringify(payload)).then(res => {
                                        console.log("POSLAOOOOO");
                                        console.log(res);
                                    }).catch(err => {
                                        console.log(err);
                                    });
                                })

                            })
                        }
                    }
                })
                if (data.nModified == 1) {
                    res.json(data);
                }
                else res.send("Neuspesno azuriranje");
            }
        }
    );

});

//azurirajKolicinuVode
user_Route.post('/VodaPromena', (req, res) => {
    Rasadnik.updateOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik },
        { $set: { trenutnoVode: req.body.novakolicinaVode } },
        (err, data) => {

            if (err) res.send("Error: " + err);
            else {
                Rasadnik.findOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik }, (err, data) => {
                    if (err) {
                        console.log('Error: Nije pronadjen odgovarajuci rasadnik');
                    }
                    else {
                        if (data.trenutnoVode == 74.5 || data.trenutnoVode == 74) {
                            sendNotification().catch(err => {
                                console.log(err);
                            })
                        }
                    }
                })
                if (data.nModified == 1) {
                    res.json(data);
                }
                else res.send("Neuspesno azuriranje");
            }
        });
});

//dodajSadnicu
user_Route.post('/SadnicaDodaj', (req, res) => {

    var pozicija = req.body.pozicija

    Rasadnik.updateOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik }, {

        $set: {
            "sadnice.$[el].naziv": req.body.nazivSad,
            "sadnice.$[el].proizvodjac": req.body.proizvodjac,
            "sadnice.$[el].maxNapredak": req.body.maxNapredak

        },
        $inc: {
            "brojZasadjenih": +1,
            "brojSlobodnihMesta": -1
        }


    }, {
        arrayFilters: [{ "el._id": parseInt(req.body.pozicija) }],
        multi: "true"
    }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            res.send(data);
        }
    }
    );

});

user_Route.post('/SadnicaUkloni', (req, res) => {
    console.log("USAOOO");
    console.log(req.body.naziv);
    console.log(req.body.poljoprivrednik);
    console.log("Naziv sadnice: " + req.body.nazivSad);
    console.log("Proizvodjac: " + req.body.proizvodjac);
    var pozicija = req.body.pozicija
    console.log(req.body.pozicija);
    Rasadnik.updateOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik }, {

        $set: {
            "sadnice.$[el].naziv": req.body.nazivSad,
            "sadnice.$[el].proizvodjac": req.body.proizvodjac,
            "sadnice.$[el].napredak": 0,
            "sadnice.$[el].maxNapredak": 0

        },
        $inc: {
            "brojZasadjenih": -1,
            "brojSlobodnihMesta": +1
        }


    }, {
        arrayFilters: [{ "el._id": parseInt(req.body.pozicija) }],
        //multi: "true"
    }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            res.send(data);
        }
    }
    );

});

//azuriraj Napredak
user_Route.post('/DodajNapredak', (req, res) => {
    Rasadnik.updateOne({ naziv: req.body.naziv, poljoprivrednik: req.body.poljoprivrednik }, {
        $inc: {
            "sadnice.$[element].napredak": parseInt(req.body.napredak)
        }
    }, {
        arrayFilters: [{ "element._id": parseInt(req.body.pozicija) }]
    }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else res.send(data);
    }
    )
});

//dodajMagacinZaOdredjeniRasadnik
user_Route.post('/MagacinDodaj', (req, res) => {
    let noviMagacin = {
        rasadnik: req.body.rasadnikNaziv,
        proizvodi: new Array(),
        naruceniProizvodi: new Array()
    };
    Magacin.findOne({
        rasadnik: req.body.rasadnikNaziv
    }).
        then(mag => {
            if (!mag) {

                Magacin.create(noviMagacin)
                    .then(mag => {
                        res.json({ status: "Magacin rasadnika " + req.body.rasadnikNaziv + " je dodat prazan" });
                    })
                    .catch(err => {
                        res.send(
                            'error: ' + err
                        );
                    })
            }
            else {
                res.json(null);
            }
        })
        .catch(err => {
            res.send('error:' + err);
        })
})

user_Route.post('/DodajProizvodMag', (req, res) => {
    Magacin.findOne({ rasadnik: req.body.rasadnik }).then(
        mag => {
            var noviProizvod = {
                naziv: req.body.naziv,
                proizvodjac: req.body.proizvodjac,
                kolicina: parseInt(req.body.kol),
                maxNapredak: parseInt(req.body.napredak),
                tip: req.body.tipProizvoda
            }
            var proizvodiPoklapanje = mag.proizvodi.filter(el => (el.naziv == noviProizvod.naziv && el.proizvodjac == noviProizvod.proizvodjac));
            console.log(proizvodiPoklapanje);

            if (proizvodiPoklapanje.length == 0) {
                Magacin.updateOne({ rasadnik: req.body.rasadnik }, {
                    $push: {
                        proizvodi: noviProizvod
                    }
                }, (err, data) => {
                    if (err) {
                        res.send("err:" + err);
                    }
                    else res.send(data);
                })
            }
            else {
                Magacin.updateOne({ rasadnik: req.body.rasadnik }, {

                    $inc: {
                        "proizvodi.$[el].kolicina": parseInt(req.body.kol)
                    }
                }, {
                    arrayFilters: [{ "el.naziv": req.body.naziv, "el.proizvodjac": req.body.proizvodjac, "el.tip": req.body.tipProizvoda }],
                    multi: "true"
                }, (err, data) => {
                    if (err) {
                        res.send('error: ' + err);
                    }
                    else res.send(data);
                }
                )
            }



        }
    ).catch(err => {
        res.send('error:' + err);
    })
})

//dodaj proizvod u narucene
user_Route.post('/DodajProizvodNaruceniMag', (req, res) => {
    Magacin.findOne({ rasadnik: req.body.rasadnik }).then(
        mag => {
            var noviProizvod = {
                naziv: req.body.naziv,
                proizvodjac: req.body.proizvodjac,
                kolicina: parseInt(req.body.kol),
                maxNapredak: parseInt(req.body.napredak),
                tip: req.body.tipProizvoda
            }


            Magacin.updateOne({ rasadnik: req.body.rasadnik }, {
                $push: {
                    naruceniProizvodi: noviProizvod
                }
            }, (err, data) => {
                if (err) {
                    res.send("err:" + err);
                }
                else res.send(data);
            })





        }
    ).catch(err => {
        res.send('error:' + err);
    })

})


//obrisi iz narucenih + ovde dodaj i otkazivanje iz Narudzbine modela tj. brisanje za rasadnik i naziv kolicinu
user_Route.post('/OtkaziNarucene', (req, res) => {
    Magacin.findOne({ rasadnik: req.body.rasadnik }).then(
        mag => {
            if (mag) {
                var narudzbine = mag.naruceniProizvodi;
                console.log(narudzbine);
                narudzbine.forEach((element, index) => {
                    if (element.naziv == req.body.naziv && element.kolicina == req.body.kolicina) narudzbine.splice(index, 1);
                });

                console.log(narudzbine);
                Magacin.updateOne({ rasadnik: req.body.rasadnik }, {
                    $set: {
                        naruceniProizvodi: narudzbine
                    }
                }, (err, data) => {
                    if (err) console.log('err: ' + err);
                    else res.send(data);
                })
            }
            else {
                console.log("Nema magacina");
                res.send(null);
            }
        }
    ).catch(err => {
        console.log('err: ' + err);
    })
})
var moji_preparati = new Array();
//dohvatiti preparate
user_Route.post('/DohvatiPreparate', (req, res) => {
    moji_preparati = [];
    Magacin.findOne({ rasadnik: req.body.imeRasadnika }).then(
        mag => {
            if (mag) {
                console.log(mag.proizvodi);
                let moji_proizvodi = mag.proizvodi;
                moji_proizvodi.forEach(element => {
                    if (element.tip == "preparat") {
                        console.log("Jeste preparat");
                        moji_preparati.push(element);
                    }
                });
                if (moji_preparati.length == 0) {
                    console.log("Nema preparata u skladistu");

                }
                res.json(moji_preparati);
            }
            else {
                console.log("Nema datog magacina");
                res.json(null);
            }
        }
    ).catch(err => {
        res.send('error:' + err);
    })
})

//dohvati sadnice
var moje_sadnice = [];
user_Route.post('/DohvatiSadnice', (req, res) => {
    moje_sadnice = [];
    Magacin.findOne({ rasadnik: req.body.imeRasadnika }).then(
        mag => {
            if (mag) {
                console.log(mag.proizvodi);
                let moji_proizvodi = mag.proizvodi;
                moji_proizvodi.forEach(element => {
                    if (element.tip == "sadnica") {
                        console.log("Jeste sadnica");
                        moje_sadnice.push(element);
                    }
                });
                if (moje_sadnice.length == 0) {
                    console.log("Nema sadnica u skladistu");

                }
                res.json(moje_sadnice);
            }
            else {
                console.log("Nema datog magacina");
                res.json(null);
            }
        }
    ).catch(err => {
        res.send('error:' + err);
    })
})

var povratnaVrednost;
//dohvati sve proizvode i narucene proizvode 
user_Route.post('/DohvatiProizvodeINarucene', (req, res) => {
    povratnaVrednost = new Array();
    console.log(req.body.imeRasadnika);
    Magacin.findOne({ rasadnik: req.body.imeRasadnika }).then(
        mag => {
            if (mag) {
                console.log(mag.proizvodi);
                povratnaVrednost.push(mag.proizvodi);

                console.log(mag.naruceniProizvodi);
                povratnaVrednost.push(mag.naruceniProizvodi);

                res.json(povratnaVrednost);
            }
            else {
                console.log("Nema magacina");
                res.json(null);
            }
        }
    ).catch(err => {
        console.log('error: ' + err);
    })
})




//smanjiKolicinuProizvoda
user_Route.post('/SmanjiKolProizvodaUMagacinu', (req, res) => {
    Magacin.updateOne({ rasadnik: req.body.rasadnikNaziv }, {
        $inc: {
            "proizvodi.$[element].kolicina": -1
        }
    }, { arrayFilters: [{ "element.naziv": req.body.naziv, "element.proizvodjac": req.body.proizvodjac }] }, (err, data) => {
        if (err) {
            res.send('Error: ' + err);
        }
        else {
            res.send(data);
        }
    }
    )
})
var name = "";
var mail = "";


//slanje mejla
user_Route.post('/slanjeMejla', (req, res) => {
    console.log("request came");
    name = req.body.name;
    mail = req.body.mail;
    var user = {
        ime: name,
        mejl: mail
    }
    sendMail(user, info => {
        console.log('Poslat mejl');
        res.send(info);
    })
})


async function sendMail(user, callback) {
    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount.user, testAccount.pass)
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });

    let mailOptions = {
        from: testAccount.user,
        to: mail,
        subject: "Upozorenje!",
        text: "Upozorenje korisniku o nezeljenim uslovima rasadnika"
    };
    transporter.sendMail(mailOptions).then(info => {
        console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
        callback(info);
    });

    // callback(info);
}


/////////////////////////////////Preduzece

//dodajProizvodUPonudu
user_Route.post('/dodajProizvodProizvodjaca', (req, res) => {

    let noviProizvod = {
        naziv: req.body.naziv,
        proizvodjac: req.body.proizvodjac,
        kolicina: parseInt(req.body.kolicina),
        naStanju: true,
        prosecnaOcena: 0,
        komentari: new Array(),
        maxNapredak: parseInt(req.body.napredak),
        cena: parseInt(req.body.cena),
        tipProizvoda: req.body.tip
    }

    Preduzece_proizvod.findOne({ naziv: req.body.naziv, proizvodjac: req.body.proizvodjac, maxNapredak: parseInt(req.body.napredak), cena: parseInt(req.body.cena) }).then(
        pro => {
            if (pro) {
                Preduzece_proizvod.updateOne({ naziv: noviProizvod.naziv, proizvodjac: req.body.proizvodjac }, {
                    $inc: {
                        "kolicina": parseInt(req.body.kolicina)
                    }
                }, (err, data) => {
                    if (err) {
                        res.send('error: ' + err);
                    }
                    else res.send(data);
                })


            }
            else {
                Preduzece_proizvod.create(noviProizvod)
                    .then(pro => {
                        res.json({ status: "Proizvod: " + pro.naziv + " je dodat, za preduzece: " + pro.proizvodjac });
                    })
                    .catch(err => {
                        res.send(
                            'error: ' + err
                        );
                    })

            }
        }
    )






})


//ukloniProizvodIzPonude
user_Route.post('/ukloniProizvodProizvodjaca', (req, res) => {
    Preduzece_proizvod.deleteOne({ naziv: req.body.naziv, proizvodjac: req.body.proizvodjac }).then(ok => {
        res.json(ok);
    }).catch(err => {
        res.send(
            'error: ' + err
        );

    })
})

var proizvodi_svi = []
//izlistavanjeSvihProizvodaIzPonude
user_Route.post('/dohvatiSveProizvodeProizvodjaca', (req, res) => {
    proizvodi_svi = [];
    Preduzece_proizvod.find((err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            console.log(data);
            /*proizvodi_svi.push(data);
            console.log(proizvodi_svi);*/
            var proizvodi_kol = [];
            data.forEach(element => {
                if (element.kolicina > 0) proizvodi_kol.push(element);
            });
            console.log(proizvodi_kol)
            proizvodi_svi.push(proizvodi_kol);
            res.json(proizvodi_svi);

        }
    });
})

var proizvodi_pro = []
//izlistavanjeZaPojedinogProizvodjaca
user_Route.post('/dohvatiProizvodeZaProizvodjaca', (req, res) => {
    proizvodi_pro = [];
    Preduzece_proizvod.find({ "proizvodjac": req.body.proizvodjac }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            proizvodi_pro.push(data);
            res.json(proizvodi_pro);
        }
    })
})


//dodajNarudzbinu
user_Route.post('/dodajNarudzbinu', (req, res) => {
    let novaNarudzbina = {
        poljoprivrednik: req.body.narudzbina.poljoprivrednik,
        preduzece: req.body.narudzbina.preduzece,
        proizvodi: req.body.narudzbina.proizvodi,
        datumNarudzbine: req.body.narudzbina.datumNarudzbine,
        status: req.body.narudzbina.status,
        rasadnik: req.body.narudzbina.rasadnik
    }
    console.log("Nova narudzbina");
    console.log(novaNarudzbina);
    Narudzbina.create(novaNarudzbina)
        .then(na => {
            res.json({ status: "Narudzbina je dodata" });
        })
        .catch(err => {
            res.send(
                'error: ' + err
            );
        })
})


var mojeNarudzbine = [];
//dohvatiNarudzbine
user_Route.post('/dohvatiNarudzbine', (req, res) => {
    mojeNarudzbine = [];
    Narudzbina.find({ poljoprivrednik: req.body.korisnik, rasadnik: req.body.rasadnik }, (err, data) => {
        if (err) {
            res.send("error: " + err);
        }
        else {
            console.log(data);
            mojeNarudzbine.push(data);
            res.send(data);
        }
    })
})

var sveNarudzbine = [];
//dohvatiSveNarudzbine
user_Route.post('/dohvatiSveNarudzbine', (req, res) => {
    sveNarudzbine = [];
    Narudzbina.find({ preduzece: req.body.preduzece }, (err, data) => {
        if (err) {
            res.send("error: " + err);
        }
        else {
            console.log(data);
            sveNarudzbine.push(data);
            res.send(data);
        }
    })
})

//otkaziNarudzbinu
user_Route.post('/otkaziNarudzbinu', (req, res) => {
    Narudzbina.deleteOne({ _id: req.body.idNar }, (err, data) => {
        if (err) {
            res.send("error: " + err);
        }
        else {
            console.log(data);
            res.send(data);
        }
    })
})


user_Route.post('/azurirajStatus', (req, res) => {
    Narudzbina.updateOne({ _id: req.body.idNar }, {
        $set: {
            "status": req.body.status
        }
    }, (err, data) => {
        if (err) {
            console.log("error: " + err);
            res.send(err);
        }
        else {
            console.log(data);
            res.send(data);
        }
    })
})

user_Route.post('/dohvatiBrojKurira', (req, res) => {
    User_preduzece.findOne({ jedinstveniNaziv: req.body.preduzece }, (err, data) => {
        if (err) {
            console.log("error: " + err);
            res.send(err);
        }
        else {
            console.log(data.brKurira);
            res.json(data.brKurira);
        }
    })
})

user_Route.post('/setujNoviBrojKurira', (req, res) => {
    User_preduzece.updateOne({ jedinstveniNaziv: req.body.preduzece }, {
        $set: {
            "brKurira": req.body.noviBrojKurira
        }
    }, (err, data) => {
        if (err) console.log("err: " + err);
        else {
            console.log(data);
            res.send(data);
        }
    }
    )
})

//prihvatiNarudzbinu
user_Route.post('/prihvatiNarudzbinu', (req, res) => {
    Narudzbina.findOne({ _id: req.body.idNar }).then(narudzbina => {
        User_preduzece.findOne({ jedinstveniNaziv: req.body.preduzece }).then(pred => {
            if (pred.brKurira > 0) {
                Preduzece_proizvod.find({ proizvodjac: req.body.preduzece }).then(proizvodi => {
                    narudzbina.proizvodi.forEach(el => {
                        proizvodi.forEach(pro => {
                            if (el.naziv == pro.naziv) {
                                //ako ima dovoljno
                                if (pro.kolicina < el.kolicina) {
                                    res.send("Nema doboljno kolicine proizvoda");
                                }
                                else console.log("Ima, dalje");
                            }
                        });
                    });
                    console.log("Svi proizvodi prosli");
                    // res.send("OK");

                    //update-uj kolicine proizvoda
                    narudzbina.proizvodi.forEach(element => {
                        Preduzece_proizvod.findOne({ naziv: element.naziv }).then(pro => {
                            if ((pro.kolicina - element.kolicina) <= 0) {
                                Preduzece_proizvod.updateOne({ naziv: element.naziv }, {
                                    $set: { naStanju: false }
                                }, (err, data) => {
                                    if (err) {
                                        console.log("Greska update-preduzece_proizvod");
                                        res.send('error: ' + err);
                                    }
                                })
                            }
                        })
                        Preduzece_proizvod.updateOne({ naziv: element.naziv }, {
                            $inc: { kolicina: - element.kolicina }
                        },
                            (err, data) => {
                                if (err) {
                                    console.log('error: ' + err);
                                    res.send(err);
                                }
                                else console.log(data);
                            })
                    });

                    //update-uj broj slobodnih kurira
                    User_preduzece.updateOne({ jedinstveniNaziv: req.body.preduzece }, {
                        $inc: { brKurira: -1 }
                    },
                        (err, data) => {
                            if (err) {
                                console.log('error: ' + err);
                                res.send(err);
                            }
                            else console.log(data);
                        })

                    //update-uj status narudzbine
                    Narudzbina.updateOne({ _id: req.body.idNar }, {
                        $set: {
                            "status": "ISPORUKA U TOKU"
                        }
                    }, (err, data) => {
                        if (err) {
                            console.log("error: " + err);
                            res.send(err);
                        }
                        else {
                            console.log(data);
                            res.send(data);
                        }
                    }) //plus mozda da se doda proveraaa ako neki proizvod vise ne bude na stanju da se ukloni
                })
            }
            else {
                //nema dovoljno kurira
                Narudzbina.updateOne({ _id: req.body.idNar }, {
                    $set: {
                        "status": "NA CEKANJU"
                    }
                }, (err, data) => {
                    if (err) {
                        console.log("error: " + err);
                        res.send(err);
                    }
                    else {
                        console.log(data);
                        res.send(data);
                    }
                })
            }

        })
    })
})

//zavrsi Narudzbinu prebaci u ISPORUCENA, prodji kroz sve narudzbine sa statusom NA CEKANJU i ako postoje, odmah prebaci i nemoj oslobadjati kurira,
//sve proizvode i date narudzbine, prebaci u magacin tog poljoprivrednika
user_Route.post('/zavrsiNarudzbinu', (req, res) => {
    /*Narudzbina.findOne({_id: req.body.idNar}).then(nar=> {
        if(nar.status == "ISPORUCENA") {
            res.send("KRAJ");
            return;
        }
    })*/
    Narudzbina.updateOne({ _id: req.body.idNar }, {
        $set: {
            "status": "ISPORUCENA"
        }
    }, (err, data) => {
        if (err) {
            console.log("error: " + err);
            res.send(err);
        }

    })

    Narudzbina.find({ status: "NA CEKANJU" }).then(nacekanju => {
        console.log(nacekanju);
        if (nacekanju.length > 0) {
            let _idNaredne = nacekanju[0]._id;
            console.log(_idNaredne);
            Narudzbina.updateOne({ _id: _idNaredne }, {
                $set: {
                    "status": "ISPORUKA U TOKU"
                }
            }, (err, data) => {
                if (err) {
                    console.log("error: " + err);
                    res.send(err);
                }

            })
        }
        else {
            User_preduzece.updateOne({ jedinstveniNaziv: req.body.preduzece }, {
                $inc: { brKurira: +1 }
            },
                (err, data) => {
                    if (err) {
                        console.log('error: ' + err);
                        res.send(err);
                    }
                    else console.log(data);
                })
        }
    });


    Narudzbina.findOne({ _id: req.body.idNar }).then(el => {
        //nasla sam tu 
        let proizvodi = el.proizvodi;
        console.log(proizvodi);
        let rasadnik = el.rasadnik;
        console.log("Rasadnik: " + rasadnik);

        proizvodi.forEach(pro => {
            console.log(pro);
            Preduzece_proizvod.findOne({ naziv: pro.naziv, proizvodjac: pro.proizvodjac }).then(val => {
                console.log(val);
                Magacin.findOne({ rasadnik: rasadnik }).then(ras => {
                    console.log(ras);
                    let proizvodDodaj = {
                        naziv: val.naziv,
                        proizvodjac: val.proizvodjac,
                        kolicina: pro.kolicina,
                        maxNapredak: val.maxNapredak,
                        tip: val.tipProizvoda
                    }
                    console.log(proizvodDodaj);
                    Magacin.updateOne({ rasadnik: rasadnik }, {
                        $push: {
                            proizvodi: proizvodDodaj
                        }
                    }, (err, data) => {
                        if (err) {
                            console.log('error: ' + err);
                            res.send(err);
                        }
                        // else res.json(data);
                    })
                })
            })


        });

        res.send(el);

    });


})

//po danima u proslih 30 dana
user_Route.post('/brojNarudzbinaPoDanima', (req, res) => {
    console.log("USAO");
    console.log(req.body.preduzece);
    let date = new Date();
    console.log(date);
    //pre 30 dana
    let granica = new Date(date);
    granica.setDate(granica.getDate() - 30);

    var a = [];
    let i = 0;
    while (i < 30) {
        let pomDate = new Date(date);
        pomDate.setDate(pomDate.getDate() - i);
        a[pomDate] = 0;
        i = i + 1;
        console.log('I: ' + i);
    }
    for (var ii in a) {
        console.log(ii);

    }
    console.log(granica);
    console.log(a);
    //console.log(parsedDate);
    Narudzbine.find({ preduzece: req.body.preduzece }).then(narudzbine => {
        narudzbine.forEach(element => {
            console.log(element);
            //console.log(element.datumNarudzbine);
            var trenutniDatum = element.datumNarudzbine;

            for (var ii in a) {
                console.log(ii);
                console.log("Broj narudzbina: " + a[ii]);
                let date = new Date(ii);
                console.log(date);
                console.log(trenutniDatum);
                if (date.getDate() == trenutniDatum.getDate()) {
                    console.log("JESTEEE");
                    a[ii] = a[ii] + 1;
                    console.log(a[ii]);
                    break;
                }
                else {
                    console.log("NIJEEE");
                }
            }
        });
        console.log(a);
        var arrayPovratni = [];
        for (var iii in a) {
            let novi = {
                datum: iii,
                kolicina: a[iii]
            }
            arrayPovratni.push(novi);
        }

        res.send(arrayPovratni);
    })
})


function sendNotification() {
    webpush.setVapidDetails(
        'http://localhost:4200/poljoprivrednik',
        publicVapidKey,
        privateVapidKey
    );
    const pushPayload = {
        "notification": {
            "title": 'Upozorenje o vrednostima parametara rasadnika',
            "body": 'Vrednosti su ispod dozvoljenih, molim vas azurirajte',
            "vibrate": [100, 50, 100]
        }
    };


    Subscriptions.find().then(subscriptions => {

        console.log(subscriptions);


        webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);
        subscriptions.forEach(sub => {
            console.log("Subskripcija: :D ");
            console.log(sub);
            webpush.sendNotification(sub, JSON.stringify(pushPayload)).then(res => {
                console.log("Push poslata");
                console.log(res);
            }).catch(err => {
                console.log(err);
            });
        })
    })
}


//sacuvaj subskripciju
user_Route.post('/sacuvajSub', (req, res) => {
    this.sub = req.body.sub;
    console.log(this.sub);

    var keys = req.body.keys;
    var expirationTime = req.body.expirationTime;
    var endpoint = req.body.endpoint;
    let sub = {
        endpoint: endpoint,
        expirationTime: expirationTime,
        keys: keys
    }
    console.log(keys);
    console.log(expirationTime);
    console.log(endpoint);
    console.log('Ubacen');
    console.log(sub);

    //prvo da se obrisu svi pa onda da se kreira nova svaki put ka logovanju
   Subscriptions.remove({}, (err=> {
       console.log(err);
   }))
    Subscriptions.create(sub).then(sub => {
       /* Subscriptions.find().then(subscriptions => {

            console.log(subscriptions);
            const payload = {
                "notification": {
                    "data": {
                        url: "https://www.youtube.com/watch?v=0vSEmEdYKro"
                    },
                    "title": "My first notification",
                    "vibrate": [100, 50, 100]
                }
            }

            webpush.setVapidDetails('mailto:example@yourdomain.org', publicVapidKey, privateVapidKey);
            subscriptions.forEach(sub => {
                console.log("Subskripcija: :D ");
                console.log(sub);
                webpush.sendNotification(sub, JSON.stringify(payload)).then(res => {
                    console.log("POSLAOOOOO");
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            })

        })
        /*sendNotification().catch(err=> {
            console.log(err);
        });*/
        res.json({ status: "Subskripcija dodata: " + sub.endpoint + " je registrovana" });
    })
        .catch(err => {
            res.send(
                'error: ' + err
            );
            console.log('error: ' + err);
        })


})

var ras_novi = new Array();
//dohvatiSveRasadnikeZaDatogKorisnika
user_Route.get('/sviRasadnici/:ime', (req, res) => {
    ras_novi = [];
    Rasadnik.find({ "poljoprivrednik": req.params.ime }, (err, data) => {
        if (err) {
            res.send("Error: " + err);
        }
        else {
            ras_novi.push(data);
            res.json(ras_novi);

        }
    });

})


module.exports = user_Route;