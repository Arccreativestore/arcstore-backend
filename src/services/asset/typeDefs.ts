import gql from "graphql-tag";

const AssetType = gql`

  type Mutation {
    addAssetCategory(data:IAddCategoryInput):String!
    updateAssetCategory(data:IUpdateCategoryInput):String!
    enableOrDisableAssetCategory(categoryId:ID! status:Boolean!):String!
  }

  type Query {
    getAllCategory:[ICategoryResponse]
    getAssetCategoryById(categoryId:ID!):ICategoryResponse
  }

  input IAddCategoryInput{
    title:String
    description:String
  }

  input IUpdateCategoryInput{
    categoryId:ID!
    title:String
    description:String
  }

  type ICategoryResponse{
    _id:ID
    title:String
    slug:String
    description:String
    createdAt:DateTime
    updatedAt:DateTime
  }
`;

export default AssetType;
