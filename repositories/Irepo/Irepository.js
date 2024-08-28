
class Irepository{

    async find(query)
    {
        throw new Error("Method 'find()' must be implemented.");
    }
    async create(data)
    {
        throw new Error("Method 'create()' must be implemented.");
    }
}

module.exports = Irepository