class UserController{

    async index(req, res){}

    async store(req, res){
    	return res.json(req.body);
    }

}

module.exports = new UserController();