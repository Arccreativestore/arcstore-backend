const userModel = require("../models/authModel");
const authRepo = require("../repositories/Auth/authRepo");
const userepo = require("../repositories/Irepo/userepo");


jest.mock('../models/authModel')

describe('authRepo', ()=>{

    beforeEach(() => {
        jest.clearAllMocks(); 
      });

      test('find email returns a value when email is a param', async()=>{
        const email = 'eniola@gmail.com'
        const response = {id: 1, email: email}
        userModel.findOne.mockResolvedValue(response)
     
        const result = await userepo.find(email)
        expect(result).toEqual(response)
      });

      test('empty params for find email to return null', async ()=>{
        const result = await authRepo.findEmail()
        expect(result).toBeNull() 
      })

      test('create a new account and returning account', async()=>{

        const data = { email: "eniola@gmail.com", username: 'eniola', password: 'eni123' }
        const response = { email: "eniola@gmail.com", username: 'eniola', password: 'eni123', verified: false, createdAt:"2024-08-29 11:26:15.972+01", updatedAt:"2024-08-29 11:26:15.972+01"}
        delete response.password
        userModel.create.mockResolvedValue(response)
        
        const newAccount = await userepo.create(data)
        expect(newAccount).toEqual(response)
      });

      test('')
 

})