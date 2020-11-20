var Model = require('../models/User');

class UserController{

    async index(req, res) {
        var users = await Model.findAll();

        res.json(users);
    }

    async findUser(req, res) {
        var id = req.params.id;
        var user = await Model.findById(id);

        if(user === undefined) {
            res.status(404);
            res.json({});
        } else {

            res.status(200);
            res.json(user);
        }
    }

    async store(req, res) {
    	const { name, email, password } = req.body;

    	if (!name || !email || !password){
    		res.status(400);
    		return res.json({ status: 403, message: 'Bad Request' });
    	};

    	var emailExists = await Model.findEmail(email);

    	if (emailExists) {
    		res.status(406);
    		return res.json({ status: 406, message: 'Email exists!' });
    	}

		await Model.create(name, email, password);
		res.status(200);
		res.json(req.body);
    }

    async edit(req, res) {
        var { id, name, email, role } = req.body;
        var result = await Model.update(id, name, email, role);

        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.json({ message: 'updated!' });  
            } else {
                res.status(406);
                res.send(result.error)
            }
        }  else {
            res.status(406);
            res.json({ message: 'server error!' })
        }
    }

    async remove(req, res) {
        var { id } = req.params;

        var result  = await Model.delete(id);

        if (result.status) {
            res.status(200);
            res.json({ message: 'deleted' });
        } else {
            res.status(406);
            res.json({ error:  result.error });
        }
    }

}

module.exports = new UserController();