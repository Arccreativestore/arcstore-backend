import  gql  from "graphql-tag";

const UserType = gql`
  type Mutation {
    userRegistration(data:iRegInput): User!
    verifyAccount: JSON!  
<<<<<<< HEAD
    
=======
>>>>>>> 3a57ec96355985a393c0cfafc88d7bcca9750a4c
  }

type Query{
    getUserProfile: String
}
enum IuserType{
    USER
    CREATOR
    SUPERADMIN
    STAFF
}

<<<<<<< HEAD
input iRegInput
{
    email: String!
    username: String!
    password: String!
    role: IuserType!
=======
input iRegInput{
    email: String!
    username: String!
    password: String!
>>>>>>> 3a57ec96355985a393c0cfafc88d7bcca9750a4c
     
}

    type User {
        status: String
        _id: String!
        email: String
        username: String
        role:String
       
    }

`;

export default UserType;
