var database = require('../database/connection');
var bcrypt = require('bcrypt');

class User{

	async create(name, email, password){

		try{
			var hash = await bcrypt.hash(password, 10);

			await database.insert({ email, password: hash, name, role: 0 }).table('users');	
		} catch(err){
			console.log(err);
		}
		

	}

	async findEmail(email){

		try{
			var result = await database.select().from('users').where({ email: email });
			
			if (result.length > 0) {
				return true;
			} else {
				return false
			}

		} catch(err){
			console.log(err);
			return false;
		}

	}

}

module.exports = new User();