var database = require('../database/connection');
var bcrypt = require('bcrypt');

class User{

	async findAll() {
		try {
			var result = await database.select(['id', 'name', 'email']).table('users');	

			return result;
		} catch(error) {
			console.log(error);
		}
	}

	async findById(id) {
		try {
			var result = 
				await database.select(['id', 'name', 'email'])
					.table('users')
					.where('id', id);

			if (result.length > 0) {
				return result[0];	
			} else {
				return undefined;
			}
		} catch(error) {
			console.log(error);
			return undefined;
		}
	}

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

	async update(id, name, email, role) {
		const user = await this.findById(id);

		if (user != undefined) {

			const editedUser = {};

			if (email != undefined) {
				if (email != user.email) {
					const result = await this.findEmail(email);

					if (!result) {
						editedUser.email = email;
					} else {
						return { status: false, error: 'Email exists!' }
					}
				}
			}

			if (name != undefined) {
				editedUser.name = name;
			}

			if (role != undefined) {
				editedUser.role = role;
			}

			try {
				await database
					.update(editedUser)
					.where({ id })
					.table('users');

				return { status: true };
			} catch(error) {
				return { status: false, error };
			}

		} else {
			return { status: false, err: 'User not exists!' }
		}
	}

    async delete(id) {
        var user = await this.findById(id);

        if (user != undefined) {

        	try {
        		await database.delete().where({ id }).table('users');
        		return { status: true };
        	} catch(error) {
        		return { status: false, error };
        	}
            

        } else {
            return { status: false, error: 'User not exists!' }
        }
    }

}

module.exports = new User();