import gql from "graphql-tag";

const PermissionType = gql`
  type Mutation {
    createPermissionGroup(data:IPermissionGroupInput):String!
    updatePermissionGroup(data:IUpdatePermissionGroupInput):String!
    disablePermissionGroup(permissionGroupId:ID):String!
  }

  type Query {
    getAllPermissionGroup:[IPermissionResponse]
    getAllDefaultPermissions(permissionGroupId:ID!):PaginatedPermission
  }


  input IPermissionGroupInput{
    permissions:[ID!]!
    title:String!
    description:String!
  }


  type PaginatedPermission{
    data:[IPermission]
    pageInfo:PageInfo
  }


  type IPermissionResponse {
    _id:ID
    title: String
    description: String
    permissions: String
    disable: Boolean
    createdAt:DateTime
    updatedAt:DateTime
    permissionsDetails:[IPermission]   
  }

  type IPermission{
      _id:ID
      title: String
      description: String
      permissions: String
      disable: Boolean
      createdAt:DateTime
  }
  type PageInfo{
        hasNextPage: Boolean
        hasPrevPage: Boolean
        totalPages: Int
        nextPage: Int
        prevPage: Int
        totalDocs: Int
    }


  input IUpdatePermissionGroupInput{
    permissionGroupId:ID!
    permissions:[ID]
    title:String
    description:String
  }
  
  
`;

export default PermissionType;
