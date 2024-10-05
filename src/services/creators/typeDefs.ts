import gql from "graphql-tag";

const typeDefs = gql`
type Query {
signUpCreator(data: Icreator): Creator!
followCreator(data: Ifollow): General!
acceptFollower(data: IacceptFollow): General!
unfollowCreator(data: Ifollow): General!
privateCreator: General!
}
input Icreator {
country: String
city: String
address: String
postalCode: String
phoneNumber: String
}

input Ifollow {
creatorId: String
}

input IacceptFollow {
userId: String
}

type General {
status: String
message: String
}



type Creator {
    country: String
    firstName: String
    lastName: String
    userId: ID
    _id: ID
    city: String
    address: String
    postalCode: String
    phoneNumber: String
    disabled: Boolean
}

`


export default typeDefs