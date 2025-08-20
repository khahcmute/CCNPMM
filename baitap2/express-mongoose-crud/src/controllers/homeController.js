const CRUDService = require('../services/CRUDService');

let getHomePage = async (req, res) => {
    try {
        // Redirect to CRUD page instead of rendering homepage
        return res.redirect('/get-crud');
    } catch (e) {
        console.log(e);
        return res.status(500).send('Internal Server Error');
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    try {
        let message = await CRUDService.createNewUser(req.body);
        console.log(message);
        return res.redirect('/get-crud');
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error creating user');
    }
}

let displayGetCRUD = async (req, res) => {
    try {
        let data = await CRUDService.getAllUser();
        console.log('-------------------------');
        console.log(data);
        console.log('-------------------------');
        return res.render('users/findAllUser.ejs', {
            dataTable: data
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error fetching users');
    }
}

let getEditCRUD = async (req, res) => {
    try {
        let userId = req.query.id;
        if (userId) {
            let userData = await CRUDService.getUserInfoById(userId);
            return res.render('users/updateUser.ejs', {
                user: userData
            });
        } else {
            return res.send('User not found!');
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error fetching user data');
    }
}

let putCRUD = async (req, res) => {
    try {
        let data = req.body;
        let allUsers = await CRUDService.updateUserData(data);
        return res.redirect('/get-crud');
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error updating user');
    }
}

let deleteCRUD = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            await CRUDService.deleteUserById(id);
            return res.redirect('/get-crud');
        } else {
            return res.send('User not found!');
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send('Error deleting user');
    }
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
};