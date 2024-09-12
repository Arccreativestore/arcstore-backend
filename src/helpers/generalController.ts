import Base from "../base.js";
import MongooseErrorUtils from "./handleMongoDbError.js";
import {Document} from "mongoose";



class GeneralController {


  async handleMongoError(mongo: Promise<Document>): Promise<Document> {
    return new Promise((resolve, reject) => {
        mongo.then((data) => resolve(data))
            .catch((reason) => {
                reject(MongooseErrorUtils.handleMongooseError(reason));
            });
    });
}

}

export default GeneralController;
