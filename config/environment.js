module.exports = {
    smtp : {
        host: "smtp.gmail.com",
        port: '465',
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'testcodeial',
            pass: 'testcodeial@123',
        }
    },
    db : 'Evoting',
    google_client_id: '1016752488714-44n4j4qtff1v672urkvspldjvvdla816.apps.googleusercontent.com',
    google_client_secret: '72fZoEI3YGA8oDhQyLck60G1',
    google_call_back_url: 'http://localhost:5000/users/auth/google/callback',
    secret: 'WDGOE7!Z<N4f%V}J]F5UM@!ZhT)[^TPt8ETu)4%A:pGy#Ra(@XsTI{D+zTyK#x',
    session_name: 'collage'
}

