import { logger } from './config/logger';
import DefaultPermission from './defaultData/defaultPermission.json' assert {type: 'json'}
import defaultCountry from './defaultData/countries.json' assert {type: 'json'}
import __Permission from './models/permission'
import __Country from './models/countries'

export default class DefaultScripts {
    constructor() {
        this.addDefaultPermission().catch((error) => logger.error("Error Adding Default Permission", error));
        this.addDefaultCountry().catch((error) => console.log("Error adding default countries", error));
    }


    async addDefaultPermission() {
        const serviceProviders = await __Permission().countDocuments();
        if (serviceProviders === 0) {
            await __Permission().create(DefaultPermission);
            logger.info("Default Permission Added")
        } else {

            const updates = DefaultPermission.map(({_id, ...data}) => {
                return __Permission().updateOne({_id: _id}, {$set: data}, {upsert: true});
            });
            await Promise.all(updates)
        }

    }


	async addDefaultCountry() {
		const config = await __Country.countDocuments();
		if (config === 0) {
			await __Country.create(defaultCountry);
			console.log("Default Country Added Successfully")
		} else {
			console.log("Default Country Already Exist")
		}

	}


}

