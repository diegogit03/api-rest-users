var Model = require('../models/User');

class UserController{

    async index(req, res){}

    async store(req, res){
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

}

module.exports = new UserController();